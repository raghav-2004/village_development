import React from 'react';
import Map, { NavigationControl, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export function MapView() {
  const [viewState, setViewState] = React.useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4
  });

  return (
    <div className="h-[calc(100vh-4rem)]">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken="pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja2V4" // Replace with your Mapbox token
      >
        <NavigationControl position="top-right" />
      </Map>
    </div>
  );
}