import { requireAuth } from './guard.js';
import { getCurrentUser, getUsers, write, KEYS, setupShell, showToast, clearErrors, setFieldError, saveClients } from './storage.js';
import { loadClients } from './data.js';
requireAuth(); setupShell('profile');
let user=getCurrentUser();
const $=id=>document.getElementById(id);
function renderProfile(){
  if(!user)return;
  $('profile-name').textContent=user.fullName;$('profile-email').textContent=user.email;$('profile-company').textContent=user.company||'No company added';
  $('profile-avatar').textContent=user.fullName.split(/\s+/).map(part=>part[0]).slice(0,2).join('').toUpperCase();
  $('member-since').textContent=`Member since ${new Date(user.createdAt).toLocaleDateString()}`;
  $('profile-fullname').value=user.fullName;$('profile-company-input').value=user.company||'';
}
renderProfile();
$('profile-form').addEventListener('submit',e=>{
  e.preventDefault();const form=e.currentTarget;clearErrors(form);const name=$('profile-fullname');if(name.value.trim().length<3){setFieldError(name,'Full name must be at least 3 characters');return;}
  const users=getUsers(),index=users.findIndex(item=>item.id===user.id);users[index].fullName=name.value.trim();users[index].company=$('profile-company-input').value.trim();write(KEYS.users,users);user=users[index];renderProfile();showToast('Profile updated ✓');
});
$('password-form').addEventListener('submit',e=>{
  e.preventDefault();const form=e.currentTarget;clearErrors(form);const current=$('current-password'),next=$('new-password'),confirm=$('confirm-new-password');let valid=true;
  if(current.value!==user.password){setFieldError(current,'Current password is incorrect');valid=false;}
  if(next.value.length<8||!/[a-zA-Z]/.test(next.value)||!/[0-9]/.test(next.value)){setFieldError(next,'Password must be at least 8 characters and contain a letter and a number');valid=false;}
  else if(next.value===current.value){setFieldError(next,'New password must be different from the current one');valid=false;}
  if(confirm.value!==next.value){setFieldError(confirm,'Passwords do not match');valid=false;}
  if(!valid)return;
  const users=getUsers(),index=users.findIndex(item=>item.id===user.id);users[index].password=next.value;write(KEYS.users,users);user=users[index];form.reset();showToast('Password changed ✓');
});
$('reset-data').addEventListener('click',async()=>{
  if(!confirm('Reset CRM data? Your saved clients will be replaced with the sample client list.'))return;
  localStorage.removeItem(KEYS.clients);saveClients([]);
  try{const clients=await loadClients(true);saveClients(clients);showToast('CRM data reset successfully ✓');}
  catch(error){showToast('Could not reload clients. Check your connection.','error');}
});
