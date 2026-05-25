"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert("Error: " + error.message);
    else {
      alert("¡Cuenta creada! Ya puedes iniciar sesión.");
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#121212] p-8 rounded-xl shadow-2xl border border-gray-800">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#1DB954] tracking-tighter">Spotify</h1>
        <h2 className="text-white text-xl font-bold mb-6 text-center">Regístrate gratis</h2>
        <form onSubmit={handleRegistro} className="space-y-4">
          <input type="email" placeholder="Correo electrónico" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full p-4 bg-transparent border border-gray-500 rounded-md text-white focus:border-white outline-none" />
          <input type="password" placeholder="Contraseña (Mínimo 6 caracteres)" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full p-4 bg-transparent border border-gray-500 rounded-md text-white focus:border-white outline-none" />
          <button type="submit" className="w-full bg-[#1DB954] text-black font-bold py-4 rounded-full hover:scale-105 transition">Siguiente</button>
        </form>
        <p className="text-gray-400 text-center mt-6">¿Ya tienes cuenta? <Link href="/login" className="text-white underline hover:text-[#1DB954]">Inicia sesión aquí</Link></p>
      </div>
    </div>
  );
}