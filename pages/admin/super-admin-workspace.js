import { api } from '../../services/api-client.js';
import { authService } from '../../services/auth-service.js';

const view=document.body.dataset.adminView??'dashboard';
const root=document.querySelector('[data-admin-root]');
const links=[['Dashboard','/admin/'],['Users','/admin/users/'],['Subscriptions','/admin/subscriptions/'],['Usage','/admin/usage/'],['Interventions','/admin/interventions/'],['Settings','/admin/settings/'],['Landing page','/admin/landing-content/'],['Mail outbox','/admin/mail/'],['Reports','/admin/reports/'],['System','/admin/system/'],['Security','/admin/security/'],['Resume Services','/admin/resume-services/'],['CV Specialists','/admin/cv-specialists/']];
const header=document.createElement('header'),nav=document.createElement('nav'),title=document.createElement('h1'),content=document.createElement('section'),status=document.createElement('p');
header.className='dashboard-panel p-6';nav.className='mt-5 flex flex-wrap gap-2';title.className='text-3xl font-black';title.textContent=view.replaceAll('-',' ');
for(const[label,href]of links){const link=document.createElement('a');link.className='dashboard-action';link.href=href;link.textContent=label;nav.append(link);}
const logout=document.createElement('button');logout.type='button';logout.className='dashboard-action';logout.textContent='Logout admin';logout.dataset.logout='';
logout.addEventListener('click',async()=>{logout.disabled=true;try{await authService.logout();}finally{location.assign('/login/');}});nav.append(logout);
header.append(title,nav);content.className='dashboard-panel mt-6 overflow-x-auto p-5';status.className='mt-4 text-slate-300';status.textContent='Memuat data terotorisasi…';root.append(header,content,status);

load();

async function load(){
  try{
    const {user:actor}=await api.get('/me');
    const roles=Array.isArray(actor.roles)?actor.roles:[actor.role];
    if(!roles.includes('super_admin')){location.replace(roles.includes('cv_specialist')?'/specialist/':'/app/');return;}
    if(['dashboard','reports'].includes(view))return renderObject(await api.get('/admin/statistics'));
    if(view==='users')return renderRows(await api.get('/admin/users'));
    if(view==='subscriptions')return renderRows(await api.get('/admin/subscriptions'));
    if(view==='usage')return renderRows(await api.get('/admin/usage'));
    if(view==='interventions')return renderRows(await api.get('/admin/interventions'));
    if(view==='settings')return renderRows(await api.get('/admin/settings'));
    if(view==='mail')return renderMail(await api.get('/admin/mail/outbox?limit=100'));
    if(view==='cv-specialists')return renderRows(await api.get('/admin/cv-specialists'));
    if(view==='user-detail')return renderUser(await api.get(`/admin/users/${encodeURIComponent(new URLSearchParams(location.search).get('id')??'')}`));
    if(['system','security'].includes(view))return renderRows(await api.get('/admin/activity'));
  }catch(error){if(error.status===401){location.replace('/login/');return;}status.textContent=error.message;}
}

function renderMail(rows){
  if(!rows.length){content.textContent='Belum ada mail job.';status.textContent='0 item.';return;}
  const table=document.createElement('table'),thead=document.createElement('thead'),tbody=document.createElement('tbody'),head=document.createElement('tr');
  for(const label of['Recipient','Template','Status','Attempts','Available','Error','Action']){const th=document.createElement('th');th.className='px-2 py-3 text-left text-slate-400';th.textContent=label;head.append(th);}thead.append(head);
  for(const item of rows){const line=document.createElement('tr');line.className='border-t border-white/10';const values=[item.maskedRecipient,item.templateKey,item.status,`${item.attempts}/${item.maxAttempts}`,format(item.availableAt),item.lastErrorMessage??'—'];for(const value of values){const td=document.createElement('td');td.className='px-2 py-3 align-top break-words';td.textContent=String(value);line.append(td);}const action=document.createElement('td');action.className='px-2 py-3 align-top';if(item.status==='failed'){const retry=document.createElement('button');retry.type='button';retry.className='dashboard-action';retry.textContent='Retry';retry.addEventListener('click',()=>retryMail(item,retry));action.append(retry);}else action.textContent='—';line.append(action);tbody.append(line);}
  table.className='min-w-full text-sm';table.append(thead,tbody);content.replaceChildren(table);status.textContent=`${rows.length} mail job tersanitasi. Data sensitif dan secret tidak ditampilkan.`;
}

async function retryMail(item,button){
  const reason=window.prompt('Alasan retry mail (minimal 10 karakter):','Retry after verified delivery incident');
  if(!reason||reason.trim().length<10){status.textContent='Retry dibatalkan: alasan minimal 10 karakter.';return;}
  if(!window.confirm(`Antrekan ulang mail ${item.publicId.slice(0,8)} dan catat immutable audit event?`))return;
  button.disabled=true;
  try{await api.post(`/admin/mail/outbox/${encodeURIComponent(item.publicId)}/retry`,{reason:reason.trim(),confirm:true});status.textContent='Mail job berhasil dimasukkan kembali ke antrean.';return load();}
  catch(error){status.textContent=error.message;button.disabled=false;}
}

