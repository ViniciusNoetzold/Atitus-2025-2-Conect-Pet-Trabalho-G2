import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Title, Logo } from "../components";
import { signIn } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

import dogHeadSvg from '../assets/svg/dog_head.svg';
import catHeadSvg from '../assets/svg/cat_head.svg';
import boneSvg from '../assets/svg/bone.svg';
import yarnBallSvg from '../assets/svg/yarn_ball.svg';

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const { token } = await signIn(email, senha);
      login(token);
      navigate("/map");
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#2B2B24] relative">

      {/* ANIMAÇÃO DE FUNDO (FIXA) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <img src={dogHeadSvg} alt="" className="animated-pet-icon dog-head" />
        <img src={boneSvg} alt="" className="animated-toy-icon bone" />
        <img src={catHeadSvg} alt="" className="animated-pet-icon cat-head" />
        <img src={yarnBallSvg} alt="" className="animated-toy-icon yarn-ball" />
      </div>

      {/* CONTEÚDO ROLÁVEL */}
      <div className="flex items-center justify-center min-h-screen p-6 relative z-10">
        <div className="w-full max-w-sm mx-auto p-8 border-4 border-black bg-[#F7EEDD] shadow-[10px_10px_0_0_#A35E49] text-black">
          <div className="text-center">
            <Logo />
          </div>

          <div className="pt-6 pb-4">
            <Title title="FAÇA SEU LOGIN" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="pb-4">
              <Input
                label="Email"
                placeholder="Digite seu email..."
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="pb-4">
              <Input
                label="Senha"
                placeholder="Digite sua senha..."
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            {erro && <p style={{ color: "#A35E49" }} className="text-center pb-4 font-bold">{erro}</p>}

            <div className="text-center pt-8">
              <Button
                type="submit"
                onClick={handleSubmit}
              >
                ACESSAR
              </Button>
            </div>
          </form>

          <div className="text-center pt-8">
            <Link
              to="/register"
              className="text-black hover:text-[#A35E49] hover:underline transition-colors duration-200 font-bold"
            >
              Ainda não tem cadastro? <strong>Crie sua conta</strong>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}