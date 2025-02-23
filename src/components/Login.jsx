import { useState } from "react";
import { login } from "../services/api";

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

export default Login;
