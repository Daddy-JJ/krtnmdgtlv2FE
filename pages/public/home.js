import{I18n}from'../../services/i18n.js';const locale=document.documentElement.lang||'id';new I18n().load(locale).then(i18n=>i18n.apply()).catch(()=>{});
