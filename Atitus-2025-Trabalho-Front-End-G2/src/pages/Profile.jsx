import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Title, Button, Input } from "../components";

export const Profile = () => {
    const navigate = useNavigate();

    // Estados para os dados do perfil
    const [profileImage, setProfileImage] = useState(null);
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState("usuario@exemplo.com");
    const [showEmail, setShowEmail] = useState(false);

    // Novo estado para controlar a visibilidade do modal de sucesso
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSaveProfile = (e) => {
        e.preventDefault();
        // Mostra o modal customizado em vez do alert
        setShowSuccessModal(true);

        // Opcional: Esconder o modal automaticamente após alguns segundos
        // setTimeout(() => setShowSuccessModal(false), 3000);
    };

    return (
        <div className="min-h-screen bg-[#2B2B24] p-6 flex flex-col items-center relative">

            {/* Cabeçalho com Botão Voltar */}
            <div className="w-full max-w-md flex items-center mb-8 relative">
                <button
                    onClick={() => navigate('/map')}
                    className="absolute left-0 text-[#F7EEDD] hover:text-[#A35E49] transition-colors"
                >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="w-full text-center">
                    <Title title="MINHA CONTA" />
                </div>
            </div>

            {/* Container Principal */}
            <div className="w-full max-w-md bg-[#F7EEDD] p-8 border-4 border-black shadow-[10px_10px_0_0_#A35E49] text-black">

                <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">

                    {/* 1. Foto de Perfil */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 bg-gray-300 border-4 border-black overflow-hidden flex items-center justify-center relative">
                            {profileImage ? (
                                <img src={URL.createObjectURL(profileImage)} alt="Perfil" className="w-full h-full object-cover" />
                            ) : (
                                <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            )}
                        </div>

                        <input
                            id="profile-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setProfileImage(e.target.files[0])}
                        />
                        <label
                            htmlFor="profile-upload"
                            className="cursor-pointer text-sm font-bold text-[#A35E49] hover:underline uppercase"
                        >
                            Alterar Foto
                        </label>
                    </div>

                    {/* 2. E-mail com Olho (Hide/Show) */}
                    <div>
                        <label className="block text-sm font-bold mb-1 uppercase">Meu E-mail</label>
                        <div className="relative">
                            <div className="w-full h-[50px] bg-[#F7EEDD] border-[3px] border-black flex items-center px-4 text-[#2B2B24]">
                                {showEmail ? email : email.replace(/^(.{2})(.*)(@.*)$/, "$1***$3")}
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowEmail(!showEmail)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-[#A35E49]"
                            >
                                {showEmail ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* 3. Descrição do Perfil */}
                    <div>
                        <label className="block text-sm font-bold mb-1 uppercase">Sobre Mim</label>
                        <textarea
                            className="w-full min-h-[100px] bg-[#F7EEDD] border-[3px] border-black p-3 text-[#2B2B24] focus:outline-none resize-none"
                            placeholder="Escreva algo sobre você..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Botão Salvar */}
                    <div className="flex justify-center pt-4">
                        <Button type="submit">
                            Salvar Alterações
                        </Button>
                    </div>

                </form>
            </div>

            {/* --- MODAL DE SUCESSO CUSTOMIZADO --- */}
            {showSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
                    {/* Caixa do Modal */}
                    <div className="bg-[#F7EEDD] border-4 border-black shadow-[10px_10px_0_0_#A35E49] p-8 w-80 text-center animate-bounce-in">

                        {/* Ícone de Sucesso (Check) */}
                        <div className="w-16 h-16 bg-[#A35E49] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F7EEDD" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>

                        <h3 className="text-xl font-black uppercase text-black mb-2">Sucesso!</h3>
                        <p className="text-black font-medium mb-6">Seu perfil foi atualizado corretamente.</p>

                        <Button
                            onClick={() => setShowSuccessModal(false)}
                            style={{ width: '100%' }}
                        >
                            FECHAR
                        </Button>
                    </div>
                </div>
            )}

        </div>
    );
};