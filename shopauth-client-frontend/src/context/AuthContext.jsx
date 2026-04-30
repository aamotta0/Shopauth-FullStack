import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

// Creamos el contexto — es como un "contenedor global" de datos
const AuthContext = createContext();

// Provider — el componente que envuelve toda la app y provee los datos
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Al cargar la app, verificamos si hay una sesión activa
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    // Función de registro
    const register = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        setToken(data.token);
        setUser(data.data);
        return data;
    };

    // Función de login
    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        setToken(data.token);
        setUser(data.data);
        return data;
    };

    // Función de logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto fácilmente
// En lugar de useContext(AuthContext) escribimos useAuth()
export const useAuth = () => useContext(AuthContext);

// ¿Qué es un Hook? Es una función especial de React que empieza con use. Los hooks permiten usar características de React como estado (useState) o efectos secundarios (useEffect) dentro de componentes funcionales.

