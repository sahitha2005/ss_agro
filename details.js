console.log("Details Page Loaded");

const params = new URLSearchParams(window.location.search);
const vegId = params.get("id");
const lang = params.get("lang") || "en";

console.log("Language received:", lang);

const translations = {
    en: {
        pageTitle: "Vegetable Details",
        soil: "Soil Type:",
        season: "Season:",
        market: "Market Price:",
        seed: "Seed Price:",
        back: "Back to Home"
    },
    te: {
        pageTitle: "కూరగాయల వివరాలు",
        soil: "మట్టి రకం:",
        season: "పంట కాలం:",
        market: "మార్కెట్ ధర:",
        seed: "విత్తన ధర:",
        back: "హోమ్ కి వెళ్ళండి"
    }
};

function updateUI() {
    document.getElementById("pageTitle").innerText =
        translations[lang].pageTitle;

    document.getElementById("soilLabel").innerText =
        translations[lang].soil;

    document.getElementById("seasonLabel").innerText =
        translations[lang].season;

    document.getElementById("marketLabel").innerText =
        translations[lang].market;

    document.getElementById("seedLabel").innerText =
        translations[lang].seed;

    document.getElementById("backBtn").innerText =
        translations[lang].back;
}

if (vegId) {
    fetch(`http://localhost:5000/api/vegetable-details/${vegId}`)
        .then(res => res.json())
        .then(data => {

            if (!data) return;

            if (lang === "te") {
                document.getElementById("soilType").innerText = data.soil_type_te;
                document.getElementById("season").innerText = data.season_te;
            } else {
                document.getElementById("soilType").innerText = data.soil_type;
                document.getElementById("season").innerText = data.season;
            }

            document.getElementById("marketPrice").innerText = data.market_price;
            document.getElementById("seedPrice").innerText = data.seed_price;
        })
        .catch(err => console.log(err));
}

document.getElementById("backBtn").addEventListener("click", function () {
    window.location.href = "home.html";
});

updateUI();