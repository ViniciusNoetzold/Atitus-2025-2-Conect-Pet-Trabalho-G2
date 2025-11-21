import { api } from "./api";

const API_URL = "/api/animais";

export async function getPoints() {
  try {
    const response = await api.get(`${API_URL}/disponiveis`);
    return response.data.map((animal) => ({
      id: animal.id,
      title: animal.nome || "Pet",
      description: animal.descricao, // Adicionamos descrição para ver no mapa
      position: {
        lat: animal.latitude,
        lng: animal.longitude,
      },
      color: animal.color || "#E53E3E", // Usa a cor salva ou vermelho
      isMyPet: false,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function postPoint(jsonData) {
  // Envia JSON normal
  const response = await api.post(API_URL, jsonData);
  return response.data;
}