import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductModal from '../components/ProductModal';
import Button from '../components/Button';
import api from '../api/axios';

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Control del modal
    const [showModal, setShowModal] = useState(false);

    // Producto seleccionado para editar (null = crear nuevo)
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Control del modal de confirmación de eliminación
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/products');
            setProducts(data.data);
        } catch {
            setError('Error al cargar los productos');
        } finally {
            setLoading(false);
        }
    };

    // Abre el modal para CREAR un producto nuevo
    const handleCreate = () => {
        setSelectedProduct(null); // null = modo creación
        setShowModal(true);
    };

    // Abre el modal para EDITAR un producto existente
    const handleEdit = (product) => {
        setSelectedProduct(product); // pasamos el producto = modo edición
        setShowModal(true);
    };

    // Se llama cuando el modal guarda exitosamente
    const handleSaved = () => {
        setShowModal(false);
        setSelectedProduct(null);
        fetchProducts(); // Recargamos la lista
    };

    // Confirmar eliminación
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleting(true);

        try {
            await api.delete(`/products/${deleteTarget._id}`);
            setDeleteTarget(null);
            fetchProducts();
        } catch (error) {
            setError(error.response?.data?.message || 'Error al eliminar');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Layout>

            {/* Header con botón de crear */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">⚙️ Panel Admin</h1>
                    <p className="text-gray-400">{products.length} productos en total</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium
            px-4 py-2.5 rounded-lg transition-colors cursor-pointer
            flex items-center gap-2"
                >
                    ➕ Nuevo producto
                </button>
            </div>

            {/* Mensaje de error */}
            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50
          rounded-lg text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Tabla de productos */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-gray-400">Cargando productos...</div>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-5xl mb-4">📦</p>
                    <p className="text-gray-400">No hay productos aún</p>
                    <button
                        onClick={handleCreate}
                        className="mt-4 text-blue-400 hover:text-blue-300
              underline cursor-pointer text-sm"
                    >
                        Crear el primero
                    </button>
                </div>
            ) : (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">

                    {/* Header de la tabla */}
                    <div className="grid grid-cols-12 gap-4 px-4 py-3
            border-b border-gray-700 text-xs text-gray-400 uppercase tracking-wider">
                        <div className="col-span-4">Producto</div>
                        <div className="col-span-2">Categoría</div>
                        <div className="col-span-2">Precio</div>
                        <div className="col-span-1">Stock</div>
                        <div className="col-span-1">Estado</div>
                        <div className="col-span-2 text-right">Acciones</div>
                    </div>

                    {/* Filas de productos */}
                    {products.map((product, index) => (
                        <div
                            key={product._id}
                            className={`grid grid-cols-12 gap-4 px-4 py-4 items-center
                hover:bg-gray-750 transition-colors
                ${index !== products.length - 1 ? 'border-b border-gray-700/50' : ''}
              `}
                        >
                            {/* Nombre y descripción */}
                            <div className="col-span-4">
                                <p className="text-white font-medium text-sm leading-tight">
                                    {product.name}
                                </p>
                                <p className="text-gray-500 text-xs mt-0.5 truncate">
                                    {product.description}
                                </p>
                            </div>

                            {/* Categoría */}
                            <div className="col-span-2">
                                <span className="text-gray-300 text-sm">{product.category}</span>
                            </div>

                            {/* Precio */}
                            <div className="col-span-2">
                                <span className="text-white font-medium text-sm">
                                    ${Number(product.price).toLocaleString('es-CO')}
                                </span>
                            </div>

                            {/* Stock */}
                            <div className="col-span-1">
                                <span className={`text-sm font-medium
                  ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {product.stock}
                                </span>
                            </div>

                            {/* Disponible */}
                            <div className="col-span-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full
                  ${product.available
                                        ? 'bg-green-500/10 text-green-400'
                                        : 'bg-gray-500/10 text-gray-400'
                                    }`}>
                                    {product.available ? 'Activo' : 'Oculto'}
                                </span>
                            </div>

                            {/* Botones de acción */}
                            <div className="col-span-2 flex items-center justify-end gap-2">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="text-xs text-blue-400 hover:text-blue-300
                    hover:bg-blue-500/10 px-2.5 py-1.5 rounded-lg
                    transition-colors cursor-pointer"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(product)}
                                    className="text-xs text-red-400 hover:text-red-300
                    hover:bg-red-500/10 px-2.5 py-1.5 rounded-lg
                    transition-colors cursor-pointer"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de crear/editar */}
            {showModal && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedProduct(null);
                    }}
                    onSave={handleSaved}
                />
            )}

            {/* Modal de confirmación de eliminación */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm
          flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-2xl border border-gray-700
            p-6 w-full max-w-sm shadow-2xl">

                        <h3 className="text-white font-bold text-lg mb-2">
                            ¿Eliminar producto?
                        </h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Estás a punto de eliminar{' '}
                            <span className="text-white font-medium">
                                "{deleteTarget.name}"
                            </span>
                            . Esta acción no se puede deshacer.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="flex-1 py-2.5 rounded-lg border border-gray-600
                  text-gray-300 hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <div className="flex-1">
                                <Button
                                    variant="danger"
                                    loading={deleting}
                                    onClick={handleDeleteConfirm}
                                >
                                    Sí, eliminar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </Layout>
    );
};

export default Admin;

/*
Conceptos nuevos:

deleteTarget → en lugar de eliminar directamente al hacer clic, guardamos el producto objetivo y mostramos un modal de confirmación. Es una buena práctica de UX para evitar eliminaciones accidentales.
Tabla con CSS Grid → usamos grid-cols-12 de Tailwind para crear columnas proporcionales, igual que una tabla HTML pero más flexible y estilizable.
*/