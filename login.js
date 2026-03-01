function togglePassword() {
  const password = document.getElementById("password");
  password.type = password.type === "password" ? "text" : "password";
}

document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (response.ok) {
    document.getElementById("msg").style.color = "green";
    document.getElementById("msg").innerText = "Login successful";

    // Redirect to home page
    setTimeout(() => {
      window.location.href = "home.html";
    }, 1000);

  } else {
    document.getElementById("msg").style.color = "red";
    document.getElementById("msg").innerText = data.message || "Login failed";
  }
});