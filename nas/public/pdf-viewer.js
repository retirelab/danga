import {getDocument,GlobalWorkerOptions} from './vendor/pdfjs/legacy/build/pdf.min.js';
GlobalWorkerOptions.workerSrc=new URL('./vendor/pdfjs/legacy/build/pdf.worker.min.js',import.meta.url).href;
const $=id=>document.getElementById(id);
let pdf=null,loading=null,renderTask=null,pageNumber=1,scale=1.5,fit=false,revision=0,source=null,loadVersion=0;
const origin=location.origin;
function status(message){$('status').textContent=message;}
async function render(){
  if(!pdf)return;const ticket=++revision;
  if(renderTask){renderTask.cancel();renderTask=null;}
  try{
    const page=await pdf.getPage(pageNumber);if(ticket!==revision)return;
    const natural=page.getViewport({scale:1});
    const width=Math.max(200,document.documentElement.clientWidth-(innerWidth<600?12:24));
    if(fit)scale=Math.min(1,width/natural.width);
    // Limit backing canvas memory on mobile; CSS size remains the chosen zoom.
    const viewport=page.getViewport({scale});const ratio=Math.min(devicePixelRatio||1,2,4096/viewport.width,6000/viewport.height);
    const canvas=$('canvas');canvas.width=Math.floor(viewport.width*ratio);canvas.height=Math.floor(viewport.height*ratio);canvas.style.width=viewport.width+'px';canvas.style.height=viewport.height+'px';canvas.style.display='inline-block';
    $('page').value=pageNumber;$('page').max=pdf.numPages;$('total').textContent=pdf.numPages;$('zoom').textContent=Math.round(scale*100)+'%';$('prev').disabled=pageNumber<=1;$('next').disabled=pageNumber>=pdf.numPages;
    status('원본을 표시하는 중입니다…');
    renderTask=page.render({canvasContext:canvas.getContext('2d'),viewport,transform:[ratio,0,0,ratio,0,0]});await renderTask.promise;
    if(ticket===revision){renderTask=null;status('원본 '+pageNumber+' / '+pdf.numPages+'쪽');}
  }catch(e){if(ticket===revision && e.name!=='RenderingCancelledException')status('PDF 표시 실패: '+e.message);}
}
async function load(message){
  const generation=++loadVersion;
  ++revision;if(renderTask){renderTask.cancel();renderTask=null;}
  if(loading)await loading.destroy();if(generation!==loadVersion)return;pdf=null;status('원본 PDF를 불러오는 중입니다…');
  document.title=message.title || '단가표 원본';$('title').textContent=document.title;
  try{
    const task=getDocument({data:new Uint8Array(message.data),isEvalSupported:false,cMapUrl:new URL('./vendor/pdfjs/cmaps/',import.meta.url).href,cMapPacked:true,standardFontDataUrl:new URL('./vendor/pdfjs/standard_fonts/',import.meta.url).href,wasmUrl:new URL('./vendor/pdfjs/wasm/',import.meta.url).href});
    loading=task;const documentPDF=await task.promise;if(loading!==task)return;pdf=documentPDF;pageNumber=Math.max(1,Math.min(pdf.numPages,Number(message.page)||1));fit=false;scale=1.5;window.scrollTo(0,0);await render();
  }catch(e){status('PDF를 열지 못했습니다: '+e.message);}
}
window.addEventListener('message',event=>{
  if(event.origin!==origin || !event.source)return;
  if(event.data?.type==='danga:pdf-ping'){
    if(source && event.source!==source)return;source=event.source;source.postMessage({type:'danga:pdf-ready'},origin);return;
  }
  if(event.source===source && event.data?.type==='danga:pdf-data' && event.data.data instanceof ArrayBuffer)load(event.data);
});
function move(value){if(!pdf)return;const next=Math.max(1,Math.min(pdf.numPages,Number(value)||1));if(next===pageNumber)return;pageNumber=next;window.scrollTo(0,0);render();}
$('prev').onclick=()=>move(pageNumber-1);$('next').onclick=()=>move(pageNumber+1);$('page').onchange=()=>move($('page').value);
$('smaller').onclick=()=>{fit=false;scale=Math.max(.25,scale-.15);render();};$('larger').onclick=()=>{fit=false;scale=Math.min(3,scale+.15);render();};$('fit').onclick=()=>{fit=true;render();};$('actual').onclick=()=>{fit=false;scale=1;render();};
function editing(target){return target instanceof Element && !!target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"])');}
window.addEventListener('keydown',event=>{
  if(!pdf || editing(event.target) || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey)return;
  const direction={ArrowLeft:-1,ArrowUp:-1,ArrowRight:1,ArrowDown:1}[event.key];
  if(!direction)return;event.preventDefault();if(!event.repeat)move(pageNumber+direction);
});
// Scroll tall pages normally, then turn one page at the top/bottom edge.
let wheelDistance=0,wheelDirection=0,wheelTime=0,lastTurn=-Infinity;
window.addEventListener('wheel',event=>{
  if(!pdf || editing(event.target) || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || !event.deltaY || Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
  const now=performance.now(),direction=Math.sign(event.deltaY),scroll=document.scrollingElement;
  const atEdge=direction<0?scroll.scrollTop<=2:scroll.scrollTop+innerHeight>=scroll.scrollHeight-2;
  if(!atEdge){wheelDistance=0;return;}
  if((direction<0 && pageNumber===1) || (direction>0 && pageNumber===pdf.numPages))return;
  event.preventDefault();
  if(now-lastTurn<650){wheelTime=now;wheelDistance=0;return;}
  if(direction!==wheelDirection || now-wheelTime>200)wheelDistance=0;
  wheelDirection=direction;wheelTime=now;
  wheelDistance+=Math.abs(event.deltaY)*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
  if(wheelDistance>=60){wheelDistance=0;lastTurn=now;move(pageNumber+direction);}
},{passive:false});
let resize;window.addEventListener('resize',()=>{clearTimeout(resize);if(fit)resize=setTimeout(render,150);});
window.addEventListener('pagehide',()=>{++revision;if(loading)loading.destroy();});
