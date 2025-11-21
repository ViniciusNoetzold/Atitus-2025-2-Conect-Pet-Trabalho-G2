import { useEffect, useState, useCallback } from "react";
import { Navbar, Input, Button } from "../components";
import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from "@react-google-maps/api";
import { getPoints, postPoint } from '../services/mapService';

const containerStyle = { width: "100%", height: "calc(100vh - 65px)" };
const defaultCenter = { lat: -23.55052, lng: -46.633308 };
// SVG Path de um pino padrão do Google Maps
const PIN_ICON_PATH = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z";
const COLOR_OPTIONS = ["#E53E3E", "#3182CE", "#38A169", "#D69E2E", "#805AD5"];

export const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [newPointCoords, setNewPointCoords] = useState(null);

  // Estados do Formulário
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [fotoFile, setFotoFile] = useState(null);

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const loadMarkers = useCallback(async () => {
    const data = await getPoints();
    setMarkers(data);
  }, []);

  useEffect(() => {
    if (isLoaded) loadMarkers();
  }, [isLoaded, loadMarkers]);

  const handleMapClick = (event) => {
    if (!event.latLng) return;
    setSelectedMarker(null);
    setNewPointCoords({ lat: event.latLng.lat(), lng: event.latLng.lng() });

    // Resetar form
    setNome("");
    setDescricao("");
    setFotoFile(null);
    setColor(COLOR_OPTIONS[0]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!descricao || !nome) return alert("Preencha nome e descrição.");

    setIsLoading(true);
    try {
      // Monta objeto de dados
      const pointData = {
        nome,
        descricao,
        latitude: newPointCoords.lat,
        longitude: newPointCoords.lng,
        color
      };

      // Envia para o serviço
      await postPoint(pointData, fotoFile);

      // Recarrega e limpa
      await loadMarkers();
      setNewPointCoords(null);
      alert("Pet cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar. Verifique o console.");
    } finally {
      setIsLoading(false);
    }
  };

  // Função auxiliar para renderizar o ícone do marcador
  const getMarkerIcon = (markerColor) => ({
    path: PIN_ICON_PATH,
    fillColor: markerColor,
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "#000",
    scale: 2,
    anchor: { x: 12, y: 24 }
  });

  return (
    <>
      <Navbar />
      <div style={{ width: "100%", height: "calc(100vh - 65px)", position: "relative" }}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={12}
            onClick={handleMapClick}
          >
            {/* Renderiza marcadores existentes */}
            {markers.map(marker => (
              <Marker
                key={marker.id}
                position={marker.position}
                onClick={() => setSelectedMarker(marker)}
                icon={getMarkerIcon(marker.color)}
              />
            ))}

            {/* Janela de Informações ao clicar no marcador */}
            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.position}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-2 text-black max-w-xs">
                  <h3 className="font-bold uppercase text-lg mb-1">{selectedMarker.title}</h3>
                  <p className="mb-2 text-sm">{selectedMarker.description}</p>
                  {selectedMarker.foto && (
                    <img
                      src={selectedMarker.foto}
                      alt="Foto do Pet"
                      className="w-full h-32 object-cover rounded border-2 border-black mt-2"
                    />
                  )}
                </div>
              </InfoWindow>
            )}

            {/* Marcador Temporário (Novo Ponto) */}
            {newPointCoords && (
              <Marker
                position={newPointCoords}
                icon={getMarkerIcon(color)}
                opacity={0.7}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-full text-white">Carregando Mapa...</div>
        )}

        {/* Formulário Flutuante */}
        {newPointCoords && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#F7EEDD] p-6 border-4 border-black shadow-lg z-50 w-80 text-black max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 uppercase text-center">Novo Pet</h2>
            <form onSubmit={handleSave}>
              <div className="mb-2">
                <Input label="Nome do Pet" value={nome} onChange={e => setNome(e.target.value)} required />
              </div>
              <div className="mb-2">
                <Input label="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} required />
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-bold text-sm uppercase">Foto (Opcional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setFotoFile(e.target.files[0])}
                  className="w-full text-sm border-2 border-black p-2 bg-white cursor-pointer"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-bold text-sm uppercase text-center">Cor do Pino</label>
                <div className="flex justify-center gap-3">
                  {COLOR_OPTIONS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      style={{
                        backgroundColor: c,
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        border: color === c ? '3px solid #000' : '2px solid #fff',
                        boxShadow: color === c ? '2px 2px 0 #000' : 'none',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-3 mt-6">
                <Button onClick={() => setNewPointCoords(null)} style={{ backgroundColor: '#666' }}>Cancelar</Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};