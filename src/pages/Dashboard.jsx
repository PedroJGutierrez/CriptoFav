import { useEffect, useState } from "react";
import { fetchFavorites } from "../services/api";

const Dashboard = ({ token }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetchFavorites(token).then(setFavorites);
    }, [token]);

    return (
        <div>
            <h2>Mis Criptomonedas Favoritas</h2>
            <ul>
                {favorites.map((crypto) => (
                    <li key={crypto}>{crypto}</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
