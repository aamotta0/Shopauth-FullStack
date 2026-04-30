// Componente de botón reutilizable con estado de carga
const Button = ({ children, loading, variant = 'primary', ...props }) => {
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        ghost: 'bg-transparent hover:bg-gray-700 text-gray-300 border border-gray-600',
    };

    return (
        <button
            className={`
        w-full py-2.5 px-4 rounded-lg font-medium
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
      `}
            // Deshabilitamos el botón mientras carga para evitar doble envío
            disabled={loading || props.disabled}
            {...props}
        >
            {/* Mostramos spinner o el texto según el estado */}
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Cargando...
                </span>
            ) : children}
        </button>
    );
};

export default Button;