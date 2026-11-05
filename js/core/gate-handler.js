(function(){'use strict';
const gate=document.getElementById('brz-access-gate'),form=document.getElementById('brz-gate-form'),field=document.getElementById('brz-gate-password'),error=document.getElementById('brz-gate-error'),show=document.getElementById('brz-gate-show'),submit=form.querySelector('[type="submit"]');
show.addEventListener('click',()=>{const shown=field.type==='text';field.type=shown?'password':'text';show.textContent=shown?'Mostrar':'Ocultar';field.focus();});
form.addEventListener('submit',async e=>{e.preventDefault();error.textContent='';submit.disabled=true;
try{if(!window.BRZSYNC)throw Error('Conexão indisponível. Atualize a página.');await window.BRZSYNC.login(field.value);}
catch(err){error.textContent=err.message||'Não foi possível validar a senha.';field.value='';field.focus();}finally{submit.disabled=false;}});
})();