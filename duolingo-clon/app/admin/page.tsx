"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [cursoNombre, setCursoNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cursos, setCursos] = useState<any[]>([]);

  const router = useRouter();

  // Verificar sesión
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);
      fetchCursos();
    };

    load();
  }, [router]);

  // Obtener cursos
  const fetchCursos = async () => {
    const { data, error } = await supabase.from("cursos").select("*");

    if (error) {
      console.error("Error al obtener cursos:", error.message);
      return;
    }

    setCursos(data || []);
  };

  // Crear curso
  const createCurso = async (e: FormEvent) => {
    e.preventDefault();

    if (!cursoNombre.trim()) return;

    const { error } = await supabase
      .from("cursos")
      .insert([{ nombre: cursoNombre, descripcion }]);

    if (error) {
      console.error("Error al crear curso:", error.message);
      return;
    }

    setCursoNombre("");
    setDescripcion("");
    fetchCursos();
  };

  // Eliminar curso
  const deleteCurso = async (id: string) => {
    const { error } = await supabase.from("cursos").delete().eq("id", id);

    if (error) {
      console.error("Error al eliminar curso:", error.message);
      return;
    }

    fetchCursos();
  };

  // Render
  return (
    <div className="p-6 bg-white border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Panel Administrativo</h1>

      <form onSubmit={createCurso} className="mb-6 flex flex-col gap-3">
        <input
          className="border p-2 rounded"
          placeholder="Nombre del curso"
          value={cursoNombre}
          onChange={(e) => setCursoNombre(e.target.value)}
        />

        <textarea
          className="border p-2 rounded"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <button className="bg-green-600 text-white p-2 rounded">
          Crear curso
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Cursos creados</h2>

      <div className="flex flex-col gap-4">
        {cursos.length === 0 && (
          <p className="text-gray-600">No hay cursos aún.</p>
        )}

        {cursos.map((c: any) => (
          <div
            key={c.id}
            className="border p-3 rounded shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{c.nombre}</h3>
              <p className="text-gray-700">{c.descripcion}</p>
            </div>

            <button
              className="bg-red-600 text-white p-2 rounded"
              onClick={() => deleteCurso(c.id)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
