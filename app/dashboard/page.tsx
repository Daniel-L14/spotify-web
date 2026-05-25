"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [canciones, setCanciones] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const cargarDatos = async () => {
      // Verificar si hay sesión
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      
      // Traer canciones
      const { data } = await supabase.from('canciones').select('*');
      if (data) setCanciones(data);
    };
    cargarDatos();
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="bg-black/80 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-10 border-b border-gray-900">
        <h1 className="text-2xl font-bold">¡Hola!</h1>
        <button onClick={() => { supabase.auth.signOut(); router.push('/login'); }} className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:scale-105 transition">Cerrar Sesión</button>
      </header>
      
      <main className="p-6 flex-1 bg-gradient-to-b from-[#1e3264] to-black">
        <h2 className="text-3xl font-bold mb-6">Hecho para ti</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {canciones.length === 0 ? <p className="text-gray-400">Aún no hay música en el servidor. Ve al /admin para agregarla.</p> : null}
          {canciones.map((c) => (
            <div key={c.id} className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition duration-300 group cursor-pointer">
              <div className="relative mb-4">
                <img src={c.imagen_url} alt={c.titulo} className="w-full aspect-square object-cover rounded-md shadow-2xl" />
                <button className="absolute bottom-2 right-2 bg-[#1DB954] rounded-full p-3 opacity-0 group-hover:opacity-100 transition shadow-xl translate-y-2 group-hover:translate-y-0">▶️</button>
              </div>
              <h3 className="font-bold text-white truncate">{c.titulo}</h3>
              <p className="text-sm text-gray-400 truncate mt-1">{c.artista}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}