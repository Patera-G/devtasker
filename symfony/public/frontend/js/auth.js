document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch('http://localhost:8080/api/login_check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
        const data = await res.json();
        localStorage.setItem('jwt_token', data.token);
        window.location.href = 'tasks.html';
    } else {
        document.getElementById('error').textContent = 'Ivalid credentials.';
    }
});