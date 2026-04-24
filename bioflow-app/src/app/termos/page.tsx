import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="!min-h-screen !bg-[#F3F3F1] !font-sans !flex !flex-col">
      
      {/* Cabeçalho */}
      <header className="!bg-white !border-b !border-gray-200 !py-4 !px-6 !fixed !top-0 !w-full !z-50 !flex !items-center !justify-between">
        <Link href="/" className="!text-2xl !font-black !text-black !flex !items-center !gap-2 !tracking-tight">
          BioFlow
          <svg className="!w-5 !h-5 !text-sky-500 !mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </Link>
        <Link href="/login" className="!text-sm !font-bold !bg-black !text-white !px-5 !py-2.5 !rounded-full hover:!bg-gray-800 !transition-colors">
          Cadastre-se
        </Link>
      </header>

      {/* Conteúdo Principal */}
      <main className="!flex-grow !pt-[140px] !pb-20 !px-4">
        <div className="!max-w-[800px] !mx-auto !bg-white !p-8 sm:!p-16 !rounded-[32px] !shadow-sm">
          <h1 className="!text-4xl sm:!text-5xl !font-black !text-black !tracking-tight !mb-6 !text-center">
            Termos e Condições
          </h1>
          <p className="!text-gray-500 !font-medium !text-center !mb-12">
            Última atualização: Abril de 2026
          </p>

          <div className="!prose !max-w-none !text-gray-700 !leading-relaxed !space-y-6">
            <p className="!font-medium !text-[16px]">
              Bem-vindo ao BioFlow! Estes Termos e Condições regem o uso do nosso site e serviços. Ao criar uma conta ou usar nossa plataforma, você concorda com estes termos.
            </p>

            <h2 className="!text-2xl !font-bold !text-black !mt-10 !mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao aceder ao BioFlow, você concorda em ficar vinculado a estes Termos de Serviço, a todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de quaisquer leis locais aplicáveis.
            </p>

            <h2 className="!text-2xl !font-bold !text-black !mt-10 !mb-4">2. Uso da Conta</h2>
            <p>
              Você é responsável por manter a confidencialidade da sua conta e senha, e concorda em aceitar a responsabilidade por todas as atividades que ocorram sob a sua conta. O BioFlow reserva-se o direito de recusar o serviço, encerrar contas ou remover conteúdo a seu exclusivo critério se houver violação das nossas políticas.
            </p>

            <h2 className="!text-2xl !font-bold !text-black !mt-10 !mb-4">3. Conteúdo do Usuário</h2>
            <p>
              Você mantém todos os direitos sobre o conteúdo que publica no seu perfil do BioFlow. No entanto, o conteúdo não deve ser ilegal, obsceno, ameaçador, difamatório, invasivo da privacidade ou de outra forma censurável.
            </p>
            
            <h2 className="!text-2xl !font-bold !text-black !mt-10 !mb-4">4. Isenção de Responsabilidade</h2>
            <p>
              Os materiais no site do BioFlow são fornecidos "como estão". O BioFlow não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização ou adequação a um fim específico.
            </p>
          </div>
        </div>
      </main>

      {/* Seção CTA */}
      <section className="!bg-[#502274] !py-24 !px-6 !flex !flex-col !items-center !justify-center !text-center !relative !overflow-hidden">
        <h2 className="!text-white !text-4xl sm:!text-5xl !font-black !mb-10 !tracking-tight !max-w-3xl !mx-auto !relative !z-10 !leading-tight">
          Dê um impulso ao seu canto da internet hoje
        </h2>
        <div className="!flex !flex-col sm:!flex-row !gap-4 !w-full !max-w-xl !relative !z-10">
          <div className="!flex !items-center !bg-white !rounded-xl !overflow-hidden !h-14 !w-full !px-4">
            <span className="!text-gray-500 !font-medium">bioflow.com/</span>
            <input type="text" className="!w-full !h-full !outline-none !text-black !font-bold" placeholder="seunome" />
          </div>
          <Link href="/login" className="!h-14 !px-8 !bg-[#D2E823] !text-black !font-bold !rounded-xl hover:!bg-[#b8cc1d] !transition-colors !flex !items-center !justify-center !whitespace-nowrap">
            Reivindique seu BioFlow
          </Link>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="!bg-white !border-t !border-gray-200 !py-8">
        <div className="!max-w-[1200px] !mx-auto !px-6 !flex !flex-col sm:!flex-row !items-center !justify-between !gap-4">
          <div className="!text-xl !font-black !text-black !flex !items-center !gap-2">
            BioFlow
            <svg className="!w-4 !h-4 !text-sky-500 !mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </div>
          <div className="!text-sm !text-gray-500 !font-medium !text-center sm:!text-left">
            Dê um impulso ao seu canto da internet hoje.
          </div>
        </div>
      </footer>
    </div>
  );
}