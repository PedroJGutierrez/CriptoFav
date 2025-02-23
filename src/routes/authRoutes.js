import express from "express";
import { register, login } from "../controllers/authController.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, favorites: [] });
        await user.save();
        res.status(201).json({ message: "Usuario registrado" });
    } catch (error) {
        res.status(500).json({ error: "Error registrando usuario" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, userId: user._id, favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ error: "Error en el login" });
    }
});

router.post("/add-favorite", async (req, res) => {
    try {
        const { userId, cryptoId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        if (!user.favorites.includes(cryptoId)) {
            user.favorites.push(cryptoId);
            await user.save();
        }
        res.json({ favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ error: "Error agregando favorito" });
    }
});

// Quitar cripto favorita
router.post("/remove-favorite", async (req, res) => {
    try {
        const { userId, cryptoId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        user.favorites = user.favorites.filter(fav => fav !== cryptoId);
        await user.save();
        res.json({ favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ error: "Error eliminando favorito" });
    }
});

export default router;
