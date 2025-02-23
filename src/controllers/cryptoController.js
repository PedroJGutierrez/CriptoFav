//import { getCryptoData } from "../services/cryptoService.js";
import User from "../models/User.js";

export const getFavoritesData = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const data = await getCryptoData(user.favorites);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo información" });
  }
};
