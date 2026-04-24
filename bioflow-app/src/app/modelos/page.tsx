"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

interface Template {
  id: string;
  name: string;
  description: string;
  bgClass: string;
  textClass: string;
  btnClass: string;
}

export default function ModelosPage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      setIsLoading(false);
      setTimeout(() => setIsVisible(true), 50); 
    };
    checkAuth();
  }, []);

  const handleOpenModal = (tpl: Template) => {
    setSelectedTemplate(tpl);
    setTimeout(() => setShowModal(true), 10);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedTemplate(null), 300);
  };

  const templates: Template[] = [
    {
      id: "light",
      name: "Minimalista Claro",
      description: "O modelo perfeito para quem busca simplicidade e foco total no conteúdo. Com um visual clean e fundos brancos, é ideal para portfólios profissionais, currículos e marcas minimalistas que querem ir direto ao ponto.",
      bgClass: "!bg-gray-50",
      textClass: "!text-gray-900",
      btnClass: "!bg-white !border !border-gray-200 !shadow-sm text-gray-800",
    },
    {
      id: "dark",
      name: "Elegância Escura",
      description: "Um visual moderno, sofisticado e de alto contraste. O modo escuro reduz o cansaço visual e passa uma forte sensação de autoridade, sendo a escolha número um para criadores tech, designers e marcas noturnas.",
      bgClass: "!bg-[#1A1A1A]",
      textClass: "!text-white",
      btnClass: "!bg-white/10 !border !border-white/10 text-white",
    },
    {
      id: "sunset",
      name: "Pôr do Sol",
      description: "Quente, vibrante e cheio de energia. Este modelo traz um gradiente em tons de laranja e rosa que remete a um pôr do sol de verão. Perfeito para influenciadores de lifestyle, moda e viagens.",
      bgClass: "!bg-gradient-to-br !from-orange-400 !to-pink-600",
      textClass: "!text-white",
      btnClass: "!bg-white/10 !border !border-white/10 text-white",
    },
    {
      id: "ocean",
      name: "Brisa do Mar",
      description: "Calmo, corporativo e seguro. Tons de azul transmitem confiança e clareza. Este modelo é altamente recomendado para empresas, startups, consultores e profissionais da saúde.",
      bgClass: "!bg-gradient-to-br !from-sky-400 !to-blue-700",
      textClass: "!text-white",
      btnClass: "!bg-white/10 !border !border-white/10 text-white",
    },
    {
      id: "forest",
      name: "Floresta Viva",
      description: "Conecte-se com a natureza. Este gradiente em tons de esmeralda e verde musgo é a escolha ideal para marcas sustentáveis, nichos de saúde, bem-estar, esportes e alimentação saudável.",
      bgClass: "!bg-gradient-to-br !from-emerald-400 !to-teal-700",
      textClass: "!text-white",
      btnClass: "!bg-white/10 !border !border-white/10 text-white",
    },
    {
      id: "berry",
      name: "Frutas Vermelhas",
      description: "Audacioso, criativo e pop. Uma mistura intensa de rosa e roxo que não passa despercebida. Uma excelente opção para criadores de conteúdo, músicos, artistas e marcas do universo pop.",
      bgClass: "!bg-gradient-to-br !from-rose-400 !to-purple-700",
      textClass: "!text-white",
      btnClass: "!bg-white/10 !border !border-white/10 text-white",
    },
    {
      id: "midnight",
      name: "Meia Noite",
      description: "Profundo e imersivo. Um azul quase preto que passa um ar de mistério e exclusividade. Funciona perfeitamente para marcas de luxo, gamers, streamers e fotógrafos.",
      bgClass: "!bg-[#0B1021]",
      textClass: "!text-white",
      btnClass: "!bg-white/10 !border !border-white/10 text-white",
    },
    {
      id: "monochrome",
      name: "Monocromático",
      description: "Estilo industrial e neutro. Tons de cinza chumbo entregam um visual brutalista e sem distrações. Feito para arquitetos, fotógrafos preto e branco e marcas urbanas.",
      bgClass: "!bg-zinc-500",
      textClass: "!text-white",
      btnClass: "!bg-white/10 !border !border-white/10 text-white",
    },
  ];

  const handleUseTemplate = (templateId: string) => {
    router.push(user ? `/dashboard?theme=${templateId}` : `/login?theme=${templateId}`);
  };

  return (
    <div className="!min-h-screen !bg-[#F6F7F5] !font-sans !text-[#111827] !relative">
      
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          background-color: #F6F7F5;
          overscroll-behavior: none;
          margin: 0;
          padding: 0;
        }
      `}} />

      <nav className="!w-full !bg-[#F6F7F5] !sticky !top-0 !z-40 !h-24 !flex !items-center !justify-between !px-6 lg:!px-12 !transition-all border-b border-gray-200/50 backdrop-blur-md">
        <div className="!flex !items-center !gap-12 !h-full">
          <div 
            onClick={() => router.push("/")}
            className="!flex !items-center !gap-2 !cursor-pointer !font-black !text-2xl !tracking-tight"
          >
            BioFlow
            <svg className="!w-6 !h-6 !text-sky-500 !-mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </div>
          
          <div className="!hidden md:!flex !items-center !gap-8 !text-[15px] !font-bold !text-gray-600 !h-full">
            
            <div className="!relative group !h-full !flex !items-center">
              <button className="hover:!text-black !transition-colors !h-full !flex !items-center !gap-1">
                Produtos
                <svg className="!w-4 !h-4 !transition-transform group-hover:!rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              <div className="!absolute !top-[80px] !-left-12 lg:!-left-24 !w-[850px] !bg-white !rounded-3xl !shadow-[0_20px_60px_rgba(0,0,0,0.1)] !border !border-gray-100 !opacity-0 !invisible group-hover:!opacity-100 group-hover:!visible !transition-all !duration-200 !flex !overflow-hidden !z-50 !cursor-default">
                
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

                <div className="!w-[43%] !p-8 !flex !flex-col !gap-7">
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
                  </div>
                </div>

                <div className="!w-[25%] !bg-[#F9FAFB] !border-l !border-gray-100 !p-6 !flex !flex-col">
                  <h3 className="!text-black !text-[15px] !font-bold !mb-4">Em destaque</h3>
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

            <button className="!text-black !border-b-2 !border-black !py-1 !h-max">Modelos</button>
            <button onClick={() => router.push("/pricing")} className="hover:!text-black !transition-colors !h-full !flex !items-center">Planos</button>
          </div>
        </div>
        <div className="!flex !items-center !gap-4">
          {user ? (
            <button onClick={() => router.push("/dashboard")} className="!text-[15px] !font-bold !bg-black hover:!bg-gray-800 !text-white !px-6 !py-3 !rounded-full !transition-colors">
              Painel
            </button>
          ) : (
            <>
              <button onClick={() => router.push("/login")} className="!text-[15px] !font-bold !bg-gray-200 hover:!bg-gray-300 !text-black !px-6 !py-3 !rounded-full !transition-colors !hidden sm:!block">
                Entrar
              </button>
              <button onClick={() => router.push("/login")} className="!text-[15px] !font-bold !bg-black hover:!bg-gray-800 !text-white !px-6 !py-3 !rounded-full !transition-colors">
                Criar meu BioFlow
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ÁREA DO CONTEÚDO */}
      {isLoading ? (
        <div className="!flex !items-center !justify-center !h-[calc(100vh-96px)]">
          <div className="!animate-spin !rounded-full !h-12 !w-12 !border-t-2 !border-b-2 !border-sky-500"></div>
        </div>
      ) : (
        <div className={`!transition-opacity !duration-700 !ease-out ${isVisible ? '!opacity-100' : '!opacity-0'}`}>
          <main className="!max-w-7xl !mx-auto !px-6 lg:!px-12 !py-16 !text-center">
            <h1 className="!text-5xl sm:!text-6xl !font-black !tracking-tight !mb-6 !text-gray-900">
              Modelos inspiradores
            </h1>
            <p className="!text-lg sm:!text-xl !text-gray-500 !max-w-2xl !mx-auto !font-medium">
              Diferentes estilos visuais para ajudar você a criar um perfil que reflita a sua marca. Escolha um e comece agora mesmo!
            </p>

            <div className="!mt-16 !grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-4 !gap-8 !pb-20">
              {templates.map((tpl) => (
                <div 
                  key={tpl.id} 
                  onClick={() => handleOpenModal(tpl)}
                  className="!flex !flex-col !items-center !group !cursor-pointer"
                >
                  <div className="!w-full !max-w-[280px] !h-[540px] !bg-black !rounded-[40px] !p-2.5 !shadow-xl !relative !overflow-hidden !transition-transform !duration-500 group-hover:!-translate-y-4">
                    <div className="!absolute !inset-0 !bg-black/40 !z-30 !opacity-0 group-hover:!opacity-100 !transition-opacity !duration-300 !flex !items-center !justify-center !backdrop-blur-sm !rounded-[32px]">
                      <span className="!bg-white !text-black !font-bold !px-6 !py-3 !rounded-full !shadow-lg">
                        Ver detalhes
                      </span>
                    </div>

                    <div className={`!w-full !h-full !rounded-[32px] !relative !overflow-hidden !flex !flex-col !items-center !pt-12 !px-4 ${tpl.bgClass}`}>
                      <div className="!w-20 !h-20 !rounded-full !bg-white/20 !backdrop-blur-md !p-1 !mb-4">
                         <img src={`https://ui-avatars.com/api/?name=${tpl.name}&background=random`} alt="avatar" className="!w-full !h-full !rounded-full !object-cover" />
                      </div>
                      <div className={`!w-32 !h-4 !rounded-md !mb-2 !opacity-80 ${tpl.textClass === '!text-white' ? '!bg-white' : '!bg-gray-900'}`}></div>
                      <div className={`!w-48 !h-2 !rounded-md !mb-8 !opacity-50 ${tpl.textClass === '!text-white' ? '!bg-white' : '!bg-gray-900'}`}></div>
                      <div className="!w-full !flex !flex-col !gap-3">
                        <div className={`!w-full !h-12 !rounded-xl !flex !items-center !justify-center !font-bold !text-sm ${tpl.btnClass}`}>Link Exemplo 1</div>
                        <div className={`!w-full !h-12 !rounded-xl !flex !items-center !justify-center !font-bold !text-sm ${tpl.btnClass}`}>Link Exemplo 2</div>
                        <div className={`!w-full !h-12 !rounded-xl !flex !items-center !justify-center !font-bold !text-sm ${tpl.btnClass}`}>Link Exemplo 3</div>
                      </div>
                    </div>
                  </div>
                  <h3 className="!mt-6 !font-bold !text-lg !text-gray-900">{tpl.name}</h3>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}

      {/* MODAL DE DETALHES DO MODELO */}
      {selectedTemplate && (
        <div 
          className={`!fixed !inset-0 !z-[100] !flex !items-center !justify-center !p-4 md:!p-8 !bg-black/60 !backdrop-blur-sm !transition-opacity !duration-300 !ease-out ${showModal ? '!opacity-100' : '!opacity-0'}`}
          onClick={handleCloseModal}
        >
          <div 
            className={`!w-full !max-w-6xl !h-full !max-h-[850px] !bg-[#F6F7F5] !rounded-[32px] md:!rounded-[48px] !relative !flex !flex-col md:!flex-row !overflow-hidden !shadow-2xl !transition-all !duration-300 !transform !ease-out ${showModal ? '!scale-100 !translate-y-0' : '!scale-95 !translate-y-12'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={handleCloseModal}
              className="!absolute !top-6 !right-6 md:!top-8 md:!right-8 !w-10 !h-10 !bg-white !rounded-full !flex !items-center !justify-center !text-gray-900 hover:!bg-gray-200 !shadow-sm !z-50 !transition-colors"
            >
              <svg className="!w-5 !h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div className="!flex-1 !p-8 md:!p-16 !flex !flex-col !justify-center !overflow-y-auto">
              <div className="!flex !items-center !gap-2 !text-[13px] !font-bold !text-gray-400 !mb-6 !uppercase !tracking-widest">
                <span>Modelos</span>
                <span>/</span>
                <span className="!text-gray-900">{selectedTemplate.name}</span>
              </div>
              <h2 className="!text-4xl md:!text-6xl !font-black !text-gray-900 !mb-6 !tracking-tight">
                {selectedTemplate.name}
              </h2>
              <p className="!text-lg md:!text-xl !text-gray-600 !leading-relaxed !mb-10 !max-w-lg">
                {selectedTemplate.description}
              </p>
              <button 
                onClick={() => handleUseTemplate(selectedTemplate.id)}
                className="!bg-sky-500 hover:!bg-sky-600 !text-white !font-bold !text-lg !px-10 !py-4 !rounded-full !w-max !transition-transform hover:!scale-105 !shadow-lg"
              >
                {user ? "Aplicar ao meu BioFlow" : "Criar meu BioFlow"}
              </button>
            </div>

            {/* 👇 LADO DIREITO DO MODAL (O CELULAR) - TAMANHO FIXO PARA NÃO QUEBRAR 👇 */}
            <div className="!hidden md:!flex !flex-1 !bg-white !border-l !border-gray-200 !items-center !justify-center !p-8 !relative">
              <div className="!w-[280px] !h-[580px] !bg-black !rounded-[40px] !p-2 !shadow-2xl !relative !overflow-hidden !shrink-0">
                <div className="!absolute !top-0 !inset-x-0 !h-5 !w-28 !bg-black !mx-auto !rounded-b-xl !z-20"></div>
                <div className={`!w-full !h-full !rounded-[32px] !relative !overflow-hidden !flex !flex-col !items-center !pt-14 !px-4 ${selectedTemplate.bgClass}`}>
                  <div className="!w-20 !h-20 !rounded-full !bg-white/20 !backdrop-blur-md !p-1 !mb-4">
                     <img src={`https://ui-avatars.com/api/?name=${selectedTemplate.name}&background=random`} alt="avatar" className="!w-full !h-full !rounded-full !object-cover" />
                  </div>
                  <h3 className={`!text-lg !font-bold !mb-1 !text-center ${selectedTemplate.textClass}`}>{selectedTemplate.name}</h3>
                  <p className={`!text-xs !font-medium !mb-6 !text-center !opacity-80 !leading-relaxed ${selectedTemplate.textClass}`}>
                    Exemplo de biografia para o modelo {selectedTemplate.name}.
                  </p>
                  <div className="!w-full !flex !flex-col !gap-3">
                    <div className={`!w-full !h-12 !rounded-[14px] !flex !items-center !justify-center !font-bold !text-[13px] ${selectedTemplate.btnClass}`}>Meu Portfólio</div>
                    <div className={`!w-full !h-12 !rounded-[14px] !flex !items-center !justify-center !font-bold !text-[13px] ${selectedTemplate.btnClass}`}>Loja Oficial</div>
                    <div className={`!w-full !h-12 !rounded-[14px] !flex !items-center !justify-center !font-bold !text-[13px] ${selectedTemplate.btnClass}`}>Inscreva-se no Canal</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}