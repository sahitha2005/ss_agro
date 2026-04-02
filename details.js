document.addEventListener('DOMContentLoaded', async () => {
    // 1. Ensure the user is logged in
    const userString = localStorage.getItem('user');
    if (!userString) {
        window.location.href = 'auth.html';
        return;
    }

    // 2. Extract the 'id' parameter from the URL (e.g., ?id=3)
    const urlParams = new URLSearchParams(window.location.search);
    const vegId = urlParams.get('id');

    // If no ID is provided in the URL, send them back to the home page
    if (!vegId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        // 3. Fetch the specific vegetable details from the backend
        const response = await fetch(`http://localhost:3000/api/veg/${vegId}`);
        
        if (!response.ok) {
            throw new Error('Vegetable not found');
        }

        const veg = await response.json();

        // 4. Populate the HTML elements with the fetched data
        document.getElementById('vegImage').src = veg.image_url;
        document.getElementById('vegName').textContent = veg.name;
        document.getElementById('vegPrice').textContent = `$${veg.price}`;
        document.getElementById('vegSeason').textContent = veg.season || 'N/A';
        document.getElementById('vegCountry').textContent = veg.country || 'N/A';
        document.getElementById('vegDuration').textContent = veg.duration || 'N/A';

        // Hide the loading message and show the card
        document.getElementById('loadingMessage').classList.add('hidden');
        document.getElementById('detailsCard').classList.remove('hidden');

        // 5. Buy Now Button - Redirect to the Buy Now page
        document.getElementById('buyNowBtn').addEventListener('click', () => {
            window.location.href = `buynow.html?id=${vegId}`;
        });

        // 6. Fertilizer Button - Redirect to the separate fertilizer page
        document.getElementById('fertilizerBtn').addEventListener('click', () => {
            window.location.href = `fertilizer.html?id=${vegId}`;
        });

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loadingMessage').textContent = 'Error loading details. Please try again.';
        document.getElementById('loadingMessage').style.color = 'red';
    }
});
