import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es obligatorio';
        }

        if (!formData.email) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Ingresa un email válido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mínimo 6 caracteres';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirma tu contraseña';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setServerError('');

        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/products');
        } catch (error) {
            setServerError(
                error.response?.data?.message || 'Error al crear la cuenta'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">🛒 ShopAuth</h1>
                    <p className="text-gray-400">Crea tu cuenta gratis</p>
                </div>

                <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">

                    {serverError && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50
              rounded-lg text-red-400 text-sm">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            label="Nombre completo"
                            type="text"
                            name="name"
                            placeholder="Juan Pérez"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                        />

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
                            placeholder="Mínimo 6 caracteres"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                        />

                        <Input
                            label="Confirmar contraseña"
                            type="password"
                            name="confirmPassword"
                            placeholder="Repite tu contraseña"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                        />

                        <Button type="submit" loading={loading} className="mt-2">
                            Crear cuenta
                        </Button>
                    </form>

                    <p className="text-center text-gray-400 text-sm mt-6">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login"
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;