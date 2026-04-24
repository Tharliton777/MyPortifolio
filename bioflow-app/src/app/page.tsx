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
          
          <div className="!hidden md:!flex !items-center !gap-8 !text-[15px] !font-bold !text-gray-600 !h-full">
            
            {/* === INÍCIO DO MENU DE PRODUTOS === */}
            {/* NOTA: 'group' aqui não pode ter ! senão o Tailwind não reconhece */}
            <div className="!relative group !h-full !flex !items-center">
              <button className="hover:!text-black !transition-colors !h-full !flex !items-center !gap-1">
                Produtos
                <svg className="!w-4 !h-4 !transition-transform group-hover:!rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              {/* MEGA MENU DROPDOWN */}
              <div className="!absolute !top-[80px] !-left-12 lg:!-left-24 !w-[850px] !bg-white !rounded-3xl !shadow-[0_20px_60px_rgba(0,0,0,0.1)] !border !border-gray-100 !opacity-0 !invisible group-hover:!opacity-100 group-hover:!visible !transition-all !duration-200 !flex !overflow-hidden !z-50 !cursor-default">
                
                {/* Coluna 1: Categorias Laterais */}
                <div className="!w-[32%] !bg-[#F9FAFB] !p-4 !flex !flex-col !gap-2 !border-r !border-gray-100">
                  <div className="!flex !items-center !justify-between !px-4 !py-3.5 !bg-white !rounded-2xl !shadow-sm !font-bold !text-black !text-[14px] !cursor-pointer">
                    <div className="!flex !items-center !gap-3">
                      <svg className="!w-4 !h-4 !text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                      Link na bio + ferramentas
                    </div>
                    <svg className="!w-4 !h-4 !text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                  
                  <div className="!flex !items-center !justify-between !px-4 !py-3.5 !rounded-2xl !text-gray-600 hover:!bg-gray-100 !font-bold !text-[14px] !cursor-pointer !transition-colors">
                    <div className="!flex !items-center !gap-3">
                      <svg className="!w-4 !h-4 !text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      Gerencie suas redes
                    </div>
                    <svg className="!w-4 !h-4 !text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </div>

                  <div className="!flex !items-center !justify-between !px-4 !py-3.5 !rounded-2xl !text-gray-600 hover:!bg-gray-100 !font-bold !text-[14px] !cursor-pointer !transition-colors">
                    <div className="!flex !items-center !gap-3">
                      <svg className="!w-4 !h-4 !text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                      Envolva seu público
                    </div>
                    <svg className="!w-4 !h-4 !text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </div>

                  <div className="!flex !items-center !justify-between !px-4 !py-3.5 !rounded-2xl !text-gray-600 hover:!bg-gray-100 !font-bold !text-[14px] !cursor-pointer !transition-colors">
                    <div className="!flex !items-center !gap-3">
                      <svg className="!w-4 !h-4 !text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Monetize seguidores
                    </div>
                    <svg className="!w-4 !h-4 !text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </div>

                  <div className="!flex !items-center !justify-between !px-4 !py-3.5 !rounded-2xl !text-gray-600 hover:!bg-gray-100 !font-bold !text-[14px] !cursor-pointer !transition-colors">
                    <div className="!flex !items-center !gap-3">
                      <svg className="!w-4 !h-4 !text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                      Meça seu sucesso
                    </div>
                    <svg className="!w-4 !h-4 !text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                </div>

                {/* Coluna 2: Detalhes das Ferramentas */}
                <div className="!w-[43%] !p-8 !flex !flex-col !gap-7">
                  {/* NOTA: group/item também não pode ter ! */}
                  <div className="group/item !cursor-pointer">
                    <h4 className="!text-black !font-bold !text-[15px] group-hover/item:!text-sky-500 !transition-colors">Link na bio</h4>
                    <p className="!text-gray-500 !text-[13px] !mt-1.5 !leading-relaxed">Personalize seu BioFlow para combinar com a sua marca única.</p>
                  </div>
                  <div className="!w-full !border-t !border-gray-100"></div>

                  <div className="group/item !cursor-pointer">
                    <h4 className="!text-black !font-bold !text-[15px] group-hover/item:!text-sky-500 !transition-colors">Encurtador de links</h4>
                    <p className="!text-gray-500 !text-[13px] !mt-1.5 !leading-relaxed">Crie links curtos rastreáveis e fáceis de compartilhar em qualquer lugar.</p>
                  </div>
                  <div className="!w-full !border-t !border-gray-100"></div>

                  <div className="group/item !cursor-pointer">
                    <h4 className="!text-black !font-bold !text-[15px] group-hover/item:!text-sky-500 !transition-colors">Gerador de código QR</h4>
                    <p className="!text-gray-500 !text-[13px] !mt-1.5 !leading-relaxed">Transforme seus links em códigos QR dinâmicos e escaneáveis para o mundo físico.</p>
                  </div>
                  <div className="!w-full !border-t !border-gray-100"></div>

                  <div>
                    <h4 className="!text-black !font-bold !text-[15px]">Integrações sociais</h4>
                    <p className="!text-gray-500 !text-[13px] !mt-1.5 !leading-relaxed !mb-3">Expanda e envolva seu público unindo todas as suas redes sociais.</p>
                    <div className="!flex !gap-3 !text-gray-400">
                      <div className="!w-8 !h-8 !bg-gray-100 !rounded-full !flex !items-center !justify-center hover:!text-black hover:!bg-gray-200 !transition-colors !cursor-pointer">
                        <svg className="!w-4 !h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      </div>
                      <div className="!w-8 !h-8 !bg-gray-100 !rounded-full !flex !items-center !justify-center hover:!text-black hover:!bg-gray-200 !transition-colors !cursor-pointer">
                        <svg className="!w-4 !h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                      </div>
                      <div className="!w-8 !h-8 !bg-gray-100 !rounded-full !flex !items-center !justify-center hover:!text-black hover:!bg-gray-200 !transition-colors !cursor-pointer">
                        <svg className="!w-4 !h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </div>
                      <div className="!w-8 !h-8 !bg-gray-100 !rounded-full !flex !items-center !justify-center hover:!text-black hover:!bg-gray-200 !transition-colors !cursor-pointer">
                        <svg className="!w-4 !h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna 3: Destaque Lateral */}
                <div className="!w-[25%] !bg-[#F9FAFB] !border-l !border-gray-100 !p-6 !flex !flex-col">
                  <h3 className="!text-black !text-[15px] !font-bold !mb-4">Em destaque</h3>
                  
                  {/* Card Ilustrativo Destaque */}
                  <div className="!w-full !aspect-square !bg-gradient-to-br !from-indigo-600 !to-[#8129D9] !rounded-2xl !mb-4 !p-4 !flex !flex-col !justify-end !relative !overflow-hidden">
                    <div className="!absolute !-right-4 !-top-4 !w-24 !h-24 !bg-white/10 !rounded-full !blur-xl"></div>
                    <div className="!w-10 !h-10 !bg-white !rounded-full !border-2 !border-white !mb-2 !shadow-lg">
                       <img src="https://ui-avatars.com/api/?name=C&background=random" alt="User" className="!w-full !h-full !rounded-full" />
                    </div>
                    <div className="!w-2/3 !h-2 !bg-white/80 !rounded-full !mb-1.5"></div>
                    <div className="!w-1/2 !h-2 !bg-white/50 !rounded-full"></div>
                  </div>

                  <p className="!text-gray-600 !text-[13px] !leading-relaxed">
                    Junte-se a milhares de usuários do BioFlow. Um único link para compartilhar tudo o que você cria, e vender em todas as suas redes.
                  </p>
                </div>

              </div>
            </div>
            {/* === FIM DO MENU DE PRODUTOS === */}

            <button onClick={() => router.push("/modelos")} className="hover:!text-black !transition-colors !h-full !flex !items-center">Modelos</button>
            <button onClick={() => router.push("/pricing")} className="hover:!text-black !transition-colors !h-full !flex !items-center">Planos</button>
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