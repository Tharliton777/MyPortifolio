"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  created_at: string;
  is_blocked: boolean;
  is_verified: boolean;
  plan_type: string;
}

export default function AdminDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); 
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalLinks: 0,
    activePercent: 0,
    blockedUsers: 0,
    proUsers: 0
  });

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  async function checkAdminAndLoadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
    if (!profile?.is_admin) { router.push("/dashboard"); return; }

    setIsAdmin(true);

    // Métricas Avançadas
    const { count: uCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
    const { count: lCount } = await supabase.from("links").select("*", { count: "exact", head: true });
    const { count: bCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_blocked", true);
    const { count: pCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("plan_type", "pro");

    setMetrics({
      totalUsers: uCount || 0,
      totalLinks: lCount || 0,
      blockedUsers: bCount || 0,
      proUsers: pCount || 0,
      activePercent: uCount ? Math.round(((uCount - (bCount || 0)) / uCount) * 100) : 0
    });

    const { data: usersData } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (usersData) setUsers(usersData);

    setLoading(false);
  }

  // --- FUNÇÕES DE CONTROLE TOTAL ---

  const updateProfile = async (userId: string, data: Partial<UserProfile>) => {
    const { error } = await supabase.from("profiles").update(data).eq("id", userId);
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, ...data } : u));
    }
  };

  const exportLeads = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Username,Display Name,Plan,Verified,Created At\n"
      + users.map(u => `${u.username},${u.display_name},${u.plan_type},${u.is_verified},${u.created_at}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bioflow_leads.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return (
    <div className="!min-h-screen !bg-black !flex !items-center !justify-center">
      <div className="!animate-spin !rounded-full !h-12 !w-12 !border-t-2 !border-sky-500"></div>
    </div>
  );

  return (
    <div className="!min-h-screen !bg-[#0a0a0a] !flex !font-sans !text-white !overflow-hidden">
      
      {/* SIDEBAR GIGANTE */}
      <aside className="!w-64 !bg-[#111] !border-r !border-white/10 !flex !flex-col !p-6 !gap-8 !hidden md:!flex !shrink-0">
        <div className="!flex !items-center !gap-2 !font-bold !text-xl !text-sky-500">
           BioFlow <span className="!text-white">Admin Pro</span>
        </div>

        <nav className="!flex !flex-col !gap-2">
          <button onClick={() => setActiveTab("overview")} className={`!flex !items-center !gap-3 !px-4 !py-3 !rounded-xl !text-sm !font-semibold !transition-all ${activeTab === "overview" ? "!bg-sky-500 !text-white" : "!text-gray-400 hover:!bg-white/5"}`}>
             Growth & Métricas
          </button>
          <button onClick={() => setActiveTab("users")} className={`!flex !items-center !gap-3 !px-4 !py-3 !rounded-xl !text-sm !font-semibold !transition-all ${activeTab === "users" ? "!bg-sky-500 !text-white" : "!text-gray-400 hover:!bg-white/5"}`}>
             Gestão de Membros
          </button>
          <button onClick={() => setActiveTab("database")} className={`!flex !items-center !gap-3 !px-4 !py-3 !rounded-xl !text-sm !font-semibold !transition-all ${activeTab === "database" ? "!bg-sky-500 !text-white" : "!text-gray-400 hover:!bg-white/5"}`}>
             Engenharia
          </button>
        </nav>

        <div className="!mt-auto !pt-6 !border-t !border-white/10">
            <button onClick={handleLogout} className="!w-full !flex !items-center !gap-3 !px-4 !py-3 !text-red-400 hover:!bg-red-400/10 !rounded-xl !text-sm !font-bold !transition-all">
                Sair
            </button>
        </div>
      </aside>

      <main className="!flex-1 !p-8 !overflow-y-auto">
        
        {/* ABA: OVERVIEW (GIGANTE) */}
        {activeTab === "overview" && (
          <div className="!animate-in !fade-in !slide-in-from-bottom-4 !duration-500">
            <div className="!flex !items-center !justify-between !mb-8">
                <div>
                    <h1 className="!text-3xl !font-bold">Dashboard Executivo</h1>
                    <p className="!text-gray-400 !mt-1">Estatísticas vitais do seu SaaS.</p>
                </div>
                <button onClick={exportLeads} className="!bg-white !text-black !font-bold !px-6 !py-3 !rounded-full hover:!bg-gray-200 !transition-all !text-sm !flex !items-center !gap-2">
                    Exportar Leads (CSV)
                </button>
            </div>
            
            <div className="!grid !grid-cols-1 md:!grid-cols-4 !gap-6 !mb-10">
              <div className="!bg-[#111] !p-6 !rounded-3xl !border !border-white/10">
                <p className="!text-gray-400 !text-xs !font-bold !mb-1 !uppercase">Usuários</p>
                <p className="!text-3xl !font-black">{metrics.totalUsers}</p>
              </div>
              <div className="!bg-[#111] !p-6 !rounded-3xl !border !border-white/10">
                <p className="!text-gray-400 !text-xs !font-bold !mb-1 !uppercase">Contas PRO</p>
                <p className="!text-3xl !font-black !text-sky-400">{metrics.proUsers}</p>
              </div>
              <div className="!bg-[#111] !p-6 !rounded-3xl !border !border-white/10">
                <p className="!text-gray-400 !text-xs !font-bold !mb-1 !uppercase">Taxa de Conversão</p>
                <p className="!text-3xl !font-black !text-emerald-400">{metrics.totalUsers ? Math.round((metrics.proUsers / metrics.totalUsers)*100) : 0}%</p>
              </div>
              <div className="!bg-[#111] !p-6 !rounded-3xl !border !border-white/10">
                <p className="!text-gray-400 !text-xs !font-bold !mb-1 !uppercase">Bloqueados</p>
                <p className="!text-3xl !font-black !text-red-500">{metrics.blockedUsers}</p>
              </div>
            </div>

            {/* Simulação de Gráfico de Tendência com CSS */}
            <div className="!bg-[#111] !border !border-white/10 !p-8 !rounded-[40px] !mb-10">
                <h3 className="!text-lg !font-bold !mb-6">Cadastros (Últimos 7 dias)</h3>
                <div className="!flex !items-end !gap-4 !h-48 !px-4">
                    {[30, 45, 25, 60, 85, 40, 100].map((val, i) => (
                        <div key={i} className="!flex-1 !flex !flex-col !items-center !gap-2">
                            <div className="!w-full !bg-sky-500/20 hover:!bg-sky-500 !rounded-t-lg !transition-all" style={{height: `${val}%`}}></div>
                            <span className="!text-[10px] !text-gray-500">Dia {i+1}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}

        {/* ABA: USUÁRIOS (COM TODOS OS PODERES) */}
        {activeTab === "users" && (
          <div className="!animate-in !fade-in !duration-300">
            <div className="!flex !items-center !justify-between !mb-8">
                <h1 className="!text-3xl !font-bold">Controle de Membros</h1>
                <input 
                    type="text" 
                    placeholder="Pesquisar @username ou Nome..." 
                    className="!bg-[#111] !border !border-white/10 !px-6 !py-3 !rounded-2xl !text-sm !w-96 focus:!border-sky-500 !outline-none"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="!bg-[#111] !rounded-[32px] !border !border-white/10 !overflow-hidden">
                <table className="!w-full !text-left">
                    <thead>
                        <tr className="!bg-white/5 !text-gray-400 !text-[10px] !uppercase !font-bold">
                            <th className="!px-6 !py-5">Usuário</th>
                            <th className="!px-6 !py-5">Selo</th>
                            <th className="!px-6 !py-5">Plano</th>
                            <th className="!px-6 !py-5">Status</th>
                            <th className="!px-6 !py-5 !text-right">Gerenciar</th>
                        </tr>
                    </thead>
                    <tbody className="!divide-y !divide-white/5">
                        {users.filter(u => u.username.includes(searchTerm) || u.display_name?.includes(searchTerm)).map(u => (
                            <tr key={u.id} className="hover:!bg-white/[0.02] !transition-colors">
                                <td className="!px-6 !py-5">
                                    <div className="!flex !items-center !gap-3">
                                        <img src={u.avatar_url || "https://ui-avatars.com/api/?name="+u.username} className="!w-9 !h-9 !rounded-full !object-cover" />
                                        <div className="!flex !flex-col !truncate !max-w-[150px]">
                                            <span className="!font-bold !text-sm">@{u.username}</span>
                                            <span className="!text-[11px] !text-gray-500">{u.display_name}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="!px-6 !py-5">
                                    <button 
                                        onClick={() => updateProfile(u.id, { is_verified: !u.is_verified })}
                                        className={`!w-8 !h-8 !rounded-full !flex !items-center !justify-center !transition-all ${u.is_verified ? "!bg-sky-500 !text-white" : "!bg-white/5 !text-gray-600 hover:!bg-white/10"}`}
                                    >
                                        <svg className="!w-4 !h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    </button>
                                </td>
                                <td className="!px-6 !py-5">
                                    <select 
                                        value={u.plan_type}
                                        onChange={(e) => updateProfile(u.id, { plan_type: e.target.value })}
                                        className="!bg-black !text-[10px] !font-bold !border !border-white/10 !rounded-md !px-2 !py-1 !outline-none"
                                    >
                                        <option value="free">FREE</option>
                                        <option value="pro">PRO</option>
                                        <option value="vip">VIP</option>
                                    </select>
                                </td>
                                <td className="!px-6 !py-5">
                                    {u.is_blocked ? 
                                        <span className="!text-[9px] !bg-red-500/20 !text-red-500 !px-2 !py-1 !rounded !font-bold">SUSPENSO</span> :
                                        <span className="!text-[9px] !bg-emerald-500/20 !text-emerald-500 !px-2 !py-1 !rounded !font-bold">ATIVO</span>
                                    }
                                </td>
                                <td className="!px-6 !py-5 !text-right !flex !justify-end !gap-2">
                                    {/* MODO FANTASMA */}
                                    <button 
                                        onClick={() => window.open(`/${u.username}`, '_blank')}
                                        className="!p-2 !bg-white/5 !rounded-lg hover:!bg-white/10 !text-gray-400"
                                        title="Ver Perfil"
                                    >
                                        <svg className="!w-4 !h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                    </button>
                                    
                                    <button 
                                        onClick={() => updateProfile(u.id, { is_blocked: !u.is_blocked })}
                                        className={`!px-3 !py-2 !rounded-lg !text-[10px] !font-bold !transition-all ${u.is_blocked ? "!bg-emerald-500 !text-white" : "!bg-red-500/10 !text-red-500 hover:!bg-red-500 hover:!text-white"}`}
                                    >
                                        {u.is_blocked ? "ATIVAR" : "BANIR"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        )}

        {/* DATABASE TAB (MESMO DA ANTERIOR) */}
        {activeTab === "database" && (
            <div className="!animate-in !fade-in !duration-300">
                <h1 className="!text-3xl !font-bold !mb-8">Acesso à Engenharia</h1>
                <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-6">
                    <a href="https://supabase.com/" target="_blank" className="!bg-[#111] !p-8 !rounded-[32px] !border !border-white/10 hover:!border-sky-500 !transition-all">
                        <h3 className="!text-xl !font-bold !mb-2">Estrutura de Perfis</h3>
                        <p className="!text-gray-500 !text-sm">Abra o Supabase para gerenciar colunas e RLS.</p>
                    </a>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}