import express from "express";
import { getCryptoPrices } from "../services/cryptoService.js";
import User from "../models/User.js"; // Asegúrate de que exista este modelo
import axios from "axios";

const router = express.Router();
const API_URL = "https://api.coingecko.com/api/v3/coins/markets";


router.get("/", async (req, res) => {
  try {
      const { data } = await axios.get(API_URL, {
          params: { vs_currency: "usd", order: "market_cap_desc", per_page: 30, page: 1, sparkline: false }
      });
      res.json(data);
  } catch (error) {
      res.status(500).json({ error: "Error obteniendo criptomonedas" });
  }
});

// Obtener precios en tiempo real de las criptos favoritas de un usuario
router.get("/favorites", async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    if (!user.favoriteCryptos.length)
      return res.json({ message: "No tienes criptos favoritas" });

    const prices = await getCryptoPrices(user.favoriteCryptos);
    res.json(prices);
  } catch (error) {
    console.error("Error en /favorites:", error.message);
    res.status(500).json({ message: "Error al obtener precios" });
  }
});
// Agregar criptomoneda a favoritos
router.post("/favorite", async (req, res) => {
    try {
      const { userId, crypto } = req.body;
      const user = await User.findById(userId);
  
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  
      if (user.favoriteCryptos.length >= 30)
        return res.status(400).json({ message: "Máximo de 30 criptos alcanzado" });
  
      if (!user.favoriteCryptos.includes(crypto)) {
        user.favoriteCryptos.push(crypto);
        await user.save();
      }
  
      res.json({ message: "Cripto añadida a favoritos", favoriteCryptos: user.favoriteCryptos });
    } catch (error) {
      console.error("Error en /favorite:", error.message);
      res.status(500).json({ message: "Error al guardar la cripto" });
    }
  });
  
  router.delete("/favorites", async (req, res) => {
    const { userId, cryptoSymbol } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        user.favorites = user.favorites.filter(symbol => symbol !== cryptoSymbol);
        await user.save();
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar favorito" });
    }
});
  router.get("/favorites/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener favoritos" });
    }
});
export default router;
