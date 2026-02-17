import React, { useRef, useEffect, useState } from 'react';



function useGoogleReady() {
  const [ready, setReady] = useState(() => Boolean(window.google?.maps?.places));
  useEffect(() => {
    if (window.google?.maps?.places) {
      setReady(true);
      return;
    }
    const id = setInterval(() => {
      if (window.google?.maps?.places) {
        setReady(true);
        clearInterval(id);
      }
    }, 100);
    return () => clearInterval(id);
  }, []);
  return ready;
}

export default function PlaceInputWithMap({ value, onChange, placeholder, onRemove, showRemove }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const googleReady = useGoogleReady();

  onChangeRef.current = onChange;

 
  useEffect(() => {
    if (!googleReady || !inputRef.current || autocompleteRef.current) return;
    const Autocomplete = window.google.maps.places.Autocomplete;
    const autocomplete = new Autocomplete(inputRef.current, {
      types: ['establishment', 'geocode'],
      fields: ['formatted_address', 'geometry'],
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) onChangeRef.current(place.formatted_address);
    });
    autocompleteRef.current = autocomplete;
    return () => {
      if (window.google?.maps?.event?.clearInstanceListeners) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
      autocompleteRef.current = null;
    };
  }, [googleReady]);

 
  useEffect(() => {
    if (!mapModalOpen || !googleReady || !mapRef.current) return;
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 20.5937, lng: 78.9629 },
      zoom: 5,
    });
    const geocoder = new window.google.maps.Geocoder();
    const listener = map.addListener('click', (e) => {
      const latLng = e.latLng;
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK' && results?.[0]?.formatted_address) {
          onChangeRef.current(results[0].formatted_address);
          setMapModalOpen(false);
        }
      });
    });
    mapInstanceRef.current = map;
    return () => {
      window.google.maps.event.removeListener(listener);
      mapInstanceRef.current = null;
    };
  }, [mapModalOpen, googleReady]);

  return (
    <>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-slate-800 p-2 rounded border border-slate-700 focus:border-indigo-500 outline-none"
          required
        />
        <button
          type="button"
          onClick={() => setMapModalOpen(true)}
          className="px-3 py-2 rounded border border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Pick location on map"
        >
          📍
        </button>
        {showRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="px-3 text-red-400 hover:bg-red-400/10 rounded border border-red-400/30"
          >
            ✕
          </button>
        )}
      </div>

      
      {mapModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setMapModalOpen(false)}
        >
          <div
            className="bg-slate-900 rounded-xl shadow-2xl overflow-hidden max-w-2xl w-full max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-slate-700 flex justify-between items-center">
              <span className="text-sm text-slate-300">Click on the map to select a place</span>
              <button
                type="button"
                onClick={() => setMapModalOpen(false)}
                className="text-slate-400 hover:text-white px-2 py-1"
              >
                ✕
              </button>
            </div>
            <div ref={mapRef} className="w-full h-[400px] bg-slate-800" />
          </div>
        </div>
      )}
    </>
  );
}
