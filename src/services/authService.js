import { api } from "./api";
export async function signIn(email, password) {
  try {
    const response = await api.post("/auth/signin", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erro ao fazer login.");
  }
}
export async function signUp(name, email, password) {
  try {
    const response = await api.post("/auth/signup", { name, email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erro ao cadastrar usuário.");
  }
}
export async function getUserProfile() {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return null;
  }
}
export async function updateUserProfile(formData) {
  try {
    const response = await api.put("/auth/me", formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erro ao atualizar perfil.");
  }
}