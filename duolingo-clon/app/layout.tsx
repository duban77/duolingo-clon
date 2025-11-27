import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Duolingo Clon",
  description: "App estilo Duolingo con Supabase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-100">
        <nav className="w-full bg-green-600 text-white p-4 flex justify-between items-center shadow">
          <h1 className="text-xl font-bold">🟢 Duolingo Clon</h1>

          <div className="flex gap-4">
            <Link href="/mvp">MVP</Link>
            <Link href="/user">Perfil</Link>
            <Link href="/admin">Admin</Link>
            <Link href="/login">Salir</Link>
          </div>
        </nav>

        <main className="p-6 max-w-3xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
