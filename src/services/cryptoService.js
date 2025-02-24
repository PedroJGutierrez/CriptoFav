import axios from "axios";

const API_URL = "https://api.coingecko.com/api/v3/simple/price";

export const getCryptoPrices = async (cryptoIds) => {
    try {
        const { data } = await axios.get(API_URL, {
            params: { ids: cryptoIds.join(","), vs_currencies: "usd" }
        });
        return data;
    } catch (error) {
        console.error("Error obteniendo precios de criptomonedas:", error.message);
        throw new Error("No se pudieron obtener los precios");
    }
};
