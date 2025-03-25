import { useRef, useEffect, useState } from 'react';
import Map, { NavigationControl, Source, Layer } from 'react-map-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAuth } from '../contexts/AuthContext';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja2V4'; // Replace with your token

export function MapView() {
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4
  });
  const { user } = useAuth();

  const [landParcels, setLandParcels] = useState({
    type: 'FeatureCollection',
    features: []
  });

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    });

    map.addControl(draw);

    map.on('draw.create', updateArea);
    map.on('draw.delete', updateArea);
    map.on('draw.update', updateArea);

    function updateArea(e) {
      const data = draw.getAll();
      setLandParcels(data);
    }

    return () => {
      map.removeControl(draw);
    };
  }, []);

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Land Survey Tools</h2>
        <p className="text-sm text-gray-600 mb-4">
          {user ? 'Draw polygons to mark land parcels' : 'Login to use survey tools'}
        </p>
      </div>
      
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />
        
        <Source type="geojson" data={landParcels}>
          <Layer
            id="land-parcels"
            type="fill"
            paint={{
              'fill-color': '#0080ff',
              'fill-opacity': 0.5
            }}
          />
          <Layer
            id="land-parcels-outline"
            type="line"
            paint={{
              'line-color': '#0080ff',
              'line-width': 2
            }}
          />
        </Source>
      </Map>
    </div>
  );
}