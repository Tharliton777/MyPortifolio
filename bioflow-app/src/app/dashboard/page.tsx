"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  is_active: boolean;
  position: number;
  image_url?: string; // Adicionado para receber a imagem do link
}

export default function DashboardPage() {
  const router = useRouter();

  // ==========================================
  // ESTADOS GLOBAIS E NAVEGAÇÃO
  // ==========================================
  const [profile, setProfile] = useState<{
    username: string;
    display_name?: string;
    bio: string;
    avatar_url?: string;
    cover_url?: string;
    theme?: string;
  } | null>(null);

  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("config");

  // ==========================================
  // ESTADOS DE MENSAGENS E MODAIS
  // ==========================================
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);

  // ==========================================
  // ESTADOS DA ABA DE LINKS
  // ==========================================
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [savingLink, setSavingLink] = useState(false);

  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editImageUrl, setEditImageUrl] = useState(""); // Novo estado
  const [uploadingLinkImage, setUploadingLinkImage] = useState(false); // Novo estado

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // ==========================================
  // ESTADOS DA ABA DE APARÊNCIA (UPLOADS E TEMAS)
  // ==========================================
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [customColor, setCustomColor] = useState("#3b82f6");
  const [customGrad1, setCustomGrad1] = useState("#f97316");
  const [customGrad2, setCustomGrad2] = useState("#db2777");

  // ==========================================
  // ESTADOS DA ABA DE CONFIGURAÇÕES
  // ==========================================
  const [editUsername, setEditUsername] = useState("");
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // ==========================================
  // 1. CARREGAMENTO INICIAL
  // ==========================================
  useEffect(() => {
    loadData();
  }, [router]);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("username, display_name, bio, avatar_url, cover_url, theme")
      .eq("id", user.id)
      .single();

    if (profileError || !profileData) {
      router.push("/onboarding");
      return;
    } else {
      const safeUsername = profileData.username
        ? profileData.username.toLowerCase().replace(/[^a-z0-9_.-]/g, "")
        : "";

      setProfile({ ...profileData, username: safeUsername });
      setEditUsername(safeUsername);
      setEditDisplayName(profileData.display_name || "");
      setEditBio(profileData.bio || "");

      if (profileData.theme?.startsWith("gradient:")) {
        const colors = profileData.theme.replace("gradient:", "").split(",");
        if (colors.length === 2) {
          setCustomGrad1(colors[0]);
          setCustomGrad2(colors[1]);
        }
      } else if (profileData.theme?.startsWith("#")) {
        setCustomColor(profileData.theme);
      }
    }

    const { data: linksData } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });

    if (linksData) {
      setLinks(linksData);
    }

    setLoading(false);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  // ==========================================
  // 2. FUNÇÕES DA ABA DE CONFIGURAÇÕES
  // ==========================================
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setErrorMsg("");
    setSuccessMsg("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) return;

    const cleanUsername = editUsername
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9_.-]/g, "");

    const { error } = await supabase
      .from("profiles")
      .update({
        username: cleanUsername,
        display_name: editDisplayName,
        bio: editBio,
      })
      .eq("id", user.id);

    if (error) {
      if (error.code === "23505") {
        setErrorMsg("Este nome de usuário da URL já está em uso.");
      } else {
        setErrorMsg("Erro ao atualizar o perfil.");
      }
    } else {
      setSuccessMsg("Perfil atualizado com sucesso!");
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              username: cleanUsername,
              display_name: editDisplayName,
              bio: editBio,
            }
          : null
      );
      setEditUsername(cleanUsername);
    }
    setSavingProfile(false);
  };

  const copyToClipboard = () => {
    const safeUsername =
      profile?.username?.toLowerCase().replace(/[^a-z0-9_.-]/g, "") || "";
    const url = `${window.location.origin}/${safeUsername}`;
    navigator.clipboard.writeText(url);
    setSuccessMsg("Link copiado para a área de transferência!");
  };

  // ==========================================
  // 3. FUNÇÕES DE UPLOAD E TEMAS
  // ==========================================
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);
      setErrorMsg("");
      
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Usuário não autenticado");

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}-avatar-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);
      
      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      setProfile((prev) =>
        prev ? { ...prev, avatar_url: publicUrl } : null
      );
    } catch (error) {
      setErrorMsg("Erro ao fazer upload da imagem de perfil.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setUploadingAvatar(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
      if (!user) return;
      
      await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", user.id);
        
      setProfile((prev) => (prev ? { ...prev, avatar_url: undefined } : null));
    } catch (error) {
      setErrorMsg("Erro ao remover imagem.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingCover(true);
      setErrorMsg("");
      
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Usuário não autenticado");

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}-cover-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("covers")
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("covers").getPublicUrl(filePath);
      
      await supabase
        .from("profiles")
        .update({ cover_url: publicUrl })
        .eq("id", user.id);

      setProfile((prev) =>
        prev ? { ...prev, cover_url: publicUrl } : null
      );
    } catch (error) {
      setErrorMsg("Erro ao fazer upload da capa.");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleRemoveCover = async () => {
    try {
      setUploadingCover(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
      if (!user) return;
      
      await supabase
        .from("profiles")
        .update({ cover_url: null })
        .eq("id", user.id);
        
      setProfile((prev) => (prev ? { ...prev, cover_url: undefined } : null));
    } catch (error) {
      setErrorMsg("Erro ao remover capa.");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleUpdateTheme = async (newTheme: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) return;
    
    setProfile((prev) => (prev ? { ...prev, theme: newTheme } : null));
    
    await supabase
      .from("profiles")
      .update({ theme: newTheme })
      .eq("id", user.id);
  };

  // ==========================================
  // 4. FUNÇÕES DA ABA DE LINKS E IMAGEM DE LINK
  // ==========================================
  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLink(true);
    
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from("links")
        .insert([
          { user_id: user.id, title: newTitle, url: newUrl, position: 0 },
        ])
        .select()
        .single();

      if (!error && data) {
        setLinks([data, ...links]);
        setNewTitle("");
        setNewUrl("");
        setIsAdding(false);
      }
    }
    setSavingLink(false);
  };

  // INÍCIO DA EDIÇÃO
  const startEditing = (link: LinkItem) => {
    setEditingLink(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
    setEditImageUrl(link.image_url || "");
  };

  const cancelEditing = () => {
    setEditingLink(null);
    setEditTitle("");
    setEditUrl("");
    setEditImageUrl("");
  };

  // UPLOAD DA IMAGEM DO LINK (NOVO)
  const handleLinkImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingLinkImage(true);
      setErrorMsg("");

      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}-link-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("link_images") // IMPORTANTE: O Bucket "link_images" deve existir no Supabase!
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("link_images").getPublicUrl(filePath);

      setEditImageUrl(publicUrl);
    } catch (error) {
      setErrorMsg("Erro ao fazer upload da imagem do link. Verifique se o bucket 'link_images' existe.");
    } finally {
      setUploadingLinkImage(false);
    }
  };

  const handleUpdateLink = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    setLinks(
      links.map((l) =>
        l.id === id ? { ...l, title: editTitle, url: editUrl, image_url: editImageUrl } : l
      )
    );
    cancelEditing();
    
    await supabase
      .from("links")
      .update({ title: editTitle, url: editUrl, image_url: editImageUrl })
      .eq("id", id);
  };

  const toggleLinkStatus = async (id: string, currentStatus: boolean) => {
    setLinks(
      links.map((l) =>
        l.id === id ? { ...l, is_active: !currentStatus } : l
      )
    );
    
    await supabase
      .from("links")
      .update({ is_active: !currentStatus })
      .eq("id", id);
  };

  const confirmDelete = () => {
    if (linkToDelete) {
      setLinks(links.filter((l) => l.id !== linkToDelete));
      supabase.from("links").delete().eq("id", linkToDelete).then();
      setLinkToDelete(null);
    }
  };

  const handleSort = async () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;

    const _links = [...links];
    const draggedItemContent = _links.splice(dragItem.current, 1)[0];
    _links.splice(dragOverItem.current, 0, draggedItemContent);

    dragItem.current = null;
    dragOverItem.current = null;
    setLinks(_links);

    const updates = _links.map((link, index) =>
      supabase.from("links").update({ position: index }).eq("id", link.id)
    );
    await Promise.all(updates);
  };

  // ==========================================
  // 5. LÓGICA VISUAL DO CELULAR E TEMAS
  // ==========================================
  const currentTheme = profile?.theme || "light";

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
      case "dark":
        return "!bg-[#1A1A1A]";
      case "sunset":
        return "!bg-gradient-to-br !from-orange-400 !to-pink-600";
      case "ocean":
        return "!bg-gradient-to-br !from-sky-400 !to-blue-700";
      case "forest":
        return "!bg-gradient-to-br !from-emerald-400 !to-teal-700";
      case "berry":
        return "!bg-gradient-to-br !from-rose-400 !to-purple-700";
      case "midnight":
        return "!bg-[#0B1021]";
      case "monochrome":
        return "!bg-zinc-500";
      default:
        return "!bg-gray-50";
    }
  };

  const getDynamicStyle = () => {
    let styles: any = { scrollbarWidth: "none", msOverflowStyle: "none" };
    if (currentTheme.startsWith("#")) {
      styles.backgroundColor = currentTheme;
    } else if (currentTheme.startsWith("gradient:")) {
      const colors = currentTheme.replace("gradient:", "").split(",");
      styles.backgroundImage = `linear-gradient(to bottom right, ${colors[0]}, ${colors[1]})`;
    }
    return styles;
  };

  // --- TELA DE LOADING ---
  if (loading) {
    return (
      <div className="!min-h-screen !bg-[#F6F7F5] !flex !items-center !justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  // ==========================================
  // RENDERIZAÇÃO PRINCIPAL
  // ==========================================
  return (
    <div className="!min-h-screen !bg-[#F6F7F5] !flex !flex-col !font-sans !text-black !overflow-x-hidden !relative">
      
      {/* 👇 BLOQUEIO DO OVERSCROLL 👇 */}
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          background-color: #F6F7F5;
          overscroll-behavior: none;
          margin: 0;
          padding: 0;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}} />

      {/* MODAL DE EXCLUSÃO DE LINKS */}
      {linkToDelete && (
        <div className="!fixed !inset-0 !bg-black/50 !z-[100] !flex !items-center !justify-center !p-4 !backdrop-blur-sm">
          <div className="!bg-white !w-full !max-w-md !rounded-3xl !p-8 !shadow-2xl !flex !flex-col !items-center !text-center !animate-in !fade-in !zoom-in duration-200">
            <div className="!w-16 !h-16 !bg-red-100 !text-red-500 !rounded-full !flex !items-center !justify-center !mb-6">
              <svg
                className="!w-8 !h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
            </div>
            <h3 className="!text-[22px] !font-bold !text-gray-900 !mb-2">
              Excluir Link
            </h3>
            <p className="!text-[15px] !text-gray-500 !mb-8">
              Tem certeza que deseja excluir permanentemente este link? Essa
              ação não pode ser desfeita.
            </p>
            <div className="!w-full !flex !gap-4">
              <button
                onClick={() => setLinkToDelete(null)}
                className="!flex-1 !py-3.5 !bg-gray-100 hover:!bg-gray-200 !text-gray-900 !font-bold !text-[15px] !rounded-full !transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="!flex-1 !py-3.5 !bg-red-500 hover:!bg-red-600 !text-white !font-bold !text-[15px] !rounded-full !transition-colors"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAVEGAÇÃO SUPERIOR */}
      <nav className="!w-full !bg-white border-b border-gray-200 !sticky !top-0 !z-50 !h-20 !flex !items-center !justify-between !px-6 lg:!px-10">
        <div className="!flex !items-center !gap-8 !h-full">
          <div className="!flex !items-center !gap-2 !cursor-pointer !font-bold !text-2xl !tracking-tight">
            BioFlow
            <svg
              className="!w-6 !h-6 !mt-0.5 !text-sky-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </div>
          <div className="!hidden md:!flex !items-center !gap-6 !text-[15px] !font-semibold !text-gray-500 !h-full">
            <button
              onClick={() => setActiveTab("links")}
              className={`!h-full !px-1 !pt-1 border-b-2 transition-colors ${
                activeTab === "links"
                  ? "!text-black !border-black"
                  : "!border-transparent hover:!text-black"
              }`}
            >
              Links
            </button>
            <button
              onClick={() => setActiveTab("appearance")}
              className={`!h-full !px-1 !pt-1 border-b-2 transition-colors ${
                activeTab === "appearance"
                  ? "!text-black !border-black"
                  : "!border-transparent hover:!text-black"
              }`}
            >
              Aparência
            </button>
            <button
              onClick={() => setActiveTab("config")}
              className={`!h-full !px-1 !pt-1 border-b-2 transition-colors ${
                activeTab === "config"
                  ? "!text-black !border-black"
                  : "!border-transparent hover:!text-black"
              }`}
            >
              Configurações
            </button>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="!text-[15px] !font-semibold !bg-gray-100 hover:!bg-gray-200 !text-black !px-5 !py-2.5 !rounded-full !transition-colors"
        >
          Sair
        </button>
      </nav>

      {/* ÁREA DE TRABALHO PRINCIPAL */}
      <div className="!flex-1 !w-full !max-w-[1200px] !mx-auto !flex !flex-col md:!flex-row !p-6 lg:!p-10 !gap-10 !items-start">
        
        {/* ==================================================== */}
        {/* LADO ESQUERDO (CONTEÚDO DINÂMICO DAS ABAS)             */}
        {/* ==================================================== */}
        <div className="!flex-1 !min-w-0 !flex !flex-col !gap-6">
          
          {/* MENSAGENS DE SUCESSO/ERRO GLOBAIS */}
          {errorMsg && (
            <div className="!w-full !bg-red-50 border border-red-200 !text-red-600 !px-4 !py-3 !rounded-xl !flex !items-center !gap-3 !text-[15px] !font-medium">
              <svg
                className="!w-5 !h-5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="!w-full !bg-emerald-50 border border-emerald-200 !text-emerald-600 !px-4 !py-3 !rounded-xl !flex !items-center !gap-3 !text-[15px] !font-medium">
              <svg
                className="!w-5 !h-5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM13.707 5.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L8 10.586l4.293-4.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {successMsg}
            </div>
          )}

          {/* ========================================== */}
          {/* ABA: LINKS                                 */}
          {/* ========================================== */}
          {activeTab === "links" && (
            <div className="!bg-white !p-8 !rounded-3xl border border-gray-200 shadow-sm">
              <h2 className="!text-[28px] !font-bold !text-black !mb-6 !font-sans">
                Adicionar Links
              </h2>
              
              {!isAdding ? (
                <button
                  onClick={() => setIsAdding(true)}
                  className="!w-full !py-4 !bg-sky-500 hover:!bg-sky-600 !text-white !font-bold !text-[16px] !rounded-full !transition-colors !flex !items-center !justify-center !gap-2 !font-sans"
                >
                  <svg
                    className="!w-5 !h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                  Adicionar Novo Link
                </button>
              ) : (
                <form
                  onSubmit={handleSaveLink}
                  className="!w-full !bg-gray-50 !p-6 !rounded-2xl border border-gray-200 !flex !flex-col !gap-4"
                >
                  <input
                    type="text"
                    placeholder="Título (ex: Meu Instagram)"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="!w-full !h-12 !px-4 !rounded-xl border border-gray-300 focus:outline-none focus:border-sky-500 !text-[16px]"
                  />
                  <input
                    type="url"
                    placeholder="URL (ex: https://instagram.com/...)"
                    required
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value.replace(/\s+/g, ''))}
                    className="!w-full !h-12 !px-4 !rounded-xl border border-gray-300 focus:outline-none focus:border-sky-500 !text-[16px]"
                  />
                  <div className="!flex !justify-end !gap-3 !mt-2">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="!px-6 !py-2.5 !bg-gray-200 hover:!bg-gray-300 !text-black !font-bold !text-[15px] !rounded-full !transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={savingLink}
                      className="!px-6 !py-2.5 !bg-sky-500 hover:!bg-sky-600 !text-white !font-bold !text-[15px] !rounded-full !transition-colors disabled:opacity-50"
                    >
                      {savingLink ? "Salvando..." : "Salvar Link"}
                    </button>
                  </div>
                </form>
              )}

              <div className="!mt-8 !flex !flex-col !gap-4">
                {links.length === 0 ? (
                  <div className="!text-center !bg-gray-50 !rounded-2xl !p-10 border border-dashed border-gray-300">
                    <p className="!text-gray-500 !mt-2 !text-[15px] !font-sans">
                      Adicione seu primeiro link para exibi-lo no seu perfil BioFlow.
                    </p>
                  </div>
                ) : (
                  links.map((link, index) =>
                    editingLink === link.id ? (
                      <form
                        key={link.id}
                        onSubmit={(e) => handleUpdateLink(e, link.id)}
                        className="!w-full !bg-white !p-6 !rounded-2xl border-2 border-sky-500 shadow-md !flex !flex-col !gap-4 !transition-all"
                      >
                        <input
                          type="text"
                          required
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="!w-full !h-12 !px-4 !rounded-xl border border-gray-300 focus:outline-none focus:border-sky-500 !text-[16px]"
                        />
                        <input
                          type="url"
                          required
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value.replace(/\s+/g, ''))}
                          className="!w-full !h-12 !px-4 !rounded-xl border border-gray-300 focus:outline-none focus:border-sky-500 !text-[16px]"
                        />
                        
                        {/* ÁREA DE UPLOAD DA IMAGEM DO LINK */}
                        <div className="!flex !items-center !gap-4 !mt-2 !p-3 !bg-gray-50 !rounded-xl !border !border-gray-200">
                          <div className="!w-14 !h-14 !bg-gray-200 !rounded-xl !overflow-hidden !flex !items-center !justify-center !shrink-0 !border !border-gray-300">
                            {editImageUrl ? (
                              <img src={editImageUrl} alt="Imagem do Link" className="!w-full !h-full !object-cover" />
                            ) : (
                              <svg className="!w-6 !h-6 !text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z"/></svg>
                            )}
                          </div>
                          <div className="!flex !flex-col !gap-1.5 !flex-1">
                            <span className="!text-[14px] !font-bold !text-gray-700">Imagem ou Ícone do Link</span>
                            <div className="!flex !gap-2 !items-center">
                              <button
                                type="button"
                                onClick={() => document.getElementById(`link-image-upload-${link.id}`)?.click()}
                                disabled={uploadingLinkImage}
                                className="!text-[13px] !bg-white border border-gray-300 hover:!bg-gray-50 !text-black !font-bold !px-3 !py-1.5 !rounded-lg !transition-colors"
                              >
                                {uploadingLinkImage ? "Enviando..." : "Definir Imagem"}
                              </button>
                              {editImageUrl && (
                                <button
                                  type="button"
                                  onClick={() => setEditImageUrl("")}
                                  className="!text-[13px] !bg-red-50 hover:!bg-red-100 !text-red-500 !font-bold !px-3 !py-1.5 !rounded-lg !transition-colors"
                                >
                                  Remover
                                </button>
                              )}
                            </div>
                            <input
                              id={`link-image-upload-${link.id}`}
                              type="file"
                              accept="image/*"
                              className="!hidden"
                              onChange={handleLinkImageUpload}
                            />
                          </div>
                        </div>

                        <div className="!flex !justify-end !gap-3 !mt-2">
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="!px-6 !py-2.5 !bg-gray-100 hover:!bg-gray-200 !text-black !font-bold !text-[15px] !rounded-full !transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="!px-6 !py-2.5 !bg-black hover:!bg-gray-800 !text-white !font-bold !text-[15px] !rounded-full !transition-colors"
                          >
                            Atualizar
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div
                        key={link.id}
                        draggable
                        onDragStart={() => (dragItem.current = index)}
                        onDragEnter={() => (dragOverItem.current = index)}
                        onDragEnd={handleSort}
                        onDragOver={(e) => e.preventDefault()}
                        className="!w-full !bg-white !p-5 !rounded-2xl border border-gray-200 shadow-sm !flex !items-center !justify-between hover:shadow-md !transition-all active:!scale-[0.99] active:!shadow-inner !bg-opacity-95"
                      >
                        <div className="!flex !items-center !truncate !mr-4 !w-full">
                          <div className="!text-gray-300 !cursor-grab active:!cursor-grabbing hover:!text-gray-500 !mr-4 !shrink-0">
                            <svg
                              className="!w-6 !h-6"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M9 5a2 2 0 11-4 0 2 2 0 014 0zM9 12a2 2 0 11-4 0 2 2 0 014 0zM9 19a2 2 0 11-4 0 2 2 0 014 0zM19 5a2 2 0 11-4 0 2 2 0 014 0zM19 12a2 2 0 11-4 0 2 2 0 014 0zM19 19a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          
                          {/* MINIATURA DA IMAGEM NA LISTA */}
                          {link.image_url ? (
                            <img src={link.image_url} alt={link.title} className="!w-[42px] !h-[42px] !rounded-lg !object-cover !mr-4 !shrink-0 !border !border-gray-200" />
                          ) : (
                            <div className="!w-[42px] !h-[42px] !rounded-lg !bg-gray-50 !border !border-gray-200 !flex !items-center !justify-center !mr-4 !shrink-0">
                               <svg className="!w-5 !h-5 !text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z"/></svg>
                            </div>
                          )}

                          <div className="!flex !flex-col !truncate">
                            <span className="!font-bold !text-[16px] !text-gray-900 !truncate">
                              {link.title}
                            </span>
                            <span className="!text-[14px] !text-gray-500 !truncate">
                              {link.url}
                            </span>
                          </div>
                        </div>
                        <div className="!flex !items-center !gap-2 sm:!gap-4 !shrink-0">
                          <button
                            onClick={() => startEditing(link)}
                            className="!p-2 !text-gray-400 hover:!text-sky-500 !transition-colors !rounded-lg hover:!bg-sky-50"
                          >
                            <svg
                              className="!w-5 !h-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              ></path>
                            </svg>
                          </button>

                          <div
                            onClick={() => toggleLinkStatus(link.id, link.is_active)}
                            className={`!w-12 !h-6 !rounded-full !p-1 !transition-colors !cursor-pointer ${
                              link.is_active ? "!bg-green-500" : "!bg-gray-300"
                            }`}
                          >
                            <div
                              className={`!w-4 !h-4 !bg-white !rounded-full !transition-transform ${
                                link.is_active ? "!translate-x-6" : "!translate-x-0"
                              }`}
                            ></div>
                          </div>

                          <button
                            onClick={() => setLinkToDelete(link.id)}
                            className="!p-2 !text-gray-400 hover:!text-red-500 !transition-colors !rounded-lg hover:!bg-red-50"
                          >
                            <svg
                              className="!w-5 !h-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    )
                   )
                  )}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* ABA: APARÊNCIA                             */}
          {/* ========================================== */}
          {activeTab === "appearance" && (
            <div className="!bg-white !p-8 !rounded-3xl border border-gray-200 shadow-sm !flex !flex-col !gap-10">
              
              {/* SESSÃO: PERFIL E CAPA */}
              <div>
                <h2 className="!text-[28px] !font-bold !text-black !font-sans !mb-6">
                  Perfil
                </h2>
                
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="!hidden"
                />
                <input
                  type="file"
                  ref={coverInputRef}
                  onChange={handleCoverUpload}
                  accept="image/*"
                  className="!hidden"
                />

                <div className="!flex !flex-col sm:!flex-row !gap-8 !items-center">
                  <div className="!relative !group">
                    <div className="!w-24 !h-24 !bg-gray-100 !rounded-full !border-2 !border-gray-200 !flex !items-center !justify-center !overflow-hidden">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Avatar"
                          className="!w-full !h-full !object-cover"
                        />
                      ) : (
                        <svg
                          className="!w-12 !h-12 !text-gray-300 !mt-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      )}
                    </div>
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="!absolute !bottom-0 !right-0 !bg-sky-500 hover:!bg-sky-600 !text-white !p-2 !rounded-full !shadow-lg hover:!scale-110 disabled:!opacity-50 !transition-transform"
                    >
                      {profile?.avatar_url ? (
                        <svg
                          className="!w-4 !h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="!w-4 !h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 4v16m8-8H4"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="!flex-1 !flex !flex-col !gap-3">
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="!bg-sky-500 !text-white !font-bold !py-3 !px-6 !rounded-full !w-full sm:!w-max hover:!bg-sky-600 disabled:!opacity-50 !transition-colors !text-[15px]"
                    >
                      {uploadingAvatar ? "Carregando..." : "Alterar foto"}
                    </button>
                    <button
                      onClick={handleRemoveAvatar}
                      disabled={uploadingAvatar || !profile?.avatar_url}
                      className="!bg-gray-100 !text-gray-600 !font-bold !py-3 !px-6 !rounded-full !w-full sm:!w-max hover:!bg-gray-200 disabled:!opacity-50 disabled:!cursor-not-allowed !transition-colors !text-[15px]"
                    >
                      Remover
                    </button>
                  </div>
                </div>

                <div className="!border-t !border-gray-100 !pt-8 !mt-8">
                  <h3 className="!font-bold !text-xl !mb-4">Foto de Capa</h3>
                  {profile?.cover_url ? (
                    <div className="!flex !flex-col !gap-4">
                      <div className="!w-full !h-32 !rounded-2xl !overflow-hidden !border !border-gray-200 !shadow-sm !relative">
                        <img
                          src={profile.cover_url}
                          alt="Cover"
                          className="!w-full !h-full !object-cover"
                        />
                        <div className="!absolute !inset-0 !bg-black/20 !flex !items-center !justify-center !opacity-0 hover:!opacity-100 !transition-opacity">
                          <button
                            onClick={() => coverInputRef.current?.click()}
                            className="!bg-white !text-black !font-bold !px-6 !py-2 !rounded-full !shadow-lg hover:!scale-105 !transition-transform !text-[15px]"
                          >
                            {uploadingCover ? "Carregando..." : "Alterar Capa"}
                          </button>
                        </div>
                      </div>
                      <div className="!flex !justify-end">
                        <button
                          onClick={handleRemoveCover}
                          disabled={uploadingCover}
                          className="!text-red-500 !font-bold hover:!text-red-600 !text-[15px]"
                        >
                          Remover capa
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => coverInputRef.current?.click()}
                      className={`!w-full !h-32 !bg-gray-50 !rounded-2xl !border-2 !border-dashed !border-gray-300 !flex !flex-col !items-center !justify-center !gap-2 hover:!bg-gray-100 !cursor-pointer !transition-colors ${
                        uploadingCover ? "!opacity-50 !pointer-events-none" : ""
                      }`}
                    >
                      <svg
                        className="!w-8 !h-8 !text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <span className="!text-[15px] !text-gray-500 !font-bold">
                        {uploadingCover
                          ? "Enviando..."
                          : "Adicionar Imagem de Capa"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* SESSÃO: TEMAS E CORES */}
              <div className="!border-t !border-gray-100 !pt-8">
                <h3 className="!font-bold !text-[22px] !mb-2">Temas e Cores</h3>
                <p className="!text-gray-500 !text-[15px] !mb-6">
                  Escolha um estilo visual ou crie a sua própria cor personalizada.
                </p>

                <div className="!grid !grid-cols-2 md:!grid-cols-4 !gap-4 !mb-8">
                  {/* Tema: Claro */}
                  <div
                    onClick={() => handleUpdateTheme("light")}
                    className={`!cursor-pointer !rounded-2xl !p-2 !border-2 !transition-all hover:!scale-105 ${
                      currentTheme === "light"
                        ? "!border-sky-500"
                        : "!border-transparent"
                    }`}
                  >
                    <div className="!w-full !h-24 !bg-gray-50 !border !border-gray-200 !rounded-xl !flex !items-center !justify-center">
                      <div className="!w-1/2 !h-3 !bg-gray-300 !rounded-full"></div>
                    </div>
                    <p className="!text-center !text-[15px] !font-bold !mt-2">
                      Claro
                    </p>
                  </div>

                  {/* Tema: Escuro */}
                  <div
                    onClick={() => handleUpdateTheme("dark")}
                    className={`!cursor-pointer !rounded-2xl !p-2 !border-2 !transition-all hover:!scale-105 ${
                      currentTheme === "dark"
                        ? "!border-sky-500"
                        : "!border-transparent"
                    }`}
                  >
                    <div className="!w-full !h-24 !bg-[#1A1A1A] !rounded-xl !flex !items-center !justify-center">
                      <div className="!w-1/2 !h-3 !bg-gray-600 !rounded-full"></div>
                    </div>
                    <p className="!text-center !text-[15px] !font-bold !mt-2">
                      Escuro
                    </p>
                  </div>

                  {/* Tema: Sunset */}
                  <div
                    onClick={() => handleUpdateTheme("sunset")}
                    className={`!cursor-pointer !rounded-2xl !p-2 !border-2 !transition-all hover:!scale-105 ${
                      currentTheme === "sunset"
                        ? "!border-sky-500"
                        : "!border-transparent"
                    }`}
                  >
                    <div className="!w-full !h-24 !bg-gradient-to-br !from-orange-400 !to-pink-600 !rounded-xl !flex !items-center !justify-center">
                      <div className="!w-1/2 !h-3 !bg-white/30 !rounded-full"></div>
                    </div>
                    <p className="!text-center !text-[15px] !font-bold !mt-2">
                      Sunset
                    </p>
                  </div>

                  {/* Tema: Ocean */}
                  <div
                    onClick={() => handleUpdateTheme("ocean")}
                    className={`!cursor-pointer !rounded-2xl !p-2 !border-2 !transition-all hover:!scale-105 ${
                      currentTheme === "ocean"
                        ? "!border-sky-500"
                        : "!border-transparent"
                    }`}
                  >
                    <div className="!w-full !h-24 !bg-gradient-to-br !from-sky-400 !to-blue-700 !rounded-xl !flex !items-center !justify-center">
                      <div className="!w-1/2 !h-3 !bg-white/30 !rounded-full"></div>
                    </div>
                    <p className="!text-center !text-[15px] !font-bold !mt-2">
                      Ocean
                    </p>
                  </div>

                  {/* Tema: Forest */}
                  <div
                    onClick={() => handleUpdateTheme("forest")}
                    className={`!cursor-pointer !rounded-2xl !p-2 !border-2 !transition-all hover:!scale-105 ${
                      currentTheme === "forest"
                        ? "!border-sky-500"
                        : "!border-transparent"
                    }`}
                  >
                    <div className="!w-full !h-24 !bg-gradient-to-br !from-emerald-400 !to-teal-700 !rounded-xl !flex !items-center !justify-center">
                      <div className="!w-1/2 !h-3 !bg-white/30 !rounded-full"></div>
                    </div>
                    <p className="!text-center !text-[15px] !font-bold !mt-2">
                      Forest
                    </p>
                  </div>

                  {/* Tema: Berry */}
                  <div
                    onClick={() => handleUpdateTheme("berry")}
                    className={`!cursor-pointer !rounded-2xl !p-2 !border-2 !transition-all hover:!scale-105 ${
                      currentTheme === "berry"
                        ? "!border-sky-500"
                        : "!border-transparent"
                    }`}
                  >
                    <div className="!w-full !h-24 !bg-gradient-to-br !from-rose-400 !to-purple-700 !rounded-xl !flex !items-center !justify-center">
                      <div className="!w-1/2 !h-3 !bg-white/30 !rounded-full"></div>
                    </div>
                    <p className="!text-center !text-[15px] !font-bold !mt-2">
                      Berry
                    </p>
                  </div>

                  {/* Tema: Midnight */}
                  <div
                    onClick={() => handleUpdateTheme("midnight")}
                    className={`!cursor-pointer !rounded-2xl !p-2 !border-2 !transition-all hover:!scale-105 ${
                      currentTheme === "midnight"
                        ? "!border-sky-500"
                        : "!border-transparent"
                    }`}
                  >
                    <div className="!w-full !h-24 !bg-[#0B1021] !rounded-xl !flex !items-center !justify-center">
                      <div className="!w-1/2 !h-3 !bg-white/10 !rounded-full"></div>
                    </div>
                    <p className="!text-center !text-[15px] !font-bold !mt-2">
                      Midnight
                    </p>
                  </div>

                  {/* Tema: Monochrome */}
                  <div
                    onClick={() => handleUpdateTheme("monochrome")}
                    className={`!cursor-pointer !rounded-2xl !p-2 !border-2 !transition-all hover:!scale-105 ${
                      currentTheme === "monochrome"
                        ? "!border-sky-500"
                        : "!border-transparent"
                    }`}
                  >
                    <div className="!w-full !h-24 !bg-zinc-500 !rounded-xl !flex !items-center !justify-center">
                      <div className="!w-1/2 !h-3 !bg-white/40 !rounded-full"></div>
                    </div>
                    <p className="!text-center !text-[15px] !font-bold !mt-2">
                      Monochrome
                    </p>
                  </div>
                </div>

                <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-6">
                  
                  {/* Bloco: Cor Sólida Personalizada */}
                  <div className="!bg-gray-50 !p-6 !rounded-2xl !border !border-gray-200">
                    <h4 className="!font-bold !text-[16px] !mb-2">Cor Sólida</h4>
                    <p className="!text-[14px] !text-gray-500 !mb-4">
                      Escolha a cor da sua marca.
                    </p>
                    <div className="!flex !items-center !gap-4">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="!w-14 !h-14 !p-1 !rounded-xl !cursor-pointer !bg-white !border !border-gray-300"
                      />
                      <button
                        onClick={() => handleUpdateTheme(customColor)}
                        className="!bg-black hover:!bg-gray-800 !text-white !font-bold !py-3 !px-6 !rounded-full !transition-colors !text-[15px]"
                      >
                        Aplicar Cor
                      </button>
                    </div>
                  </div>

                  {/* Bloco: Gradiente Personalizado */}
                  <div className="!bg-gray-50 !p-6 !rounded-2xl !border !border-gray-200">
                    <h4 className="!font-bold !text-[16px] !mb-2">Gradiente Personalizado</h4>
                    <p className="!text-[14px] !text-gray-500 !mb-4">
                      Misture duas cores únicas.
                    </p>
                    <div className="!flex !items-center !gap-4">
                      <div className="!flex !gap-1">
                        <input
                          type="color"
                          value={customGrad1}
                          onChange={(e) => setCustomGrad1(e.target.value)}
                          className="!w-10 !h-14 !p-1 !rounded-xl !cursor-pointer !bg-white !border !border-gray-300"
                        />
                        <input
                          type="color"
                          value={customGrad2}
                          onChange={(e) => setCustomGrad2(e.target.value)}
                          className="!w-10 !h-14 !p-1 !rounded-xl !cursor-pointer !bg-white !border !border-gray-300"
                        />
                      </div>
                      <button
                        onClick={() =>
                          handleUpdateTheme(
                            `gradient:${customGrad1},${customGrad2}`
                          )
                        }
                        className="!bg-black hover:!bg-gray-800 !text-white !font-bold !py-3 !px-6 !rounded-full !transition-colors !text-[15px]"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* ABA: CONFIGURAÇÕES                         */}
          {/* ========================================== */}
          {activeTab === "config" && (
            <div className="!bg-white !p-8 !rounded-3xl border border-gray-200 shadow-sm !flex !flex-col !gap-10">
              
              <div>
                <h2 className="!text-[28px] !font-bold !text-black !font-sans !mb-2">
                  Informações do Perfil
                </h2>
                <p className="!text-gray-500 !mb-6 !text-[15px]">
                  Edite o seu nome de usuário público e a sua biografia.
                </p>

                <form
                  onSubmit={handleUpdateProfile}
                  className="!flex !flex-col !gap-5"
                >
                  <div className="!flex !flex-col !gap-2">
                    <label className="!font-bold !text-[15px] !text-gray-700">
                      Nome de Exibição
                    </label>
                    <input
                      type="text"
                      placeholder="Seu nome ou nome da marca"
                      value={editDisplayName}
                      onChange={(e) => setEditDisplayName(e.target.value)}
                      className="!w-full !h-12 !px-4 !rounded-xl border border-gray-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 !transition-all !bg-white !text-black !font-semibold !text-[16px]"
                    />
                    <span className="!text-[13px] !text-gray-500">
                      Este é o nome que aparece grande no seu perfil. Aceita espaços e maiúsculas.
                    </span>
                  </div>

                  <div className="!flex !flex-col !gap-2">
                    <label className="!font-bold !text-[15px] !text-gray-700">
                      Nome de Usuário (URL)
                    </label>
                    <div className="!flex !items-center !w-full !h-12 !px-4 !rounded-xl border border-gray-300 focus-within:!border-sky-500 focus-within:!ring-1 focus-within:!ring-sky-500 !transition-all !bg-white">
                      <span className="!text-gray-400 !font-semibold !mr-1 !text-[16px]">
                        bioflow.com/
                      </span>
                      <input
                        type="text"
                        required
                        value={editUsername}
                        onChange={(e) =>
                          setEditUsername(
                            e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, "")
                              .replace(/[^a-z0-9_.-]/g, "")
                          )
                        }
                        className="!w-full !h-full !bg-transparent focus:!outline-none !text-black !font-semibold !text-[16px]"
                      />
                    </div>
                    <span className="!text-[13px] !text-gray-500">
                      Este é o link que você compartilha. Não pode conter espaços ou letras maiúsculas.
                    </span>
                  </div>

                  <div className="!flex !flex-col !gap-2">
                    <label className="!font-bold !text-[15px] !text-gray-700">
                      Biografia
                    </label>
                    <textarea
                      rows={3}
                      maxLength={150}
                      placeholder="Conte ao mundo quem você é..."
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="!w-full !p-4 !rounded-xl border border-gray-300 focus:!outline-none focus:!border-sky-500 focus:!ring-1 focus:!ring-sky-500 !resize-none !text-[16px]"
                    />
                    <span className="!text-[13px] !text-gray-400 !self-end">
                      {editBio.length}/150
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile || !editUsername}
                    className="!w-full md:!w-max !self-end !px-8 !py-3.5 !bg-sky-500 hover:!bg-sky-600 !text-white !font-bold !rounded-full !transition-colors disabled:!opacity-50 !text-[15px]"
                  >
                    {savingProfile ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </form>
              </div>

              <div className="!border-t !border-gray-100 !pt-8">
                <h2 className="!text-[22px] !font-bold !text-black !font-sans !mb-2">
                  Compartilhar Perfil
                </h2>
                <p className="!text-gray-500 !mb-6 !text-[15px]">
                  Copie o link abaixo para adicionar na bio do seu Instagram ou TikTok.
                </p>

                <div className="!flex !items-center !gap-3 !bg-gray-50 !p-2 !rounded-xl border border-gray-200">
                  <div className="!flex-1 !px-3 !truncate !text-gray-600 !font-medium !text-[15px]">
                    {typeof window !== "undefined"
                      ? `${window.location.origin}/${
                          profile?.username
                            ?.toLowerCase()
                            .replace(/[^a-z0-9_.-]/g, "") || ""
                        }`
                      : `bioflow.com/${
                          profile?.username
                            ?.toLowerCase()
                            .replace(/[^a-z0-9_.-]/g, "") || ""
                        }`}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="!shrink-0 !bg-black hover:!bg-gray-800 !text-white !font-bold !py-2.5 !px-6 !rounded-lg !transition-colors !text-[15px]"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==================================================== */}
        {/* LADO DIREITO (CELULAR VIRTUAL DE PREVIEW)            */}
        {/* ==================================================== */}
        <div className="!w-[340px] !shrink-0 !flex !justify-center !sticky !top-28">
          <div className="!w-[320px] !h-[640px] border-[12px] border-black !rounded-[45px] !bg-white shadow-2xl !relative !overflow-hidden !flex !flex-col !items-center !px-0">
            
            {/* "Notch" do Celular */}
            <div className="!absolute !top-0 !inset-x-0 !h-6 !w-36 !bg-black !mx-auto !rounded-b-2xl z-20"></div>

            {/* Tela Interna com Tema Dinâmico */}
            <div
              className={`!w-full !h-full !flex !flex-col !items-center !text-center !overflow-y-auto relative z-0 ${getThemeBackgroundClass()}`}
              style={getDynamicStyle()}
            >
              
              {/* Cover */}
              <div
                className={`!w-full !h-32 ${
                  darkTextNeeded ? "!bg-white/10" : "!bg-gray-100"
                } !relative !shrink-0`}
              >
                {profile?.cover_url && (
                  <img
                    src={profile.cover_url}
                    alt="Capa"
                    className="!w-full !h-full !object-cover"
                  />
                )}
              </div>

              {/* Avatar */}
              <div
                className={`!w-24 !h-24 ${
                  darkTextNeeded
                    ? "!bg-gray-800 !border-[#1A1A1A]"
                    : "!bg-white !border-white"
                } !rounded-full !border-4 !shadow-sm !flex !items-center !justify-center !shrink-0 !-mt-12 !relative !z-10 !overflow-hidden`}
                style={{
                  borderColor: currentTheme.startsWith("#")
                    ? currentTheme
                    : undefined,
                }}
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="!w-full !h-full !object-cover"
                  />
                ) : (
                  <div className="!w-full !h-full !bg-gray-200 !flex !items-center !justify-center">
                    <svg
                      className="!w-14 !h-14 !text-gray-400 !mt-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Informações Pessoais - LIVE PREVIEW DO NOME DE EXIBIÇÃO */}
              <div className="!px-4 !w-full !flex !flex-col !items-center">
                <h1
                  className={`!text-[22px] !font-bold !mt-2 !mb-1 !tracking-tight !font-sans ${
                    darkTextNeeded ? "!text-white" : "!text-gray-900"
                  }`}
                >
                  {/* LIVE PREVIEW: Se estiver digitando, mostra. Senão, mostra o salvo. */}
                  {(activeTab === "config" ? editDisplayName : profile?.display_name) ||
                   (activeTab === "config" ? editUsername : profile?.username) ||
                   "Seu Nome"}
                </h1>
                
                <p
                  className={`!text-[15px] !mb-6 !max-w-[260px] !break-words !font-sans ${
                    darkTextNeeded ? "!text-white/80" : "!text-gray-600"
                  }`}
                >
                  {/* LIVE PREVIEW: Biografia */}
                  {(activeTab === "config" ? editBio : profile?.bio) || "Sua biografia aparecerá aqui."}
                </p>

                {/* Lista de Links Renderizados no Preview */}
                <div className="!w-full !flex !flex-col !gap-3 !pb-24">
                  {links
                    .filter((l) => l.is_active)
                    .map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`!w-full !py-3.5 !px-4 !rounded-xl !text-[15px] !font-semibold shadow-sm !transition-colors !truncate !flex !items-center !justify-center !relative ${
                          darkTextNeeded
                            ? "!bg-white/10 !text-white hover:!bg-white/20 !border !border-white/10"
                            : "!bg-white !text-gray-800 hover:!bg-gray-50 border border-gray-200"
                        }`}
                      >
                        {link.image_url && (
                          <img src={link.image_url} className="!w-6 !h-6 !rounded-md !object-cover !absolute !left-3" alt="" />
                        )}
                        {link.title}
                      </a>
                    ))}

                  {/* Skeleton Animado (se não houver links ativos) */}
                  {links.filter((l) => l.is_active).length === 0 && (
                    <div
                      className={`!w-full !h-12 !rounded-xl animate-pulse ${
                        darkTextNeeded ? "!bg-white/10" : "!bg-gray-100"
                      }`}
                    ></div>
                  )}
                </div>
              </div>

              {/* BRANDING FOOTER / MARCA D'ÁGUA (PLG) */}
              <div className="!absolute !bottom-4 !inset-x-0 !flex !justify-center !z-20">
                <div
                  className={`!backdrop-blur-md !px-4 !py-2 !rounded-full !shadow-lg !flex !items-center !gap-2 !cursor-pointer hover:!scale-105 !transition-transform ${
                    darkTextNeeded
                      ? "!bg-black/40 !border !border-white/10"
                      : "!bg-white/90 !border !border-gray-200"
                  }`}
                >
                  <svg
                    className="!w-4 !h-4 !text-sky-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  <span
                    className={`!text-[11px] !font-bold !font-sans ${
                      darkTextNeeded ? "!text-white" : "!text-black"
                    }`}
                  >
                    Crie seu BioFlow
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}