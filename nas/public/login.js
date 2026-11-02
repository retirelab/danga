'use strict';
const form=document.getElementById('login');
const error=document.getElementById('error');
const submit=document.getElementById('submit');
const pin=document.getElementById('pin');
pin.addEventListener('input',()=>{pin.value=pin.value.replace(/[^0-9]/g,'').slice(0,4);});
form.addEventListener('submit',async event=>{
  event.preventDefault();submit.disabled=true;error.textContent='';
  try {
    const statusResponse=await fetch('api.php?action=status',{cache:'no-store'});
    const status=await statusResponse.json();
    if(!statusResponse.ok) throw new Error(status.error || '설정을 확인해 주세요.');
    const response=await fetch('api.php?action=login',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':status.csrf},body:JSON.stringify({pin:pin.value})});
    pin.value='';
    const result=await response.json();
    if(!response.ok) throw new Error(result.error || '로그인하지 못했습니다.');
    location.replace('index.php');
  } catch(e) {error.textContent=e.message;pin.focus();}
  finally {submit.disabled=false;}
});
window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
