import { useState, useEffect } from "react";
import { fetchCryptos, toggleFavorite } from "../services/api";

const CryptoList = ({ token }) => {
    const [cryptos, setCryptos] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetchCryptos().then(setCryptos);
    }, []);

    const handleFavorite = async (cryptoId) => {
        if (!token) return alert("Debes iniciar sesión");
        const response = await toggleFavorite(cryptoId, token);
        setFavorites(response.favorites);
    };

    return (
        <div>
            <h2>Lista de Criptomonedas</h2>
            <ul>
                {cryptos.map((crypto) => (
                    <li key={crypto.id}>
                        {crypto.name} - {crypto.symbol}
                        <button onClick={() => handleFavorite(crypto.id)}>
                            {favorites.includes(crypto.id) ? "★" : "☆"}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CryptoList;
