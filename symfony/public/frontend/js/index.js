import { apiFetch } from './api.js';
import { setupNavListeners } from './nav.js';

document.addEventListener('DOMContentLoaded', () => {
    const error = document.getElementById('error');
    error.classList.add('hidden');
    setupNavListeners();
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    error.classList.add('hidden');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const spinner = document.getElementById('loading-spinner');

    spinner.classList.remove('hidden');


    const res = await fetch('http://localhost:8080/api/login_check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    spinner.classList.add('hidden');

    if (res.ok) {
        const data = await res.json();
        localStorage.setItem('jwt_token', data.token);
        window.location.href = 'tasks.html';
    } else {
        document.getElementById('error').textContent = 'Invalid credentials.';
        error.classList.remove('hidden');
    }
});