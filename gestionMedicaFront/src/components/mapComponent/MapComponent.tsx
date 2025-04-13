import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  direccionInicial: string;
  onSelect: (direccion: string) => void;
}

const fallbackPosition: [number, number] = [41.6529, -4.7286]; // Valladolid

const MapComponent: React.FC<MapComponentProps> = ({ direccionInicial, onSelect }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [direccionActual, setDireccionActual] = useState<string>('');
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null); // AHORA es null al inicio

  const markerIcon = L.icon({
    iconUrl: '/customMarker.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(direccionInicial)}&format=json`
        );
        const data = await res.json();
        if (data?.length > 0) {
          const { lat, lon } = data[0];
          const coords: [number, number] = [parseFloat(lat), parseFloat(lon)];
          setPosition(coords);
          setMapCenter(coords);
          setDireccionActual(direccionInicial);
        }
      } catch (err) {
        console.warn('No se pudo obtener la ubicación desde la dirección inicial. Se usará fallback.');
        setMapCenter(fallbackPosition);
      }
    };

    if (direccionInicial) {
      fetchCoords();
    }
  }, [direccionInicial]);

  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await response.json();
          const direccion = data.display_name || `${lat}, ${lng}`;
          setDireccionActual(direccion);
          onSelect(direccion);
        } catch (error) {
          console.error('Error obteniendo dirección:', error);
        }
      },
    });

    return null;
  };

  return (
    <div className="mapWrapper">
      {mapCenter ? (
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '300px', width: '100%', borderRadius: '12px' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <MapClickHandler />
          {position && <Marker position={position} icon={markerIcon} />}
        </MapContainer>
      ) : (
        <div className="spinnerContainer">
          <p>Cargando mapa...</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
