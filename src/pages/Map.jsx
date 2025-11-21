import { useEffect, useState, useCallback } from "react";
import { Navbar, Input, Button } from "../components";
import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from "@react-google-maps/api";
import { getPoints, postPoint } from '../services/mapService';

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 65px)",
};

const defaultCenter = {
  lat: -23.55052,
  lng: -46.633308,
};

const PIN_ICON_PATH = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z";
const COLOR_OPTIONS = ["#E53E3E", "#3182CE", "#38A169", "#D69E2E", "#805AD5"];

export const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [newPointCoords, setNewPointCoords] = useState(null);
  const [newPointDescription, setNewPointDescription] = useState("");
  const [newPointImage, setNewPointImage] = useState(null);
  const [newPointColor, setNewPointColor] = useState(COLOR_OPTIONS[0]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showMyPetsOnly, setShowMyPetsOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const loadMarkers = useCallback(async () => {
    try {
      const data = await getPoints();
      setMarkers(data);
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  useEffect(() => {
    loadMarkers();
  }, [loadMarkers]);

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

  const handleSavePoint = async (e) => {
    e.preventDefault();
    if (!newPointCoords || !newPointDescription.trim()) {
      alert("A descrição é obrigatória.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('latitude', newPointCoords.lat);
    formData.append('longitude', newPointCoords.lng);
    formData.append('descricao', newPointDescription.trim());
    formData.append('color', newPointColor);

    if (newPointImage) {
      formData.append('image', newPointImage);
    }

    try {
      await postPoint(formData); o
      await loadMarkers();

      setNewPointCoords(null);
      alert("Pet cadastrado com sucesso!");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
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
                onClick={() => setSelectedMarker(marker)}
                icon={{
                  path: PIN_ICON_PATH,
                  fillColor: marker.color,
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
                <div className="p-3 bg-[#F7EEDD] border-[3px] border-black max-w-[300px] text-black">
                  <h3 className="font-bold text-lg mb-2 border-b-2 border-black pb-1 break-words uppercase">
                    {selectedMarker.title}
                  </h3>
                  {selectedMarker.imageUrl && (
                    <div className="w-full border-2 border-black mb-2 bg-white">
                      <img
                        src={selectedMarker.imageUrl}
                        alt="Pet"
                        className="w-full h-[150px] object-cover block"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                  <div className="text-xs font-bold">
                    <p>Clique para detalhes.</p>
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
                  fillOpacity: 0.7,
                  strokeWeight: 1,
                  strokeColor: "#000000",
                  scale: 2,
                  anchor: { x: 12, y: 24 }
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="flex justify-center items-center h-full text-[#F7EEDD]">
            <h1>Carregando mapa...</h1>
          </div>
        )}

        {newPointCoords && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#F7EEDD] p-6 border-4 border-black shadow-[10px_10px_0_0_#A35E49] z-20 w-80 text-black">
            <h2 className="text-xl font-bold mb-4 uppercase text-center">Novo Pet</h2>
            <form onSubmit={handleSavePoint}>
              <div className="mb-4">
                <Input
                  label="Descrição"
                  placeholder="Ex: Cão perdido"
                  value={newPointDescription}
                  onChange={(e) => setNewPointDescription(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Foto (Opcional)</label>
                <input
                  id="pet-file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setNewPointImage(e.target.files[0])}
                />
                <label
                  htmlFor="pet-file-upload"
                  className="w-full text-sm cursor-pointer px-3 py-2 block bg-[#F7EEDD] border-[3px] border-black text-center hover:bg-gray-100 truncate"
                >
                  {newPointImage ? newPointImage.name : "📷 Escolher Foto"}
                </label>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-2 text-center">Cor do Marcador</label>
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
                        transform: newPointColor === color ? 'scale(1.2)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <Button type="button" onClick={() => setNewPointCoords(null)} disabled={isLoading}>
                  CANCELAR
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "SALVANDO..." : "SALVAR"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};