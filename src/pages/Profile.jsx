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
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        async function loadData() {
            try {
                const user = await getUserProfile();
                if (user) {
                    setName(user.name || "");
                    setEmail(user.email || "");
                    setDescription(user.description || user.bio || "");
                    if (user.photoUrl) setPreviewImage(user.photoUrl);
                }
            } catch (error) {
                console.error("Erro perfil", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);
    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        if (profileImage) formData.append("photo", profileImage);
        try {
            await updateUserProfile(formData);
            alert("Perfil atualizado!");
        } catch (error) {
            alert(error.message);
        }
    };
    if (isLoading) return <div className="text-white text-center mt-10">Carregando...</div>;
    return (
        <div className="min-h-screen bg-[#2B2B24] p-6 flex flex-col items-center">
            <div className="w-full max-w-md flex items-center mb-8 relative">
                <button onClick={() => navigate('/map')} className="absolute left-0 text-[#F7EEDD] hover:text-[#A35E49]">
                    Voltar
                </button>
                <div className="w-full text-center"><Title title="MINHA CONTA" /></div>
            </div>
            <div className="w-full max-w-md bg-[#F7EEDD] p-8 border-4 border-black shadow-[10px_10px_0_0_#A35E49] text-black">
                <form onSubmit={handleSave} className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 bg-gray-300 border-4 border-black overflow-hidden">
                            {previewImage && <img src={previewImage} alt="Perfil" className="w-full h-full object-cover" />}
                        </div>
                        <input type="file" accept="image/*" onChange={(e) => {
                            setProfileImage(e.target.files[0]);
                            setPreviewImage(URL.createObjectURL(e.target.files[0]));
                        }} />
                    </div>
                    <div>
                        <label className="font-bold block mb-1">Nome</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border-[3px] border-black p-2 bg-white" />
                    </div>
                    <div>
                        <label className="font-bold block mb-1">Sobre Mim</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border-[3px] border-black p-2 bg-white h-24" />
                    </div>
                    <div className="text-center">
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};