import { useEffect, useState, useCallback } from "react";
import { Navbar, Input, Button } from "../components";
import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from "@react-google-maps/api";
import { getPoints, postPoint } from '../services/mapService';

const containerStyle = { width: "100%", height: "calc(100vh - 65px)" };
const defaultCenter = { lat: -23.55052, lng: -46.633308 };
const PIN_ICON_PATH = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z";
const COLOR_OPTIONS = ["#E53E3E", "#3182CE", "#38A169", "#D69E2E", "#805AD5"];

export const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [newPointCoords, setNewPointCoords] = useState(null);
  const [nome, setNome] = useState(""); // Novo campo
  const [descricao, setDescricao] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const loadMarkers = useCallback(async () => {
    const data = await getPoints();
    setMarkers(data);
  }, []);

  useEffect(() => { loadMarkers(); }, [loadMarkers]);

  const handleMapClick = (event) => {
    setSelectedMarker(null);
    setNewPointCoords({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    setNome("");
    setDescricao("");
    setColor(COLOR_OPTIONS[0]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!descricao || !nome) return alert("Preencha nome e descrição.");

    setIsLoading(true);
    try {
      // Envia JSON simples
      await postPoint({
        nome,
        descricao,
        latitude: newPointCoords.lat,
        longitude: newPointCoords.lng,
        color
      });
      await loadMarkers();
      setNewPointCoords(null);
      alert("Pet cadastrado!");
    } catch (error) {
      alert("Erro ao salvar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ width: "100%", height: "calc(100vh - 65px)" }}>
        {isLoaded && (
          <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={12} onClick={handleMapClick}>
            {markers.map(marker => (
              <Marker
                key={marker.id}
                position={marker.position}
                onClick={() => setSelectedMarker(marker)}
                icon={{ path: PIN_ICON_PATH, fillColor: marker.color, fillOpacity: 1, strokeWeight: 1, strokeColor: "#000", scale: 2, anchor: { x: 12, y: 24 } }}
              />
            ))}

            {selectedMarker && (
              <InfoWindow position={selectedMarker.position} onCloseClick={() => setSelectedMarker(null)}>
                <div className="p-2 text-black">
                  <h3 className="font-bold uppercase">{selectedMarker.title}</h3>
                  <p>{selectedMarker.description}</p>
                </div>
              </InfoWindow>
            )}

            {newPointCoords && (
              <Marker position={newPointCoords} icon={{ path: PIN_ICON_PATH, fillColor: color, fillOpacity: 0.7, scale: 2, anchor: { x: 12, y: 24 }, strokeWeight: 1 }} />
            )}
          </GoogleMap>
        )}

        {newPointCoords && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#F7EEDD] p-6 border-4 border-black shadow-lg z-20 w-80 text-black">
            <h2 className="text-xl font-bold mb-4 uppercase text-center">Novo Pet</h2>
            <form onSubmit={handleSave}>
              <div className="mb-2"><Input label="Nome do Pet" value={nome} onChange={e => setNome(e.target.value)} /></div>
              <div className="mb-4"><Input label="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} /></div>

              <div className="mb-6 flex justify-center gap-3">
                {COLOR_OPTIONS.map(c => (
                  <button key={c} type="button" onClick={() => setColor(c)} style={{ backgroundColor: c, width: 32, height: 32, borderRadius: '50%', border: color === c ? '3px solid #000' : '2px solid #fff' }} />
                ))}
              </div>

              <div className="flex justify-center gap-3">
                <Button onClick={() => setNewPointCoords(null)}>Cancelar</Button>
                <Button type="submit" disabled={isLoading}>Salvar</Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};