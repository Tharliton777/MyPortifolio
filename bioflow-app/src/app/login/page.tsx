"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Função para Login/Cadastro com Email e Senha
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagemErro("");

    const themeParam = searchParams.get("theme");

    try {
      let authUser = null;

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered") || signUpError.message.includes("User already registered")) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (signInError) {
            setMensagemErro("Senha incorreta. Tente novamente.");
            setLoading(false);
            return;
          }
          authUser = signInData.user;
        } else {
          setMensagemErro("Erro: " + signUpError.message);
          setLoading(false);
          return;
        }
      } else {
        authUser = signUpData.user;
      }

      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', authUser.id)
          .single();

        const themeQueryString = themeParam ? `?theme=${themeParam}` : "";

        if (profile && profile.username) {
          router.push(`/dashboard${themeQueryString}`);
        } else {
          router.push(`/onboarding${themeQueryString}`);
        }
      }

    } catch (err) {
      console.error(err);
      setMensagemErro("Ocorreu um erro inesperado de conexão.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // NOVA FUNÇÃO: LOGIN COM O GOOGLE
  // ==========================================
  const handleGoogleLogin = async () => {
    setLoading(true);
    setMensagemErro("");
    
    const themeParam = searchParams.get("theme");
    const themeQueryString = themeParam ? `?theme=${themeParam}` : "";

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Após logar no Google, o Supabase vai redirecionar para o Dashboard repassando o tema.
          // Como o Dashboard já tem a inteligência de mandar para o /onboarding se não tiver perfil, o fluxo fica perfeito!
          redirectTo: `${window.location.origin}/dashboard${themeQueryString}`
        }
      });

      if (error) throw error;
    } catch (err) {
      console.error(err);
      setMensagemErro("Erro ao conectar com o provedor do Google.");
      setLoading(false);
    }
  };

  return (
    <div className="!min-h-screen !flex !w-full !bg-white !font-sans !text-black !overflow-hidden !relative">
      
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          background-color: white;
          overscroll-behavior: none;
          margin: 0;
          padding: 0;
        }
      `}} />

      {/* LADO ESQUERDO */}
      <div className="!w-full lg:!w-1/2 !flex !flex-col !h-screen !overflow-y-auto !p-8 sm:!p-12">
        
        <div onClick={() => router.push("/")} className="!flex !items-center !gap-2 !cursor-pointer !shrink-0 !w-max">
          <span className="!text-2xl !font-bold !text-black !tracking-tight">BioFlow</span>
          <svg className="!w-6 !h-6 !mt-1 !text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </div>

        <div className="!flex-1 !flex !items-center !justify-center !w-full !mt-12">
          <div className="!w-full !max-w-[420px] !flex !flex-col !py-8">
            
            <div className="!text-center !mb-12">
              <h1 className="!text-4xl sm:!text-[44px] !font-black !text-black !mb-4 !tracking-tighter !leading-tight">
                Junte-se ao BioFlow
              </h1>
              <p className="!text-gray-500 !text-lg">
                Inscreva-se gratuitamente!
              </p>
            </div>

            <form onSubmit={handleAuth} className="!flex !flex-col !gap-4">
              <input
                type="email"
                placeholder="E-mail"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="!w-full !h-14 !px-6 !bg-[#F6F7F5] !border !border-transparent focus:!bg-white !rounded-2xl !text-black placeholder:!text-gray-500 focus:!outline-none focus:!border-black focus:!ring-1 focus:!ring-black !transition-all !text-base !font-medium"
              />
              
              <input
                type="password"
                placeholder="Senha"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="!w-full !h-14 !px-6 !bg-[#F6F7F5] !border !border-transparent focus:!bg-white !rounded-2xl !text-black placeholder:!text-gray-500 focus:!outline-none focus:!border-black focus:!ring-1 focus:!ring-black !transition-all !text-base !font-medium"
              />

              {mensagemErro && (
                <p className="!text-red-500 !text-sm !font-bold !text-center !mt-1">{mensagemErro}</p>
              )}

              <div className="!flex !items-center !gap-3 !mt-2">
                <input type="checkbox" required className="!w-5 !h-5 !rounded !border-gray-300 !text-black focus:!ring-black !accent-black !cursor-pointer" />
                <span className="!text-[14px] !font-medium !text-gray-600 !leading-snug">Eu concordo em receber ofertas, notícias e atualizações.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="!w-full !h-14 !bg-[#E0E2D9] !text-gray-700 !font-bold !rounded-full hover:!bg-[#d1d3ca] hover:!text-black !transition-colors !text-base !mt-2 !flex !items-center !justify-center disabled:!opacity-50 disabled:!cursor-not-allowed"
              >
                {loading ? "Conectando..." : "Continuar"}
              </button>
            </form>

            <div className="!mt-8 !text-center !px-4">
               <p className="!text-xs !text-gray-500 !leading-relaxed !font-medium">
                 Ao clicar em <strong>Criar conta</strong>, você concorda com o <a href="#" className="!underline hover:!text-black !transition-colors">aviso de privacidade</a>, <a href="#" className="!underline hover:!text-black !transition-colors">Termos e Condições</a> e <a href="#" className="!underline hover:!text-black !transition-colors">aviso de cookies</a>.
               </p>
            </div>

            <div className="!my-10 !flex !items-center !justify-between">
              <hr className="!w-full !border-gray-200" />
              <span className="!px-4 !text-xs !text-gray-400 !uppercase !tracking-widest !font-bold">OU</span>
              <hr className="!w-full !border-gray-200" />
            </div>

            {/* BOTÃO DO GOOGLE (Único provedor social agora) */}
            <div className="!flex !flex-col !gap-3">
              <button 
                type="button" 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="!w-full !h-14 !bg-white !text-black !font-bold !rounded-full !border !border-gray-200 hover:!border-gray-400 hover:!bg-gray-50 !transition-all !flex !items-center !justify-center !gap-3 !text-base disabled:!opacity-50"
              >
                <svg className="!w-5 !h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {loading ? "Redirecionando..." : "Continuar com o Google"}
              </button>
            </div>

            <div className="!mt-12 !text-center">
              <p className="!text-gray-500 !text-[15px] !font-medium">
                Já tem uma conta? <a href="#" className="!text-[#8129D9] hover:!underline !font-bold !transition-colors">Entrar</a>
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* LADO DIREITO */}
      <div className="!hidden lg:!block lg:!w-1/2 !relative !bg-[#F3F3F1]">
         <img 
           src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
           alt="BioFlow Banner" 
           className="!absolute !inset-0 !w-full !h-full !object-cover"
         />
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="!min-h-screen !bg-white !flex !items-center !justify-center"><div className="!animate-spin !rounded-full !h-12 !w-12 !border-t-2 !border-b-2 !border-black"></div></div>}>
      <LoginContent />
    </Suspense>
  );
}