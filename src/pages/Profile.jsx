import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Title, Button } from "../components";
import { getUserProfile, updateUserProfile } from "../services/authService";

export const Profile = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [showEmail, setShowEmail] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const user = await getUserProfile();
                if (user) {
                    setName(user.name || "");
                    setEmail(user.email || "");
                    setDescription(user.description || user.bio || "");

                    if (user.photoUrl) {
                        setPreviewImage(user.photoUrl);
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar perfil", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            if (profileImage) {
                formData.append("photo", profileImage);
            }

            await updateUserProfile(formData);
            setShowSuccessModal(true);
        } catch (error) {
            alert(error.message || "Erro ao atualizar perfil.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center text-[#F7EEDD]">Carregando...</div>;

    return (
        <div className="min-h-screen bg-[#2B2B24] p-6 flex flex-col items-center relative">
            <div className="w-full max-w-md flex items-center mb-8 relative">
                <button onClick={() => navigate('/map')} className="absolute left-0 text-[#F7EEDD] hover:text-[#A35E49] transition-colors">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="w-full text-center">
                    <Title title="MINHA CONTA" />
                </div>
            </div>

            <div className="w-full max-w-md bg-[#F7EEDD] p-8 border-4 border-black shadow-[10px_10px_0_0_#A35E49] text-black">
                <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 bg-gray-300 border-4 border-black overflow-hidden flex items-center justify-center relative">
                            {previewImage ? (
                                <img src={previewImage} alt="Perfil" className="w-full h-full object-cover" />
                            ) : (
                                <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            )}
                        </div>

                        <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        <label htmlFor="profile-upload" className="cursor-pointer text-sm font-bold text-[#A35E49] hover:underline uppercase">
                            Alterar Foto
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1 uppercase">Nome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#F7EEDD] border-[3px] border-black px-4 py-2 text-[#2B2B24]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1 uppercase">Meu E-mail</label>
                        <div className="relative">
                            <div className="w-full h-[50px] bg-[#F7EEDD] border-[3px] border-black flex items-center px-4 text-[#2B2B24] overflow-hidden">
                                {showEmail ? email : (email ? email.replace(/^(.{2})(.*)(@.*)$/, "$1***$3") : "...")}
                            </div>
                            <button type="button" onClick={() => setShowEmail(!showEmail)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-[#A35E49]">
                                {showEmail ? "Ocultar" : "Mostrar"}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1 uppercase">Sobre Mim</label>
                        <textarea
                            className="w-full min-h-[100px] bg-[#F7EEDD] border-[3px] border-black p-3 text-[#2B2B24] focus:outline-none resize-none"
                            placeholder="Escreva algo sobre você..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-center pt-4">
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </div>
                </form>
            </div>

            {showSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#F7EEDD] border-4 border-black shadow-[10px_10px_0_0_#A35E49] p-8 w-80 text-center animate-bounce-in">
                        <h3 className="text-xl font-black uppercase text-black mb-2">Sucesso!</h3>
                        <p className="text-black font-medium mb-6">Perfil atualizado.</p>
                        <Button onClick={() => setShowSuccessModal(false)} style={{ width: '100%' }}>FECHAR</Button>
                    </div>
                </div>
            )}
        </div>
    );
};