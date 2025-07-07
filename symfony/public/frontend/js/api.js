async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('jwt_token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    alert('Session expired. Please log in again.');
    localStorage.removeItem('jwt_token');
    window.location.href = 'index.html';
    return;
  }

  return res;
}
