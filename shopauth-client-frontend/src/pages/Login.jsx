import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
    // Estado del formulario
    const [formData, setFormData] = useState({ email: '', password: '' });

    // Estado de errores por campo
    const [errors, setErrors] = useState({});

    // Estado de carga mientras espera la respuesta de la API
    const [loading, setLoading] = useState(false);

    // Estado de error general (mensaje del servidor)
    const [serverError, setServerError] = useState('');

    const { login } = useAuth();

    // useNavigate nos permite redirigir al usuario desde código
    const navigate = useNavigate();

    // Actualiza el estado cuando el usuario escribe en un campo
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiamos el error del campo cuando el usuario empieza a escribir
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Validación del lado del cliente antes de enviar a la API
    const validate = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Ingresa un email válido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        }

        setErrors(newErrors);

        // Retorna true si no hay errores
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        // Prevenimos que el formulario recargue la página
        e.preventDefault();

        // Si la validación falla, no enviamos nada
        if (!validate()) return;

        setLoading(true);
        setServerError('');

        try {
            const data = await login(formData.email, formData.password);

            // Redirigimos según el rol del usuario
            if (data.data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/products');
            }
        } catch (error) {
            // Mostramos el mensaje de error que devuelve nuestra API
            setServerError(
                error.response?.data?.message || 'Error al iniciar sesión'
            );
        } finally {
            // Siempre desactivamos el loading al terminar
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">🛒 ShopAuth</h1>
                    <p className="text-gray-400">Inicia sesión en tu cuenta</p>
                </div>

                {/* Card del formulario */}
                <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">

                    {/* Error del servidor */}
                    {serverError && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50
              rounded-lg text-red-400 text-sm">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            placeholder="juan@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                        />

                        <Input
                            label="Contraseña"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                        />

                        <Button type="submit" loading={loading} className="mt-2">
                            Iniciar sesión
                        </Button>
                    </form>

                    {/* Link al registro */}
                    <p className="text-center text-gray-400 text-sm mt-6">
                        ¿No tienes cuenta?{' '}
                        <Link to="/register"
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;