'use strict';
(() => {
  const PARENT='https://retirelab.github.io';
  const $=id=>document.getElementById(id);
  let pdfRequest=0;
  let pdfTab=null, pdfTabRequest=0;
  const externalPDFs=new Set();
  let token='', catalog=null, blobURL='', selected=null, currentDoc=null;
  const error=message=>{$('error').textContent=message || '';};
  const money=n=>new Intl.NumberFormat('ko-KR').format(n)+'원';
  const text=(tag,value,cls)=>{const e=document.createElement(tag);e.textContent=value;if(cls)e.className=cls;return e;};
  const button=(label,handler)=>{const e=text('button',label);e.type='button';e.addEventListener('click',handler);return e;};
  function clearPDF(){pdfRequest++; $('pdfFrame').removeAttribute('src');$('pdfNew').removeAttribute('href');if(blobURL)URL.revokeObjectURL(blobURL);blobURL='';selected=null;currentDoc=null;$('confirmed').checked=false;$('apply').disabled=true; }
  function reset(){for(const url of externalPDFs)URL.revokeObjectURL(url);externalPDFs.clear();token='';catalog=null;clearPDF();if($('pdfDialog').open)$('pdfDialog').close();$('results').replaceChildren();$('documents').replaceChildren();$('catalog').hidden=true;$('login').hidden=false;$('lock').hidden=true;$('pin').value='';}
  async function request(action,params={},body){
    const response=await fetch('service.php?'+new URLSearchParams({action,...params}),{method:body?'POST':'GET',cache:'no-store',credentials:'omit',headers:{...(token?{Authorization:'Bearer '+token}:{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
    if(!response.ok){const data=await response.json().catch(()=>({}));if(response.status===401 && action!=='login')reset();throw new Error(data.error || 'NAS 요청에 실패했습니다.');}
    return response;
  }
  async function lock(message='잠겼습니다.') {const old=token;reset();error(message);if(old)await fetch('service.php?action=logout',{method:'POST',credentials:'omit',headers:{Authorization:'Bearer '+old},keepalive:true}).catch(()=>{});}
  $('lock').onclick=()=>lock();
  $('pin').oninput=()=>{$('pin').value=$('pin').value.replace(/[^0-9]/g,'').slice(0,4);};
  $('login').onsubmit=async e=>{e.preventDefault();error('');const submit=e.submitter;submit.disabled=true;
    try {const data=await (await request('login',{}, {pin:$('pin').value})).json();$('pin').value='';token=data.token;
      catalog=await (await request('catalog')).json();$('login').hidden=true;$('catalog').hidden=false;$('lock').hidden=false;
      $('maker').replaceChildren(new Option('전체 업체',''));[...new Set(catalog.items.map(i=>i.maker))].sort().forEach(m=>$('maker').add(new Option(m,m)));
      $('demo').textContent=catalog.demo?'가상 샘플입니다. 실제 견적에 사용하지 마세요.':'';
      $('documents').replaceChildren();(catalog.documents || []).forEach(doc=>$('documents').append(button(doc.title+' · '+doc.pages+'쪽 · 새 탭으로 보기',()=>openPDFTab(doc))));
      if(!catalog.documents?.length)$('documents').append(text('p','등록된 원본 PDF가 없습니다.'));
      render();
    }catch(e){if(token)reset();error(e.message);}finally{submit.disabled=false;}
  };
  const norm=s=>String(s || '').toUpperCase().replace(/[\s-]/g,'');
  // Field model: controller series + number of pumps + pump model.
  function systemAlias(item){
    const series=String(item.category || '').match(/^(NSQP|NSQ|XQP|IOP|N747D)\b/i)?.[1]?.toUpperCase();
    const count=String(item.spec || '').match(/\b([2-6])\s*Pump\b/i)?.[1];
    const pump=String(item.model || '').replace(/\s+/g,'').toUpperCase();
    return series && count && /^XRL[0-9]/.test(pump) ? `${series}-${count}${pump}` : '';
  }
  function matchesQuery(item,query){
    const needle=norm(query),alias=systemAlias(item);
    if(/^(NSQP|NSQ|XQP|IOP|N747D)[2-6]XRL/.test(needle))return norm(alias)===needle;
    return norm([alias,item.maker,item.model,item.spec,item.category].join(' ')).includes(needle);
  }
  function render(){
    if(!catalog)return;const matches=catalog.items.filter(i=>(!$('maker').value || i.maker===$('maker').value) && matchesQuery(i,$('query').value));
    $('count').textContent=`검색 ${matches.length}건 · 개정 ${catalog.revision || '-'}${matches.length>100?' · 처음 100건 표시':''}`;$('results').replaceChildren();
    matches.slice(0,100).forEach(item=>{const card=document.createElement('article');card.append(text('p',`${item.maker} · ${item.category || ''} · 적용 ${item.effective_date || '미등록'}`),text('h3',systemAlias(item) || item.model),text('p',item.spec),text('p',item.status==='available'?`${item.price_type==='purchase'?'매입가':'정가/공장도가'} ${money(item.price_krw)} · 부가세 별도`:'본사 문의 / 적용 불가','money'));
      const doc=catalog.documents?.find(d=>d.id===item.document_id);const linked=doc && Number.isInteger(item.source_page) && item.source_page>0 && item.source_page<=doc.pages && item.source_sha256===doc.sha256;
      if(linked){
        card.append(text('p',`${doc.title} · PDF ${item.source_page}쪽${item.printed_page?' · 인쇄 '+item.printed_page+'쪽':''}`));
        const actions=document.createElement('div');actions.className='actions';
        if(item.status==='available'){
          const applyButton=button(money(item.price_krw)+' 바로 적용',()=>applyDirect(item,applyButton));actions.append(applyButton);
        }
        actions.append(button('원본 PDF ↗',()=>openPDFTab(doc,item.source_page)));card.append(actions);
      }
      else card.append(text('p','원본 페이지 연결 전 · 가격 적용을 막았습니다.','badge'));
      if(!item.verified)card.append(text('p','자동 추출 가격 · 견적 확정 전 원본 확인을 권장합니다.','badge'));$('results').append(card);
    });
  }
  $('query').oninput=render;$('maker').onchange=render;
  function jump(){if(!blobURL)return;const page=Math.max(1,Math.min(currentDoc.pages,Number($('page').value)||1));$('page').value=page;const url=blobURL+'#page='+page+'&zoom=100';$('pdfFrame').src=url;$('pdfNew').href=url;$('confirmed').checked=false;$('apply').disabled=true;}
  async function applyDirect(item,control){
    error('');control.disabled=true;
    try{
      const fresh=await (await request('select',{id:item.id,revision:catalog.revision,price:String(item.price_krw)})).json();
      const alias=systemAlias(fresh);if(alias){fresh.pump_model=fresh.model;fresh.model=alias;}
      if(window.parent===window)throw new Error('GitHub 계산기의 단가표 버튼에서 열어 적용해 주세요.');
      window.parent.postMessage({type:'danga:apply-price',version:1,item:fresh},PARENT);
    }catch(e){error(e.message);}finally{control.disabled=false;}
  }
  function waitPDFViewer(tab){
    return new Promise((resolve,reject)=>{
      const origin=location.origin;
      const cleanup=()=>{clearInterval(ping);clearTimeout(timeout);window.removeEventListener('message',receive);};
      const receive=event=>{if(event.origin===origin && event.source===tab && event.data?.type==='danga:pdf-ready'){cleanup();resolve();}};
      window.addEventListener('message',receive);
      const ping=setInterval(()=>{if(tab.closed){cleanup();reject(new Error('PDF 탭이 닫혔습니다.'));}else tab.postMessage({type:'danga:pdf-ping'},origin);},200);
      const timeout=setTimeout(()=>{cleanup();reject(new Error('전용 PDF 뷰어를 불러오지 못했습니다. NAS 업데이트 파일을 확인해 주세요.'));},20000);
    });
  }
  async function openPDFTab(doc,page=1){
    error('');const ticket=++pdfTabRequest;
    const reused=pdfTab && !pdfTab.closed;
    const tab=reused?pdfTab:window.open('pdf-viewer.php','_blank');
    if(!tab){error('새 탭이 차단되었습니다. 이 사이트의 팝업을 허용한 뒤 다시 눌러주세요.');return;}
    pdfTab=tab;if(!reused)tab.opener=null;tab.focus();const loginToken=token;
    try{
      const ready=waitPDFViewer(tab);ready.catch(()=>{});
      // Authorization stays in the NAS widget, never in the viewer URL or tab.
      const response=await request('pdf',{id:doc.id});const data=await response.arrayBuffer();
      await ready;
      if(ticket!==pdfTabRequest || token!==loginToken || !token || tab.closed)return;
      tab.postMessage({type:'danga:pdf-data',title:doc.title,page:Math.max(1,Math.min(doc.pages,Number(page)||1)),data},location.origin,[data]);tab.focus();
    }catch(e){if(ticket===pdfTabRequest)error(e.message);}
  }
  async function openPDF(doc,page,item){error('');clearPDF();const ticket=pdfRequest;$('pdfTitle').textContent=doc.title;$('pdfMeta').textContent=`적용일 ${doc.effective_date || '-'} · ${doc.pages}쪽${item?' · '+item.model+' · '+item.spec+' · '+(item.status==='available'?money(item.price_krw):'문의'):''}`;
    $('confirmLabel').hidden=true;$('apply').hidden=true;$('pdfDialog').showModal();
    try {const response=await request('pdf',{id:doc.id});const blob=await response.blob();if(!$('pdfDialog').open || ticket!==pdfRequest)return;blobURL=URL.createObjectURL(blob);currentDoc=doc;selected=item;$('page').max=doc.pages;$('page').value=page;jump();
      const canApply=item?.status==='available' && item.source_sha256===doc.sha256;$('confirmLabel').hidden=!canApply;$('apply').hidden=!canApply;
    }catch(e){if(ticket===pdfRequest){$('pdfDialog').close();error(e.message);}}
  }
  $('jump').onclick=jump;$('pdfClose').onclick=()=>$('pdfDialog').close();$('pdfDialog').addEventListener('close',clearPDF);
  $('confirmed').onchange=()=>{$('apply').disabled=!$('confirmed').checked;};
  $('apply').onclick=async()=>{if(!selected || !$('confirmed').checked || !blobURL)return;$('apply').disabled=true;
    try {const item=await (await request('select',{id:selected.id,revision:catalog.revision,price:String(selected.price_krw)})).json();
      if(window.parent===window)throw new Error('GitHub 계산기의 단가표 버튼에서 열어 적용해 주세요.');
      window.parent.postMessage({type:'danga:apply-price',version:1,item},PARENT);$('pdfDialog').close();
    }catch(e){error(e.message);$('pdfDialog').close();}
  };
  window.addEventListener('pageshow',e=>{if(e.persisted)reset();});
  window.addEventListener('pagehide',()=>{const old=token;reset();if(old)fetch('service.php?action=logout',{method:'POST',credentials:'omit',headers:{Authorization:'Bearer '+old},keepalive:true}).catch(()=>{});});
})();
