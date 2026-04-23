"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

function OnboardingContent() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Limpa o nome de utilizador para não ter espaços ou letras maiúsculas
    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_.-]/g, "");
    
    // CAPTURA O TEMA DA URL (ex: ?theme=sunset)
    const themeParam = searchParams.get("theme");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilizador não autenticado");

      // Cria o perfil do utilizador já guardando o tema que ele escolheu na vitrine!
      const { error: dbError } = await supabase
        .from("profiles")
        .insert([
          { 
            id: user.id, 
            username: cleanUsername,
            theme: themeParam || "light" // Se não tiver tema na URL, salva "light" como padrão
          }
        ]);

      if (dbError) {
        if (dbError.code === '23505') {
          setError("Este nome já está em uso. Escolha outro.");
        } else {
          setError("Erro ao guardar: " + dbError.message);
        }
        setLoading(false);
        return;
      }

      // Sucesso! Envia para o Dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="!min-h-screen !flex !items-center !justify-center !relative !overflow-hidden">
      
      {/* BACKGROUND COM A IMAGEM COLORIDA */}
      <div className="!absolute !inset-0 !z-0">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
          alt="Background" 
          className="!w-full !h-full !object-cover"
        />
        {/* Camada escura e com blur para o cartão branco saltar à vista */}
        <div className="!absolute !inset-0 !bg-black/30 backdrop-blur-sm"></div>
      </div>

      {/* LOGO NO CANTO SUPERIOR */}
      <div className="!absolute !top-8 !left-8 !z-10 !flex !items-center !gap-2 !text-white !font-bold !text-2xl !tracking-tight">
        BioFlow
        <svg className="!w-6 !h-6 !text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      </div>

      {/* CARTÃO CENTRAL */}
      <div className="!relative !z-10 !bg-white !w-full !max-w-[480px] !p-10 sm:!p-12 !rounded-[32px] !shadow-2xl !mx-4">
        <div className="!text-center !mb-8">
          <h1 className="!text-[32px] !font-black !text-black !tracking-tight !mb-2">Garanta o seu link</h1>
          <p className="!text-gray-500 !text-[15px]">Este será o seu endereço oficial na internet.</p>
        </div>

        <form onSubmit={handleSave} className="!flex !flex-col !gap-5">
          <div className="!w-full !h-14 !px-4 !bg-[#F6F7F5] !border !border-transparent focus-within:!bg-white !rounded-2xl focus-within:!border-black focus-within:!ring-1 focus-within:!ring-black !transition-all !flex !items-center !overflow-hidden">
            <span className="!text-gray-400 !font-semibold !mr-1 !text-[16px] !shrink-0">bioflow.com/</span>
            <input
              type="text"
              required
              placeholder="seunome"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""))}
              className="!w-full !h-full !bg-transparent !text-black !font-bold focus:!outline-none !text-[16px]"
            />
          </div>
          
          {error && <p className="!text-red-500 !text-sm !font-bold !text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading || !username}
            className="!w-full !h-14 !bg-black !text-white !font-bold !text-[16px] !rounded-full hover:!bg-gray-800 !transition-colors disabled:!opacity-50 !mt-2"
          >
            {loading ? "A Guardar..." : "Continuar para o Painel"}
          </button>
        </form>
      </div>
    </div>
  );
}

// O Suspense é obrigatório para não quebrar o build na Vercel
export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="!min-h-screen !bg-white !flex !items-center !justify-center"><div className="!animate-spin !rounded-full !h-12 !w-12 !border-t-2 !border-b-2 !border-black"></div></div>}>
      <OnboardingContent />
    </Suspense>
  );
}