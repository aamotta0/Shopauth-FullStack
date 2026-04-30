import Navbar from './Navbar';

// Layout recibe children (el contenido de cada página)
// y lo muestra debajo del Navbar
const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            {/* Contenedor principal con padding */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;

// ¿Por qué un Layout? Sin él, tendríamos que poner <Navbar /> manualmente en cada página. Con el Layout lo escribimos una sola vez y todas las páginas lo heredan automáticamente.