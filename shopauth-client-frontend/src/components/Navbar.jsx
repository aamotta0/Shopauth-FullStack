import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

                {/* Logo */}
                <Link to="/products" className="text-xl font-bold text-white flex items-center gap-2">
                    🛒 ShopAuth
                </Link>

                {/* Links del centro */}
                <div className="flex items-center gap-6">
                    <Link
                        to="/products"
                        className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                    >
                        Productos
                    </Link>

                    {/* Solo visible para admins */}
                    {user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium"
                        >
                            ⚙️ Admin
                        </Link>
                    )}
                </div>

                {/* Sección derecha: usuario y logout */}
                <div className="flex items-center gap-4">

                    {/* Info del usuario */}
                    <Link to="/profile" className="flex items-center gap-2 group">
                        {/* Avatar con inicial del nombre */}
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center
              justify-center text-white text-sm font-bold group-hover:bg-blue-500
              transition-colors">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-white text-sm font-medium leading-none">
                                {user?.name}
                            </p>
                            <p className="text-gray-400 text-xs mt-0.5 capitalize">
                                {user?.role}
                            </p>
                        </div>
                    </Link>

                    {/* Botón logout */}
                    <button
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-red-400 transition-colors
              text-sm cursor-pointer px-2 py-1 rounded hover:bg-gray-700"
                    >
                        Salir
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

// user?.role usa el operador de encadenamiento opcional ?.. Si user es null, no lanza error, simplemente retorna undefined. Es muy útil cuando los datos pueden no existir todavía.