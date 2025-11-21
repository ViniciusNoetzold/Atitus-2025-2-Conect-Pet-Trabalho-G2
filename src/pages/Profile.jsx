import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Title, Button } from "../components";
import { getUserProfile, updateUserProfile } from "../services/authService";
import dogHead from '../assets/svg/dog_head.svg';
import catHead from '../assets/svg/cat_head.svg';
import bone from '../assets/svg/bone.svg';
import yarn from '../assets/svg/yarn_ball.svg';
const AVATARS = {
    dog: dogHead,
    cat: catHead,
    bone: bone,
    yarn: yarn
};
export const Profile = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState("dog");
    const [showEmail, setShowEmail] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => {
        getUserProfile().then(user => {
            if (user) {
                setName(user.name || "");
                setEmail(user.email || "");
                setBio(user.bio || "");
                if (user.avatar && AVATARS[user.avatar]) {
                    setSelectedAvatar(user.avatar);
                }
            }
            setIsLoading(false);
        });
    }, []);
    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateUserProfile({ name, bio, avatar: selectedAvatar });
            alert("Perfil salvo com sucesso!");
        } catch (error) {
            alert("Erro ao salvar: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };
    const getMaskedEmail = (emailStr) => {
        if (!emailStr) return "";
        return emailStr.replace(/^(.{2})(.*)(@.*)$/, "$1***$3");
    };
    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#2B2B24] text-[#F7EEDD] font-bold text-xl">CARREGANDO...</div>;
    return (
        <div className="min-h-screen bg-[#2B2B24] p-6 flex flex-col items-center font-sans">
            { }
            <div className="w-full max-w-md flex items-center mb-8 relative">
                <button
                    onClick={() => navigate('/map')}
                    className="absolute left-0 text-[#F7EEDD] hover:text-[#A35E49] transition-colors flex items-center gap-2 font-bold uppercase"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Voltar
                </button>
                <div className="w-full text-center"><Title title="MEU PERFIL" /></div>
            </div>
            { }
            <div className="w-full max-w-md bg-[#F7EEDD] p-8 border-4 border-black shadow-[10px_10px_0_0_#A35E49] text-black relative">
                { }
                <div className="absolute top-0 left-0 w-full h-4 bg-[#A35E49] border-b-4 border-black"></div>
                <form onSubmit={handleSave} className="flex flex-col gap-6 mt-4">
                    { }
                    <div className="text-center">
                        <label className="font-black block mb-3 uppercase text-lg tracking-wide">Escolha seu Avatar</label>
                        <div className="flex justify-center gap-4 flex-wrap">
                            {Object.keys(AVATARS).map(key => (
                                <div
                                    key={key}
                                    onClick={() => setSelectedAvatar(key)}
                                    className={`
                                        cursor-pointer p-3 border-4 rounded-lg transition-all duration-200
                                        ${selectedAvatar === key
                                            ? 'border-[#A35E49] bg-white shadow-[4px_4px_0_0_#000] -translate-y-1'
                                            : 'border-transparent hover:bg-white/50 hover:border-black'}
                                    `}
                                >
                                    <img src={AVATARS[key]} alt={key} className="w-12 h-12" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <hr className="border-2 border-black border-dashed opacity-20" />
                    { }
                    <div>
                        <label className="font-black block mb-1 uppercase text-sm">Nome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-white border-4 border-black p-3 font-bold focus:outline-none focus:border-[#A35E49] transition-colors placeholder-gray-400"
                            placeholder="Seu nome..."
                        />
                    </div>
                    { }
                    <div>
                        <label className="font-black block mb-1 uppercase text-sm">Email</label>
                        <div className="relative w-full">
                            <div className="w-full bg-gray-200 border-4 border-black p-3 font-bold text-gray-700 flex items-center justify-between">
                                <span className="truncate pr-2">
                                    {showEmail ? email : getMaskedEmail(email)}
                                </span>
                                { }
                                <button
                                    type="button"
                                    onClick={() => setShowEmail(!showEmail)}
                                    className="text-black hover:text-[#A35E49] focus:outline-none transition-colors p-1"
                                    title={showEmail ? "Esconder email" : "Mostrar email"}
                                >
                                    {showEmail ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                            <line x1="2" x2="22" y1="2" y2="22"></line>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    { }
                    <div>
                        <label className="font-black block mb-1 uppercase text-sm">Bio</label>
                        <textarea
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            className="w-full bg-white border-4 border-black p-3 font-medium h-28 resize-none focus:outline-none focus:border-[#A35E49] transition-colors placeholder-gray-400"
                            placeholder="Conte um pouco sobre você..."
                        />
                    </div>
                    { }
                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={isSaving}
                            style={{ width: '100%', fontSize: '1.1rem', padding: '15px' }}
                        >
                            {isSaving ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};