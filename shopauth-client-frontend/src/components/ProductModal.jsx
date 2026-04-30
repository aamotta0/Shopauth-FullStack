import { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button';
import api from '../api/axios';

const CATEGORIES = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Alimentación', 'Otro'];

// product → si viene, estamos editando. Si no, estamos creando
// onClose → función para cerrar el modal
// onSave  → función que se llama cuando se guarda exitosamente
const ProductModal = ({ product, onClose, onSave }) => {
    const isEditing = !!product; // true si viene un producto, false si es nuevo

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Electrónica',
        stock: '',
        available: true,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    // Si estamos editando, llenamos el formulario con los datos del producto
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                stock: product.stock,
                available: product.available,
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // Para checkboxes usamos checked, para el resto usamos value
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
        if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';
        if (!formData.price) newErrors.price = 'El precio es obligatorio';
        else if (Number(formData.price) < 0) newErrors.price = 'El precio no puede ser negativo';
        if (formData.stock === '') newErrors.stock = 'El stock es obligatorio';
        else if (Number(formData.stock) < 0) newErrors.stock = 'El stock no puede ser negativo';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setServerError('');

        try {
            if (isEditing) {
                // PUT para actualizar
                await api.put(`/products/${product._id}`, formData);
            } else {
                // POST para crear
                await api.post('/products', formData);
            }

            // Avisamos al padre que se guardó para que recargue la lista
            onSave();
        } catch (error) {
            setServerError(error.response?.data?.message || 'Error al guardar el producto');
        } finally {
            setLoading(false);
        }
    };

    return (
        // Fondo oscuro semitransparente que cubre toda la pantalla
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex
      items-center justify-center z-50 p-4">

            {/* Contenedor del modal */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full
        max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">

                {/* Header del modal */}
                <div className="flex items-center justify-between p-6
          border-b border-gray-700">
                    <h2 className="text-white font-bold text-xl">
                        {isEditing ? '✏️ Editar producto' : '➕ Nuevo producto'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors
              text-2xl cursor-pointer leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

                    {serverError && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50
              rounded-lg text-red-400 text-sm">
                            {serverError}
                        </div>
                    )}

                    <Input
                        label="Nombre del producto"
                        type="text"
                        name="name"
                        placeholder="Ej: Laptop Dell XPS"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                    />

                    {/* Textarea para descripción */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-300">
                            Descripción
                        </label>
                        <textarea
                            name="description"
                            placeholder="Describe el producto..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className={`w-full px-4 py-2.5 rounded-lg bg-gray-700 border
                text-white placeholder-gray-400 focus:outline-none focus:ring-2
                resize-none transition-colors
                ${errors.description
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-600 focus:ring-blue-500'
                                }`}
                        />
                        {errors.description && (
                            <p className="text-xs text-red-400">{errors.description}</p>
                        )}
                    </div>

                    {/* Precio y Stock en la misma fila */}
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Precio ($)"
                            type="number"
                            name="price"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            error={errors.price}
                        />
                        <Input
                            label="Stock"
                            type="number"
                            name="stock"
                            placeholder="0"
                            min="0"
                            value={formData.stock}
                            onChange={handleChange}
                            error={errors.stock}
                        />
                    </div>

                    {/* Selector de categoría */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-300">
                            Categoría
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg bg-gray-700 border
                border-gray-600 text-white focus:outline-none focus:ring-2
                focus:ring-blue-500 cursor-pointer"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Checkbox disponible */}
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            name="available"
                            checked={formData.available}
                            onChange={handleChange}
                            className="w-4 h-4 accent-blue-500 cursor-pointer"
                        />
                        <span className="text-gray-300 text-sm group-hover:text-white
              transition-colors">
                            Producto disponible al público
                        </span>
                    </label>

                    {/* Botones */}
                    <div className="flex gap-3 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 rounded-lg font-medium
                bg-transparent border border-gray-600 text-gray-300
                hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <div className="flex-1">
                            <Button type="submit" loading={loading}>
                                {isEditing ? 'Guardar cambios' : 'Crear producto'}
                            </Button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ProductModal;

/*
Modal → componente con fixed inset-0 que cubre toda la pantalla con un fondo oscuro. El contenido flota encima con z-50.
useEffect con dependencia → useEffect(() => {...}, [product]) se ejecuta cada vez que product cambia. Perfecto para llenar el formulario cuando seleccionamos un producto a editar.
isEditing → con !!product convertimos el objeto a booleano. Si hay producto es true, si es null es false. Un solo componente maneja crear y editar
*/