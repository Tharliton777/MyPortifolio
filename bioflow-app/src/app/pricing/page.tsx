"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const handleSelectPlan = async (planId: string) => {
    if (!isAuthenticated) {
      router.push("/register");
      return;
    }

    if (planId === currentPlan) {
      router.push("/dashboard");
      return;
    }

    setProcessingPlan(planId);

    // Simula um delay de gateway de pagamento (Stripe/MercadoPago)
    setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({ plan_type: planId }).eq("id", user.id);
        router.push("/dashboard");
      }
    }, 1500);
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
      
      {/* 👇 BLOQUEIO DO OVERSCROLL (Efeito elástico/borracha) */}
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          background-color: #F6F7F5;
          overscroll-behavior: none;
          margin: 0;
          padding: 0;
        }
      `}} />

      {/* NAVEGAÇÃO SUPERIOR (Atualizada e Sincronizada) */}
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
          <div className="!hidden md:!flex !items-center !gap-8 !text-[15px] !font-bold !text-gray-600">
            <button onClick={() => router.push("/modelos")} className="hover:!text-black !transition-colors">Modelos</button>
            <button className="hover:!text-black !transition-colors">Descobrir</button>
            <button onClick={() => router.push("/pricing")} className="!text-black !border-b-2 !border-black !py-1">Preços</button>
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
        </div>

        {/* GRID DE PLANOS */}
        <div className="!w-full !grid !grid-cols-1 md:!grid-cols-2 xl:!grid-cols-4 !gap-6 !items-stretch">
          
          {/* PLANO: LIVRE */}
          <div className="!bg-[#EAEBE5] !rounded-[32px] !p-8 !flex !flex-col !h-full !border !border-transparent hover:!border-gray-300 !transition-all">
            <h3 className="!text-3xl !font-black !mb-2">Livre</h3>
            <p className="!text-sm !font-medium !text-gray-700 !mb-6 !h-10">Comece a usar seu próprio BioFlow pessoal.</p>
            <div className="!mb-6">
              <span className="!text-4xl !font-black">R$ 0</span>
            </div>
            <p className="!text-sm !text-gray-600 !mb-6">Livre, para sempre.</p>
            
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
              <span className="!text-4xl !font-black">R$ 15</span>
              <span className="!text-sm !text-gray-500 !font-semibold">/mês</span>
            </div>
            <p className="!text-sm !text-gray-500 !mb-6">Cobrança anual ou R$ 22 mensais.</p>
            
            <button 
              onClick={() => handleSelectPlan("starter")}
              disabled={processingPlan !== null || currentPlan === "starter"}
              className="!w-full !py-3.5 !bg-white hover:!bg-gray-50 !text-black !font-bold !rounded-full !border border-gray-300 !transition-colors !mb-8 disabled:!opacity-50"
            >
              {currentPlan === "starter" ? "Plano Atual" : processingPlan === "starter" ? "Processando..." : "Comece agora"}
            </button>

            <div className="!flex-1">
              <p className="!font-bold !text-sm !mb-4">Tudo do pacote Livre, mais:</p>
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
            
            {/* Header Roxo do Pró */}
            <div className="!bg-[#502274] !text-white !p-8 !pb-6">
              <div className="!flex !justify-between !items-start !mb-2">
                <h3 className="!text-3xl !font-black">Pró</h3>
                <span className="!bg-[#D9FA50] !text-black !text-[11px] !font-bold !px-3 !py-1 !rounded-full !uppercase !tracking-wider">Recomendado</span>
              </div>
              <p className="!text-sm !font-medium !text-white/80 !mb-6 !h-10">Para criadores e negócios buscando crescimento e monetização.</p>
              <div className="!mb-6 !flex !items-baseline !gap-1">
                <span className="!text-4xl !font-black">R$ 32</span>
                <span className="!text-sm !text-white/70 !font-semibold">/mês</span>
              </div>
              <p className="!text-sm !text-white/70">Cobrança anual ou R$ 42 mensais.</p>
            </div>

            {/* Conteúdo Branco do Pró */}
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
            
            {/* Header Cinza do Premium */}
            <div className="!bg-[#EAEBE5] !p-8 !pb-6">
              <h3 className="!text-3xl !font-black !mb-2">Premium</h3>
              <p className="!text-sm !font-medium !text-gray-700 !mb-6 !h-10">Para marcas e equipes que buscam resultados em escala.</p>
              <div className="!mb-6 !flex !items-baseline !gap-1">
                <span className="!text-4xl !font-black">R$ 94</span>
                <span className="!text-sm !text-gray-500 !font-semibold">/mês</span>
              </div>
              <p className="!text-sm !text-gray-600">Cobrança anual ou R$ 123 mensais.</p>
            </div>

            {/* Conteúdo Branco do Premium */}
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

        {/* BANNER AGÊNCIA */}
        <div className="!w-full !mt-16 !bg-white !rounded-[32px] !p-8 md:!p-12 !flex !flex-col md:!flex-row !items-center !justify-between !border !border-gray-200 !shadow-sm">
          <div className="!mb-6 md:!mb-0 md:!mr-8 text-center md:text-left">
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