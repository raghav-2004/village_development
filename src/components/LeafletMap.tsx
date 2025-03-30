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
    
    // Clear any existing search marker
    if (searchMarkerRef.current) {
      mapRef.current.removeLayer(searchMarkerRef.current);
      searchMarkerRef.current = null;
    }
    
    // Add or update marker at the clicked location
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
    
    // Get the location name through reverse geocoding
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(response => response.json())
      .then(data => {
        const locationName = data.display_name || `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        
        // Update the marker with the location name
        if (locationMarkerRef.current) {
          locationMarkerRef.current.bindPopup(locationName).openPopup();
        }
        
        // Call the parent's callback with the selected location and name
        onLocationSelect({ 
          lat, 
          lng, 
          displayName: locationName 
        });
      })
      .catch(error => {
        console.error("Error reverse geocoding clicked location:", error);
        
        // Use coordinates as fallback name
        const fallbackName = `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        
        if (locationMarkerRef.current) {
          locationMarkerRef.current.bindPopup(fallbackName).openPopup();
        }
        
        // Call the parent's callback with fallback name
        onLocationSelect({ lat, lng, displayName: fallbackName });
      });
  };
  
  const searchLocation = () => {
    if (!searchInput.trim() || !mapRef.current) return;
    
    // Show loading indicator
    const loadingToast = document.createElement('div');
    loadingToast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50';
    loadingToast.textContent = 'Searching location...';
    document.body.appendChild(loadingToast);
    
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}`)
      .then(response => response.json())
      .then(data => {
        // Remove loading indicator
        if (document.body.contains(loadingToast)) {
          document.body.removeChild(loadingToast);
        }
        
        if (data.length === 0) {
          alert("Location not found. Please try a different search term.");
          return;
        }
        
        const { lat, lon, display_name } = data[0];
        const parsedLat = parseFloat(lat);
        const parsedLon = parseFloat(lon);
        
        // Remove existing search marker if any
        if (searchMarkerRef.current) {
          mapRef.current.removeLayer(searchMarkerRef.current);
        }
        
        // Remove existing location marker if any
        if (locationMarkerRef.current) {
          mapRef.current.removeLayer(locationMarkerRef.current);
        }
        
        // Add new marker and move map
        searchMarkerRef.current = window.L.marker([parsedLat, parsedLon], {
          icon: window.L.divIcon({
            className: 'search-marker',
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
        })
          .addTo(mapRef.current)
          .bindPopup(display_name || searchInput)
          .openPopup();
        
        mapRef.current.setView([parsedLat, parsedLon], 12);
        
        // Show success notification
        const successToast = document.createElement('div');
        successToast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50';
        successToast.textContent = 'Location found!';
        document.body.appendChild(successToast);
        
        // Remove success notification after 2 seconds
        setTimeout(() => {
          if (document.body.contains(successToast)) {
            document.body.removeChild(successToast);
          }
        }, 2000);
        
        // Call the parent's callback with the searched location
        onLocationSelect({ 
          lat: parsedLat, 
          lng: parsedLon, 
          displayName: display_name || searchInput 
        });
      })
      .catch(error => {
        // Remove loading indicator
        if (document.body.contains(loadingToast)) {
          document.body.removeChild(loadingToast);
        }
        
        console.error("Error fetching location:", error);
        alert("Error searching for location. Please check your connection and try again.");
      });
  };
  
  const getCurrentLocation = () => {
    if (!navigator.geolocation || !mapRef.current) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    // Show loading indicator
    const loadingToast = document.createElement('div');
    loadingToast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50';
    loadingToast.textContent = 'Getting your location...';
    document.body.appendChild(loadingToast);
    
    // Define timeout handler to provide better user experience
    const timeoutId = setTimeout(() => {
      if (document.body.contains(loadingToast)) {
        document.body.removeChild(loadingToast);
        alert("Location request is taking longer than expected. Please try again or use search instead.");
      }
    }, 20000); // 20 seconds fallback timeout for UI feedback
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Clear timeout
        clearTimeout(timeoutId);
        
        // Remove loading indicator
        if (document.body.contains(loadingToast)) {
          document.body.removeChild(loadingToast);
        }
        
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Reverse geocode to get location name
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
          .then(response => response.json())
          .then(data => {
            const locationName = data.display_name || "Your Location";
            
            // Remove existing search marker if any
            if (searchMarkerRef.current) {
              mapRef.current.removeLayer(searchMarkerRef.current);
            }
            
            // Remove existing location marker if any
            if (locationMarkerRef.current) {
              mapRef.current.removeLayer(locationMarkerRef.current);
            }
            
            // Add marker at current location
            searchMarkerRef.current = window.L.marker([lat, lon], {
              icon: window.L.divIcon({
                className: 'current-location-marker',
                html: `
                  <div class="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                `,
                iconSize: [32, 32],
                iconAnchor: [16, 32]
              })
            })
              .addTo(mapRef.current)
              .bindPopup(locationName)
              .openPopup();
            
            // Move map to current location
            mapRef.current.setView([lat, lon], 14);
            
            // Call the parent's callback with the current location
            onLocationSelect({ lat, lng: lon, displayName: locationName });
          })
          .catch(error => {
            console.error("Error reverse geocoding:", error);
            
            // Still show the marker even if reverse geocoding fails
            const fallbackName = "Your Location";
            
            // Add marker with fallback name
            searchMarkerRef.current = window.L.marker([lat, lon], {
              icon: window.L.divIcon({
                className: 'current-location-marker',
                html: `
                  <div class="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                `,
                iconSize: [32, 32],
                iconAnchor: [16, 32]
              })
            })
              .addTo(mapRef.current)
              .bindPopup(fallbackName)
              .openPopup();
            
            mapRef.current.setView([lat, lon], 14);
            onLocationSelect({ lat, lng: lon, displayName: fallbackName });
          });
      },
      (error) => {
        // Clear timeout
        clearTimeout(timeoutId);
        
        // Remove loading indicator
        if (document.body.contains(loadingToast)) {
          document.body.removeChild(loadingToast);
        }
        
        console.error("Error getting location:", error);
        let errorMessage = "Unable to retrieve your location.";
        
        // Provide more specific error messages
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied. Please enable location services in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please try again later.";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get your location timed out. Please try using the search feature instead.";
            break;
        }
        
        // Show user-friendly error notification instead of alert
        const errorToast = document.createElement('div');
        errorToast.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg z-50';
        errorToast.textContent = errorMessage;
        document.body.appendChild(errorToast);
        
        // Remove error notification after 5 seconds
        setTimeout(() => {
          if (document.body.contains(errorToast)) {
            document.body.removeChild(errorToast);
          }
        }, 5000);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 30000,  // 30 seconds timeout (increased from 10)
        maximumAge: 0    // Don't use cached position
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