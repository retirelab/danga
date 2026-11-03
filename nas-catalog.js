/* Public bridge: no PIN, token, catalog or PDF is stored in this origin. */
window.NasCatalog = function NasCatalog({onApply}) {
  const [open,setOpen]=React.useState(false);
  const [ready,setReady]=React.useState(false);
  const frame=React.useRef(null), dialog=React.useRef(null), trigger=React.useRef(null);
  const origin='https://danga.onsnas83.diskstation.me';
  React.useEffect(()=>{
    if(!open)return;const d=dialog.current;d.showModal();
    const receive=event=>{
      if(event.origin!==origin || event.source!==frame.current?.contentWindow)return;
      const message=event.data,item=message?.item;
      if(message?.type!=='danga:apply-price' || message.version!==1 || !item || item.status!=='available' || !item.verified || !Number.isSafeInteger(item.price_krw) || item.price_krw<=0 || item.currency!=='KRW' || item.vat!=='excluded' || !['list','purchase'].includes(item.price_type) || !['maker','model','spec','id','revision','document_id','source_sha256'].every(k=>typeof item[k]==='string' && item[k].length<2000) || !Number.isInteger(item.source_page) || item.source_page<1)return;
      onApply(item);setOpen(false);
    };
    window.addEventListener('message',receive);
    return()=>{window.removeEventListener('message',receive);d.close();trigger.current?.focus();};
  },[open,onApply]);
  return React.createElement(React.Fragment,null,
    React.createElement('button',{ref:trigger,className:'btn-outline',onClick:()=>{setReady(false);setOpen(true);},style:{marginLeft:'auto',whiteSpace:'nowrap'}},'비공개 단가표 · PDF'),
    open && React.createElement('dialog',{ref:dialog,onCancel:()=>setOpen(false),style:{width:'96vw',maxWidth:'1350px',height:'94vh',margin:'auto',padding:'12px',border:'1px solid #cbd5e1',borderRadius:'12px'}},
      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}},React.createElement('strong',null,'NAS 비공개 단가표'),React.createElement('button',{className:'btn-outline',onClick:()=>setOpen(false)},'닫기 · 잠금')),
      !ready && React.createElement('p',{role:'status'},'NAS 연결 중입니다. 열리지 않으면 NAS 서비스 업데이트와 접속 상태를 확인하세요.'),
      React.createElement('iframe',{ref:frame,src:origin+'/widget.php',title:'비공개 단가표 검색 및 원본 PDF 대조',referrerPolicy:'no-referrer',onLoad:()=>setReady(true),style:{width:'100%',height:'calc(100% - 55px)',border:0}})
    ));
};
