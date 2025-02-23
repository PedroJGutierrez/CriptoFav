import { useState, useEffect } from "react";

const Home = ({ setToken }) => {
    const [userId, setUserId] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [cryptos, setCryptos] = useState([]);

   
    useEffect(() => {
        const fetchCryptos = async () => {
            try {
                const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd");
                const data = await res.json();
                setCryptos(data);
            } catch (error) {
                console.error("Error al obtener criptomonedas", error);
            }
        };

        fetchCryptos();
        const interval = setInterval(fetchCryptos, 60000); 
        return () => clearInterval(interval);
    }, []);

   
    const fetchFavorites = async () => {
        if (!userId) return;
        try {
            const res = await fetch(`http://localhost:3000/api/users/${userId}/favorites`);
            const data = await res.json();
            setFavorites(data.favorites || []);
        } catch (error) {
            console.error("Error al obtener favoritos", error);
        }
    };

    return (
        <div>
            <h1>Mis Criptomonedas Favoritas</h1>

            {}
            <input
                type="text"
                placeholder="Ingresa tu ID de usuario"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <button onClick={fetchFavorites}>Ver Favoritas</button>

            {}
            <h2>Favoritas</h2>
            <ul>
                {favorites.length > 0 ? (
                    favorites.map((fav) => <li key={fav}>{fav}</li>)
                ) : (
                    <p>No tienes criptomonedas favoritas aún.</p>
                )}
            </ul>

            {/* 🔹 Mostrar precios en tiempo real */}
            <h2>Precios en Tiempo Real</h2>
            <ul>
                {cryptos.length > 0 ? (
                    cryptos.map((crypto) => (
                        <li key={crypto.id}>
                            {crypto.name} - ${crypto.current_price}
                        </li>
                    ))
                ) : (
                    <p>Cargando datos...</p>
                )}
            </ul>
        </div>
    );
};

export default Home;
