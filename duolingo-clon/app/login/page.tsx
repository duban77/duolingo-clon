"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Evitar entrar si ya está logueado
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setLoading(false);
      } else {
        router.push("/user");
      }
    };
    checkUser();
  }, [router]);

  if (loading) return <p className="text-center mt-10">Verificando sesión...</p>;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("❌ Error: " + error.message);
      return;
    }

    setMessage("✅ Sesión iniciada. Redirigiendo...");
    router.push("/mvp");
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-xl font-bold mb-4 text-center">Iniciar Sesión</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input required type="email" placeholder="Correo" value={email} onChange={(e)=>setEmail(e.target.value)} className="border p-2 rounded"/>
        <input required type="password" placeholder="Contraseña" value={password} onChange={(e)=>setPassword(e.target.value)} className="border p-2 rounded"/>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Entrar
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}

      <p className="mt-4 text-center">
        ¿No tienes cuenta?{" "}
        <button onClick={() => router.push("/register")} className="text-blue-600 underline">
          Regístrate
        </button>
      </p>
    </div>
  );
}
