"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/login?username=${username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "")}`);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="!min-h-screen !bg-[#F6F7F5] !font-sans !text-[#111827] !overflow-hidden !relative">
      
      {/* BLOQUEIO DO OVERSCROLL (Efeito elástico/borracha) */}
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          background-color: #F6F7F5;
          overscroll-behavior: none;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
      `}} />

      {/* NAVEGAÇÃO */}
      <nav className="!w-full !bg-[#F6F7F5] !sticky !top-0 !z-50 !h-24 !flex !items-center !justify-between !px-6 lg:!px-12 !transition-all">
        <div className="!flex !items-center !gap-12 !h-full">
          <div className="!flex !items-center !gap-2 !cursor-pointer !font-black !text-2xl !tracking-tight">
            BioFlow
            <svg className="!w-6 !h-6 !text-sky-500 !-mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </div>
          <div className="!hidden md:!flex !items-center !gap-8 !text-[15px] !font-bold !text-gray-600">
            <button className="hover:!text-black !transition-colors">Modelos</button>
            <button className="hover:!text-black !transition-colors">Descobrir</button>
            <button onClick={() => router.push("/pricing")} className="hover:!text-black !transition-colors">Preços</button>
          </div>
        </div>
        <div className="!flex !items-center !gap-4">
          <button onClick={() => router.push("/login")} className="!text-[15px] !font-bold !bg-gray-200 hover:!bg-gray-300 !text-black !px-6 !py-3 !rounded-full !transition-colors !hidden sm:!block">
            Entrar
          </button>
          <button onClick={() => router.push("/login")} className="!text-[15px] !font-bold !bg-black hover:!bg-gray-800 !text-white !px-6 !py-3 !rounded-full !transition-colors">
            Cadastre-se grátis
          </button>
        </div>
      </nav>

      {/* ÁREA CENTRAL ROLÁVEL */}
      <div className="!w-full !h-[calc(100vh-96px)] !overflow-y-auto !overflow-x-hidden !scroll-smooth">
        {/* HERO SECTION (DOBRA PRINCIPAL) */}
        <section className="!w-full !max-w-7xl !mx-auto !px-6 lg:!px-12 !pt-12 md:!pt-24 !pb-20 !flex !flex-col lg:!flex-row !items-center !justify-between !gap-16">
          
          {/* LADO ESQUERDO: TEXTO E CTA */}
          <div className="!w-full lg:!w-[55%] !flex !flex-col !items-center lg:!items-start !text-center lg:!text-left !z-10">
            <h1 className="!text-5xl sm:!text-6xl lg:!text-[72px] !font-black !leading-[1.1] !tracking-tight !text-[#111827] !mb-6">
              Tudo o que você é, em <span className="!text-sky-500">um só link.</span>
            </h1>
            <p className="!text-lg sm:!text-xl !text-gray-600 !font-medium !mb-10 !max-w-2xl !leading-relaxed">
              Junte-se a milhares de criadores e marcas. Reúna seus links, redes sociais, lojas e vídeos em uma única página personalizada em segundos.
            </p>

            <form onSubmit={handleClaim} className="!w-full !max-w-md !flex !flex-col sm:!flex-row !items-center !gap-3 !bg-white !p-2 !rounded-3xl sm:!rounded-full !shadow-[0_8px_30px_rgb(0,0,0,0.08)] !border !border-gray-100">
              <div className="!flex-1 !flex !items-center !w-full !px-4 !py-2 sm:!py-0">
                <span className="!text-gray-400 !font-bold !text-[15px]">bioflow.com/</span>
                <input
                  type="text"
                  placeholder="seunome"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                  className="!w-full !bg-transparent !outline-none !font-bold !text-[15px] !text-black placeholder:!text-gray-300"
                />
              </div>
              <button type="submit" className="!w-full sm:!w-auto !bg-sky-500 hover:!bg-sky-600 !text-white !font-bold !px-8 !py-4 !rounded-2xl sm:!rounded-full !transition-transform hover:!scale-105 !shadow-md">
                Reivindicar
              </button>
            </form>
            <p className="!mt-6 !text-sm !text-gray-500 !font-medium">
              É grátis e leva menos de 1 minuto.
            </p>
          </div>

          {/* LADO DIREITO: MOCKUP DO CELULAR */}
          <div className="!w-full lg:!w-[45%] !flex !justify-center lg:!justify-end !relative">
            <div className="!absolute !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-[120%] !h-[120%] !bg-sky-500/10 !rounded-full !blur-3xl !-z-10"></div>
            
            <div className="!w-[300px] sm:!w-[340px] !h-[600px] sm:!h-[680px] !bg-black !border-[12px] !border-black !rounded-[48px] !shadow-2xl !relative !overflow-hidden !transform !rotate-2 hover:!rotate-0 !transition-transform !duration-500">
              <div className="!absolute !top-0 !inset-x-0 !h-6 !w-36 !bg-black !mx-auto !rounded-b-2xl !z-20"></div>
              
              <div className="!w-full !h-full !bg-gradient-to-b !from-sky-400 !to-blue-700 !relative !flex !flex-col !items-center !pt-16 !px-6">
                
                <div className="!w-24 !h-24 !bg-white !rounded-full !p-1 !mb-4 !shadow-lg">
                  <img src="https://ui-avatars.com/api/?name=Bio+Flow&background=random" alt="Avatar" className="!w-full !h-full !rounded-full !object-cover" />
                </div>
                
                <h2 className="!text-white !text-xl !font-bold !mb-1">@bioflow.app</h2>
                <p className="!text-white/80 !text-sm !font-medium !mb-8 !text-center">Criando conexões reais na internet. 👇</p>
                
                <div className="!w-full !flex !flex-col !gap-3">
                  <div className="!w-full !bg-white !text-black !py-4 !px-6 !rounded-xl !font-bold !text-sm !text-center !shadow-sm hover:!scale-105 !transition-transform !cursor-pointer">
                    🎥 Meu último vídeo
                  </div>
                  <div className="!w-full !bg-white !text-black !py-4 !px-6 !rounded-xl !font-bold !text-sm !text-center !shadow-sm hover:!scale-105 !transition-transform !cursor-pointer">
                    🛒 Loja Oficial
                  </div>
                  <div className="!w-full !bg-white !text-black !py-4 !px-6 !rounded-xl !font-bold !text-sm !text-center !shadow-sm hover:!scale-105 !transition-transform !cursor-pointer">
                    🎧 Ouça meu Podcast
                  </div>
                </div>

                <div className="!absolute !bottom-6 !text-white/50 !font-bold !text-xs !flex !items-center !gap-1">
                  BioFlow
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* SESSÃO: SOCIAL PROOF / LOGOS */}
        <section className="!w-full !py-12 !border-t !border-gray-200 !bg-white">
          <div className="!max-w-7xl !mx-auto !px-6 !text-center">
            <p className="!text-sm !font-bold !text-gray-400 !uppercase !tracking-wider !mb-8">Conecte seu público nas maiores plataformas</p>
            <div className="!flex !flex-wrap !justify-center !gap-8 sm:!gap-16 !opacity-40 !grayscale">
              <svg className="!w-8 !h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <svg className="!w-8 !h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              <svg className="!w-8 !h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              <svg className="!w-8 !h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 21.002c-1.579 0-3.125-.425-4.484-1.229l-4.994 1.31 1.336-4.869a8.96 8.96 0 0 1-1.23-4.577c0-4.966 4.041-9.006 9.008-9.006 2.407 0 4.67 .938 6.372 2.642 1.702 1.704 2.639 3.966 2.639 6.37 0 4.965-4.043 9.006-9.007 9.006a8.962 8.962 0 0 1-3.64-.783l-.26-.154z"/></svg>
              <svg className="!w-8 !h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}