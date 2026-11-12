import { getUsers, KEYS, write, showToast, clearErrors, setFieldError, applyTheme } from './storage.js';
import { redirectIfAuthenticated } from './guard.js';
redirectIfAuthenticated(); applyTheme();
const form = document.getElementById('login-form');
form.addEventListener('submit', event => {
  event.preventDefault(); clearErrors(form);
  const emailInput = document.getElementById('email'), passwordInput = document.getElementById('password');
  const email = emailInput.value.trim().toLowerCase(), password = passwordInput.value;
  let valid = true;
  if (!email) { setFieldError(emailInput, 'Email is required'); valid = false; }
  if (!password) { setFieldError(passwordInput, 'Password is required'); valid = false; }
  if (!valid) return;
  const user = getUsers().find(item => item.email === email && item.password === password);
  if (!user) { showToast('Invalid email or password', 'error'); return; }
  write(KEYS.session, { userId: user.id, email: user.email, loginAt: new Date().toISOString() });
  location.href = 'dashboard.html';
});
