'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; 
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [canciones, setCanciones] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [saludo, setSaludo] = useState('Hola');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Saludo dinámico según la hora del día
    const hora = new Date().getHours();
    if (hora < 12) setSaludo('Buenos días');
    else if (hora < 19) setSaludo('Buenas tardes');
    else setSaludo('Buenas noches');

    const fetchData = async () => {
      try {
        // Verificar si la sesión es válida
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { 
          router.push('/login'); 
          return; 
        }
        setUser(session.user);

        // Traer las canciones desde Supabase
        const { data, error } = await supabase
          .from('canciones')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (!error && data) {
          setCanciones(data);
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // 1. ESTADO DE CARGA PREMIUM (Skeletons animados para que parezca una App nativa)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white p-4 font-sans animate-pulse">
        <div className="flex justify-between items-center my-6">
          <div className="h-8 bg-white/10 rounded-md w-36"></div>
          <div className="h-6 bg-white/10 rounded-full w-20"></div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/5 h-14 rounded flex items-center">
              <div className="w-14 h-14 bg-white/10"></div>
              <div className="h-3 bg-white/10 rounded w-16 ml-3"></div>
            </div>
          ))}
        </div>
        <div className="h-6 bg-white/10 rounded-md w-44 mb-4"></div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white/5 p-3 rounded-lg min-w-[150px]">
              <div className="w-full aspect-square bg-white/10 rounded-md mb-3"></div>
              <div className="h-3 bg-white/10 rounded w-20 mb-2"></div>
              <div className="h-2 bg-white/10 rounded w-14"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans pb-28 selection:bg-[#1DB954]/30">
      
      {/* 2. GRADIENTE DE FONDO FLUIDO ESTILO REPRODUCTOR */}
      <div className="bg-gradient-to-b from-[#224430] via-[#121212]/90 to-[#121212] p-4 pt-8 transition-all duration-700">
        
        {/* ENCABEZADO DE LA APP */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{saludo}</h1>
          
          <div className="flex items-center gap-3">
            {/* ICONO DE ESTADO OBLIGATORIO (0.15 pts) - Rediseñado minimalista */}
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1DB954]"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-400">Online</span>
            </div>

            {/* BOTÓN LOGOUT OBLIGATORIO (0.15 pts) - Estilizado como botón de perfil */}
            <button 
              onClick={handleLogout} 
              className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Salir
            </button>
          </div>
        </header>

        {/* 3. RECIENTES (SECCIÓN SUPERIOR DE ACCESO RÁPIDO) */}
        <section className="grid grid-cols-2 gap-2 mb-8">
          {canciones.slice(0, 6).map((track) => (
             <div 
               key={`recent-${track.id}`} 
               className="bg-white/5 hover:bg-white/10 flex items-center rounded-md overflow-hidden transition-all duration-200 cursor-pointer group backdrop-blur-sm active:bg-white/20"
             >
                <img src={track.imagen_url} alt={track.titulo} className="h-14 w-14 object-cover shadow-md" />
                <p className="font-bold text-xs px-3 truncate w-full group-hover:text-[#1DB954] transition-colors">{track.titulo}</p>
             </div>
          ))}
        </section>
      </div>

      {/* 4. CONTENIDO DINÁMICO RECOMENDADO (VISTA DE TARJETAS LATERIALES) */}
      <main className="px-4 space-y-8">
        
        {/* CAROUSEL 1: Hecho para el usuario */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold tracking-tight hover:underline cursor-pointer">
              Hecho para {user?.email ? user.email.split('@')[0] : 'ti'}
            </h2>
            <span className="text-xs text-[#a7a7a7] font-bold hover:underline cursor-pointer">Ver todo</span>
          </div>
          
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            {canciones.length > 0 ? (
              canciones.map((track) => (
                <div 
                  key={`made-${track.id}`} 
                  className="min-w-[155px] max-w-[155px] bg-[#181818] hover:bg-[#282828] p-3 rounded-md transition-all duration-300 cursor-pointer group shadow-lg relative"
                >
                  <div className="relative mb-3 aspect-square w-full rounded-md overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                    <img src={track.imagen_url} alt={track.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    
                    {/* BOTÓN PLAY INTERACTIVO */}
                    <div className="absolute bottom-2 right-2 bg-[#1DB954] text-black rounded-full w-10 h-10 flex items-center justify-center shadow-xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 active:scale-95 hover:bg-[#1ed760]">
                      <svg role="img" height="22" width="22" viewBox="0 0 24 24" fill="currentColor"><path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path></svg>
                    </div>
                  </div>
                  <p className="font-bold text-sm truncate text-white">{track.titulo}</p>
                  <p className="text-[#a7a7a7] text-xs truncate mt-1">{track.artista}</p>
                </div>
              ))
            ) : (
              // Mensaje estilizado si no hay datos
              <div className="w-full bg-[#181818] p-8 rounded-lg text-center border border-white/5">
                <p className="text-gray-400 text-sm">Tu biblioteca está lista pero vacía.</p>
                <button 
                  onClick={() => router.push('/admin')} 
                  className="mt-3 text-xs bg-[#1DB954] text-black font-bold px-4 py-2 rounded-full hover:scale-105 transition-all"
                >
                  Configurar música en /admin
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CAROUSEL 2: Novedades basadas en el reverso */}
        {canciones.length > 0 && (
          <section>
            <h2 className="text-xl font-bold tracking-tight mb-4">Agregados recientemente</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
              {[...canciones].reverse().map((track) => (
                <div key={`recent-list-${track.id}`} className="min-w-[140px] max-w-[140px] bg-transparent cursor-pointer group">
                  <div className="relative mb-2 aspect-square w-full rounded-md overflow-hidden shadow-lg">
                    <img src={track.imagen_url} alt={track.titulo} className="w-full h-full object-cover rounded-md" />
                  </div>
                  <p className="font-bold text-xs truncate">{track.titulo}</p>
                  <p className="text-[#a7a7a7] text-[11px] truncate mt-0.5">{track.artista}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 5. MENÚ DE NAVEGACIÓN INFERIOR TOTALMENTE MÓVIL (Garantiza aspecto de App Instalada) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-black/0 pt-8 pb-4 px-6 z-50 pointer-events-none">
        <div className="bg-[#000]/80 backdrop-blur-lg border border-white/5 rounded-full flex justify-around items-center py-2.5 max-w-md mx-auto pointer-events-auto shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          
          <div className="flex flex-col items-center text-[#1DB954] cursor-pointer">
            <svg role="img" height="21" width="21" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z"></path></svg>
            <span className="text-[9px] mt-1 font-bold tracking-wide">Inicio</span>
          </div>

          <div onClick={() => router.push('/admin')} className="flex flex-col items-center text-[#a7a7a7] hover:text-white transition-colors cursor-pointer">
            <svg role="img" height="21" width="21" viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"></path></svg>
            <span className="text-[9px] mt-1 font-medium">Subir Música</span>
          </div>

          <div onClick={() => router.push('/login')} className="flex flex-col items-center text-[#a7a7a7] hover:text-white transition-colors cursor-pointer">
            <svg role="img" height="21" width="21" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 4a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 14.2a7.2 7.2 0 0 1-6-3.2c.025-2 4-3.1 6-3.1s5.975 1.1 6 3.1a7.2 7.2 0 0 1-6 3.2z"></path></svg>
            <span className="text-[9px] mt-1 font-medium">Mi Cuenta</span>
          </div>

        </div>
      </footer>

    </div>
  );
}