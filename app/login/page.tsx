"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Correo o contraseña incorrectos");
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black p-10 rounded-lg shadow-2xl">
        <h1 className="text-5xl font-bold text-center mb-10 text-white tracking-tighter">Spotify</h1>
        <form onSubmit={handleLogin} className="space-y-5">
          <input type="email" placeholder="Correo electrónico" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full p-4 bg-[#121212] border border-gray-600 rounded text-white focus:border-white outline-none" />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full p-4 bg-[#121212] border border-gray-600 rounded text-white focus:border-white outline-none" />
          <button type="submit" className="w-full bg-[#1DB954] text-black font-bold py-4 rounded-full hover:bg-green-400 transition mt-6">Iniciar Sesión</button>
        </form>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-400">¿No tienes cuenta? <Link href="/registro" className="text-white font-bold hover:underline">Regístrate en Spotify</Link></p>
        </div>
      </div>
    </div>
  );
}