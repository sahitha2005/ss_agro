// --- UI Toggle Logic ---
const signupSection = document.getElementById('signupSection');
const loginSection = document.getElementById('loginSection');
const showLoginBtn = document.getElementById('showLogin');
const showSignupBtn = document.getElementById('showSignup');

// When "LOGIN" is clicked, hide Sign Up and show Login
showLoginBtn.addEventListener('click', () => {
    signupSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

// When "SIGN UP" is clicked, hide Login and show Sign Up
showSignupBtn.addEventListener('click', () => {
    loginSection.classList.add('hidden');
    signupSection.classList.remove('hidden');
});


// --- API Logic Below ---
const API_URL = 'http://localhost:3000/api/auth';

// Signup Submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const messageEl = document.getElementById('signupMessage');

    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            messageEl.style.color = 'green';
            messageEl.textContent = 'Signup successful! Please login.';
            document.getElementById('signupForm').reset();
            
            // Optional: Automatically switch to login screen after successful signup
            setTimeout(() => {
                showLoginBtn.click();
                messageEl.textContent = ''; // Clear message after switching
            }, 1500);

        } else {
            messageEl.style.color = 'red';
            messageEl.textContent = data.error;
        }
    } catch (error) {
        messageEl.style.color = 'red';
        messageEl.textContent = 'Server error. Please try again.';
    }
});

// Login Submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageEl = document.getElementById('loginMessage');

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            messageEl.style.color = 'green';
            messageEl.textContent = 'Login successful! Redirecting...';
            
            localStorage.setItem('user', JSON.stringify(data.user));
            
            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 1000);
        } else {
            messageEl.style.color = 'red';
            messageEl.textContent = data.error;
        }
    } catch (error) {
        messageEl.style.color = 'red';
        messageEl.textContent = 'Server error. Please try again.';
    }
});
