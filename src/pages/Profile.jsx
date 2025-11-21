import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Title, Button } from "../components";
import { getUserProfile, updateUserProfile } from "../services/authService";

// Importando os SVGs locais
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
    const [selectedAvatar, setSelectedAvatar] = useState("dog"); // Padrão

    useEffect(() => {
        getUserProfile().then(user => {
            if (user) {
                setName(user.name);
                setEmail(user.email);
                setBio(user.bio || "");
                if (user.avatar && AVATARS[user.avatar]) {
                    setSelectedAvatar(user.avatar);
                }
            }
        });
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Envia JSON simples
            await updateUserProfile({ name, bio, avatar: selectedAvatar });
            alert("Perfil salvo!");
        } catch (error) {
            alert("Erro ao salvar");
        }
    };

    return (
        <div className="min-h-screen bg-[#2B2B24] p-6 flex flex-col items-center">
            <div className="w-full max-w-md mb-8 text-center relative">
                <button onClick={() => navigate('/map')} className="absolute left-0 text-[#F7EEDD] font-bold">Voltar</button>
                <Title title="MEU PERFIL" />
            </div>

            <div className="w-full max-w-md bg-[#F7EEDD] p-8 border-4 border-black shadow-[10px_10px_0_0_#A35E49] text-black">
                <form onSubmit={handleSave} className="flex flex-col gap-6">

                    {/* Seletor de Avatar */}
                    <div>
                        <label className="font-bold block mb-2 uppercase text-center">Escolha seu Avatar</label>
                        <div className="flex justify-center gap-4">
                            {Object.keys(AVATARS).map(key => (
                                <div
                                    key={key}
                                    onClick={() => setSelectedAvatar(key)}
                                    className={`cursor-pointer p-2 border-4 ${selectedAvatar === key ? 'border-[#A35E49] bg-white' : 'border-transparent'}`}
                                >
                                    <img src={AVATARS[key]} alt={key} className="w-12 h-12" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="font-bold block mb-1">Nome</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border-[3px] border-black p-2" />
                    </div>

                    <div>
                        <label className="font-bold block mb-1">Email</label>
                        <div className="w-full border-[3px] border-black p-2 bg-gray-200">{email}</div>
                    </div>

                    <div>
                        <label className="font-bold block mb-1">Bio</label>
                        <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full border-[3px] border-black p-2 h-24 resize-none" />
                    </div>

                    <Button type="submit">SALVAR ALTERAÇÕES</Button>
                </form>
            </div>
        </div>
    );
};