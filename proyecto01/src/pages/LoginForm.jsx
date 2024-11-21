import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useCart } from '../context/CartContext';
import ApiUrls from '../components/ApiUrls.jsx'; // Importamos las URLs desde el archivo de constantes

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useCart();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(ApiUrls.login, { // Usamos ApiUrls.login aquí
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        console.log("Logeamos bien");

        const decodedToken = jwtDecode(token);
        const { email, rol } = decodedToken;
        console.log("El mail del token es " + email);
        console.log("El rol del token es " + rol);

        const usuario = { email, rol };
        setUser(usuario);
        localStorage.setItem("token", token);
        navigate("/admin/index-product");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error en el servidor");
    }
  };

  return (
    <div className="flex items-center justify-center bg-black mt-10"> {/* Agregado mt-10 para margen superior */}
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg max-w-lg w-full space-y-8 mb-10"> {/* Agregado mb-10 para margen inferior */}
        <h2 className="text-3xl font-bold text-yellow-400 text-center">Admin Login</h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Ingresa tu email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Ingresa tu contraseña"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-yellow-400 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-300"
          >
            Iniciar sesión
          </button>
        </form>
        <div className="text-sm text-center">
          <a href="#" className="text-yellow-400 hover:text-yellow-500 transition-all duration-300">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
