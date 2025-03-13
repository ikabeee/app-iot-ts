/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, } from "react"
import mapboxgl from 'mapbox-gl'

const INITIAL_ZOOM = 10;
const INITIAL_CENTER = { lng: -99.1332, lat: 19.4326 }
interface mapProps{
    center?: {lng: number, lat: number},
    zoom?: number,
    className?: string
}
export default function Map({center=INITIAL_CENTER, zoom= INITIAL_ZOOM, className}: mapProps) {
    const apiKey = import.meta.env.VITE_API_KEY_MAP;
    const map = useRef<mapboxgl.Map>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mapboxgl.accessToken = apiKey;
        /* If mapContainer exist */
        if (mapContainerRef.current) {
            map.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: center,
                attributionControl: false,
                zoom: zoom
            });
        }
        return () => { map.current?.remove() };
    }, [])



    return (
            <div className={`${className}`} id="map-container" ref={mapContainerRef} />
    )
}