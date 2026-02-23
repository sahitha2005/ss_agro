let vegetablesData = [];
let isTelugu = false;

// 🔓 Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    window.location.href = "login.html";
});

// 🌱 Load vegetables
async function loadVegetables() {
    const response = await fetch("http://localhost:5000/api/vegetables");
    vegetablesData = await response.json();
    renderVegetables(vegetablesData);
}

// 🖥️ Render function
function renderVegetables(data) {

    const container = document.getElementById("vegContainer");
    container.innerHTML = "";

    data.forEach((veg, index) => {

        const row = document.createElement("div");
        row.classList.add("veg-row");

        if (index % 2 !== 0) {
            row.classList.add("reverse");
        }

        row.innerHTML = `
            <div class="veg-image">
                <img src="${veg.image_url}" alt="${veg.name}">
            </div>

            <div class="veg-details">
                <h3>${veg.name}</h3>
                <p>${veg.description}</p>
                <p class="price">Price: ${veg.price}</p>
                <button class="view-btn" onclick="viewDetails(${veg.id})">
                    View Details
                </button>
            </div>
        `;

        container.appendChild(row);
    });
}

// 🌍 Translate button
document.getElementById("translateBtn").addEventListener("click", async () => {

    if (!isTelugu) {

        for (let veg of vegetablesData) {

            const response = await fetch("http://localhost:5000/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: veg.name + ". " + veg.description
                })
            });

            const data = await response.json();

            const translatedParts = data.translatedText.split(".");
            veg.name = translatedParts[0];
            veg.description = translatedParts[1] || "";
        }

        renderVegetables(vegetablesData);

        document.getElementById("translateBtn").innerText = "English";
        isTelugu = true;

    } else {

        loadVegetables(); // reload original English
        document.getElementById("translateBtn").innerText = "తెలుగు";
        isTelugu = false;
    }
});

// 🔍 View details
function viewDetails(id) {
    window.location.href = `details.html?id=${id}`;
}

loadVegetables();