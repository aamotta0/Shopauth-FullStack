// Componente de input reutilizable
// En lugar de repetir las mismas clases de Tailwind en cada formulario,
// lo definimos una vez aquí y lo usamos en toda la app
const Input = ({ label, error, ...props }) => {
    return (
        <div className="flex flex-col gap-1">
            {/* Etiqueta del campo */}
            {label && (
                <label className="text-sm font-medium text-gray-300">
                    {label}
                </label>
            )}

            {/* Campo de input */}
            <input
                className={`
          w-full px-4 py-2.5 rounded-lg bg-gray-700 border text-white
          placeholder-gray-400 focus:outline-none focus:ring-2
          transition-colors duration-200
          ${error
                        ? 'border-red-500 focus:ring-red-500'   // Borde rojo si hay error
                        : 'border-gray-600 focus:ring-blue-500'  // Borde azul normal
                    }
        `}
                {...props}
            />

            {/* Mensaje de error debajo del input */}
            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}
        </div>
    );
};

export default Input;

// {...props} es el operador spread. Le pasa todos los atributos adicionales al input (como type, placeholder, value, onChange). Así el componente es flexible sin tener que declarar cada prop manualmente.