import { api } from "./api";
const POINTS_URL = "/ws/point";
export async function getPoints() {
  try {
    const response = await api.get(POINTS_URL);
    return response.data.map((point) => ({
      id: point.id,
      title: point.descricao,
      position: {
        lat: Number(point.latitude),
        lng: Number(point.longitude),
      },
      imageUrl: point.imageUrl || null,
      color: point.color || "#E53E3E",
      isMyPet: point.isMyPet || false,
    }));
  } catch (error) {
    console.error("Erro ao buscar pontos:", error);
    throw new Error(error.response?.data?.message || "Erro ao carregar mapa.");
  }
}
export async function postPoint(pointData) {
  try {
    const response = await api.post(POINTS_URL, pointData);
    return response.data;
  } catch (error) {
    console.error("Erro ao salvar ponto:", error);
    throw new Error(error.response?.data?.message || "Erro ao cadastrar pet.");
  }
}