document.addEventListener('DOMContentLoaded', async () => {
    // 1. Auth & Role Check
    const userString = localStorage.getItem('user');
    if (!userString) {
        window.location.href = 'auth.html';
        return;
    }
    const user = JSON.parse(userString);
    if (user.role !== 'admin') {
        alert('Access Denied.');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'auth.html';
    });

    const ordersBody = document.getElementById('ordersTableBody');
    const inventoryBody = document.getElementById('inventoryTableBody');

    // Modals
    const editModal = document.getElementById('editModal');
    const fertModal = document.getElementById('fertModal');

    // --- ORDERS MANAGEMENT ---
    async function loadOrders() {
        try {
            const response = await fetch('http://localhost:3000/api/admin/orders');
            const orders = await response.json();
            ordersBody.innerHTML = ''; 

            if (orders.length === 0) {
                ordersBody.innerHTML = '<tr><td colspan="9" style="text-align: center;">No orders found.</td></tr>';
                return;
            }

            orders.forEach(order => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>#${order.order_id}</td>
                    <td>${new Date(order.order_date).toLocaleDateString()}</td>
                    <td>${order.buyer_name}</td>
                    <td>${order.user_email}</td>
                    <td>${order.vegetable_name}</td>
                    <td>${order.quantity}</td>
                    <td style="font-weight:bold; color:#2e7d32;">$${parseFloat(order.total_price).toFixed(2)}</td>
                    <td>${order.shipping_address}</td>
                    <td><button class="delete-btn" data-id="${order.order_id}">Delete</button></td>
                `;

                // Handle Delete Order
                const deleteBtn = tr.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', async () => {
                    if(confirm('Are you sure you want to delete this order?')) {
                        await fetch(`http://localhost:3000/api/admin/orders/${order.order_id}`, { method: 'DELETE' });
                        loadOrders(); // Refresh table
                    }
                });
                ordersBody.appendChild(tr);
            });
        } catch (error) {
            console.error(error);
        }
    }

    // --- INVENTORY & FERTILIZER MANAGEMENT ---
    // Dynamically insert an "Add New Vegetable" button above the inventory table
    const addVegBtn = document.createElement('button');
    addVegBtn.textContent = '+ Add New Vegetable';
    addVegBtn.style.cssText = 'background:#2e7d32; color:white; border:none; padding:10px 15px; margin-bottom:15px; cursor:pointer; border-radius:4px; font-weight:bold;';
    const inventoryTable = document.getElementById('inventoryTableBody').closest('table');
    if (inventoryTable) {
        inventoryTable.parentNode.insertBefore(addVegBtn, inventoryTable);
    }

    async function loadInventory() {
        try {
            const res = await fetch('http://localhost:3000/api/veg');
            const veggies = await res.json();
            inventoryBody.innerHTML = ''; 
            
            veggies.forEach(veg => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${veg.veg_id}</td>
                    <td><img src="${veg.image_url}" class="inventory-img" style="width:50px; border-radius:5px;"></td>
                    <td>${veg.name}</td>
                    <td>$${parseFloat(veg.price).toFixed(2)}</td>
                    <td style="display: flex; gap: 10px;">
                        <button class="edit-btn" style="background:#f57c00; color:white; border:none; padding:6px; cursor:pointer; border-radius:4px;">Edit Veg</button>
                        <button class="fert-btn" style="background:#1565c0; color:white; border:none; padding:6px; cursor:pointer; border-radius:4px;">Edit Fertilizer</button>
                        <button class="delete-veg-btn" style="background:#d32f2f; color:white; border:none; padding:6px; cursor:pointer; border-radius:4px;">Delete</button>
                    </td>
                `;

                tr.querySelector('.edit-btn').addEventListener('click', () => openEditModal(veg));
                tr.querySelector('.fert-btn').addEventListener('click', () => openFertilizerModal(veg.veg_id));
                tr.querySelector('.delete-veg-btn').addEventListener('click', async () => {
                    if(confirm('Are you sure you want to delete this vegetable?')) {
                        try {
                            const res = await fetch(`http://localhost:3000/api/admin/veg/${veg.veg_id}`, { method: 'DELETE' });
                            if (res.ok) {
                                alert('Vegetable deleted successfully!');
                                loadInventory(); // Refresh the inventory table
                            } else {
                                const errData = await res.json().catch(() => ({}));
                                alert(`Failed to delete vegetable: ${errData.error || res.statusText}`);
                            }
                        } catch (error) {
                            console.error(error);
                            alert('An error occurred.');
                        }
                    }
                });

                inventoryBody.appendChild(tr);
            });
        } catch (error) {
            console.error(error);
        }
    }

    // --- ADD VEGETABLE MODAL LOGIC ---
    const addModal = document.createElement('div');
    addModal.id = 'addModal';
    addModal.className = 'hidden';
    addModal.innerHTML = `
        <div style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:white; padding:25px; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.3); z-index:1000; min-width:300px;">
            <h2 style="margin-top:0;">Add New Vegetable</h2>
            <form id="addForm">
                <input type="text" id="addVegName" placeholder="Vegetable Name" required style="display:block; margin-bottom:15px; width:100%; padding:8px; box-sizing:border-box;">
                <input type="number" id="addVegPrice" placeholder="Price" step="0.01" required style="display:block; margin-bottom:15px; width:100%; padding:8px; box-sizing:border-box;">
                <input type="text" id="addVegImage" placeholder="Image URL" required style="display:block; margin-bottom:15px; width:100%; padding:8px; box-sizing:border-box;">
                <input type="text" id="addVegSeason" placeholder="Season (Optional)" style="display:block; margin-bottom:15px; width:100%; padding:8px; box-sizing:border-box;">
                <input type="text" id="addVegCountry" placeholder="Country (Optional)" style="display:block; margin-bottom:15px; width:100%; padding:8px; box-sizing:border-box;">
                <input type="text" id="addVegDuration" placeholder="Duration (Optional)" style="display:block; margin-bottom:15px; width:100%; padding:8px; box-sizing:border-box;">
                <div style="display:flex; justify-content:flex-end; gap:10px;">
                    <button type="button" id="closeAddModal" style="background:#d32f2f; color:white; padding:8px 15px; border:none; border-radius:4px; cursor:pointer;">Cancel</button>
                    <button type="submit" style="background:#2e7d32; color:white; padding:8px 15px; border:none; border-radius:4px; cursor:pointer;">Add</button>
                </div>
            </form>
        </div>
        <div id="addModalOverlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999;"></div>
    `;
    document.body.appendChild(addModal);

    addVegBtn.addEventListener('click', () => addModal.classList.remove('hidden'));
    document.getElementById('closeAddModal').addEventListener('click', () => addModal.classList.add('hidden'));
    document.getElementById('addModalOverlay').addEventListener('click', () => addModal.classList.add('hidden'));

    document.getElementById('addForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newVegData = {
            name: document.getElementById('addVegName').value,
            price: document.getElementById('addVegPrice').value,
            image_url: document.getElementById('addVegImage').value,
            season: document.getElementById('addVegSeason').value,
            country: document.getElementById('addVegCountry').value,
            duration: document.getElementById('addVegDuration').value
        };

        try {
            const res = await fetch('http://localhost:3000/api/admin/veg', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newVegData)
            });

            if (res.ok) {
                alert('New vegetable added successfully!');
                document.getElementById('addForm').reset();
                addModal.classList.add('hidden');
                loadInventory();
            } else {
                const errData = await res.json().catch(() => ({}));
                alert(`Failed to add vegetable: ${errData.error || res.statusText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
        }
    });

    // --- MODAL LOGIC ---
    async function openEditModal(veg) {
        document.getElementById('editVegId').value = veg.veg_id;
        document.getElementById('editVegName').value = veg.name;
        document.getElementById('editVegPrice').value = veg.price;
        document.getElementById('editVegImage').value = veg.image_url;

        // Fetch full details to populate season, country, duration
        try {
            const res = await fetch(`http://localhost:3000/api/veg/${veg.veg_id}`);
            const fullVeg = await res.json();

            // Inject input fields into the modal if they haven't been added yet
            if (!document.getElementById('editVegSeason')) {
                document.getElementById('editVegImage').insertAdjacentHTML('afterend', `
                    <input type="text" id="editVegSeason" placeholder="Season" style="display:block; margin-bottom:15px; width:100%; padding:8px; box-sizing:border-box;">
                    <input type="text" id="editVegCountry" placeholder="Country" style="display:block; margin-bottom:15px; width:100%; padding:8px; box-sizing:border-box;">
                    <input type="text" id="editVegDuration" placeholder="Duration" style="display:block; margin-bottom:15px; width:100%; padding:8px; box-sizing:border-box;">
                `);
            }
            document.getElementById('editVegSeason').value = fullVeg.season || '';
            document.getElementById('editVegCountry').value = fullVeg.country || '';
            document.getElementById('editVegDuration').value = fullVeg.duration || '';
        } catch (err) {
            console.error('Failed to fetch full vegetable details', err);
        }

        editModal.classList.remove('hidden');
    }

    async function openFertilizerModal(vegId) {
        try {
            // Fetch current fertilizer data to populate the form
            const res = await fetch(`http://localhost:3000/api/veg/${vegId}/fertilizer`);
            const fertData = await res.json();
            
            document.getElementById('editFertVegId').value = vegId;
            document.getElementById('editFertName').value = fertData.fertilizer_name;
            document.getElementById('editFertInstructions').value = fertData.instructions;
            fertModal.classList.remove('hidden');
        } catch(error) {
            alert('Could not fetch fertilizer details.');
        }
    }

    // Close Modals
    document.getElementById('closeModal').addEventListener('click', () => editModal.classList.add('hidden'));
    document.getElementById('closeFertModal').addEventListener('click', () => fertModal.classList.add('hidden'));

    // Handle Veg Edit Submit
    document.getElementById('editForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const vegId = document.getElementById('editVegId').value;
        const updatedData = {
            name: document.getElementById('editVegName').value,
            price: document.getElementById('editVegPrice').value,
            image_url: document.getElementById('editVegImage').value,
            season: document.getElementById('editVegSeason') ? document.getElementById('editVegSeason').value : '',
            country: document.getElementById('editVegCountry') ? document.getElementById('editVegCountry').value : '',
            duration: document.getElementById('editVegDuration') ? document.getElementById('editVegDuration').value : ''
        };

        const res = await fetch(`http://localhost:3000/api/admin/veg/${vegId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (res.ok) {
            alert('Vegetable updated successfully!');
            editModal.classList.add('hidden');
            loadInventory();
        }
    });

    // Handle Fertilizer Edit Submit
    document.getElementById('fertForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const vegId = document.getElementById('editFertVegId').value;
        const updatedData = {
            fertilizer_name: document.getElementById('editFertName').value,
            instructions: document.getElementById('editFertInstructions').value
        };

        const res = await fetch(`http://localhost:3000/api/admin/fertilizer/${vegId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (res.ok) {
            alert('Fertilizer details updated!');
            fertModal.classList.add('hidden');
        }
    });

    // Initial Data Load
    loadOrders();
    loadInventory();
});
