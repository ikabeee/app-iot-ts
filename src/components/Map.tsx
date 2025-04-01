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
  description?: string;
  lastUpdate?: string;
  location?: string;
  manager?: string;
  cropType?: string;
  lastWatering?: string;
  id?: number;
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
      
      // SVG para el marcador con animación al hover
      el.innerHTML = `
        <div class="marker-container" style="position: relative;">
          ${markerData.status === 'DELETED' ? `
            <div class="marker-pulse" style="
              position: absolute;
              width: 30px;
              height: 30px;
              background: ${markerColor};
              border-radius: 50%;
              opacity: 0.2;
              animation: deletedPulse 2s infinite;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            "></div>
            <div class="deleted-overlay" style="
              position: absolute;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1;
            ">
              <div style="
                width: 2px;
                height: 40px;
                background: ${markerColor};
                transform: rotate(45deg);
                opacity: 0.8;
              "></div>
            </div>
          ` : `
            <div class="marker-pulse" style="
              position: absolute;
              width: 30px;
              height: 30px;
              background: ${markerColor};
              border-radius: 50%;
              opacity: 0.3;
              animation: pulse 2s infinite;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            "></div>
          `}
          <svg width="30" height="40" viewBox="0 0 24 24" fill="${markerColor}" 
               style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); transition: all 0.3s ease-in-out; cursor: pointer;">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <div class="marker-label" style="
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 8px 12px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
            margin-bottom: 8px;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(0,0,0,0.08);
            backdrop-filter: blur(8px);
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 250px;
            ${markerData.status === 'DELETED' ? 'text-decoration: line-through; color: #EF4444;' : ''}
          ">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" style="background: ${markerColor}"></div>
                <span class="font-semibold">${markerData.label}</span>
              </div>
              ${markerData.status ? `
                <div class="px-2 py-0.5 text-xs font-medium rounded-full" 
                     style="background: ${markerColor}15; color: ${markerColor}; border: 1px solid ${markerColor}30">
                  ${markerData.status === 'DELETED' ? 'Eliminado' : markerData.status}
                </div>
              ` : ''}
            </div>
            ${markerData.location ? `
              <div class="text-xs text-gray-600 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>${markerData.location}</span>
              </div>
            ` : ''}
            ${markerData.manager ? `
              <div class="text-xs text-gray-600 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span>${markerData.manager}</span>
              </div>
            ` : ''}
            ${markerData.cropType ? `
              <div class="text-xs text-gray-600 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>${markerData.cropType}</span>
              </div>
            ` : ''}
            ${markerData.lastWatering ? `
              <div class="text-xs text-gray-500 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
                <span>Último riego: ${new Date(markerData.lastWatering).toLocaleDateString()}</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      // Añadir eventos hover al marcador
      el.addEventListener('mouseenter', () => {
        const svg = el.querySelector('svg') as SVGElement;
        const label = el.querySelector('.marker-label') as HTMLElement;
        const overlay = el.querySelector('.deleted-overlay') as HTMLElement;
        if (svg) {
          svg.style.transform = 'scale(1.2) translateY(-2px)';
          svg.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))';
        }
        if (label) {
          label.style.opacity = '1';
          label.style.transform = 'translateX(-50%) translateY(-2px)';
        }
        if (overlay && markerData.status === 'DELETED') {
          overlay.style.opacity = '0.5';
        }
      });

      el.addEventListener('mouseleave', () => {
        const svg = el.querySelector('svg') as SVGElement;
        const label = el.querySelector('.marker-label') as HTMLElement;
        const overlay = el.querySelector('.deleted-overlay') as HTMLElement;
        if (svg) {
          svg.style.transform = 'scale(1) translateY(0)';
          svg.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))';
        }
        if (label) {
          label.style.opacity = '0';
          label.style.transform = 'translateX(-50%) translateY(0)';
        }
        if (overlay && markerData.status === 'DELETED') {
          overlay.style.opacity = '0.8';
        }
      });

      // Crear el marcador con popup mejorado
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat([markerData.lng, markerData.lat])
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