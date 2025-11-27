"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const [user, setUser] = useState<any>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }

      const uid = data.user.id;
      const { data: userData } = await supabase.from("usuarios").select("*").eq("id", uid).single();

      setUser(userData);
      setNombre(userData?.nombre || "");
      setTelefono(userData?.telefono || "");
    };

    loadUser();
  }, [router]);

  const updateUser = async () => {
    await supabase.from("usuarios").update({ nombre, telefono }).eq("id", user.id);
    alert("Datos actualizados");
  };

  const deleteUser = async () => {
    await supabase.from("usuarios").delete().eq("id", user.id);
    await supabase.auth.signOut();
    router.push("/register");
  };

  if (!user) return <p>Cargando...</p>;

  return (
    <div className="p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4">Perfil del usuario</h2>

      <input
        className="border p-2 w-full mb-3"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />

      <button className="bg-blue-600 text-white p-2 rounded mr-2" onClick={updateUser}>
        Guardar cambios
      </button>

      <button className="bg-red-600 text-white p-2 rounded" onClick={deleteUser}>
        Eliminar cuenta
      </button>
    </div>
  );
}
