import React, { useState } from "react";
import "./navbar.css";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function Navbar({ onFilterMyPets, showMyPetsOnly }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    };

    const handleFilterClick = () => {
        if (onFilterMyPets) {
            onFilterMyPets();
        }
        setIsMenuOpen(false);
    };

    const handleHelpClick = () => {
        navigate('/help');
        setIsMenuOpen(false);
    };

    const handleProfileClick = () => {
        navigate('/profile');
        setIsMenuOpen(false);
    };

    return (
        <>
            <header className="navbar">
                <div style={{ fontWeight: '900', fontSize: '20px' }}>CONECT PET</div>

                <button className="menu-icon" onClick={() => setIsMenuOpen(true)}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="11" fill="#A35E49" stroke="black" strokeWidth="2" />
                        <path d="M6 8H18" stroke="black" strokeWidth="2" strokeLinecap="round" />
                        <path d="M6 12H18" stroke="black" strokeWidth="2" strokeLinecap="round" />
                        <path d="M6 16H18" stroke="black" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </header>

            {isMenuOpen && (
                <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}>
                    <div className="sidebar-content" onClick={e => e.stopPropagation()}>

                        {/* Botão Fechar */}
                        <div className="sidebar-header">
                            <button className="close-menu" onClick={() => setIsMenuOpen(false)}>
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                            </button>
                        </div>

                        {/* Opções do Menu */}
                        <div className="sidebar-options-top">
                            <button className="sidebar-btn" onClick={handleProfileClick}>
                                Minha conta
                            </button>

                            <button
                                className="sidebar-btn"
                                onClick={handleFilterClick}
                                style={showMyPetsOnly ? { backgroundColor: '#A35E49', color: '#F7EEDD' } : {}}
                            >
                                {showMyPetsOnly ? "Mostrar Todos" : "Meus Pets"}
                            </button>

                            <button className="sidebar-btn" onClick={handleHelpClick}>
                                Ajuda
                            </button>
                        </div>

                        <div className="sidebar-options-bottom">
                            <button className="sidebar-btn sidebar-logout" onClick={handleLogout}>
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}