function renderObject(value){
  const grid=document.createElement('div');grid.className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4';
  const labels={starterUsers:'User Starter',basicUsers:'User Basic',proUsers:'User Pro',totalUsers:'Total user',activeUsers:'User aktif',activeSubscriptions:'Subscription aktif'};
  for(const[key,data]of Object.entries(value)){const card=document.createElement('article'),label=document.createElement('p'),number=document.createElement('p');card.className=`rounded-2xl border p-4 ${key==='starterUsers'?'border-slate-400/40':key==='basicUsers'?'border-cyan-400/40':key==='proUsers'?'border-amber-400/40':'border-white/10'}`;label.className='text-sm text-slate-400';number.className='mt-2 text-2xl font-black';label.textContent=labels[key]??key;number.textContent=data??'—';card.append(label,number);grid.append(card);}
  content.replaceChildren(grid);status.textContent='Statistik teragregasi; tidak ada isi resume atau secret yang ditampilkan.';
}

function renderRows(rows){
  if(!rows.length){content.textContent='Belum ada data.';status.textContent='0 item.';return;}
  const table=document.createElement('table'),thead=document.createElement('thead'),tbody=document.createElement('tbody'),headers=Object.keys(rows[0]).filter(key=>!['internalNotes','storagePath','pastedResumeText'].includes(key)),tr=document.createElement('tr');
  table.className='min-w-full text-left text-sm';for(const key of headers){const th=document.createElement('th');th.className='px-2 py-3 text-slate-400';th.textContent=key;tr.append(th);}thead.append(tr);
  for(const row of rows){const line=document.createElement('tr');line.className='border-t border-white/10';for(const key of headers){const td=document.createElement('td');td.className='px-2 py-3 align-top break-words';if(key==='publicId'&&['users','cv-specialists'].includes(view)){const link=document.createElement('a');link.className='text-cyan-300 hover:underline';link.href=`/admin/${view==='users'?'users':'cv-specialists'}/detail/?id=${encodeURIComponent(row[key])}`;link.textContent=String(row[key]).slice(0,8);td.append(link);}else td.textContent=format(row[key]);line.append(td);}tbody.append(line);}
  table.append(thead,tbody);content.replaceChildren(table);status.textContent=`${rows.length} item ditampilkan.`;
}

function renderUser(data){
  const wrapper=document.createElement('div');wrapper.className='grid gap-5 lg:grid-cols-2';
  wrapper.append(objectPanel('Identity & verification',data.identity));
  for(const key of['subscriptions','payments','usage','resume','security','audit'])wrapper.append(rowsPanel(key,data[key]));
  const form=document.createElement('form');form.className='rounded-2xl border border-white/10 p-5';form.dataset.intervention='';
  const formTitle=document.createElement('h2');formTitle.className='text-xl font-black';formTitle.textContent='Controlled intervention';
  const action=document.createElement('select');action.name='action';for(const value of['SUSPEND_USER','ACTIVATE_USER','GRANT_ROLE','EXTEND_SUBSCRIPTION','RESET_RESUME_ENTITLEMENT']){const option=document.createElement('option');option.value=value;option.textContent=value;action.append(option);}
  const role=document.createElement('input');role.name='roleCode';role.placeholder='roleCode jika diperlukan';
  const days=document.createElement('input');days.name='days';days.type='number';days.min='1';days.max='3650';days.placeholder='days jika diperlukan';
  const reason=document.createElement('textarea');reason.name='reason';reason.required=true;reason.minLength=10;reason.maxLength=1000;reason.placeholder='Alasan wajib (min. 10 karakter)';
  const submit=document.createElement('button');submit.type='submit';submit.className='dashboard-action';submit.textContent='Confirm intervention';
  for(const field of[action,role,days,reason,submit])field.classList.add('mt-3','block','w-full');
  form.append(formTitle,action,role,days,reason,submit);wrapper.append(form);content.replaceChildren(wrapper);status.textContent='Detail terotorisasi. Semua intervensi memerlukan recent authentication, CSRF, konfirmasi, dan alasan.';
  form.addEventListener('submit',async(event)=>{event.preventDefault();if(!window.confirm('Terapkan intervensi terkontrol dan tulis immutable audit event?'))return;const values=new FormData(form);try{await api.post(`/admin/users/${encodeURIComponent(data.identity.publicId)}/interventions`,{action:String(values.get('action')),reason:String(values.get('reason')),confirm:true,...(values.get('roleCode')?{roleCode:String(values.get('roleCode'))}:{}),...(values.get('days')?{days:Number(values.get('days'))}:{})});status.textContent='Intervensi berhasil dicatat.';}catch(error){status.textContent=error.message;}});
}

function objectPanel(label,data){
  const panel=document.createElement('section'),heading=document.createElement('h2'),list=document.createElement('dl');panel.className='rounded-2xl border border-white/10 p-5';heading.className='text-xl font-black';heading.textContent=label;list.className='mt-3 space-y-2';
  for(const[key,value]of Object.entries(data)){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.className='text-slate-400';dt.textContent=key;dd.textContent=format(value);row.append(dt,dd);list.append(row);}panel.append(heading,list);return panel;
}

function rowsPanel(label,rows){
  const panel=document.createElement('section'),heading=document.createElement('h2'),list=document.createElement('ul');panel.className='rounded-2xl border border-white/10 p-5';heading.className='text-xl font-black';heading.textContent=label;
  for(const row of rows){const item=document.createElement('li');item.className='mt-3 border-t border-white/10 pt-3 text-sm break-words';item.textContent=Object.entries(row).map(([key,value])=>`${key}: ${format(value)}`).join(' · ');list.append(item);}if(!rows.length){const empty=document.createElement('li');empty.className='mt-3';empty.textContent='Belum ada data.';list.append(empty);}panel.append(heading,list);return panel;
}

function format(value){
  if(value===null||value===undefined)return'—';
  if(typeof value==='object')return JSON.stringify(value);
  return String(value);
}
