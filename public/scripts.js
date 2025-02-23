async function getFavorites() {
    const userId = document.getElementById("userId").value;
    if (!userId) {
        alert("Por favor, ingresa un ID de usuario.");
        return;
    }

    try {
        const response = await fetch(`/api/crypto/favorites?userId=${userId}`);
        const data = await response.json();

        const cryptoList = document.getElementById("cryptoList");
        cryptoList.innerHTML = ""; // Limpiar la lista anterior

        if (data.message) {
            cryptoList.innerHTML = `<li>${data.message}</li>`;
        } else {
            Object.entries(data).forEach(([crypto, price]) => {
                const li = document.createElement("li");
                li.textContent = `${crypto.toUpperCase()}: $${price.usd}`;
                cryptoList.appendChild(li);
            });
        }
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        alert("Error al obtener los precios.");
    }
}
