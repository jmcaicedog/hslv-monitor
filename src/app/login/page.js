"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/"); // Redirige a la página principal si ya está autenticado
    }
  }, [status, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="p-8 bg-gray-800 rounded-xl shadow-lg text-center text-white">
        <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          Ingresar con Google
        </button>
      </div>
    </div>
  );
}
