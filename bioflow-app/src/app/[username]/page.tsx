import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "../../lib/supabase";

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ username: string }>;
};

// ==========================================
// 1. GERAÇÃO DE METADADOS (SEO E CARD)
// ==========================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const username = resolvedParams.username;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, username, bio, avatar_url")
    .eq("username", username)
    .single();

  if (!profile) return { title: "Perfil não encontrado" };

  const title = profile.display_name || profile.username;
  const description = profile.bio || `Confira os links de ${title}`;

  return {
    title: `${title} | BioFlow`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

// ==========================================
// 2. PÁGINA PÚBLICA (VITRINE ESTILO LINKTREE)
// ==========================================
export default async function PublicProfilePage({ params }: Props) {
  const resolvedParams = await params;
  const username = resolvedParams.username;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  // Tratamento se o perfil não existir
  if (!profile || profileError) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] text-black p-10 flex flex-col items-center justify-center font-sans">
        <h1 className="text-3xl font-bold mb-2">Perfil não encontrado</h1>
        <p className="text-gray-500">Este link não existe ou foi removido.</p>
      </div>
    );
  }

  // ==========================================
  // PROTEÇÃO: TELA DE CONTA SUSPENSA (BANIDA)
  // ==========================================
  if (profile.is_blocked) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex flex-col items-center justify-center p-10 text-center font-sans">
        <svg className="w-16 h-16 text-red-500 mb-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">CONTA SUSPENSA</h1>
        <p className="text-gray-400 max-w-sm leading-relaxed mb-8">Este perfil violou os Termos de Uso do BioFlow e foi permanentemente removido da plataforma.</p>
        <a href="/" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
          Crie seu próprio BioFlow
        </a>
      </div>
    );
  }

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", profile.id)
    .eq("is_active", true)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  // ==========================================
  // LÓGICA DE TEMAS E CORES
  // ==========================================
  const currentTheme = profile.theme || "light";

  const isDarkTheme = () => {
    if (currentTheme === "light") return false;

    let colorToCheck = currentTheme;
    if (currentTheme.startsWith("gradient:")) {
      colorToCheck = currentTheme.replace("gradient:", "").split(",")[0];
    }

    if (colorToCheck.startsWith("#")) {
      const hex = colorToCheck.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16) || 0;
      const g = parseInt(hex.substring(2, 2), 16) || 0;
      const b = parseInt(hex.substring(4, 2), 16) || 0;
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq < 128;
    }
    return true; 
  };

  const darkTextNeeded = isDarkTheme();

  const getThemeBackgroundClass = () => {
    if (currentTheme.startsWith("#") || currentTheme.startsWith("gradient:")) {
      return "";
    }
    switch (currentTheme) {
      case "dark": return "!bg-[#1A1A1A]";
      case "sunset": return "!bg-gradient-to-br !from-orange-400 !to-pink-600";
      case "ocean": return "!bg-gradient-to-br !from-sky-400 !to-blue-700";
      case "forest": return "!bg-gradient-to-br !from-emerald-400 !to-teal-700";
      case "berry": return "!bg-gradient-to-br !from-rose-400 !to-purple-700";
      case "midnight": return "!bg-[#0B1021]";
      case "monochrome": return "!bg-zinc-500";
      default: return "!bg-gray-50";
    }
  };

  const getDynamicStyle = () => {
    let styles: any = {};
    if (currentTheme.startsWith("#")) {
      styles.backgroundColor = currentTheme;
    } else if (currentTheme.startsWith("gradient:")) {
      const colors = currentTheme.replace("gradient:", "").split(",");
      styles.backgroundImage = `linear-gradient(to bottom right, ${colors[0]}, ${colors[1]})`;
    }
    return styles;
  };

  const buttonClass = darkTextNeeded
    ? "!bg-white/10 !text-white hover:!bg-white/20 !border !border-white/10"
    : "!bg-white !text-gray-800 hover:!bg-gray-50 border border-gray-200";

  const firstName = profile.display_name ? profile.display_name.split(' ')[0] : profile.username;
  const profileUrl = `https://bioflow.com/${profile.username}`; 

  return (
    <main 
      className={`min-h-screen w-full flex items-center justify-center sm:py-12 font-sans relative overflow-x-hidden ${getThemeBackgroundClass()}`}
      style={getDynamicStyle()}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          background-color: ${darkTextNeeded ? '#1A1A1A' : '#F9FAFB'};
          overscroll-behavior: none;
        }

        /* ANIMAÇÃO MODAL DO PERFIL */
        #share-toggle:checked ~ #share-modal {
          opacity: 1 !important;
          visibility: visible !important;
        }
        #share-toggle:checked ~ #share-modal #share-card {
          transform: translateY(0) scale(1) !important;
        }

        /* ANIMAÇÃO DOS MODAIS DE LINKS ESPECÍFICOS */
        .link-toggle:checked + .link-modal {
          opacity: 1 !important;
          visibility: visible !important;
        }
        .link-toggle:checked + .link-modal .link-card {
          transform: translateY(0) scale(1) !important;
        }
      `}} />

      {/* OVERLAY SUTIL */}
      <div className={`absolute inset-0 z-0 backdrop-blur-[100px] ${darkTextNeeded ? 'bg-black/10' : 'bg-white/40'}`}></div>

      <div 
        className={`w-full h-full sm:h-auto sm:min-h-[850px] max-w-[640px] sm:rounded-[40px] sm:shadow-[0_20px_60px_rgba(0,0,0,0.2)] relative flex flex-col overflow-hidden z-10 transition-all !pb-12 ${getThemeBackgroundClass()}`}
        style={getDynamicStyle()}
      >
        
        {/* ÍCONES DO TOPO */}
        <a href="/register" className={`absolute top-6 left-6 sm:top-8 sm:left-8 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-colors backdrop-blur-md shadow-sm ${darkTextNeeded ? "bg-black/20 text-white hover:bg-black/40 border border-white/10" : "bg-white/80 text-black hover:bg-white border border-gray-200"}`}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        </a>
        
        {/* Botão Compartilhar Perfil */}
        <label htmlFor="share-toggle" className={`absolute top-6 right-6 sm:top-8 sm:right-8 z-20 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors backdrop-blur-md shadow-sm ${darkTextNeeded ? "bg-black/20 text-white hover:bg-black/40 border border-white/10" : "bg-white/80 text-black hover:bg-white border border-gray-200"}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" /></svg>
        </label>

        {/* CAPA */}
        <div className={`w-full h-44 relative shrink-0 ${darkTextNeeded ? "!bg-white/10" : "!bg-gray-100"}`}>
          {profile.cover_url && (
             <img src={profile.cover_url} alt="Capa" className="w-full h-full object-cover" />
          )}
        </div>

        <div className={`flex-1 flex flex-col items-center w-full px-4 sm:px-8 z-10 ${profile.cover_url ? '' : 'pt-28'}`}>
          
          {/* AVATAR COM TAMANHO AJUSTADO (112px) E SEM BORDA */}
          {profile.avatar_url && (
            <div 
              className={`w-[112px] h-[112px] rounded-full overflow-hidden shrink-0 flex items-center justify-center shadow-lg border-4 ${darkTextNeeded ? "border-transparent" : "border-transparent"} ${profile.cover_url ? '-mt-[56px]' : '!mt-24 sm:!mt-28'}`}
            >
              <img src={profile.avatar_url} alt={profile.display_name || profile.username} className="w-full h-full object-cover" />
            </div>
          )}

          {/* NOME (MENOS GROSSEIRO, APENAS FONT-BOLD) */}
          <h1 className={`text-[24px] sm:text-[26px] font-bold flex items-center justify-center gap-1.5 ${profile.avatar_url ? '!mt-6' : (profile.cover_url ? '!mt-12' : '!mt-28')} !mb-2 tracking-tight text-center ${darkTextNeeded ? "text-white" : "text-[#111827]"}`}>
            {profile.display_name || profile.username}
            {profile.is_verified && (
              <svg className="w-[22px] h-[22px] text-sky-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            )}
          </h1>

          <p className={`text-[16px] !mb-10 text-center max-w-[480px] break-words leading-relaxed font-medium ${darkTextNeeded ? "text-white/80" : "text-gray-600"}`}>
            {profile.bio}
          </p>

          {/* LISTA DE LINKS */}
          <div className="w-full max-w-[600px] flex flex-col gap-4">
            {links?.map((link) => (
              <div key={link.id} className="relative w-full">
                
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`w-full min-h-[76px] py-[22px] px-14 rounded-[20px] flex items-center justify-center transition-colors duration-300 ease-out relative shadow-sm hover:shadow-md ${buttonClass}`}
                >
                  {(link as any).image_url && (
                    <img src={(link as any).image_url} className="!w-[50px] !h-[50px] !rounded-xl !object-cover !absolute !left-3" alt="" />
                  )}
                  <span className="font-bold text-[18px] text-center leading-tight">
                    {link.title}
                  </span>
                </a>
                
                {/* 3 Pontinhos */}
                <label htmlFor={`share-link-${link.id}`} className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 cursor-pointer rounded-full transition-colors ${darkTextNeeded ? "text-white/70 hover:bg-white/10" : "text-gray-400 hover:bg-black/5"}`}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col items-center pt-16 mt-auto z-20 gap-6">
          <a 
            href="/register" 
            className={`!inline-flex !items-center !justify-center !gap-2 !px-8 !py-4 !rounded-full !font-bold text-[16px] !shadow-lg hover:!shadow-2xl !transition-shadow !duration-300 !backdrop-blur-md ${darkTextNeeded ? "!bg-black/40 !text-white !border !border-white/10" : "!bg-white !text-black"}`}
          >
            <svg className="w-5 h-5 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            Junte-se a {firstName} no BioFlow
          </a>

          <div className={`flex flex-wrap justify-center gap-x-4 gap-y-2 text-[13px] font-semibold opacity-70 px-4 !mb-8 ${darkTextNeeded ? "text-white" : "text-[#111827]"}`}>
            <span className="cursor-pointer hover:underline">Preferências de cookies</span>
            <span className="cursor-pointer hover:underline">Relatório</span>
            <span className="cursor-pointer hover:underline">Privacidade</span>
            <span className="cursor-pointer hover:underline">Explorar</span>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* CHECKBOX INVISÍVEL (MODAL PERFIL) */}
      {/* ========================================== */}
      <input type="checkbox" id="share-toggle" className="hidden" />

      {/* ========================================== */}
      {/* MODAL DE COMPARTILHAMENTO DO PERFIL */}
      {/* ========================================== */}
      <div id="share-modal" className="fixed inset-0 z-[999] flex items-center justify-center p-4 opacity-0 invisible transition-all duration-300 ease-out">
        <label htmlFor="share-toggle" className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"></label>
        
        <div id="share-card" className="bg-white w-full max-w-[420px] rounded-[32px] !p-8 relative z-10 shadow-2xl flex flex-col !box-border overflow-hidden transform translate-y-4 scale-95 transition-all duration-300 ease-out">
          <label htmlFor="share-toggle" className="absolute top-5 right-5 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
          </label>

          <h2 className="text-[20px] font-bold text-gray-900 text-center !mt-0 !mb-6">Compartilhar BioFlow</h2>

          <div className="w-full bg-[#1e1e24] rounded-2xl !p-6 flex flex-col items-center !mb-8 shadow-inner">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full !mb-3 shadow-md object-cover shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-600 !mb-3 flex items-center justify-center shadow-md shrink-0">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
              </div>
            )}
            <h3 className="text-white font-bold text-lg flex items-center gap-1.5 !mb-0">
              {profile.display_name || profile.username}
              {profile.is_verified && (
                <svg className="w-[18px] h-[18px] text-sky-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              )}
            </h3>
            <p className="text-gray-400 text-[13px] !mt-1 flex items-center gap-1.5 font-medium !mb-0">
              <svg className="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              bioflow.com/{profile.username}
            </p>
          </div>

          <div className="flex justify-center gap-6 !mb-8 w-full">
            <a href={`https://api.whatsapp.com/send?text=Confira%20este%20perfil%20no%20BioFlow:%20${profileUrl}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center !gap-2 group no-underline">
              <div className="w-[52px] h-[52px] bg-[#25D366] rounded-full flex items-center justify-center text-white group-hover:scale-105 transition-transform shrink-0">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 21.002c-1.579 0-3.125-.425-4.484-1.229l-4.994 1.31 1.336-4.869a8.96 8.96 0 0 1-1.23-4.577c0-4.966 4.041-9.006 9.008-9.006 2.407 0 4.67 .938 6.372 2.642 1.702 1.704 2.639 3.966 2.639 6.37 0 4.965-4.043 9.006-9.007 9.006a8.962 8.962 0 0 1-3.64-.783l-.26-.154z" /></svg>
              </div>
              <span className="text-[12px] font-semibold text-gray-700">WhatsApp</span>
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${profileUrl}&text=Confira%20este%20perfil:`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center !gap-2 group no-underline">
              <div className="w-[52px] h-[52px] bg-black rounded-full flex items-center justify-center text-white group-hover:scale-105 transition-transform shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </div>
              <span className="text-[12px] font-semibold text-gray-700">X</span>
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${profileUrl}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center !gap-2 group no-underline">
              <div className="w-[52px] h-[52px] bg-[#1877F2] rounded-full flex items-center justify-center text-white group-hover:scale-105 transition-transform shrink-0">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </div>
              <span className="text-[12px] font-semibold text-gray-700">Facebook</span>
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${profileUrl}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center !gap-2 group no-underline">
              <div className="w-[52px] h-[52px] bg-[#0A66C2] rounded-full flex items-center justify-center text-white group-hover:scale-105 transition-transform shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </div>
              <span className="text-[12px] font-semibold text-gray-700">LinkedIn</span>
            </a>
          </div>

          <div className="w-full border-t border-gray-100 !pt-6 !mt-auto">
            <h4 className="font-bold text-gray-900 text-[16px] text-center !mb-2 !mt-0">Junte-se a {firstName} no BioFlow</h4>
            <p className="text-[13px] text-gray-500 font-medium text-center !mb-6 leading-relaxed">Obtenha seu próprio BioFlow gratuitamente.</p>
            <a href="/register" className="w-full block !py-4 bg-black text-white text-center font-bold rounded-full text-[15px] shadow-md hover:shadow-lg transition-shadow no-underline">
              Cadastre-se gratuitamente
            </a>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* RENDERIZAÇÃO DOS MODAIS ESPECÍFICOS DE CADA LINK */}
      {/* ========================================== */}
      {links?.map((link) => {
        const linkImage = (link as any).image_url || null;
        const linkDesc = (link as any).description || null;

        return (
          <div key={`modal-container-${link.id}`}>
            <input type="checkbox" id={`share-link-${link.id}`} className="hidden link-toggle" />
            
            <div className="link-modal fixed inset-0 z-[1000] flex items-center justify-center p-4 opacity-0 invisible transition-all duration-300 ease-out">
              <label htmlFor={`share-link-${link.id}`} className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"></label>

              <div className="link-card bg-white w-full max-w-[420px] rounded-[32px] !p-8 relative z-10 shadow-2xl flex flex-col !box-border overflow-hidden transform translate-y-4 scale-95 transition-all duration-300 ease-out">
                
                <label htmlFor={`share-link-${link.id}`} className="absolute top-5 right-5 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </label>

                <h2 className="text-[20px] font-bold text-gray-900 text-center !mt-0 !mb-6">Compartilhar link</h2>

                <div className="w-full bg-[#1e1e24] rounded-2xl !p-6 flex flex-col items-center !mb-8 shadow-inner text-center">
                  {/* IMAGEM NO MODAL */}
                  {linkImage ? (
                    <img src={linkImage} alt={link.title} className="w-[84px] h-[84px] rounded-2xl !mb-4 shadow-md object-cover shrink-0" />
                  ) : (
                    <div className="w-[84px] h-[84px] rounded-2xl bg-gray-700 !mb-4 flex items-center justify-center shadow-md shrink-0">
                      <svg className="w-10 h-10 text-white/50" fill="currentColor" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
                    </div>
                  )}
                  <h3 className="text-white font-bold text-lg !mb-1">{link.title}</h3>
                  <p className="text-gray-400 text-[13px] font-medium !mb-3 truncate w-full px-4">{link.url}</p>
                  {linkDesc && (
                    <p className="text-white/70 text-[13px] leading-relaxed line-clamp-3">{linkDesc}</p>
                  )}
                </div>

                <div className="flex justify-center gap-6 !mb-8 w-full">
                  <a href={`https://api.whatsapp.com/send?text=Confira%20este%20link:%20${link.url}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center !gap-2 group no-underline">
                    <div className="w-[52px] h-[52px] bg-[#25D366] rounded-full flex items-center justify-center text-white group-hover:scale-105 transition-transform shrink-0">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 21.002c-1.579 0-3.125-.425-4.484-1.229l-4.994 1.31 1.336-4.869a8.96 8.96 0 0 1-1.23-4.577c0-4.966 4.041-9.006 9.008-9.006 2.407 0 4.67 .938 6.372 2.642 1.702 1.704 2.639 3.966 2.639 6.37 0 4.965-4.043 9.006-9.007 9.006a8.962 8.962 0 0 1-3.64-.783l-.26-.154z" /></svg>
                    </div>
                    <span className="text-[12px] font-semibold text-gray-700">WhatsApp</span>
                  </a>
                  
                  <a href={`https://twitter.com/intent/tweet?url=${link.url}&text=Confira%20este%20link:`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center !gap-2 group no-underline">
                    <div className="w-[52px] h-[52px] bg-black rounded-full flex items-center justify-center text-white group-hover:scale-105 transition-transform shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </div>
                    <span className="text-[12px] font-semibold text-gray-700">X</span>
                  </a>

                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${link.url}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center !gap-2 group no-underline">
                    <div className="w-[52px] h-[52px] bg-[#1877F2] rounded-full flex items-center justify-center text-white group-hover:scale-105 transition-transform shrink-0">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </div>
                    <span className="text-[12px] font-semibold text-gray-700">Facebook</span>
                  </a>

                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${link.url}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center !gap-2 group no-underline">
                    <div className="w-[52px] h-[52px] bg-[#0A66C2] rounded-full flex items-center justify-center text-white group-hover:scale-105 transition-transform shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </div>
                    <span className="text-[12px] font-semibold text-gray-700">LinkedIn</span>
                  </a>
                </div>

                <div className="w-full border-t border-gray-100 !pt-6 !mt-auto">
                  <h4 className="font-bold text-gray-900 text-[16px] text-center !mb-2 !mt-0">Junte-se a {firstName} no BioFlow</h4>
                  <p className="text-[13px] text-gray-500 font-medium text-center !mb-6 leading-relaxed">Obtenha seu próprio BioFlow gratuitamente.</p>
                  <a href="/register" className="w-full block !py-4 bg-black text-white text-center font-bold rounded-full text-[15px] shadow-md hover:shadow-lg transition-shadow no-underline">
                    Cadastre-se gratuitamente
                  </a>
                </div>

              </div>
            </div>
          </div>
        );
      })}

    </main>
  );
}