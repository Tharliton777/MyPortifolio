"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

// Componente interno para poder usar o useSearchParams (exigência do Next.js)
function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Lê os dados da URL (ex: ?plan=pro&billing=annual)
  const planId = searchParams.get("plan") || "pro";
  const billingType = searchParams.get("billing") || "annual";

  // Mapeamento de Planos e Valores para exibir na tela
  const planDetails: Record<string, { name: string; monthlyPrice: number; annualPrice: number; color: string }> = {
    free: { name: "BioFlow Gratuito", monthlyPrice: 0, annualPrice: 0, color: "text-black" },
    starter: { name: "BioFlow Iniciante", monthlyPrice: 22, annualPrice: 15, color: "text-black" },
    pro: { name: "BioFlow Pró", monthlyPrice: 42, annualPrice: 32, color: "text-[#502274]" },
    premium: { name: "BioFlow Premium", monthlyPrice: 123, annualPrice: 94, color: "text-black" },
  };

  const selectedPlan = planDetails[planId] || planDetails["pro"];
  const isAnnual = billingType === "annual";
  const pricePerMonth = isAnnual ? selectedPlan.annualPrice : selectedPlan.monthlyPrice;
  const totalPrice = isAnnual ? pricePerMonth * 12 : pricePerMonth;

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      setUser(session.user);
    }
    setLoading(false);
  }

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(async () => {
      if (user) {
        // Se estiver logado, atualiza o plano no banco de dados para valer!
        await supabase.from("profiles").update({ plan_type: planId }).eq("id", user.id);
        router.push("/dashboard?payment_success=true");
      } else {
        // Se não estiver logado, simula que deu certo e manda pro login
        alert("Simulação de pagamento bem-sucedida! Por favor, crie uma conta para usar.");
        router.push("/login");
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="!min-h-screen !bg-white !flex !items-center !justify-center">
        <div className="!animate-spin !rounded-full !h-12 !w-12 !border-t-2 !border-b-2 !border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="!min-h-screen !bg-white !font-sans !text-black !flex !flex-col">
      
      {/* 👇 TRAVA DE OVERSCROLL ADICIONADA AQUI 👇 */}
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          background-color: white;
          overscroll-behavior: none;
          margin: 0;
          padding: 0;
        }
      `}} />

      {/* NAVEGAÇÃO SIMPLIFICADA (Para focar no checkout) */}
      <nav className="!w-full !bg-white !h-20 !flex !items-center !px-6 lg:!px-12 !border-b !border-gray-200">
        <Link href="/" className="!flex !items-center !gap-2 !cursor-pointer !font-black !text-2xl !tracking-tight">
          BioFlow
          <svg className="!w-6 !h-6 !text-sky-500 !-mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </Link>
      </nav>

      {/* ÁREA DIVIDIDA DO CHECKOUT */}
      <main className="!flex-grow !flex !flex-col lg:!flex-row !w-full !max-w-7xl !mx-auto">
        
        {/* LADO ESQUERDO: FORMULÁRIO (VISUAL) */}
        <div className="!w-full lg:!w-3/5 !p-8 lg:!p-16 !border-r !border-gray-200">
          <button onClick={() => router.back()} className="!flex !items-center !gap-2 !text-gray-500 hover:!text-black !transition-colors !mb-10 !font-medium !text-sm">
            <svg className="!w-4 !h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Voltar
          </button>

          <h2 className="!text-3xl !font-black !tracking-tight !mb-8">Detalhes do pagamento</h2>

          <form onSubmit={handleSimulatePayment} className="!flex !flex-col !gap-6">
            
            {/* Opções de Pagamento (Visual) */}
            <div className="!flex !gap-4 !mb-2">
              <div className="!flex-1 !border-2 !border-black !bg-gray-50 !rounded-xl !p-4 !flex !items-center !gap-3 !cursor-pointer">
                <div className="!w-5 !h-5 !rounded-full !border-4 !border-black"></div>
                <span className="!font-bold !text-sm">Cartão de Crédito</span>
              </div>
              <div className="!flex-1 !border !border-gray-200 !rounded-xl !p-4 !flex !items-center !gap-3 !cursor-not-allowed !opacity-50">
                <div className="!w-5 !h-5 !rounded-full !border !border-gray-300"></div>
                <span className="!font-bold !text-sm">PIX</span>
              </div>
            </div>

            {/* Campos de Cartão Falsos */}
            <div>
              <label className="!block !text-sm !font-bold !text-gray-900 !mb-2">Número do cartão</label>
              <div className="!relative">
                <input type="text" placeholder="0000 0000 0000 0000" required className="!w-full !h-12 !px-4 !bg-white !border !border-gray-300 focus:!border-black !rounded-xl focus:!outline-none !transition-colors !text-black !font-medium" />
                <div className="!absolute !right-4 !top-1/2 !-translate-y-1/2 !flex !gap-1">
                  <div className="!w-8 !h-5 !bg-gray-200 !rounded"></div>
                  <div className="!w-8 !h-5 !bg-gray-200 !rounded"></div>
                </div>
              </div>
            </div>

            <div className="!grid !grid-cols-2 !gap-6">
              <div>
                <label className="!block !text-sm !font-bold !text-gray-900 !mb-2">Data de expiração</label>
                <input type="text" placeholder="MM / AA" required className="!w-full !h-12 !px-4 !bg-white !border !border-gray-300 focus:!border-black !rounded-xl focus:!outline-none !transition-colors !text-black !font-medium" />
              </div>
              <div>
                <label className="!block !text-sm !font-bold !text-gray-900 !mb-2">CVC</label>
                <input type="text" placeholder="123" required className="!w-full !h-12 !px-4 !bg-white !border !border-gray-300 focus:!border-black !rounded-xl focus:!outline-none !transition-colors !text-black !font-medium" />
              </div>
            </div>

            <div>
              <label className="!block !text-sm !font-bold !text-gray-900 !mb-2">Nome impresso no cartão</label>
              <input type="text" placeholder="Seu nome completo" required className="!w-full !h-12 !px-4 !bg-white !border !border-gray-300 focus:!border-black !rounded-xl focus:!outline-none !transition-colors !text-black !font-medium" />
            </div>

            <hr className="!border-gray-200 !my-4" />

            {/* BOTÃO DE CONFIRMAR ASSINATURA */}
            <button 
              type="submit" 
              disabled={isProcessing || totalPrice === 0}
              className="!w-full !h-14 !bg-[#502274] !text-white !font-bold !text-lg !rounded-full hover:!bg-[#401a5d] !transition-colors !flex !items-center !justify-center !gap-2 disabled:!opacity-70 disabled:!cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="!animate-spin !rounded-full !h-5 !w-5 !border-t-2 !border-b-2 !border-white"></div>
                  Processando pagamento...
                </>
              ) : (
                `Assinar por R$ ${totalPrice},00`
              )}
            </button>
            <p className="!text-center !text-xs !text-gray-400 !font-medium !mt-2">
              Pagamento seguro. Cancele a qualquer momento.
            </p>
          </form>
        </div>

        {/* LADO DIREITO: RESUMO DO PEDIDO */}
        <div className="!w-full lg:!w-2/5 !bg-[#F9FAFB] !p-8 lg:!p-16">
          <h3 className="!text-sm !font-bold !text-gray-500 !uppercase !tracking-wider !mb-6">Resumo do pedido</h3>
          
          <div className="!bg-white !p-6 !rounded-[24px] !border !border-gray-200 !shadow-sm !mb-6">
            <div className="!flex !justify-between !items-start !mb-4">
              <div>
                <h4 className={`!text-xl !font-black ${selectedPlan.color}`}>{selectedPlan.name}</h4>
                <p className="!text-sm !text-gray-500 !font-medium !mt-1">
                  {isAnnual ? 'Plano Anual' : 'Plano Mensal'}
                </p>
              </div>
              <div className="!text-right">
                <span className="!text-2xl !font-black !text-black">R$ {pricePerMonth}</span>
                <span className="!text-sm !text-gray-500 !font-medium">/mês</span>
              </div>
            </div>
            
            <hr className="!border-gray-100 !my-4" />
            
            <div className="!flex !justify-between !items-center !text-sm !font-medium !text-gray-600 !mb-3">
              <span>Subtotal</span>
              <span>R$ {totalPrice},00</span>
            </div>
            
            {isAnnual && totalPrice > 0 && (
              <div className="!flex !justify-between !items-center !text-sm !font-bold !text-sky-600 !mb-3">
                <span>Desconto Anual (20%)</span>
                <span>- Aplicado</span>
              </div>
            )}

            <div className="!flex !justify-between !items-center !text-sm !font-medium !text-gray-600 !mb-3">
              <span>Impostos</span>
              <span>R$ 0,00</span>
            </div>

            <hr className="!border-gray-100 !my-4" />

            <div className="!flex !justify-between !items-center">
              <span className="!text-lg !font-bold !text-gray-900">Total a pagar hoje</span>
              <span className="!text-2xl !font-black !text-black">R$ {totalPrice},00</span>
            </div>
          </div>

          <div className="!flex !items-start !gap-3 !text-xs !text-gray-500 !font-medium !leading-relaxed">
            <svg className="!w-5 !h-5 !text-gray-400 !shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            <p>
              Ao concluir a compra, você concorda com nossos Termos de Serviço e Política de Privacidade. A assinatura será renovada automaticamente no final do período.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}

// Exportação padrão envolvendo o conteúdo num Suspense (Exigência do Next.js para usar searchParams)
export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="!min-h-screen !bg-white !flex !items-center !justify-center">
        <div className="!animate-spin !rounded-full !h-12 !w-12 !border-t-2 !border-b-2 !border-sky-500"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}