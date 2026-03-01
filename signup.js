const form = document.getElementById('registerForm');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const msg = document.getElementById('msg');

// 👁️ Hide / Unhide password
togglePassword.addEventListener('click', () => {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    togglePassword.textContent = '🙈';
  } else {
    passwordInput.type = 'password';
    togglePassword.textContent = '👁️';
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = passwordInput.value;

  // Password validation
  if (password.length < 8) {
    msg.innerText = 'Password must be at least 8 characters';
    msg.style.color = 'red';
    return;
  }

  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const data = await response.json();

  if (response.ok) {
    // ✅ DIRECTLY GO TO HOME PAGE
    window.location.href = "home.html";
  } else {
    msg.innerText = data.message;
    msg.style.color = 'red';
  }
});