import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Estado para el filtro de búsqueda
    const [search, setSearch] = useState('');

    // Estado para el filtro de categoría
    const [selectedCategory, setSelectedCategory] = useState('Todas');

    const categories = ['Todas', 'Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Alimentación', 'Otro'];

    // useEffect se ejecuta cuando el componente se monta
    // El array vacío [] significa que solo se ejecuta una vez
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/products');
            setProducts(data.data);
        } catch (err) {
            setError('Error al cargar los productos');
        } finally {
            setLoading(false);
        }
    };

    // Filtramos los productos en el frontend según búsqueda y categoría
    // Esto es filtrado local, no hace una nueva petición a la API
    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.description.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
            selectedCategory === 'Todas' || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <Layout>
            {/* Header de la página */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-1">Catálogo</h1>
                <p className="text-gray-400">
                    {products.length} productos disponibles
                </p>
            </div>

            {/* Barra de búsqueda y filtros */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">

                {/* Input de búsqueda */}
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700
              rounded-lg text-white placeholder-gray-400 focus:outline-none
              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Selector de categoría */}
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg
            text-white focus:outline-none focus:ring-2 focus:ring-blue-500
            cursor-pointer"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Estados: cargando, error, vacío o lista */}
            {loading ? (
                // Skeleton loader: muestra tarjetas grises mientras carga
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-800 rounded-xl border border-gray-700
              p-5 h-48 animate-pulse">
                            <div className="h-4 bg-gray-700 rounded w-1/3 mb-4" />
                            <div className="h-6 bg-gray-700 rounded w-2/3 mb-2" />
                            <div className="h-4 bg-gray-700 rounded w-full mb-1" />
                            <div className="h-4 bg-gray-700 rounded w-4/5" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-20">
                    <p className="text-red-400 text-lg">{error}</p>
                    <button
                        onClick={fetchProducts}
                        className="mt-4 text-blue-400 hover:text-blue-300 underline cursor-pointer"
                    >
                        Reintentar
                    </button>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-5xl mb-4">📦</p>
                    <p className="text-gray-400 text-lg">No se encontraron productos</p>
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="mt-2 text-blue-400 hover:text-blue-300 underline cursor-pointer text-sm"
                        >
                            Limpiar búsqueda
                        </button>
                    )}
                </div>
            ) : (
                // Grid de productos
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredProducts.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default Products;

/*
useEffect → se ejecuta después de que el componente se renderiza. El array [] al final le dice que solo se ejecute una vez al montar el componente, perfecto para cargar datos iniciales.
Skeleton loader → en lugar de un spinner genérico, mostramos tarjetas grises con animate-pulse que imitan la forma del contenido real. Es mejor experiencia de usuario.
Filtrado local → filtramos el array en memoria sin llamar a la API cada vez que el usuario escribe. Más rápido y menos peticiones.
*/