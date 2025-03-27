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
            padding: 6px 12px;
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
            font-size: 13px;
            font-weight: 600;
            white-space: nowrap;
            margin-bottom: 8px;
            opacity: 0;
            transition: all 0.3s ease-in-out;
            border: 1px solid rgba(0,0,0,0.1);
            backdrop-filter: blur(4px);
            ${markerData.status === 'DELETED' ? 'text-decoration: line-through; color: #EF4444;' : ''}
          ">${markerData.label}</div>
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
        .setPopup(new mapboxgl.Popup({ 
          offset: 25,
          className: 'custom-popup',
          maxWidth: '300px'
        })
          .setHTML(`
            <div class="p-4" style="min-width: 250px;">
              <div class="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 rounded-full" style="background: ${markerColor}"></div>
                  <h3 class="font-bold text-lg text-gray-800">${markerData.label}</h3>
                </div>
                <span class="px-2 py-1 text-xs font-medium rounded-full" 
                      style="background: ${markerColor}20; color: ${markerColor}">
                  ${markerData.status === 'DELETED' ? 'Eliminado' : (markerData.status || 'Activo')}
                </span>
              </div>
              <div class="space-y-3">
                ${markerData.description ? `
                  <div class="text-sm">
                    <div class="flex items-center text-gray-500 mb-1">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span class="font-medium">Descripción</span>
                    </div>
                    <p class="text-gray-600 leading-relaxed">${markerData.description}</p>
                  </div>
                ` : ''}
                ${markerData.lastUpdate ? `
                  <div class="text-sm">
                    <div class="flex items-center text-gray-500 mb-1">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span class="font-medium">Última actualización</span>
                    </div>
                    <p class="text-gray-600">${markerData.lastUpdate}</p>
                  </div>
                ` : ''}
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