import React from "react";
import { useNavigate } from "react-router-dom";
import { Title } from "../components";
export const Help = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-[#2B2B24] p-6 flex flex-col items-center">
            { }
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
                    <Title title="AJUDA" />
                </div>
            </div>
            { }
            <div className="w-full max-w-md flex flex-col gap-6">
                { }
                <div className="bg-[#F7EEDD] p-6 border-4 border-black shadow-[8px_8px_0_0_#A35E49] text-black">
                    <h3 className="text-xl font-black uppercase mb-2 border-b-2 border-black pb-1">Como adicionar um Pet?</h3>
                    <p className="text-sm font-medium leading-relaxed">
                        1. Vá para a tela do mapa.<br />
                        2. Clique exatamente no local onde o pet foi visto.<br />
                        3. Preencha a descrição e, se possível, adicione uma foto.<br />
                        4. Clique em "SALVAR PET".
                    </p>
                </div>
                { }
                <div className="bg-[#F7EEDD] p-6 border-4 border-black shadow-[8px_8px_0_0_#A35E49] text-black">
                    <h3 className="text-xl font-black uppercase mb-2 border-b-2 border-black pb-1">Termos de Uso</h3>
                    <p className="text-sm font-medium leading-relaxed text-justify">
                        Ao cadastrar um animal, você declara que as informações são verdadeiras.
                        O <strong>Conect Pet</strong> não se responsabiliza pela guarda dos animais, apenas facilitamos a conexão entre quem encontrou e quem quer adotar.
                    </p>
                </div>
                { }
                <div className="bg-[#F7EEDD] p-6 border-4 border-black shadow-[8px_8px_0_0_#A35E49] text-black">
                    <h3 className="text-xl font-black uppercase mb-2 border-b-2 border-black pb-1">Dicas de Segurança</h3>
                    <ul className="text-sm font-medium list-disc list-inside">
                        <li>Marque encontros em locais públicos.</li>
                        <li>Verifique a veracidade das informações.</li>
                        <li>Nunca faça transferências bancárias antecipadas.</li>
                    </ul>
                </div>
                { }
                <div className="mt-8 text-center border-t-2 border-[#F7EEDD] pt-6">
                    <p className="text-[#F7EEDD] font-bold text-lg mb-2">Fale Conosco</p>
                    <a href="mailto:nossoemail@gmail.com" className="text-[#A35E49] font-black text-xl hover:underline block mb-4">
                        nossoemail@gmail.com
                    </a>
                    <div className="text-[#6d6d6d] text-sm font-bold flex flex-col items-center gap-1">
                        <span>© 2025 PyPet</span>
                        <span>Todos os direitos reservados ®</span>
                    </div>
                </div>
            </div>
        </div>
    );
};