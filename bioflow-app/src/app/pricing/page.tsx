"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setIsAuthenticated(true);
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan_type")
        .eq("id", user.id)
        .single();
      
      if (profile?.plan_type) {
        setCurrentPlan(profile.plan_type);
      }
    }
    setLoading(false);
  }

  // =======================================================
  // FUNÇÃO ATUALIZADA: APENAS REDIRECIONA PARA O CHECKOUT VISUAL
  // =======================================================
  const handleSelectPlan = async (planId: string) => {
    // Se ele já tem esse plano e está logado, vai pro dashboard
    if (planId === currentPlan && isAuthenticated) {
      router.push("/dashboard");
      return;
    }

    setProcessingPlan(planId);

    // Redireciona para a tela de checkout visual (sem travar se não estiver logado)
    const billingType = isAnnual ? "annual" : "monthly";
    setTimeout(() => {
      router.push(`/checkout?plan=${planId}&billing=${billingType}`);
    }, 800); 
  };

  if (loading) {
    return (
      <div className="!min-h-screen !bg-[#F6F7F5] !flex !items-center !justify-center">
        <div className="!animate-spin !rounded-full !h-12 !w-12 !border-t-2 !border-b-2 !border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="!min-h-screen !bg-[#F6F7F5] !flex !flex-col !font-sans !text-black !overflow-x-hidden">
      
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          background-color: #F6F7F5;
          overscroll-behavior: none;
          margin: 0;
          padding: 0;
        }
      `}} />

      {/* NAVEGAÇÃO SUPERIOR */}
      <nav className="!w-full !bg-[#F6F7F5] !sticky !top-0 !z-50 !h-24 !flex !items-center !justify-between !px-6 lg:!px-12 !transition-all border-b border-gray-200/50 backdrop-blur-md">
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
            
            {/* MEGA MENU PRODUTOS */}
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

            <button onClick={() => router.push("/modelos")} className="hover:!text-black !transition-colors !h-full !flex !items-center">Modelos</button>
            <button className="!text-black !border-b-2 !border-black !py-1 !h-max">Planos</button>
          </div>
        </div>
        <div className="!flex !items-center !gap-4">
          {isAuthenticated ? (
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

      {/* CONTEÚDO PRINCIPAL (PREÇOS) */}
      <div className="!w-full !max-w-7xl !mx-auto !px-4 sm:!px-6 lg:!px-8 !py-16 !flex !flex-col !items-center">
        
        <div className="!text-center !mb-16">
          <h1 className="!text-4xl md:!text-5xl !font-black !tracking-tight !mb-4 !text-gray-900">Planos para todos os criadores</h1>
          <p className="!text-lg !text-gray-500 !font-medium">Escolha o BioFlow ideal para você e escale sua presença digital.</p>
          
          {/* Toggle Mensal / Anual */}
          <div className="!mt-10 !flex !items-center !justify-center !gap-4">
            <span className={`!font-bold !text-[15px] !transition-colors ${!isAnnual ? '!text-black' : '!text-gray-400'}`}>Mensal</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="!w-14 !h-8 !bg-black !rounded-full !relative !p-1 !cursor-pointer !transition-colors hover:!bg-gray-800"
            >
              <div className={`!w-6 !h-6 !bg-white !rounded-full !shadow-md !transition-transform !duration-300 ${isAnnual ? '!translate-x-6' : '!translate-x-0'}`}></div>
            </button>
            <span className={`!font-bold !text-[15px] !flex !items-center !gap-2 !transition-colors ${isAnnual ? '!text-black' : '!text-gray-400'}`}>
              Anual <span className="!bg-sky-100 !text-sky-600 !text-[11px] !px-2 !py-0.5 !rounded-full !font-black">-20%</span>
            </span>
          </div>
        </div>

        {/* GRID DE PLANOS */}
        <div className="!w-full !grid !grid-cols-1 md:!grid-cols-2 xl:!grid-cols-4 !gap-6 !items-stretch">
          
          {/* PLANO: GRATUITO */}
          <div className="!bg-[#EAEBE5] !rounded-[32px] !p-8 !flex !flex-col !h-full !border !border-transparent hover:!border-gray-300 !transition-all">
            <h3 className="!text-3xl !font-black !mb-2">Gratuito</h3>
            <p className="!text-sm !font-medium !text-gray-700 !mb-6 !h-10">Comece a usar seu próprio BioFlow pessoal.</p>
            <div className="!mb-6">
              <span className="!text-4xl !font-black">R$ 0</span>
            </div>
            <p className="!text-sm !text-gray-600 !mb-6">Gratuito, para sempre.</p>
            
            <button 
              onClick={() => handleSelectPlan("free")}
              disabled={processingPlan !== null || currentPlan === "free"}
              className="!w-full !py-3.5 !bg-white hover:!bg-gray-50 !text-black !font-bold !rounded-full !border border-gray-300 !transition-colors !mb-8 disabled:!opacity-50"
            >
              {currentPlan === "free" ? "Plano Atual" : processingPlan === "free" ? "Processando..." : "Comece agora"}
            </button>

            <div className="!flex-1">
              <p className="!font-bold !text-sm !mb-4">Principais características:</p>
              <ul className="!flex !flex-col !gap-4 !text-sm !font-medium !text-gray-800">
                <li className="!flex !gap-3 !items-start">
                  <span className="!text-gray-500">🔗</span> Links ilimitados
                </li>
                <li className="!flex !gap-3 !items-start">
                  <span className="!text-sky-500">🎨</span> Temas básicos
                </li>
                <li className="!flex !gap-3 !items-start">
                  <span className="!text-purple-500">📊</span> Análises de cliques (30 dias)
                </li>
                <li className="!flex !gap-3 !items-start">
                  <span className="!text-emerald-500">📱</span> Design responsivo
                </li>
              </ul>
            </div>
          </div>

          {/* PLANO: INICIANTE */}
          <div className="!bg-white !rounded-[32px] !p-8 !flex !flex-col !h-full !shadow-sm !border !border-gray-200 hover:!border-gray-300 !transition-all">
            <h3 className="!text-3xl !font-black !mb-2">Iniciante</h3>
            <p className="!text-sm !font-medium !text-gray-600 !mb-6 !h-10">Para criadores que estão apenas começando.</p>
            <div className="!mb-6 !flex !items-baseline !gap-1">
              <span className="!text-4xl !font-black">R$ {isAnnual ? '15' : '22'}</span>
              <span className="!text-sm !text-gray-500 !font-semibold">/mês</span>
            </div>
            <p className="!text-sm !text-gray-500 !mb-6">
              {isAnnual ? 'Faturado anualmente' : 'Faturado mensalmente'}
            </p>
            
            <button 
              onClick={() => handleSelectPlan("starter")}
              disabled={processingPlan !== null || currentPlan === "starter"}
              className="!w-full !py-3.5 !bg-white hover:!bg-gray-50 !text-black !font-bold !rounded-full !border border-gray-300 !transition-colors !mb-8 disabled:!opacity-50"
            >
              {currentPlan === "starter" ? "Plano Atual" : processingPlan === "starter" ? "Processando..." : "Comece agora"}
            </button>

            <div className="!flex-1">
              <p className="!font-bold !text-sm !mb-4">Tudo do pacote Gratuito, mais:</p>
              <ul className="!flex !flex-col !gap-4 !text-sm !font-medium !text-gray-800">
                <li className="!flex !gap-3 !items-start">
                  <span className="!text-amber-500">✨</span> 
                  <div>
                    <strong>Temas personalizados:</strong><br/>
                    <span className="!text-gray-500 !font-normal">Cores personalizadas e temas novos para seu estilo.</span>
                  </div>
                </li>
                <li className="!flex !gap-3 !items-start">
                  <span className="!text-rose-500">💌</span> Controle de público
                </li>
                <li className="!flex !gap-3 !items-start">
                  <span className="!text-blue-500">🔄</span> Links de redirecionamento
                </li>
              </ul>
            </div>
          </div>

          {/* PLANO: PRÓ (DESTAQUE) */}
          <div className="!bg-white !rounded-[32px] !flex !flex-col !h-full !shadow-xl !border-[3px] !border-[#502274] !relative !overflow-hidden !transform md:!-translate-y-4">
            
            <div className="!bg-[#502274] !text-white !p-8 !pb-6">
              <div className="!flex !justify-between !items-start !mb-2">
                <h3 className="!text-3xl !font-black">Pró</h3>
                <span className="!bg-[#D9FA50] !text-black !text-[11px] !font-bold !px-3 !py-1 !rounded-full !uppercase !tracking-wider">Recomendado</span>
              </div>
              <p className="!text-sm !font-medium !text-white/80 !mb-6 !h-10">Para criadores e negócios buscando crescimento e monetização.</p>
              <div className="!mb-6 !flex !items-baseline !gap-1">
                <span className="!text-4xl !font-black">R$ {isAnnual ? '32' : '42'}</span>
                <span className="!text-sm !text-white/70 !font-semibold">/mês</span>
              </div>
              <p className="!text-sm !text-white/70">
                {isAnnual ? 'Faturado R$ 384 anualmente' : 'Faturado mensalmente'}
              </p>
            </div>

            <div className="!p-8 !flex !flex-col !flex-1">
              <button 
                onClick={() => handleSelectPlan("pro")}
                disabled={processingPlan !== null || currentPlan === "pro"}
                className={`!w-full !py-3.5 !font-bold !rounded-full !transition-colors !mb-8 disabled:!opacity-50 ${currentPlan === "pro" ? "!bg-gray-200 !text-gray-800" : "!bg-[#E9C0E9] hover:!bg-[#d8a8d8] !text-[#502274]"}`}
              >
                {currentPlan === "pro" ? "Plano Atual" : processingPlan === "pro" ? "Processando..." : "Experimente grátis por 7 dias"}
              </button>

              <div className="!flex-1">
                <p className="!font-bold !text-sm !mb-4">Tudo do Iniciante, mais:</p>
                <ul className="!flex !flex-col !gap-4 !text-sm !font-medium !text-gray-800">
                  <li className="!flex !gap-3 !items-start">
                    <span className="!text-purple-600">🎨</span> 
                    <div>
                      <strong>BioFlow 100% Personalizado:</strong><br/>
                      <span className="!text-gray-500 !font-normal">Remova a logomarca e adicione o seu próprio logotipo.</span>
                    </div>
                  </li>
                  <li className="!flex !gap-3 !items-start">
                    <span className="!text-amber-400">⭐</span> 
                    <div>
                      <strong>Selo de Verificado:</strong><br/>
                      <span className="!text-gray-500 !font-normal">Receba o selo oficial ao lado do seu nome.</span>
                    </div>
                  </li>
                  <li className="!flex !gap-3 !items-start">
                    <span className="!text-emerald-500">📈</span> Análises avançadas (1 ano)
                  </li>
                  <li className="!flex !gap-3 !items-start">
                    <span className="!text-orange-500">🔥</span> Destaque de links importantes
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* PLANO: PREMIUM */}
          <div className="!bg-white !rounded-[32px] !flex !flex-col !h-full !border !border-gray-200 hover:!border-gray-300 !transition-all !overflow-hidden">
            
            <div className="!bg-[#EAEBE5] !p-8 !pb-6">
              <h3 className="!text-3xl !font-black !mb-2">Premium</h3>
              <p className="!text-sm !font-medium !text-gray-700 !mb-6 !h-10">Para marcas e equipes que buscam resultados em escala.</p>
              <div className="!mb-6 !flex !items-baseline !gap-1">
                <span className="!text-4xl !font-black">R$ {isAnnual ? '94' : '123'}</span>
                <span className="!text-sm !text-gray-500 !font-semibold">/mês</span>
              </div>
              <p className="!text-sm !text-gray-600">
                {isAnnual ? 'Faturado R$ 1.128 anualmente' : 'Faturado mensalmente'}
              </p>
            </div>

            <div className="!p-8 !flex !flex-col !flex-1">
              <button 
                onClick={() => handleSelectPlan("premium")}
                disabled={processingPlan !== null || currentPlan === "premium"}
                className="!w-full !py-3.5 !bg-white hover:!bg-gray-50 !text-black !font-bold !rounded-full !border border-gray-300 !transition-colors !mb-8 disabled:!opacity-50"
              >
                {currentPlan === "premium" ? "Plano Atual" : processingPlan === "premium" ? "Processando..." : "Comece agora"}
              </button>

              <div className="!flex-1">
                <p className="!font-bold !text-sm !mb-4">Tudo do Pró, mais:</p>
                <ul className="!flex !flex-col !gap-4 !text-sm !font-medium !text-gray-800">
                  <li className="!flex !gap-3 !items-start">
                    <span className="!text-amber-500">🤝</span> Suporte prioritário 24/7
                  </li>
                  <li className="!flex !gap-3 !items-start">
                    <span className="!text-pink-500">🚀</span> Gerenciamento de múltiplas contas
                  </li>
                  <li className="!flex !gap-3 !items-start">
                    <span className="!text-blue-600">👥</span> Acesso para equipe e colaboradores
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* BANNER AGÊNCIA RESTAURADO */}
        <div className="!w-full !mt-16 !bg-white !rounded-[32px] !p-8 md:!p-12 !flex !flex-col md:!flex-row !items-center !justify-between !border !border-gray-200 !shadow-sm">
          <div className="!mb-6 md:!mb-0 md:!mr-8 !text-center md:!text-left">
            <h2 className="!text-3xl !font-black !mb-2">Agência ou Empresa</h2>
            <p className="!text-gray-600 !font-medium">Grandes equipes, grandes objetivos. Entre em contato conosco e criaremos um plano personalizado para você alcançá-los.</p>
          </div>
          <button className="!shrink-0 !bg-[#E9C0E9] hover:!bg-[#d8a8d8] !text-[#502274] !font-bold !px-8 !py-4 !rounded-full !transition-colors">
            Entre em contato
          </button>
        </div>

      </div>
    </div>
  );
}