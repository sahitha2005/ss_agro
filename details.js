window.onload = function () {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const lang = params.get("lang") || "en";

    console.log("Vegetable ID:", id);
    console.log("Language:", lang);

    fetch(`http://localhost:5000/api/details/${id}?lang=${lang}`)
    .then(response => response.json())
    .then(data => {

        console.log("Data received:", data);

        document.getElementById("soilType").innerText = data.soil_type;
        document.getElementById("season").innerText = data.season;
        document.getElementById("marketPrice").innerText = data.market_price;
        document.getElementById("seedPrice").innerText = data.seed_price;

    })
    .catch(error => {
        console.error("Error:", error);
    });

};