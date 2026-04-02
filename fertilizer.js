document.addEventListener('DOMContentLoaded', async () => {
    // 1. Get the vegetable ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const vegId = urlParams.get('id');

    if (!vegId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        // 2. Fetch BOTH the vegetable name and the fertilizer details simultaneously
        const [vegRes, fertRes] = await Promise.all([
            fetch(`http://localhost:3000/api/veg/${vegId}`),
            fetch(`http://localhost:3000/api/veg/${vegId}/fertilizer`)
        ]);

        if (!fertRes.ok) {
            throw new Error('Fertilizer details not found for this vegetable.');
        }

        const vegData = await vegRes.json();
        const fertData = await fertRes.json();

        // 3. Populate the UI
        document.getElementById('vegName').textContent = vegData.name;
        document.getElementById('fertName').textContent = fertData.fertilizer_name;
        document.getElementById('fertInstructions').textContent = fertData.instructions;

        // 4. Hide loading text and reveal the uniquely styled card
        document.getElementById('loadingMsg').classList.add('hidden');
        document.getElementById('fertCard').classList.remove('hidden');

    } catch (err) {
        console.error(err);
        document.getElementById('loadingMsg').textContent = "Failed to load fertilizer guide. Please try again.";
        document.getElementById('loadingMsg').style.color = "#d32f2f";
    }
});
