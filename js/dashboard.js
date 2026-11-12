import { requireAuth } from './guard.js';
import { getCurrentUser, showToast, setupShell, saveClients } from './storage.js';
import { loadClients } from './data.js';
requireAuth(); setupShell('dashboard');
const user = getCurrentUser();
if (user) document.getElementById('welcome-title').textContent = `Welcome back, ${user.fullName.split(' ')[0]}!`;
function updateClock() {
  const now = new Date();
  document.getElementById('live-clock').textContent = now.toLocaleTimeString();
  document.getElementById('today-label').textContent = now.toLocaleDateString(undefined, { weekday:'long', month:'long', day:'numeric' }).toUpperCase();
}
updateClock(); setInterval(updateClock, 1000);
function render(clients) {
  document.getElementById('total-clients').textContent = clients.length;
  document.getElementById('active-deals').textContent = clients.filter(c => !['Won','Lost'].includes(c.status)).length;
  const revenue = clients.filter(c => c.status === 'Won').reduce((sum,c) => sum + Number(c.dealValue || 0), 0);
  document.getElementById('won-revenue').textContent = revenue.toLocaleString('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 });
  const week = clients.filter(c => (Date.now() - new Date(c.createdAt).getTime()) / 86400000 <= 7).length;
  document.getElementById('new-week').textContent = week;
  const statuses = ['Lead','Contacted','Won','Lost'];
  document.getElementById('pipeline').innerHTML = statuses.map(status => {
    const count = clients.filter(c => c.status === status).length, width = clients.length ? count / clients.length * 100 : 0;
    return `<div class="pipeline-row"><span>${status}</span><div class="bar-track"><div class="bar-fill bar-${status}" style="width:${width}%"></div></div><span class="count">${count}</span></div>`;
  }).join('');
  document.getElementById('insight-title').textContent = clients.length ? `${clients.filter(c=>c.status==='Won').length} deals won so far` : 'Start your pipeline';
  document.getElementById('insight-text').textContent = clients.length ? 'Keep your client records up to date to get a clearer picture of your sales activity.' : 'Add your first client to start tracking opportunities.';
  const recent = [...clients].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,5);
  document.getElementById('recent-clients').innerHTML = recent.length ? recent.map(c => `<tr><td>${escapeHTML(c.name)}</td><td>${escapeHTML(c.company || '—')}</td><td><span class="status-badge status-${c.status}">${c.status}</span></td><td>${new Date(c.createdAt).toLocaleDateString()}</td></tr>`).join('') : '<tr><td colspan="4" class="empty-state">No clients yet.</td></tr>';
}
function escapeHTML(value='') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
try { render(await loadClients()); } catch (error) { showToast('Could not load clients. Open the Clients page to retry.', 'error'); render([]); }
