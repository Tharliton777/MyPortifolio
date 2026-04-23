"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function ReportPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    reportedUrl: "",
    reportType: "",
    comments: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: dbError } = await supabase.from("reports").insert([
        {
          reporter_name: `${formData.firstName} ${formData.lastName}`.trim(),
          reporter_email: formData.email,
          reported_url: formData.reportedUrl,
          report_type: formData.reportType,
          comments: formData.comments,
        },
      ]);

      if (dbError) throw dbError;
      
      setSuccess(true);
      window.scrollTo(0, 0);
    } catch (err: any) {
      setError("Ocorreu um erro ao enviar sua denúncia. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="!min-h-screen !bg-[#F3F3F1] !font-sans !flex !flex-col">
      
      {/* Cabeçalho Simples e Integrado */}
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

      <main className="!flex-grow !pt-[120px] !pb-20 !px-4">
        <div className="!max-w-[800px] !mx-auto">
          
          {/* Cabeçalho da Página */}
          <div className="!mb-12">
            <h1 className="!text-4xl sm:!text-5xl !font-black !text-black !tracking-tight !mb-6">
              Denuncie uma violação de segurança
            </h1>
            <p className="!text-gray-800 !text-lg !leading-relaxed !font-medium">
              Se encontrar conteúdo no BioFlow que possa violar nossos <strong>Padrões da Comunidade</strong> ou <strong>Termos e Condições</strong>, preencha o formulário abaixo. Levamos as denúncias de abuso a sério, analisamos todas as solicitações e tomamos as medidas necessárias.
            </p>
          </div>

          {success ? (
            <div className="!bg-white !p-10 !rounded-[32px] !shadow-sm !text-center">
              <div className="!w-16 !h-16 !bg-green-100 !rounded-full !flex !items-center !justify-center !mx-auto !mb-6">
                <svg className="!w-8 !h-8 !text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="!text-2xl !font-bold !text-black !mb-4">Denúncia Recebida</h2>
              <p className="!text-gray-600 !mb-8">Nossa equipe de confiança e segurança vai analisar o link denunciado o mais rápido possível.</p>
              <Link href="/" className="!inline-flex !items-center !justify-center !px-8 !py-4 !bg-black !text-white !font-bold !rounded-full hover:!bg-gray-800 !transition">
                Voltar ao Início
              </Link>
            </div>
          ) : (
            <div className="!bg-white !p-8 sm:!p-12 !rounded-[32px] !shadow-sm">
              <form onSubmit={handleSubmit} className="!flex !flex-col !gap-6">
                
                {/* Nomes */}
                <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-6">
                  <div>
                    <label className="!block !text-sm !font-bold !text-gray-900 !mb-2">Primeiro Nome *</label>
                    <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="!w-full !h-12 !px-4 !bg-[#F6F7F5] !border !border-transparent focus:!bg-white !rounded-xl focus:!border-black focus:!outline-none !transition-colors !text-black" />
                  </div>
                  <div>
                    <label className="!block !text-sm !font-bold !text-gray-900 !mb-2">Último Nome *</label>
                    <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="!w-full !h-12 !px-4 !bg-[#F6F7F5] !border !border-transparent focus:!bg-white !rounded-xl focus:!border-black focus:!outline-none !transition-colors !text-black" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="!block !text-sm !font-bold !text-gray-900 !mb-2">E-mail *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="!w-full !h-12 !px-4 !bg-[#F6F7F5] !border !border-transparent focus:!bg-white !rounded-xl focus:!border-black focus:!outline-none !transition-colors !text-black" />
                </div>

                {/* URL */}
                <div>
                  <label className="!block !text-sm !font-bold !text-gray-900 !mb-2">URL do Perfil BioFlow que você está denunciando *</label>
                  <input type="url" name="reportedUrl" required placeholder="https://bioflow.com/nomedousuario" value={formData.reportedUrl} onChange={handleChange} className="!w-full !h-12 !px-4 !bg-[#F6F7F5] !border !border-transparent focus:!bg-white !rounded-xl focus:!border-black focus:!outline-none !transition-colors !text-black" />
                </div>

                {/* Tipo de denúncia */}
                <div>
                  <label className="!block !text-sm !font-bold !text-gray-900 !mb-2">Tipo de denúncia *</label>
                  <div className="!relative">
                    <select name="reportType" required value={formData.reportType} onChange={handleChange} className="!w-full !h-12 !px-4 !bg-[#F6F7F5] !border !border-transparent focus:!bg-white !rounded-xl focus:!border-black focus:!outline-none !transition-colors !text-black !appearance-none !font-medium">
                      <option value="" disabled>SELECIONE UMA OPÇÃO</option>
                      <option value="spam">Spam ou Fraude</option>
                      <option value="hate_speech">Discurso de ódio ou Assédio</option>
                      <option value="impersonation">Falsidade Ideológica (Fingindo ser outra pessoa)</option>
                      <option value="copyright">Violação de Direitos Autorais</option>
                      <option value="illegal">Conteúdo Ilegal</option>
                      <option value="other">Outro</option>
                    </select>
                    <div className="!pointer-events-none !absolute !inset-y-0 !right-0 !flex !items-center !px-4 !text-gray-500">
                      <svg className="!w-4 !h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                {/* Comentários */}
                <div>
                  <label className="!block !text-sm !font-bold !text-gray-900 !mb-2">Você tem comentários adicionais para nos ajudar a entender sua denúncia? *</label>
                  <textarea name="comments" required rows={5} value={formData.comments} onChange={handleChange} className="!w-full !p-4 !bg-[#F6F7F5] !border !border-transparent focus:!bg-white !rounded-xl focus:!border-black focus:!outline-none !transition-colors !text-black !resize-none" />
                </div>

                {error && <p className="!text-red-500 !font-bold !text-sm !text-center">{error}</p>}

                {/* Botão Enviar */}
                <div className="!mt-4">
                  <button type="submit" disabled={loading} className="!w-full sm:!w-auto !px-10 !py-4 !bg-[#8129D9] !text-white !font-bold !rounded-full hover:!bg-[#6c22b5] !transition-colors disabled:!opacity-50">
                    {loading ? "A Enviar..." : "Enviar Formulário"}
                  </button>
                </div>

              </form>
            </div>
          )}
        </div>
      </main>

      {/* === NOVA SEÇÃO DE CTA (ESTILO LINKTREE) === */}
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

      {/* Mini Rodapé */}
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