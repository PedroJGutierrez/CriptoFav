import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./styles.css";

function App() {
  const [cryptos, setCryptos] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
          params: { vs_currency: "usd" },
        });
        setCryptos(response.data);
      } catch (error) {
        console.error("Error al obtener criptomonedas:", error.message);
        alert("Hubo un problema al cargar las criptomonedas. Inténtalo más tarde.");
      }
    };
  
    fetchCryptos();
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      loadFavorites(storedUser.username);
    }
  }, []);

  useEffect(() => {
    if (user) {
      saveFavorites(user.username, favorites);
    }
  }, [favorites, user]);

  const loadFavorites = (username) => {
    const savedFavorites = JSON.parse(localStorage.getItem(`favorites_${username}`)) || [];
    setFavorites(savedFavorites);
  };

  const saveFavorites = (username, favorites) => {
    localStorage.setItem(`favorites_${username}`, JSON.stringify(favorites));
  };

  const handleFavorite = (crypto) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!favorites.some((fav) => fav.id === crypto.id)) {
      const newFavorites = [...favorites, crypto];
      setFavorites(newFavorites);
    }
    navigate("/favorites");
  };

  const removeFavorite = (cryptoId) => {
    const updatedFavorites = favorites.filter((crypto) => crypto.id !== cryptoId);
    setFavorites(updatedFavorites);
  };
  

  const handleLogout = () => {
    setUser(null);
    setFavorites([]);
    localStorage.removeItem("user");
  };
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            q: "cryptocurrency",
            sortBy: "publishedAt",
            apiKey: process.env.REACT_APP_NEWSAPI_KEY // Reemplaza con tu clave de API
          },
        });
        setNews(response.data.articles.slice(0, 5));
      } catch (error) {
        console.error("Error al obtener noticias:", error.message);
      }
    };
    fetchNews();
  }, []);

  return (
    <>
      <nav className="navbar">
        <Link to="/">Inicio</Link>
        {user && <Link to="/favorites">Favoritos</Link>}
        <Link to="/news">Noticias de Criptomonedas</Link>
        {user ? (
          <button onClick={handleLogout}>Cerrar Sesión</button>
        ) : (
          <>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/register">Registrar</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Home cryptos={cryptos} handleFavorite={handleFavorite} />} />
        <Route path="/favorites" element={user ? <Favorites favorites={favorites} removeFavorite={removeFavorite} /> : <Navigate to="/login" />} />
        <Route path="/news" element={<News news={news} />} />
        <Route path="/login" element={<Login setUser={setUser} loadFavorites={loadFavorites} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
      </Routes>
    </>
  );
}

function News({ news }) {
  return (
    <div className="container">
      <h1>Últimas Noticias de Criptomonedas</h1>
      <div className="news-list">
        {news.map((article, index) => (
          <div key={index} className="news-item">
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">Leer más</a>
          </div>
        ))}
      </div>
    </div>
  );
}
function CryptoHistoryPopup({ cryptoId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get(`https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart`, {
        params: { vs_currency: "usd", days: 3 },
      })
      .then((response) => {
        setHistory(response.data.prices);
      });
  }, [cryptoId]);

  const data = {
    labels: history.map((entry) => new Date(entry[0]).toLocaleDateString()),
    datasets: [
      {
        label: "Precio en USD",
        data: history.map((entry) => entry[1]),
        borderColor: "#00f",
        fill: false,
      },
    ],
  };

  return (
    <div className="popup">
      <Line data={data} />
    </div>
  );
}

function Home({ cryptos, handleFavorite }) {
  const [hoveredCrypto, setHoveredCrypto] = useState(null);

  return (
    <div className="container">
      <h1>Criptomonedas</h1>
      <div className="crypto-grid">
        {cryptos.map((crypto) => (
          <div key={crypto.id} className="crypto-card">
            <div
              className="crypto-name"
              onMouseEnter={() => setHoveredCrypto(crypto.id)}
              onMouseLeave={() => setHoveredCrypto(null)}
            >
              <span>{crypto.name} - ${crypto.current_price}</span>
            </div>
            <button onClick={() => handleFavorite(crypto)}>Agregar a Favoritos</button>
            {hoveredCrypto === crypto.id && <CryptoHistoryPopup cryptoId={crypto.id} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function Favorites({ favorites, removeFavorite }) {
  const sortedFavorites = [...favorites].sort((a, b) => b.current_price - a.current_price);

  return (
    <div className="container">
      <h1>Favoritos</h1>
      {sortedFavorites.length > 0 ? (
        <ul>
          {sortedFavorites.map((crypto) => (
            <li key={crypto.id} className="crypto-card">
              <span>{crypto.name} - ${crypto.current_price}</span>
              <button onClick={() => removeFavorite(crypto.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes criptomonedas en favoritos.</p>
      )}
    </div>
  );
}

function Login({ setUser, loadFavorites }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const storedUser = JSON.parse(localStorage.getItem(`user_${username}`));

    if (storedUser && storedUser.password === password) {
      setUser(storedUser);
      localStorage.setItem("user", JSON.stringify(storedUser));
      loadFavorites(storedUser.username);
      navigate("/");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="container">
      <h1>Iniciar Sesión</h1>
      <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Ingresar</button>
    </div>
  );
}

function Register({ setUser }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (username && email && password) {
      const newUser = { username, email, password };
      localStorage.setItem(`user_${username}`, JSON.stringify(newUser));
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      navigate("/");
    } else {
      alert("Por favor, complete todos los campos");
    }
  };

  return (
    <div className="container">
      <h1>Registro</h1>
      <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Registrarse</button>
    </div>
  );
}

export default App;
