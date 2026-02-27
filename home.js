let vegetables = [];
let currentLang = "en";

/* ===========================
   LOGOUT
=========================== */
document.getElementById("logoutBtn").addEventListener("click", () => {
    window.location.href = "login.html";
});

/* ===========================
   UI TRANSLATIONS
=========================== */
const translations = {
    en: {
        heroTitle: "Exotic Foreign Vegetables Grown in India",
        heroSubtitle: "Fresh • Organic • Premium Quality",
        footer: "© 2026 AgroShop. All Rights Reserved.",
        logout: "Logout",
        translateBtn: "తెలుగు",
        country: "Country",
        season: "Season",
        duration: "Duration",
        viewDetails: "View Details"
    },
    te: {
        heroTitle: "భారతదేశంలో పెరిగిన విదేశీ కూరగాయలు",
        heroSubtitle: "తాజా • సేంద్రీయ • ప్రీమియం నాణ్యత",
        footer: "© 2026 అగ్రోషాప్. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.",
        logout: "లాగౌట్",
        translateBtn: "English",
        country: "దేశం",
        season: "కాలం",
        duration: "వ్యవధి",
        viewDetails: "వివరాలు చూడండి"
    }
};

/* ===========================
   UPDATE STATIC UI
=========================== */
function updateUI() {

    document.getElementById("heroTitle").innerText =
        translations[currentLang].heroTitle;

    document.getElementById("heroSubtitle").innerText =
        translations[currentLang].heroSubtitle;

    document.getElementById("footerText").innerText =
        translations[currentLang].footer;

    document.getElementById("logoutBtn").innerText =
        translations[currentLang].logout;

    document.getElementById("translateBtn").innerText =
        translations[currentLang].translateBtn;
}

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

        renderVegetables();

    } catch (error) {
        console.error("Error loading vegetables:", error);
    }
}

/* ===========================
   RENDER VEGETABLES
=========================== */
function renderVegetables() {

    const container = document.getElementById("vegContainer");
    container.innerHTML = "";

    vegetables.forEach((veg, index) => {

        const row = document.createElement("div");
        row.classList.add("veg-row");

        if (index % 2 !== 0) {
            row.classList.add("reverse");
        }

        // Language selection
        const name = currentLang === "en" ? veg.name : veg.name_te;
        const description = currentLang === "en" ? veg.description : veg.description_te;
        const country = currentLang === "en" ? veg.country : veg.country_te;
        const season = currentLang === "en" ? veg.season : veg.season_te;
        const duration = currentLang === "en" ? veg.duration : veg.duration_te;

        row.innerHTML = `
            <div class="veg-image">
                <img src="${veg.image_url}" alt="${name}">
            </div>

            <div class="veg-details">
                <h2>${name}</h2>
                <p>${description}</p>

                <div class="veg-info">
                    <span><strong>${translations[currentLang].country}:</strong> ${country}</span>
                    <span><strong>${translations[currentLang].season}:</strong> ${season}</span>
                    <span><strong>${translations[currentLang].duration}:</strong> ${duration}</span>
                </div>

                <p class="price">₹ ${veg.price}</p>

                <button class="view-btn" onclick="viewDetails(${veg.id})">
                    ${translations[currentLang].viewDetails}
                </button>
            </div>
        `;

        container.appendChild(row);
    });
}

/* ===========================
   LANGUAGE TOGGLE
=========================== */
document.getElementById("translateBtn").addEventListener("click", () => {

    currentLang = currentLang === "en" ? "te" : "en";

    updateUI();
    renderVegetables();  // re-render using Telugu fields
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
window.onload = function () {
    updateUI();
    fetchVegetables();
};