import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const INITIAL_ZOOM = 10;
const INITIAL_CENTER = { lng: -99.1332, lat: 19.4326 };

interface Marker {
  lat: number;
  lng: number;
  label: string;
  color?: string;
  status?: string;
}

interface MapProps {
  center?: { lng: number, lat: number };
  zoom?: number;
  className?: string;
  markers?: Marker[];
}

export default function Map({ 
  center = INITIAL_CENTER, 
  zoom = INITIAL_ZOOM, 
  className, 
  markers = [] 
}: MapProps) {
  const apiKey = import.meta.env.VITE_API_KEY_MAP;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = apiKey;
    
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center,
      attributionControl: false,
      zoom: zoom
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markers.length) return;

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Crear nuevos marcadores con diseño mejorado
    markers.forEach(markerData => {
      // Crear elemento HTML personalizado para el marcador
      const el = document.createElement('div');
      el.className = 'custom-marker';
      
      // Determinar color basado en el estado o color proporcionado
      const markerColor = markerData.color || 
                         (markerData.status === 'DELETED' ? '#EF4444' : '#3B82F6');
      
      // SVG para el marcador
      el.innerHTML = `
        <div class="marker-container" style="position: relative;">
          <svg width="30" height="40" viewBox="0 0 24 24" fill="${markerColor}">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <div class="marker-label" style="
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 4px 8px;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
            margin-bottom: 8px;
          ">${markerData.label}</div>
        </div>
      `;

      // Crear el marcador
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat([markerData.lng, markerData.lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-2" style="min-width: 180px;">
              <h3 class="font-bold">${markerData.label}</h3>
              <div class="flex items-center mt-1">
                <span class="inline-block w-3 h-3 rounded-full mr-2" 
                      style="background: ${markerColor}"></span>
                <span>${markerData.status || 'Parcela'}</span>
              </div>
            </div>
          `))
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });

    // Ajustar el mapa para mostrar todos los marcadores
    if (markers.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      markers.forEach(marker => bounds.extend([marker.lng, marker.lat]));
      
      mapRef.current.fitBounds(bounds, {
        padding: {top: 50, bottom: 50, left: 50, right: 50},
        maxZoom: 15,
        duration: 1000
      });
    }

  }, [markers]);

  return (
    <div className={`${className}`} ref={mapContainerRef} />
  );
}