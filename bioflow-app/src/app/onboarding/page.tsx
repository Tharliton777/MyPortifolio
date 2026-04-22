"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase"; 

export default function OnboardingPage() {
  const [username, setUsername] = useState("");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [errorMsg, setErrorMsg] = useState(""); 
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (!username.trim()) {
      setErrorMsg("Por favor, digite um nome de usuário válido.");
      setLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setErrorMsg("Acesso negado: Você precisa estar logado. Redirecionando...");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
        return;
      }

      // Cria apenas o essencial no banco de dados para destravar o Dashboard
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            username: username,
          }
        ]);

      if (error) {
        if (error.code === '23505') { 
          setErrorMsg("Ops! Esse link já foi pego por alguém. Escolha outro.");
        } else {
          setErrorMsg("Erro ao salvar perfil: " + error.message);
        }
        setLoading(false);
        return;
      }

      // Sucesso absoluto! Manda direto pra "casa"
      router.push("/dashboard");

    } catch (err) {
      console.error(err);
      setErrorMsg("Ocorreu um erro inesperado de conexão.");
      setLoading(false);
    }
  };

  const flakeColors = ["#FCA5A5", "#FCD34D", "#6EE7B7", "#93C5FD", "#C4B5FD"];

  return (
    <main 
      className="!min-h-screen !bg-white !bg-[radial-gradient(circle_at_center,_#FFFFFF_0%,_#FDFDFD_100%)] !flex !flex-col !items-center !justify-center !font-sans !text-black !relative !p-8 sm:!p-12 !overflow-hidden !z-10"
    >
      
      <style dangerouslySetInnerHTML={{__html: `
        html, body {
          overscroll-behavior: none;
          margin: 0;
          padding: 0;
          background-color: white;
        }
        @keyframes floatAnim {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes rotateAnim {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />

      {/* ANIMAÇÃO DE FUNDO */}
      <div className="!absolute !inset-0 !z-0 !pointer-events-none !opacity-60">
        {mounted && [...Array(25)].map((_, i) => {
          const isSquare = i % 3 === 0;
          const isTriangle = i % 3 === 1;
          const isCircle = i % 3 === 2;
          
          const size = Math.random() * 8 + 6; 
          const color = flakeColors[Math.floor(Math.random() * flakeColors.length)];
          const left = Math.random() * 100; 
          const top = Math.random() * 100; 
          const floatDur = Math.random() * 10 + 15; 
          const rotateDur = Math.random() * 20 + 30; 
          const delay = Math.random() * 5;

          let shapeStyle: React.CSSProperties = {
            position: "absolute",
            left: `${left}%`,
            top: `${top}%`,
            animation: `floatAnim ${floatDur}s ease-in-out infinite, rotateAnim ${rotateDur}s linear infinite`,
            animationDelay: `${delay}s`,
            opacity: 0.6,
          };

          if (isTriangle) {
            shapeStyle = {
              ...shapeStyle,
              width: 0,
              height: 0,
              backgroundColor: "transparent",
              borderLeft: `${size / 1.5}px solid transparent`,
              borderRight: `${size / 1.5}px solid transparent`,
              borderBottom: `${size}px solid ${color}`,
            };
          } else {
            shapeStyle = {
              ...shapeStyle,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              borderRadius: isCircle ? "50%" : "3px",
            };
          }

          return <div key={i} style={shapeStyle} />;
        })}
      </div>

      {/* LOGO SUPERIOR - COM ANIMAÇÃO SUAVE E ROTEAMENTO */}
      <div 
        onClick={() => router.push("/")}
        className="!absolute !top-12 !left-12 !flex !items-center !gap-2 !cursor-pointer !z-20 hover:!-translate-y-1 hover:!opacity-80 active:!scale-95 !transition-all !duration-300"
      >
        <span className="!text-2xl !font-bold !text-black !tracking-tight">BioFlow</span>
        <svg className="!w-6 !h-6 !mt-1 !text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      </div>

      <div className="!w-full !max-w-[480px] !bg-white !p-10 sm:!p-12 !rounded-3xl !shadow-[0_15px_50px_rgba(0,0,0,0.15)] !border !border-gray-100 !flex !flex-col !items-center !z-20 !relative">
        
        <div className="!w-full !text-center !mb-10">
          <h1 className="!text-3xl sm:!text-[32px] !font-black !text-black !mb-4 !tracking-tighter !leading-tight">
            Garanta seu link
          </h1>
          <p className="!text-gray-500 !text-base">
            Este será o seu endereço oficial na internet.
          </p>
        </div>

        <form onSubmit={handleContinue} className="!w-full !flex !flex-col !items-center">
          
          {errorMsg && (
            <div className="!w-full !bg-red-50 !border !border-red-200 !text-red-600 !px-4 !py-3 !rounded-xl !mb-6 !flex !items-start !gap-3 !text-sm !font-medium !animate-pulse">
              <svg className="!w-5 !h-5 !shrink-0 !mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="!w-full !flex !flex-col !gap-6 !mb-8">
            <div className="!flex !items-center !w-full !h-16 !px-4 !bg-[#F6F7F5] !border !border-transparent focus-within:!bg-white focus-within:!border-black focus-within:!ring-1 focus-within:!ring-black !rounded-2xl !transition-all">
              <span className="!text-gray-400 !font-bold !text-[16px] !select-none">
                bioflow.com/
              </span>
              <input
                type="text"
                required
                placeholder="seunome"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""))}
                className="!w-full !h-full !bg-transparent !outline-none !font-bold !text-[16px] !text-black placeholder:!text-gray-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="!w-full !h-14 !bg-black !text-white !font-bold !rounded-full hover:!bg-gray-800 !transition-colors !text-[16px] disabled:!opacity-50 disabled:!cursor-not-allowed"
          >
            {loading ? "Processando..." : "Continuar para o Painel"}
          </button>
        </form>

      </div>
    </main>
  );
}