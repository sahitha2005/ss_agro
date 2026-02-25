let vegetables = [];
let originalVegetables = [];
let isTelugu = false;

/* ===========================
   LOGOUT
=========================== */
document.getElementById("logoutBtn").addEventListener("click", () => {
    window.location.href = "login.html";
});


/* ===========================
   FETCH VEGETABLES
=========================== */
async function fetchVegetables() {
    try {
        const response = await fetch("http://localhost:5000/api/vegetables");

        if (!response.ok) {
            throw new Error("Failed to fetch vegetables");
        }

        vegetables = await response.json();

        // Store original copy for toggling back
        originalVegetables = JSON.parse(JSON.stringify(vegetables));

        renderVegetables(vegetables);

    } catch (error) {
        console.error("Error loading vegetables:", error);
    }
}


/* ===========================
   RENDER FUNCTION (ZIGZAG)
=========================== */
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
                <h2>${veg.name}</h2>
                <p>${veg.description}</p>

                <div class="veg-info">
                    <span><strong>Country:</strong> ${veg.country}</span>
                    <span><strong>Season:</strong> ${veg.season}</span>
                    <span><strong>Duration:</strong> ${veg.duration}</span>
                </div>

                <p class="price">₹ ${veg.price}</p>

                <button class="view-btn" onclick="viewDetails(${veg.id})">
                    View Details
                </button>
            </div>
        `;

        container.appendChild(row);
    });
}


/* ===========================
   TRANSLATION (SAFE VERSION)
=========================== */
document.getElementById("translateBtn").addEventListener("click", async () => {

    if (!isTelugu) {

        try {

            // Combine all vegetables into one string
            const combinedText = vegetables.map(v =>
                `${v.name}|||${v.description}|||${v.country}|||${v.season}|||${v.duration}`
            ).join("###");

            const response = await fetch("http://localhost:5000/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: combinedText })
            });

            const data = await response.json();

            if (data.translatedText) {

                const translatedItems = data.translatedText.split("###");

                translatedItems.forEach((item, index) => {

                    const parts = item.split("|||");

                    vegetables[index].name = parts[0] || vegetables[index].name;
                    vegetables[index].description = parts[1] || vegetables[index].description;
                    vegetables[index].country = parts[2] || vegetables[index].country;
                    vegetables[index].season = parts[3] || vegetables[index].season;
                    vegetables[index].duration = parts[4] || vegetables[index].duration;
                });

                renderVegetables(vegetables);

                document.getElementById("translateBtn").innerText = "English";
                isTelugu = true;
            }

        } catch (error) {
            console.error("Translation failed:", error);
        }

    } else {

        vegetables = JSON.parse(JSON.stringify(originalVegetables));
        renderVegetables(vegetables);

        document.getElementById("translateBtn").innerText = "తెలుగు";
        isTelugu = false;
    }
});

/* ===========================
   VIEW DETAILS
=========================== */
function viewDetails(id) {
    window.location.href = `details.html?id=${id}`;
}


/* ===========================
   INITIAL LOAD
=========================== */
fetchVegetables();