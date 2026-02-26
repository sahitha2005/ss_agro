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
   UPDATE UI TEXT
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
   FETCH VEGETABLES (LANG BASED)
=========================== */
async function fetchVegetables() {
    try {

        const response = await fetch(
            `http://localhost:5000/api/vegetables?lang=${currentLang}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch vegetables");
        }

        vegetables = await response.json();

        renderVegetables(vegetables);

    } catch (error) {
        console.error("Error loading vegetables:", error);
    }
}


/* ===========================
   RENDER VEGETABLES
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
                    <span><strong>${translations[currentLang].country}:</strong> ${veg.country}</span>
                    <span><strong>${translations[currentLang].season}:</strong> ${veg.season}</span>
                    <span><strong>${translations[currentLang].duration}:</strong> ${veg.duration}</span>
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
    fetchVegetables();
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