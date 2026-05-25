"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Admin() {
  const [titulo, setTitulo] = useState('');
  const [artista, setArtista] = useState('');
  const [imagen, setImagen] = useState('');

  const subirCancion = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('canciones').insert([{ titulo, artista, imagen_url: imagen }]);
    if (error) alert("Error: " + error.message);
    else { alert("¡Canción añadida al catálogo!"); setTitulo(''); setArtista(''); setImagen(''); }
  };

  return (
    <div className="min-h-screen bg-[#121212] p-8 text-white">
      <h1 className="text-3xl font-bold text-[#1DB954] mb-8 border-b border-gray-800 pb-4">Panel Creador</h1>
      <form onSubmit={subirCancion} className="max-w-md space-y-4 bg-black p-6 rounded-xl border border-gray-800">
        <input type="text" placeholder="Nombre de la canción" value={titulo} onChange={(e)=>setTitulo(e.target.value)} required className="w-full p-3 bg-[#242424] rounded text-white" />
        <input type="text" placeholder="Artista" value={artista} onChange={(e)=>setArtista(e.target.value)} required className="w-full p-3 bg-[#242424] rounded text-white" />
        <input type="url" placeholder="URL de la portada (ej. https://imagen.jpg)" value={imagen} onChange={(e)=>setImagen(e.target.value)} required className="w-full p-3 bg-[#242424] rounded text-white" />
        <button type="submit" className="w-full bg-[#1DB954] text-black font-bold py-3 rounded-full mt-4">Agregar al Catálogo</button>
      </form>
    </div>
  );
}