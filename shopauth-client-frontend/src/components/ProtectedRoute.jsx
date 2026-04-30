import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Ruta protegida: solo usuarios autenticados pueden entrar
// Si no hay sesión, redirige al login automáticamente
export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // Mientras verificamos si hay sesión, no mostramos nada
    if (loading) return null;

    // Si no hay usuario, redirigimos al login
    if (!user) return <Navigate to="/login" replace />;

    return children;
};

// Ruta solo para admins
// Si el usuario es cliente, lo manda al catálogo
export const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user) return <Navigate to="/login" replace />;

    if (user.role !== 'admin') return <Navigate to="/products" replace />;

    return children;
};

// <Navigate> es un componente de React Router que redirige al usuario a otra ruta. replace significa que no guarda la ruta anterior en el historial, así el usuario no puede volver atrás con el botón del navegador.

