document.addEventListener('DOMContentLoaded', async () => {
    // 1. Authentication Check
    // If the user isn't stored in localStorage, kick them back to the login page
    const userString = localStorage.getItem('user');
    if (!userString) {
        window.location.href = 'auth.html';
        return;
    }

    const user = JSON.parse(userString);
    document.getElementById('welcomeMessage').textContent = `Hello, ${user.username}!`;

    // NEW: Check role and display Admin button if applicable
    const adminBtn = document.getElementById('adminBtn');
    if (user.role === 'admin') {
        adminBtn.classList.remove('hidden'); // Make the button visible
        adminBtn.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
    }
    // 2. Handle Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'auth.html';
    });

    // 3. Fetch and Display Vegetables
    const grid = document.getElementById('vegGrid');
    
    try {
        const response = await fetch('http://localhost:3000/api/veg');
        
        // Ensure the API actually returned a success response
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const vegetables = await response.json();

        // Clear the "Loading..." text
        grid.innerHTML = '';

        if (vegetables.length === 0) {
            grid.innerHTML = '<p>No vegetables found in the database.</p>';
            return;
        }

        // Loop through the database results and create a card for each
        vegetables.forEach(veg => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // Build the card HTML (Notice the inline onclick is removed)
            card.innerHTML = `
                <img src="${veg.image_url}" alt="${veg.name}">
                <div class="card-info">
                    <div>
                        <div class="card-title">${veg.name}</div>
                        <div class="card-price">$${parseFloat(veg.price).toFixed(2)}</div>
                    </div>
                    <button class="view-btn">View Details</button>
                </div>
            `;
            
            // 4. Navigation to Details Page (Modern Approach)
            // Attach the click event directly to this specific card's button
            const viewBtn = card.querySelector('.view-btn');
            viewBtn.addEventListener('click', () => {
                window.location.href = `details.html?id=${veg.veg_id}`;
            });

            // Add the card to the grid
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching vegetables:', error);
        grid.innerHTML = '<p style="color:red;">Failed to load vegetables from the server.</p>';
    }
});
