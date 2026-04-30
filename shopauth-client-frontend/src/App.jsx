import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas */}
      <Route path="/products" element={
        <ProtectedRoute><Products /></ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />

      {/* Solo admin */}
      <Route path="/admin" element={
        <AdminRoute><Admin /></AdminRoute>
      } />
    </Routes>
  );
}

export default App;