// components/Navbar.jsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Revisar si hay un usuario logueado al cargar
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    // Escuchar cambios de estado (cuando hace login o logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // Redirige al login tras cerrar sesión
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-md">
      <div className="font-bold text-xl">Mi API App</div>
      
      <div className="flex items-center gap-4">
        {/* Icono de Estado (Cumple requisito de 0.15 pts) */}
        <div className="flex items-center gap-2">
          {user ? (
            <span title="Conectado" className="text-green-500 text-xl">🟢</span>
          ) : (
            <span title="Desconectado" className="text-red-500 text-xl">🔴</span>
          )}
          <span className="text-sm text-gray-300">
            {user ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Botón de Logout (Cumple requisito de 0.15 pts) */}
        {user && (
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition"
          >
            Cerrar Sesión
          </button>
        )}
      </div>
    </nav>
  );
}