import { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();

    // Formateamos la fecha de creación de cuenta
    const memberSince = new Date(user?.createdAt).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <h1 className="text-3xl font-bold text-white mb-8">Mi Perfil</h1>

                {/* Card principal */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">

                    {/* Banner superior */}
                    <div className="h-24 bg-linear-to-r from-blue-600 to-purple-600" />

                    {/* Info del usuario */}
                    <div className="px-6 pb-6">

                        {/* Avatar grande */}
                        <div className="flex items-end justify-between -mt-10 mb-6">
                            <div className="w-20 h-20 rounded-2xl bg-gray-900 border-4
                border-gray-800 flex items-center justify-center
                text-3xl font-bold text-white">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>

                            {/* Badge de rol */}
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border
                ${user?.role === 'admin'
                                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                }`}>
                                {user?.role === 'admin' ? '⚙️ Administrador' : '👤 Cliente'}
                            </span>
                        </div>

                        {/* Datos */}
                        <div className="flex flex-col gap-4">
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                                    Nombre
                                </p>
                                <p className="text-white text-lg font-medium">{user?.name}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                                    Email
                                </p>
                                <p className="text-white">{user?.email}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                                    Miembro desde
                                </p>
                                <p className="text-white">{memberSince}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card de información de cuenta */}
                <div className="mt-4 bg-gray-800 rounded-2xl border border-gray-700 p-6">
                    <h2 className="text-white font-semibold mb-4">Estado de la cuenta</h2>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <p className="text-gray-300 text-sm">Cuenta activa</p>
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default Profile;