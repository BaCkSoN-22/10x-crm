import { getClients, saveClients } from './storage.js';
const API = 'https://dummyjson.com';
export function normalizeUser(user) {
  return { id: user.id, name: `${user.firstName || ''} ${user.lastName || ''}`.trim(), email: user.email || '', phone: user.phone || '', company: user.company?.name || '', image: user.image || '', status: 'Lead', dealValue: Math.floor(Math.random() * 9500) + 500, notes: [], createdAt: new Date().toISOString() };
}
export async function loadClients(force = false) {
  const saved = getClients();
  if (!force && Array.isArray(saved)) return saved;
  const response = await fetch(`${API}/users?limit=30`);
  if (!response.ok) throw new Error(`Could not load clients (${response.status})`);
  const data = await response.json();
  const clients = data.users.map(normalizeUser);
  saveClients(clients);
  return clients;
}
export async function addClientRequest(client) {
  const response = await fetch(`${API}/users/add`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ firstName: client.name.split(' ')[0], lastName: client.name.split(' ').slice(1).join(' '), email: client.email, phone: client.phone, company: { name: client.company } }) });
  if (!response.ok) throw new Error('Could not add client to the API.');
  const result = await response.json();
  return { ...client, id: result.id || Date.now() };
}
export async function deleteClientRequest(id) {
  const response = await fetch(`${API}/users/${encodeURIComponent(id)}`, { method: 'DELETE' });
  // DummyJSON simulates writes; local state remains the source of truth.
  if (!response.ok && response.status !== 404) throw new Error('Could not delete client from the API.');
}
