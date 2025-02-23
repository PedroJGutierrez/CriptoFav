import { useState, useEffect } from "react";
import axios from "axios";

const CryptoFavs = ({ userId }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3000/api/crypto/favorites/${userId}`)
            .then(response => setFavorites(response.data))
            .catch(error => console.error("Error cargando favoritos", error));
    }, [userId]);

    return (
        <div>
            <h2>Criptomonedas Favoritas</h2>
            <ul>
                {favorites.map((crypto, index) => (
                    <li key={index}>{crypto}</li>
                ))}
            </ul>
        </div>
    );
};

export default CryptoFavs;
