document.addEventListener('DOMContentLoaded', async () => {
    // 1. Validate User
    const userString = localStorage.getItem('user');
    if (!userString) {
        window.location.href = 'auth.html';
        return;
    }
    const user = JSON.parse(userString);

    // 2. Extract Vegetable ID
    const urlParams = new URLSearchParams(window.location.search);
    const vegId = urlParams.get('id');

    if (!vegId) {
        window.location.href = 'index.html';
        return;
    }

    let unitPrice = 0;

    // 3. Fetch Vegetable Details for the Summary
    try {
        const response = await fetch(`http://localhost:3000/api/veg/${vegId}`);
        if (!response.ok) throw new Error('Vegetable not found');
        
        const veg = await response.json();
        unitPrice = parseFloat(veg.price);

        // Populate Summary UI
        document.getElementById('summaryImage').src = veg.image_url;
        document.getElementById('summaryName').textContent = veg.name;
        document.getElementById('summaryPrice').textContent = `$${unitPrice.toFixed(2)}`;
        document.getElementById('calculatedTotal').textContent = unitPrice.toFixed(2);
        
        // Pre-fill username if available
        document.getElementById('buyerName').value = user.username || '';

        document.getElementById('loadingSummary').classList.add('hidden');
        document.getElementById('itemDetails').classList.remove('hidden');

    } catch (error) {
        console.error(error);
        document.getElementById('loadingSummary').textContent = 'Error loading item details.';
        document.getElementById('loadingSummary').style.color = 'red';
    }

    // 4. Handle Quantity Changes (Dynamic Total Calculation)
    const quantityInput = document.getElementById('quantity');
    quantityInput.addEventListener('input', (e) => {
        const qty = parseInt(e.target.value) || 1;
        const total = qty * unitPrice;
        document.getElementById('calculatedTotal').textContent = total.toFixed(2);
    });

    // 5. Handle Form Submission
    document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const buyerName = document.getElementById('buyerName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;

        const shippingAddress = document.getElementById('shippingAddress').value;
        const quantity = parseInt(quantityInput.value);
        const totalPrice = (quantity * unitPrice).toFixed(2);
        const messageEl = document.getElementById('checkoutMessage');

         const orderData = {
            user_email: user.email, 
            veg_id: vegId,
            buyer_name: buyerName,
            phone_number: phoneNumber, // NEW
            shipping_address: shippingAddress,
            quantity: quantity,
            total_price: parseFloat(totalPrice)
        };

        try {
            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (response.ok) {
                messageEl.style.color = 'green';
                messageEl.textContent = 'Order placed successfully! Redirecting...';
                document.getElementById('submitOrderBtn').disabled = true;

                // Redirect to home page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                messageEl.style.color = 'red';
                messageEl.textContent = result.error || 'Failed to place order.';
            }
        } catch (error) {
            console.error('Order Submission Error:', error);
            messageEl.style.color = 'red';
            messageEl.textContent = 'Server error. Please try again later.';
        }
    });
});
