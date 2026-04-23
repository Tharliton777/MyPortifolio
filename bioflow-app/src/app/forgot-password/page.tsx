"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // A Vercel ou o Supabase enviará um link que mandará o usuário de volta para esta URL
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setMessage("Verifique o seu e-mail! Enviamos um link de recuperação.");
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao tentar enviar o e-mail.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="!min-h-screen !flex !items-center !justify-center !relative !overflow-hidden">
      
      {/* BACKGROUND (Mesma imagem do Onboarding) */}
      <div className="!absolute !inset-0 !z-0">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
          alt="Background" 
          className="!w-full !h-full !object-cover"
        />
        <div className="!absolute !inset-0 !bg-black/30 backdrop-blur-sm"></div>
      </div>

      {/* CARD CENTRAL */}
      <div className="!relative !z-10 !bg-white !w-full !max-w-[440px] !p-10 !rounded-[32px] !shadow-2xl !mx-4">
        <div className="!text-center !mb-8">
          <h1 className="!text-[28px] !font-black !text-black !tracking-tight !mb-2">Recuperar senha</h1>
          <p className="!text-gray-500 !text-[15px]">
            Digite seu e-mail para receber um link de redefinição.
          </p>
        </div>

        {message ? (
          <div className="!text-center">
            <div className="!bg-green-50 !text-green-700 !p-4 !rounded-2xl !mb-6 !text-sm !font-medium">
              {message}
            </div>
            <Link href="/login" className="!text-black !font-bold hover:!underline">
              Voltar para o login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="!flex !flex-col !gap-4">
            <input
              type="email"
              placeholder="Seu e-mail cadastrado"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="!w-full !h-14 !px-5 !bg-[#F6F7F5] !border !border-transparent focus:!bg-white !rounded-2xl focus:!border-black !transition-all focus:!outline-none !text-black"
            />

            {error && <p className="!text-red-500 !text-sm !text-center !font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="!w-full !h-14 !bg-black !text-white !font-bold !text-[16px] !rounded-full hover:!bg-gray-800 !transition-colors disabled:!opacity-50"
            >
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </button>

            <div className="!text-center !mt-2">
              <Link href="/login" className="!text-gray-500 !text-sm hover:!text-black !font-medium">
                Voltar para o login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}