import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/User.js"; 

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/criptofav";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
            family: 4,
        });
        console.log("✅ MongoDB conectado correctamente");

      
        const adminExists = await User.findOne({ username: "admin" });
        if (!adminExists) {
            console.log("⚡ Creando usuario administrador...");

            const hashedPassword = await bcrypt.hash("admin123", 10); 
            const adminUser = new User({
                username: "admin",
                password: hashedPassword, 
                isAdmin: true,
            });

            await adminUser.save();
            console.log("✅ Usuario administrador creado con éxito: admin / admin123");
        }
    } catch (error) {
        console.error("❌ Error de conexión a MongoDB:", error.message);
        process.exit(1);
    }
};



export default connectDB;

