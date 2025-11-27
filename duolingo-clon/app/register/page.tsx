"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Si el usuario ya está logueado → redirigir
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

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    // Registrar en sistema de autenticación
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setMessage("❌ Error en registro: " + authError.message);
      return;
    }

    const userId = authData.user?.id;
    if (!userId) {
      setMessage("⚠️ No se pudo obtener el ID del usuario.");
      return;
    }

    // Guardar en la tabla usuarios
    const { error: insertError } = await supabase
      .from("usuarios")
      .insert([{ id: userId, nombre, correo: email, telefono }]);

    if (insertError) {
      setMessage("⚠️ Usuario autenticado pero no guardado: " + insertError.message);
      return;
    }

    setMessage("✅ Usuario registrado. Ahora puedes iniciar sesión.");
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-xl font-bold mb-4 text-center">Registro</h1>

      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        <input required placeholder="Nombre" value={nombre} onChange={(e)=>setNombre(e.target.value)} className="border p-2 rounded"/>
        <input required type="email" placeholder="Correo" value={email} onChange={(e)=>setEmail(e.target.value)} className="border p-2 rounded"/>
        <input placeholder="Teléfono" value={telefono} onChange={(e)=>setTelefono(e.target.value)} className="border p-2 rounded"/>
        <input required type="password" placeholder="Contraseña" value={password} onChange={(e)=>setPassword(e.target.value)} className="border p-2 rounded"/>

        <button type="submit" className="bg-green-600 text-white p-2 rounded">
          Registrarse
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}

      <p className="mt-4 text-center">
        ¿Ya tienes cuenta?{" "}
        <button onClick={() => router.push("/login")} className="text-blue-600 underline">
          Inicia sesión
        </button>
      </p>
    </div>
  );
}
