import { getSession } from './storage.js';
export function requireAuth() { if (!getSession()) location.replace('index.html'); }
export function redirectIfAuthenticated() { if (getSession()) location.replace('dashboard.html'); }
