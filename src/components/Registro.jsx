import { useState } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";


const Login = ({ setToken }) => {
    const [form, setForm] = useState({ username: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await login(form);
        if (data.token) {
            localStorage.setItem("token", data.token);
            setToken(data.token);
        } else {
            alert("Error en el login");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Usuario" onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <input type="password" placeholder="Contraseña" onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="submit">Iniciar Sesión</button>
        </form>
    );
};

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // Asegúrate de usar esto
  
    const handleRegister = () => {
      // Simular registro exitoso
      console.log("Usuario registrado:", username, email, password);
      navigate("/"); // Redirige al inicio después de registrar
    };
  
    return (
      <div>
        <h2>Registro</h2>
        <input type="text" placeholder="Usuario" onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleRegister}>Registrar</button>
      </div>
    );
  }
  
export default Login;
