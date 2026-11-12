export const KEYS = { users: 'crm_users', session: 'crm_session', clients: 'crm_clients', theme: 'crm_theme' };
export const read = (key, fallback) => { try { const value = localStorage.getItem(key); return value === null ? fallback : JSON.parse(value); } catch { return fallback; } };
export const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
export const getUsers = () => read(KEYS.users, []);
export const getSession = () => read(KEYS.session, null);
export const getCurrentUser = () => { const session = getSession(); return session ? getUsers().find(user => user.id === session.userId) || null : null; };
export const saveClients = clients => write(KEYS.clients, clients);
export const getClients = () => read(KEYS.clients, null);
export function showToast(message, type = 'success') {
  const root = document.getElementById('toast-root'); if (!root) return;
  const toast = document.createElement('div'); toast.className = `toast ${type === 'error' ? 'error' : ''}`; toast.textContent = message; root.append(toast);
  setTimeout(() => toast.remove(), 3000);
}
export function setFieldError(input, message = '') {
  if (!input) return; input.classList.toggle('input-error', Boolean(message));
  const error = input.parentElement.querySelector('.field-error'); if (error) error.textContent = message;
}
export function clearErrors(form) { form.querySelectorAll('.field-error').forEach(el => el.textContent = ''); form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error')); }
export function applyTheme() { const theme = localStorage.getItem(KEYS.theme) || 'light'; document.body.classList.toggle('dark', theme === 'dark'); }
export function setupShell(activePage) {
  applyTheme();
  document.querySelector(`[data-nav="${activePage}"]`)?.classList.add('active');
  document.getElementById('theme-toggle')?.addEventListener('click', () => { const next = document.body.classList.contains('dark') ? 'light' : 'dark'; localStorage.setItem(KEYS.theme, next); applyTheme(); });
  document.getElementById('logout-btn')?.addEventListener('click', () => { localStorage.removeItem(KEYS.session); location.href = 'index.html'; });
  document.getElementById('mobile-menu')?.addEventListener('click', () => document.querySelector('.sidebar')?.classList.toggle('open'));
}
