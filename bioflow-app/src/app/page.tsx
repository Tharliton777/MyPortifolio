"use client";
import { useState } from "react";
// Importações de ícones padronizadas para Font Awesome e Feather Icons
import { 
  FaYoutube, 
  FaLinkedin, 
  FaInstagram, 
  FaTiktok, 
  FaGithub, 
  FaFolderOpen, 
  FaLink, 
  FaDumbbell 
} from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";

export default function Home() {
  const [isLightMode, setIsLightMode] = useState(false);

  const toggleMode = () => {
    setIsLightMode(!isLightMode);
  };

  return (
    <main className={isLightMode ? "light" : ""}>
      
      <div className="capa-fundo"></div>

      <div id="container">
        <div id="profile">
          <img 
            src={isLightMode ? "/assets/profile-light.png" : "/assets/profile-root-black-mode.png"} 
            alt="Foto de perfil" 
          />
          <p>@sr_tharliton.flk</p>
        </div>

        <div id="switch" onClick={toggleMode}>
          <button>
            {/* CORREÇÃO: Passando a cor direto no componente para vencer o CSS global */}
            {isLightMode ? <FiSun size={18} color="#ff9f43" /> : <FiMoon size={18} color="#1a1a1a" />}
          </button>
          <span></span>
        </div>

        <ul>
          <li>
            <a href="#" target="_blank">
              Inscreva-se no canal
              <FaYoutube color="#FF0000" size={20} />
            </a>
          </li>
          <li>
            <a href="#" target="_blank">
              Portfólio
              <FaFolderOpen size={20} />
            </a>
          </li>
          <li>
            <a href="#" target="_blank">
              Serviços Linkup
              <FaLink size={20} />
            </a>
          </li>
          <li>
            <a href="#" target="_blank">
              Cupom Growth Suplements
              <FaDumbbell color="#22c55e" size={20} />
            </a>
          </li>
        </ul>

        <div id="social-links">
          <a href="https://github.com/Tharliton777" target="_blank"><FaGithub /></a>
          <a href="https://www.linkedin.com/in/tharliton-duarte-6219aa22b/" target="_blank"><FaLinkedin /></a>
          <a href="https://www.instagram.com/tharliton_flk/" target="_blank"><FaInstagram /></a>
          <a href="https://www.tiktok.com/@duarte_777_" target="_blank"><FaTiktok /></a>
        </div>

        <footer>Todos os direitos reservados.</footer>
      </div>
    </main>
  );
}