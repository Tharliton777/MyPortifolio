import Link from "next/link";

export default function PrivacyPage() {
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
            Aviso de Privacidade
          </h1>
          <p className="!text-gray-500 !font-medium !text-center !mb-12">
            Data de entrada em vigor: Abril de 2026
          </p>

          <div className="!prose !max-w-none !text-gray-700 !leading-relaxed !space-y-6">
            <p className="!font-medium !text-[16px]">
              No BioFlow, temos o compromisso de sermos transparentes sobre como coletamos, usamos e protegemos suas informações pessoais. Este Aviso de Privacidade explica nossas práticas de dados e descreve seus direitos em relação às suas informações, em total conformidade com a <strong>LGPD (Lei Geral de Proteção de Dados Pessoais - Lei nº 13.709/2018)</strong> do Brasil.
            </p>

            <div className="!bg-blue-50 !p-6 !rounded-2xl !border !border-blue-100 !my-8">
              <h3 className="!text-blue-900 !font-bold !text-lg !mb-2 !flex !items-center !gap-2">
                <svg className="!w-5 !h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Conheça os seus direitos
              </h3>
              <p className="!text-blue-800 !text-sm">
                Para consultar o texto oficial da Lei Geral de Proteção de Dados Pessoais do Brasil, acesse o portal oficial do governo através deste link: <br/>
                <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer" className="!font-bold !underline hover:!text-blue-600">
                  Lei nº 13.709, de 14 de agosto de 2018 (Planalto)
                </a>
              </p>
            </div>

            <h2 className="!text-2xl !font-bold !text-black !mt-10 !mb-4">O que o BioFlow faz?</h2>
            <p>
              O BioFlow fornece uma plataforma que permite aos usuários criar uma página única e personalizada (seu "BioFlow") contendo links para todo o seu conteúdo na web, redes sociais, produtos e muito mais. Ao fazer isso, processamos dados para manter a plataforma segura e funcional.
            </p>

            <h2 className="!text-2xl !font-bold !text-black !mt-10 !mb-4">Informações que coletamos</h2>
            <ul className="!list-disc !pl-6 !space-y-2">
              <li><strong>Dados de Conta:</strong> Endereço de e-mail, nome de usuário e senha (quando aplicável).</li>
              <li><strong>Dados de Perfil:</strong> Textos, links e imagens que você escolhe adicionar ao seu perfil.</li>
              <li><strong>Dados Analíticos:</strong> Informações sobre como os visitantes interagem com o seu BioFlow (cliques, visualizações de página, localização agregada).</li>
            </ul>

            <h2 className="!text-2xl !font-bold !text-black !mt-10 !mb-4">Como utilizamos suas informações</h2>
            <p>
              Utilizamos os seus dados exclusivamente para:
              <br/>- Prestar, manter e melhorar os serviços do BioFlow.
              <br/>- Personalizar a sua experiência e fornecer relatórios analíticos de acesso.
              <br/>- Proteger a segurança da plataforma e prevenir fraudes.
            </p>
            
            <h2 className="!text-2xl !font-bold !text-black !mt-10 !mb-4">Segurança e Retenção</h2>
            <p>
              Implementamos medidas de segurança robustas para proteger suas informações. Retemos os seus dados apenas pelo tempo necessário para fornecer o serviço ou conforme exigido por obrigações legais.
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