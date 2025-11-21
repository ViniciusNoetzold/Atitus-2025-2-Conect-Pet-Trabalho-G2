import { api } from "./api";

// Verifica se a URL base termina com barra para evitar // duplas
const BASE_API = "/api/animais";

export async function getPoints() {
  try {
    const response = await api.get(`${BASE_API}/disponiveis`);
    return response.data.map((animal) => ({
      id: animal.id,
      title: animal.nome || "Pet Sem Nome",
      description: animal.descricao || "",
      // Constrói a URL da imagem completa se ela existir
      foto: animal.fotoPath ? `${api.defaults.baseURL}${animal.fotoPath}` : null,
      position: {
        lat: animal.latitude,
        lng: animal.longitude,
      },
      // Usa a cor salva ou fallback para vermelho
      color: animal.color || "#E53E3E",
      isMyPet: false,
    }));
  } catch (error) {
    console.error("Erro ao buscar pontos:", error);
    return [];
  }
}

export async function postPoint(pointData, file) {
  const formData = new FormData();

  // 1. Prepara o JSON. O Backend espera uma parte chamada "animal"
  // Precisamos garantir que color, latitude, longitude vão corretos
  const animalPayload = {
    nome: pointData.nome,
    descricao: pointData.descricao,
    latitude: pointData.latitude,
    longitude: pointData.longitude,
    color: pointData.color
  };

  // 2. Transforma JSON em Blob com type application/json
  // Isso é OBRIGATÓRIO para o @RequestPart("animal") funcionar no Java
  const jsonBlob = new Blob([JSON.stringify(animalPayload)], { type: 'application/json' });
  formData.append('animal', jsonBlob);

  // 3. Anexa o arquivo APENAS se ele existir
  if (file) {
    formData.append('foto', file);
  }

  // 4. Envia. IMPORTANTE: Content-Type deve ser removido ou undefined 
  // para o browser gerar o boundary multipart
  const response = await api.post(BASE_API, formData, {
    headers: {
      "Content-Type": undefined
    }
  });

  return response.data;
}