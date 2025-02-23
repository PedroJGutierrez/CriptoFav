import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import path from "path";

import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

// 🔹 Rutas de la API
import authRoutes from "./routes/authRoutes.js";
import cryptoRoutes from "./routes/cryptoRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/crypto", cryptoRoutes);

// **📌 Aquí aseguramos que busca en la carpeta correcta**
const clientBuildPath = path.join(__dirname, "../client/build"); // Ajusta la ruta
app.use(express.static(clientBuildPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
