import React, { useEffect, useRef, useState } from 'react';
import { Village } from '../lib/mockData';

// These will be added in the HTML, so we're just declaring the types here
declare global {
  interface Window {
    L: any;
  }
}

interface LeafletMapProps {
  villages: Village[];
  onVillageSelect: (village: Village) => void;
  onLocationSelect: (location: { lat: number; lng: number; displayName?: string }) => void;
}

export function LeafletMap({ villages, onVillageSelect, onLocationSelect }: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [searchInput, setSearchInput] = useState('');
  const mapRef = useRef<any>(null);
  const villageMarkersRef = useRef<any[]>([]);
  const searchMarkerRef = useRef<any>(null);
  const locationMarkerRef = useRef<any>(null);
  
  // Initialize the map
  useEffect(() => {
    // Make sure the HTML has loaded the Leaflet scripts first
    if (!window.L || !mapContainerRef.current) return;
    
    // Create the map if it doesn't exist yet
    if (!mapRef.current) {
      mapRef.current = window.L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);
      
      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);

      // Add click handler to map
      mapRef.current.on('click', handleMapClick);
    }
    
    // Add markers for villages
    villages.forEach(village => {
      const marker = window.L.marker([village.location.latitude, village.location.longitude], {
        icon: window.L.divIcon({
          className: 'village-marker',
          html: `
            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white shadow-md text-sm font-bold">
              <span>V</span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        })
      })
        .addTo(mapRef.current)
        .bindPopup(`<b>${village.name}</b><br>Population: ${village.population}<br><button class="leaflet-details-btn">View Details</button>`);
      
      marker.on('popupopen', () => {
        // Find the button inside the popup
        setTimeout(() => {
          const detailsBtn = document.querySelector('.leaflet-details-btn');
          if (detailsBtn) {
            detailsBtn.addEventListener('click', () => {
              onVillageSelect(village);
              marker.closePopup();
            });
          }
        }, 100);
      });
      
      villageMarkersRef.current.push(marker);
    });
    
    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.off('click', handleMapClick);
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [villages, onVillageSelect, onLocationSelect]);

  // Handle clicking on the map
  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng;
    
    // Add a marker at the clicked location
    if (locationMarkerRef.current) {
      mapRef.current.removeLayer(locationMarkerRef.current);
    }
    
    locationMarkerRef.current = window.L.marker([lat, lng], {
      icon: window.L.divIcon({
        className: 'location-marker',
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      })
    }).addTo(mapRef.current);
    
    // Call the parent's callback with the selected location
    onLocationSelect({ lat, lng });
  };
  
  const searchLocation = () => {
    if (!searchInput.trim() || !mapRef.current) return;
    
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}`)
      .then(response => response.json())
      .then(data => {
        if (data.length === 0) {
          alert("Location not found.");
          return;
        }
        
        const { lat, lon } = data[0];
        
        // Remove existing search marker if any
        if (searchMarkerRef.current) {
          mapRef.current.removeLayer(searchMarkerRef.current);
        }
        
        // Add new marker and move map
        searchMarkerRef.current = window.L.marker([lat, lon], {
          icon: window.L.divIcon({
            className: 'search-marker',
            html: `
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 32]
          })
        })
          .addTo(mapRef.current)
          .bindPopup(`${searchInput}`)
          .openPopup();
        
        mapRef.current.setView([lat, lon], 12);
        
        // Call the parent's callback with the searched location
        onLocationSelect({ lat: parseFloat(lat), lng: parseFloat(lon), displayName: searchInput });
      })
      .catch(error => {
        console.error("Error fetching location:", error);
        alert("Error searching for location. Please try again.");
      });
  };
  
  const getCurrentLocation = () => {
    if (!navigator.geolocation || !mapRef.current) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Remove existing search marker if any
        if (searchMarkerRef.current) {
          mapRef.current.removeLayer(searchMarkerRef.current);
        }
        
        // Add marker at current location
        searchMarkerRef.current = window.L.marker([lat, lon], {
          icon: window.L.divIcon({
            className: 'current-location-marker',
            html: `
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 32]
          })
        })
          .addTo(mapRef.current)
          .bindPopup("Your Location")
          .openPopup();
        
        // Move map to current location
        mapRef.current.setView([lat, lon], 14);
        
        // Call the parent's callback with the current location
        onLocationSelect({ lat, lng: lon, displayName: "Your Location" });
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location.");
      }
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 shadow-md z-10 flex gap-2">
        <input
          type="text"
          id="locationInput"
          placeholder="Search for a location..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
        />
        <button
          onClick={searchLocation}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Search
        </button>
        <button
          onClick={getCurrentLocation}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          My Location
        </button>
      </div>
      <div 
        ref={mapContainerRef} 
        id="mapContainer" 
        className="flex-1"
      ></div>
      <div className="bg-white p-3 border-t border-gray-200 text-sm text-gray-600">
        <p>🟢 Click anywhere on map | 🔴 Predefined village | 🟢 Search result | 🟣 Your location</p>
      </div>
    </div>
  );
} 