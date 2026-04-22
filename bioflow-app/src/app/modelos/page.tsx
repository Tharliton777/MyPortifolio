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
  
  // ==========================================
  // ESTADOS DA PÁGINA
  // ==========================================
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false); // NOVO: Controla o fade-in do conteúdo
  const [user, setUser] = useState<any>(null);

  // Estados do Modal
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      setIsLoading(false); // Tira o spinner
      // NOVO: Espera um milissegundo e dispara a animação de opacidade
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
    router.push(user ? `/dashboard?theme=${templateId}` : `/register?theme=${templateId}`);
  };

  // Aqui está a MÁGICA: A NavBar agora fica FORA da verificação de "isLoading".
  return (
    <div className="!min-h-screen !bg-[#F6F7F5] !font-sans !text-[#111827] !relative">
      
      {/* NAVEGAÇÃO SUPERIOR (Sempre visível, não pisca) */}
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
          <div className="!hidden md:!flex !items-center !gap-8 !text-[15px] !font-bold !text-gray-600">
            <button className="!text-black !border-b-2 !border-black !py-1">Modelos</button>
            <button className="hover:!text-black !transition-colors">Descobrir</button>
            <button onClick={() => router.push("/pricing")} className="hover:!text-black !transition-colors">Preços</button>
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
              <button onClick={() => router.push("/register")} className="!text-[15px] !font-bold !bg-black hover:!bg-gray-800 !text-white !px-6 !py-3 !rounded-full !transition-colors">
                Criar meu BioFlow
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ÁREA DO CONTEÚDO (Transição Suave) */}
      {isLoading ? (
        // Se estiver carregando, mostra o spinner na área abaixo do menu
        <div className="!flex !items-center !justify-center !h-[calc(100vh-96px)]">
          <div className="!animate-spin !rounded-full !h-12 !w-12 !border-t-2 !border-b-2 !border-sky-500"></div>
        </div>
      ) : (
        // Se já carregou, aplica a classe de fade-in
        <div className={`!transition-opacity !duration-700 !ease-out ${isVisible ? '!opacity-100' : '!opacity-0'}`}>
          <main className="!max-w-7xl !mx-auto !px-6 lg:!px-12 !py-16 !text-center">
            <h1 className="!text-5xl sm:!text-6xl !font-black !tracking-tight !mb-6 !text-gray-900">
              Modelos inspiradores
            </h1>
            <p className="!text-lg sm:!text-xl !text-gray-500 !max-w-2xl !mx-auto !font-medium">
              Diferentes estilos visuais para ajudar você a criar um perfil que reflita a sua marca. Escolha um e comece agora mesmo!
            </p>

            {/* GALERIA DE TEMPLATES */}
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

            <div className="!flex-1 !bg-white !border-l !border-gray-200 !flex !items-center !justify-center !p-8 md:!p-0 !min-h-[500px]">
              <div className="!w-full !max-w-[320px] !h-[640px] !bg-black !rounded-[48px] !p-3 !shadow-2xl !relative !overflow-hidden">
                <div className="!absolute !top-0 !inset-x-0 !h-6 !w-36 !bg-black !mx-auto !rounded-b-2xl !z-20"></div>
                <div className={`!w-full !h-full !rounded-[36px] !relative !overflow-hidden !flex !flex-col !items-center !pt-16 !px-5 ${selectedTemplate.bgClass}`}>
                  <div className="!w-24 !h-24 !rounded-full !bg-white/20 !backdrop-blur-md !p-1 !mb-5">
                     <img src={`https://ui-avatars.com/api/?name=${selectedTemplate.name}&background=random`} alt="avatar" className="!w-full !h-full !rounded-full !object-cover" />
                  </div>
                  <h3 className={`!text-xl !font-bold !mb-2 ${selectedTemplate.textClass}`}>{selectedTemplate.name}</h3>
                  <p className={`!text-sm !font-medium !mb-10 !text-center !opacity-80 ${selectedTemplate.textClass}`}>
                    Exemplo de biografia para o modelo {selectedTemplate.name}.
                  </p>
                  <div className="!w-full !flex !flex-col !gap-4">
                    <div className={`!w-full !h-14 !rounded-[16px] !flex !items-center !justify-center !font-bold !text-[15px] ${selectedTemplate.btnClass}`}>Meu Portfólio</div>
                    <div className={`!w-full !h-14 !rounded-[16px] !flex !items-center !justify-center !font-bold !text-[15px] ${selectedTemplate.btnClass}`}>Loja Oficial</div>
                    <div className={`!w-full !h-14 !rounded-[16px] !flex !items-center !justify-center !font-bold !text-[15px] ${selectedTemplate.btnClass}`}>Inscreva-se no Canal</div>
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