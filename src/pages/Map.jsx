import { useEffect, useState } from "react";
import { Navbar, Input, Button } from "../components";
import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from "@react-google-maps/api";
import { getPoints, postPoint } from '../services/mapService';
import { useAuth } from "../contexts/AuthContext";

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 65px)",
};

const defaultCenter = {
  lat: -23.55052,
  lng: -46.633308,
};

const PIN_ICON_PATH = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z";

const COLOR_OPTIONS = [
  "#E53E3E",
  "#3182CE",
  "#38A169",
  "#D69E2E",
  "#805AD5"
];

export const Map = () => {
  const { token } = useAuth();
  const [markers, setMarkers] = useState([]);
  const [newPointCoords, setNewPointCoords] = useState(null);
  const [newPointDescription, setNewPointDescription] = useState("");
  const [newPointImage, setNewPointImage] = useState(null);
  const [newPointColor, setNewPointColor] = useState(COLOR_OPTIONS[0]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showMyPetsOnly, setShowMyPetsOnly] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    async function fetchMarkers() {
      try {
        constVP = await getPoints(token);
        setMarkers(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchMarkers();
  }, [token]);

  const toggleMyPetsFilter = () => {
    setShowMyPetsOnly(!showMyPetsOnly);
    setSelectedMarker(null);
  };

  const filteredMarkers = showMyPetsOnly
    ? markers.filter(marker => marker.isMyPet)
    : markers;

  const handleMapClick = (event) => {
    setSelectedMarker(null);
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setNewPointCoords({ lat, lng });
    setNewPointDescription("");
    setNewPointImage(null);
    setNewPointColor(COLOR_OPTIONS[0]);
  };

  const handleMarkerClick = (marker) => {
    setNewPointCoords(null);
    setSelectedMarker(marker);
  };

  const handleSavePoint = async (e) => {
    e.preventDefault();
    if (!newPointCoords || !newPointDescription.trim()) {
      alert("A descrição é obrigatória.");
      return;
    }

    // CORREÇÃO: Sempre usar FormData para garantir compatibilidade com o Backend
    const dataToSend = new FormData();
    dataToSend.append('latitude', newPointCoords.lat);
    dataToSend.append('longitude', newPointCoords.lng);
    dataToSend.append('descricao', newPointDescription.trim());
    dataToSend.append('color', newPointColor);

    // Só anexa a imagem se o usuário tiver selecionado uma
    if (newPointImage) {
      dataToSend.append('image', newPointImage);
    }

    try {
      // O 'true' no final força o envio como FormData (multipart/form-data)
      const savedPoint = await postPoint(token, dataToSend, true);

      const savedMarker = {
        id: savedPoint.id,
        title: savedPoint.descricao || newPointDescription.trim(),
        position: newPointCoords,
        imageUrl: savedPoint.imageUrl,
        color: newPointColor,
        isMyPet: true
      };

      setMarkers((prev) => [...prev, savedMarker]);
      setNewPointCoords(null);
      setNewPointDescription("");
      setNewPointImage(null);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar onFilterMyPets={toggleMyPetsFilter} showMyPetsOnly={showMyPetsOnly} />
      <div style={{ width: "100%", height: "calc(100vh - 65px)" }}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={12}
            onClick={handleMapClick}
          >
            {filteredMarkers.map(marker => (
              <Marker
                key={marker.id}
                position={marker.position}
                title={marker.title}
                onClick={() => handleMarkerClick(marker)}
                icon={{
                  path: PIN_ICON_PATH,
                  fillColor: marker.color || "#E53E3E",
                  fillOpacity: 1,
                  strokeWeight: 1,
                  strokeColor: "#000000",
                  scale: 2,
                  anchor: { x: 12, y: 24 }
                }}
              />
            ))}

            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.position}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-3" style={{ color: '#000000', backgroundColor: '#F7EEDD', border: '3px solid #000000', maxWidth: '300px', minWidth: '250px' }}>
                  <h3 className="font-bold text-lg mb-3 uppercase border-b-2 border-black pb-2wk-words">
                    {selectedMarker.title}
                  </h3>
                  {selectedMarker.imageUrl && (
                    <div className="w-full border-2 border-black mb-3 bg-white">
                      <img
                        src={selectedMarker.imageUrl}
                        alt={selectedMarker.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='50%' x='50%' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='%23000'>Sem Foto</text><rect x='0' y='0' width='100' height='100' fill='none' stroke='%23000' stroke-width='2'/></svg>";
                        }}
                        style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  )}
                  <div className="text-sm font-bold mt-2">
                    <p>Lat: {selectedMarker.position.lat.toFixed(4)}</p>
                    <p>Lng: {selectedMarker.position.lng.toFixed(4)}</p>
                  </div>
                </div>
              </InfoWindow>
            )}

            {newPointCoords && (
              <Marker
                position={newPointCoords}
                icon={{
                  path: PIN_ICON_PATH,
                  fillColor: newPointColor,
                  fillOpacity: 1,
                  strokeWeight: 1,
                  strokeColor: "#000000",
                  scale: 2,
                  anchor: { x: 12, y: 24 }
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="flex justify-center items-center h-full">
            <h1 className="text-white text-2xl">Carregando mapa...</h1>
          </div>
        )}

        {newPointCoords && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#F7EEDD] p-6 rounded-none border-4 border-[#000000] shadow-[10px_10px_0_0_#A35E49] z-20 w-80 text-[#000000]">
            <h2 className="text-xl font-bold mb-4 uppercase text-center">Cadastrar Novo Pet</h2>
            <form onSubmit={handleSavePoint}>
              <div className="mb-4">
                <Input
                  label="Descrição"
                  placeholder="Ex: Nome do animal, raça, etc."
                  type="text"
                  required
                  value={newPointDescription}
                  onChange={(e) => setNewPointDescription(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Foto do Pet (Opcional)</label>
                <input
                  id="pet-file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setNewPointImage(e.target.files[0])}
                />
                <label
                  htmlFor="pet-file-upload"
                  className="w-full text-base cursor-pointer px-4 py-2WKock"
                  style={{
                    backgroundColor: '#F7EEDD',
                    border: '3px solid #000000',
                    color: newPointImage ? '#000000' : '#6d6d6d',
                    minHeight: '50px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {newPointImage ? newPointImage.name : "Escolher arquivo..."}
                </label>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">Cor do Pino</label>
                <div className="flex justify-center gap-3">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewPointColor(color)}
                      style={{
                        backgroundColor: color,
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: newPointColor === color ? '3px solid #000' : '2px solid #fff',
                        boxShadow: newPointColor === color ? '0 0 0 2px #000' : '0 2px 4px rgba(0,0,0,0.3)',
                        cursor: 'pointer',
                        transform: newPointColor === color ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.2s'
                      }}
                      title="Selecionar cor"
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm mb-4 text-center">
                Lat: {newPointCoords.lat.toFixed(4)}, Lng: {newPointCoords.lng.toFixed(4)}
              </p>

              <div className="flex justify-center gap-4">
                <Button
                  type="button"
                  onClick={() => setNewPointCoords(null)}
                  style={{
                    backgroundColor: '#F7EEDD',
                    color: '#000000',
                    border: '3px solid #000000',
                    boxShadow: '4px 4px 0px #A35E49',
                  }}
                >
                  CANCELAR
                </Button>
                <Button type="submit">
                  SALVAR PET
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};