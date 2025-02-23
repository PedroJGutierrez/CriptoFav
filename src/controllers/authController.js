import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register1 = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Usuario registrado" });
  } catch (error) {
    res.status(500).json({ error: "Error en el registro" });
  }
};

export const login1 = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error en el inicio de sesión" });
  }
};

export const login = async (req, res) => {
  try {
      const { username, password } = req.body;
      console.log("🔹 Intentando login:", { username });

      // Buscar usuario en la base de datos
      const userData = await User.findOne({ username }).select("+password");

      if (!userData) {
          return res.status(401).json({ error: "Usuario no encontrado" });
      }

      // Convertimos el documento en una instancia de User para recuperar sus métodos
      const user = new User(userData.toObject());

      console.log("Usuario encontrado:", user);
      console.log("Es una instancia de Mongoose?", user instanceof User);
      console.log("Métodos disponibles:", Object.keys(Object.getPrototypeOf(user)));

      // Verificar contraseña
      const isMatch = await user.matchPassword(password);

      if (!username || !password) {
        return res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
    }
      if (!isMatch) {
          return res.status(401).json({ error: "Credenciales incorrectas" });
      }

      // Generar token JWT
      const token = jwt.sign(
          { id: user._id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
      );

      console.log("✅ Usuario autenticado:", user.username);

      res.json({ 
          message: "Login exitoso", 
          token, 
          user: { username: user.username, favorites: user.favorites } 
      });

  } catch (error) {
      console.error("❌ Error en el login:", error);
      res.status(500).json({ error: "Error en el servidor" });
  }
};

export const register = async (req, res) => {
  try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
          username,
          password: hashedPassword,
      });

      await newUser.save();
      res.status(201).json({ message: "Usuario registrado exitosamente" });

  } catch (error) {
      console.error("❌ Error en el registro:", error);

      // Manejo específico de error de usuario duplicado
      if (error.code === 11000) {
          return res.status(400).json({ error: "El nombre de usuario ya está en uso" });
      }

      res.status(500).json({ error: "Error en el servidor" });
  }
};

