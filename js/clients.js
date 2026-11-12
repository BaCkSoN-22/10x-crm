import { requireAuth } from './guard.js';
import { setupShell, getClients, saveClients, showToast, clearErrors, setFieldError } from './storage.js';
import { loadClients, addClientRequest, deleteClientRequest } from './data.js';
requireAuth(); setupShell('clients');
let clients = [], activeStatus = 'All', searchTerm = '', sortMode = 'newest';
const list = document.getElementById('clients-list'), addModal = document.getElementById('client-modal'), detailModal = document.getElementById('details-modal');
const statuses = ['Lead','Contacted','Won','Lost'];
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = value => Number(value || 0).toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
function visibleClients() {
  let result = [...clients];
  if (activeStatus !== 'All') result = result.filter(c => c.status === activeStatus);
  if (searchTerm) result = result.filter(c => `${c.name} ${c.company}`.toLowerCase().includes(searchTerm));
  if (sortMode === 'name') result.sort((a,b) => a.name.localeCompare(b.name));
  else if (sortMode === 'value') result.sort((a,b) => b.dealValue - a.dealValue);
  else result.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  return result;
}
function renderClients() {
  const visible = visibleClients();
  document.getElementById('count-All').textContent = clients.length;
  if (!visible.length) { list.innerHTML = '<div class="empty-state">No clients found.</div>'; return; }
  list.innerHTML = visible.map(c => `<article class="client-card" data-client-id="${esc(c.id)}">
    <div class="client-identity"><div class="avatar">${c.image ? `<img class="avatar" src="${esc(c.image)}" alt="" onerror="this.outerHTML='${esc((c.name||'?').slice(0,1).toUpperCase())}'">` : esc((c.name||'?').slice(0,1).toUpperCase())}</div><div><strong>${esc(c.name)}</strong><small>${esc(c.email)}</small></div></div>
    <div class="client-company">${esc(c.company || 'Independent')}</div><span class="status-badge status-${statuses.includes(c.status)?c.status:'Lead'}">${esc(c.status)}</span><div class="client-value">${money(c.dealValue)}</div>
    <div class="client-actions"><select class="status-select" data-id="${esc(c.id)}" aria-label="Change status">${statuses.map(s=>`<option ${c.status===s?'selected':''}>${s}</option>`).join('')}</select><button class="delete-btn" data-delete="${esc(c.id)}" aria-label="Delete client">×</button></div></article>`).join('');
}
async function refresh(force=false) {
  list.innerHTML = '<div class="loading-state">Loading clients...</div>';
  try { clients = await loadClients(force); renderClients(); }
  catch (error) { list.innerHTML = `<div class="empty-state">${esc('Could not load clients. Check your connection and try again.')}<br><button id="retry-load" class="btn btn-ghost retry-btn">Retry</button></div>`; }
}
document.getElementById('retry-load')?.addEventListener('click', () => refresh(true));
document.getElementById('search-input').addEventListener('input', e => { searchTerm=e.target.value.trim().toLowerCase(); renderClients(); });
document.getElementById('sort-select').addEventListener('change', e => { sortMode=e.target.value; renderClients(); });
document.getElementById('filter-chips').addEventListener('click', e => { const chip=e.target.closest('[data-status]'); if(!chip)return; activeStatus=chip.dataset.status; document.querySelectorAll('.chip').forEach(el=>el.classList.toggle('active',el===chip)); renderClients(); });
document.getElementById('add-client-btn').addEventListener('click', () => { document.getElementById('client-form').reset(); clearErrors(document.getElementById('client-form')); addModal.classList.remove('hidden'); });
addModal.addEventListener('click', e => { if(e.target.dataset.close) addModal.classList.add('hidden'); });
list.addEventListener('click', async e => {
  const del=e.target.closest('[data-delete]');
  if(del) { e.stopPropagation(); const id=del.dataset.delete; if(!confirm('Delete this client? This cannot be undone.'))return;
    try { await deleteClientRequest(id); } catch(error) { showToast(error.message,'error'); return; }
    clients=clients.filter(c=>String(c.id)!==String(id)); saveClients(clients); renderClients(); showToast('Client deleted'); return;
  }
  if(e.target.closest('.status-select')) return;
  const card=e.target.closest('[data-client-id]'); if(card) openDetails(card.dataset.clientId);
});
list.addEventListener('change', e => {
  if(!e.target.matches('.status-select'))return;
  const client=clients.find(c=>String(c.id)===String(e.target.dataset.id)); if(!client)return;
  client.status=e.target.value; saveClients(clients); renderClients(); showToast('Client status updated ✓');
});
document.getElementById('client-form').addEventListener('submit', async e => {
  e.preventDefault(); const form=e.currentTarget; clearErrors(form);
  const name=document.getElementById('client-name'), email=document.getElementById('client-email'), phone=document.getElementById('client-phone'), value=document.getElementById('client-value');
  const cleanEmail=email.value.trim().toLowerCase(); let valid=true;
  if(name.value.trim().length<3){setFieldError(name,'Name must be at least 3 characters');valid=false;}
  if(!cleanEmail.includes('@')||!cleanEmail.split('@')[1]?.includes('.')){setFieldError(email,'Please enter a valid email address');valid=false;}
  else if(clients.some(c=>c.email.toLowerCase()===cleanEmail)){setFieldError(email,'A client with this email already exists');valid=false;}
  if(phone.value.trim()&&phone.value.trim().length<6){setFieldError(phone,'Phone number looks too short');valid=false;}
  if(!Number.isFinite(Number(value.value))||Number(value.value)<=0){setFieldError(value,'Deal value must be a positive number');valid=false;}
  if(!valid)return;
  const client={name:name.value.trim(),email:cleanEmail,phone:phone.value.trim(),company:document.getElementById('client-company').value.trim(),dealValue:Number(value.value),status:document.getElementById('client-status').value,notes:[],createdAt:new Date().toISOString()};
  try { const saved=await addClientRequest(client); clients.unshift(saved); saveClients(clients); addModal.classList.add('hidden'); renderClients(); showToast('Client added ✓'); }
  catch(error){showToast(error.message,'error');}
});
function openDetails(id) {
  const c=clients.find(item=>String(item.id)===String(id)); if(!c)return;
  document.getElementById('detail-name').textContent=c.name;
  const notes=(c.notes||[]).map(n=>`<div class="note-item">${esc(n.text)}<small>${esc(n.date)}</small></div>`).join('')||'<p class="muted">No notes yet.</p>';
  document.getElementById('detail-content').innerHTML=`<div class="detail-meta"><div><span>COMPANY</span><strong>${esc(c.company||'—')}</strong></div><div><span>EMAIL</span><strong>${esc(c.email)}</strong></div><div><span>PHONE</span><strong>${esc(c.phone||'—')}</strong></div><div><span>DEAL VALUE</span><strong>${money(c.dealValue)}</strong></div><div><span>STATUS</span><strong>${esc(c.status)}</strong></div><div><span>CLIENT SINCE</span><strong>${new Date(c.createdAt).toLocaleDateString()}</strong></div></div><h3>Notes & activity</h3><div class="notes-list">${notes}</div><form id="note-form" class="note-entry"><input id="note-text" placeholder="Write a note..." aria-label="Write a note"><button class="btn btn-primary">Add note</button></form><button id="remind-btn" class="btn btn-ghost reminder-btn">Remind me in 1 min</button>`;
  document.getElementById('note-form').addEventListener('submit', e=>{e.preventDefault();const input=document.getElementById('note-text');if(!input.value.trim())return;c.notes=c.notes||[];c.notes.push({text:input.value.trim(),date:new Date().toLocaleString()});saveClients(clients);openDetails(id);});
  document.getElementById('remind-btn').addEventListener('click',()=>{showToast('Reminder set ✓');setTimeout(()=>showToast(`⏰ Follow up: ${c.name}`),60000);});
  detailModal.classList.remove('hidden');
}
detailModal.addEventListener('click',e=>{if(e.target.dataset.detailClose)detailModal.classList.add('hidden');});
refresh();
