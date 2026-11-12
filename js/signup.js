import { getUsers, KEYS, write, showToast, clearErrors, setFieldError, applyTheme } from './storage.js';
import { redirectIfAuthenticated } from './guard.js';
redirectIfAuthenticated(); applyTheme();
const form = document.getElementById('signup-form');
form.addEventListener('submit', event => {
  event.preventDefault(); clearErrors(form);
  const fields = ['fullName','email','company','password','confirmPassword'].map(id => document.getElementById(id));
  const [nameInput,emailInput,companyInput,passwordInput,confirmInput] = fields;
  const name = nameInput.value.trim(), email = emailInput.value.trim().toLowerCase(), password = passwordInput.value;
  let valid = true;
  if (name.length < 3) { setFieldError(nameInput, 'Full name must be at least 3 characters'); valid = false; }
  if (!email.includes('@') || !email.split('@')[1]?.includes('.')) { setFieldError(emailInput, 'Please enter a valid email address'); valid = false; }
  if (getUsers().some(user => user.email === email)) { setFieldError(emailInput, 'An account with this email already exists'); valid = false; }
  if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) { setFieldError(passwordInput, 'Password must be at least 8 characters and contain a letter and a number'); valid = false; }
  if (confirmInput.value !== password) { setFieldError(confirmInput, 'Passwords do not match'); valid = false; }
  if (!valid) return;
  const users = getUsers();
  users.push({ id: Date.now(), fullName: name, email, password, company: companyInput.value.trim(), createdAt: new Date().toISOString() });
  write(KEYS.users, users); showToast('Account created successfully! Please log in.');
  setTimeout(() => location.href = 'index.html', 1500);
});
