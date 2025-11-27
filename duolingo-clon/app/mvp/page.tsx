"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function MVPPage() {
  const [user, setUser] = useState<any>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [actividades, setActividades] = useState<any[]>([]);
  const router = useRouter();

  // Proteger ruta (solo usuarios logueados)
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        fetchActividades(data.user.id);
      }
    };
    checkSession();
  }, [router]);

  // Cargar actividades del usuario
  const fetchActividades = async (userId: string) => {
    const { data, error } = await supabase
      .from("actividades")
      .select("*")
      .eq("usuario_id", userId)
      .order("creado_en", { ascending: false });

    if (!error && data) setActividades(data);
  };

  // Insertar nueva actividad
  const handleInsert = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

    const { error } = await supabase.from("actividades").insert([
      {
        titulo,
        descripcion,
        usuario_id: user.id,
        curso_id: null, // por ahora vacío
        tipo: "leccion",
        imagen: "/san-agustin.png" // objeto de San Agustín
      },
    ]);

    if (!error) {
      setTitulo("");
      setDescripcion("");
      fetchActividades(user.id);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) {
    return <p className="text-center mt-10">Cargando...</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold text-center mb-4">
        Bienvenido, Duolinguista 🟢
      </h1>

      <button
        onClick={logout}
        className="bg-red-600 text-white px-3 py-1 rounded mb-4"
      >
        Cerrar sesión
      </button>

      <h2 className="text-xl font-semibold mb-3">Agregar nueva actividad</h2>

      <form onSubmit={handleInsert} className="flex flex-col gap-3 mb-6">
        <input
          required
          placeholder="Título de la lección"
          className="border p-2 rounded"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <textarea
          required
          placeholder="Descripción"
          className="border p-2 rounded"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <button className="bg-green-600 text-white p-2 rounded">
          Guardar actividad
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Tus actividades</h2>

      <div className="flex flex-col gap-4">
        {actividades.map((a) => (
          <div key={a.id} className="border p-3 rounded shadow">
            <h3 className="font-bold">{a.titulo}</h3>
            <p>{a.descripcion}</p>
            <img
              src={a.imagen}
              alt="San Agustín"
              className="w-32 mt-2 rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
