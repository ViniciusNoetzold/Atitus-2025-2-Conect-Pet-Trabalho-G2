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
      console.error("Erro ao carregar marcadores:", error.message);
    }
  }, []);
  useEffect(() => {
    loadMarkers();
  }, [loadMarkers]);
  const handleMapClick = (event) => {
    setSelectedMarker(null);
    setNewPointCoords({ lat: event.latLng.lat(), lng: event.latLng.lng() });
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
      await postPoint(formData);
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
      <Navbar onFilterMyPets={() => setShowMyPetsOnly(!showMyPetsOnly)} showMyPetsOnly={showMyPetsOnly} />
      <div style={{ width: "100%", height: "calc(100vh - 65px)" }}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={12}
            onClick={handleMapClick}
          >
            { }
            {(showMyPetsOnly ? markers.filter(m => m.isMyPet) : markers).map(marker => (
              <Marker
                key={marker.id}
                position={marker.position}
                onClick={() => setSelectedMarker(marker)}
                icon={{
                  path: PIN_ICON_PATH,
                  fillColor: marker.color,
                  fillOpacity: 1,
                  strokeWeight: 1,
                  strokeColor: "#000",
                  scale: 2,
                  anchor: { x: 12, y: 24 }
                }}
              />
            ))}
            { }
            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.position}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-3 bg-[#F7EEDD] border-[3px] border-black max-w-[250px] text-black">
                  <h3 className="font-bold text-lg mb-2 border-b-2 border-black pb-1 uppercase">{selectedMarker.title}</h3>
                  {selectedMarker.imageUrl && (
                    <img
                      src={selectedMarker.imageUrl}
                      alt="Pet"
                      className="w-full h-[150px] object-cover border-2 border-black mb-2"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                </div>
              </InfoWindow>
            )}
            { }
            {newPointCoords && (
              <Marker position={newPointCoords} icon={{ path: PIN_ICON_PATH, fillColor: newPointColor, fillOpacity: 0.7, scale: 2, anchor: { x: 12, y: 24 }, strokeWeight: 1 }} />
            )}
          </GoogleMap>
        ) : (
          <div className="flex justify-center items-center h-full text-white">Carregando...</div>
        )}
        { }
        {newPointCoords && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#F7EEDD] p-6 border-4 border-black shadow-[10px_10px_0_0_#A35E49] z-20 w-80 text-black">
            <h2 className="text-xl font-bold mb-4 uppercase text-center">Novo Pet</h2>
            <form onSubmit={handleSavePoint}>
              <div className="mb-4">
                <Input label="Descrição" value={newPointDescription} onChange={(e) => setNewPointDescription(e.target.value)} disabled={isLoading} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Foto</label>
                <input type="file" accept="image/*" onChange={(e) => setNewPointImage(e.target.files[0])} className="block w-full text-sm" />
              </div>
              <div className="mb-6 flex justify-center gap-3">
                {COLOR_OPTIONS.map(color => (
                  <button key={color} type="button" onClick={() => setNewPointColor(color)} style={{ backgroundColor: color, width: 32, height: 32, borderRadius: '50%', border: newPointColor === color ? '3px solid #000' : '2px solid #fff' }} />
                ))}
              </div>
              <div className="flex justify-center gap-3">
                <Button type="button" onClick={() => setNewPointCoords(null)} disabled={isLoading}>Cancelar</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? "..." : "Salvar"}</Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};