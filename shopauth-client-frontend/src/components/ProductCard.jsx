// Componente que muestra la información de un producto
const ProductCard = ({ product }) => {

    // Colores por categoría para hacer las tarjetas más visuales
    const categoryColors = {
        'Electrónica': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        'Ropa': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        'Hogar': 'bg-green-500/10 text-green-400 border-green-500/30',
        'Deportes': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        'Alimentación': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        'Otro': 'bg-gray-500/10 text-gray-400 border-gray-500/30',
    };

    const categoryStyle = categoryColors[product.category] || categoryColors['Otro'];

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5
      hover:border-gray-500 transition-all duration-200 hover:shadow-lg
      hover:shadow-black/20 flex flex-col gap-3">

            {/* Header: categoría y stock */}
            <div className="flex items-center justify-between">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${categoryStyle}`}>
                    {product.category}
                </span>

                {/* Indicador de stock */}
                <span className={`text-xs ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
                </span>
            </div>

            {/* Nombre y descripción */}
            <div className="flex-1">
                <h3 className="text-white font-semibold text-lg leading-tight mb-1">
                    {product.name}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                    {product.description}
                </p>
            </div>

            {/* Footer: precio y creador */}
            <div className="flex items-center justify-between pt-2
        border-t border-gray-700">
                <span className="text-2xl font-bold text-white">
                    ${product.price.toLocaleString('es-CO')}
                </span>

                {/* Quién creó el producto (viene del populate del backend) */}
                {product.createdBy && (
                    <span className="text-xs text-gray-500">
                        por {product.createdBy.name}
                    </span>
                )}
            </div>
        </div>
    );
};

export default ProductCard;