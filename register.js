document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // 🔐 Password length validation
  if (password.length < 8) {
    document.getElementById('msg').innerText =
      "Password must be at least 8 characters";
    return;
  }

  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  });

  const data = await response.json();
  document.getElementById('msg').innerText = data.message;
});
