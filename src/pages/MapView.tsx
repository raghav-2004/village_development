import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Village, villages } from '../lib/mockData';
import { VillageDetails } from '../components/VillageDetails';
import { LocationDetails } from '../components/LocationDetails';
import { LeafletMap } from '../components/LeafletMap';

// This ensures the Leaflet script is loaded before rendering
function useLeaflet() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Skip if already loaded
    if (window.L) {
      setIsLoaded(true);
      return;
    }

    // Create CSS link
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    cssLink.crossOrigin = '';
    document.head.appendChild(cssLink);

    // Create script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = () => setIsLoaded(true);
    
    document.head.appendChild(script);

    // Cleanup
    return () => {
      document.head.removeChild(cssLink);
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return isLoaded;
}

interface SelectedLocation {
  lat: number;
  lng: number;
  displayName?: string;
}

export function MapView() {
  const { user } = useAuth();
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const leafletLoaded = useLeaflet();

  const handleVillageSelect = (village: Village) => {
    setSelectedVillage(village);
    setSelectedLocation(null); // Close location details if open
  };

  const handleLocationSelect = (location: SelectedLocation) => {
    setSelectedLocation(location);
    setSelectedVillage(null); // Close village details if open
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Top section with title */}
      <div className="bg-green-600 text-white p-4">
        <h1 className="text-2xl font-bold">gramMITRA - Map View</h1>
      </div>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-64 bg-white p-4 shadow-md overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">Land Survey Tools</h2>
          <p className="text-sm text-gray-600 mb-4">
            {user ? 'Explore villages and land details' : 'Login to use survey tools'}
          </p>
          <div className="text-sm text-gray-600">
            <h3 className="font-medium mb-1">Available Villages:</h3>
            <ul className="space-y-1">
              {villages.map(village => (
                <li key={village.id}>
                  <button 
                    onClick={() => handleVillageSelect(village)}
                    className="flex items-center text-left w-full px-2 py-1 hover:bg-green-100 rounded"
                  >
                    <span className="mr-1 text-green-600">🏠</span>
                    {village.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 font-medium">Instructions:</p>
            <ul className="text-xs text-gray-600 mt-1 space-y-1 list-disc pl-4">
              <li>Click anywhere on the map to get detailed information</li>
              <li>Use the search box to find specific locations</li>
              <li>Click on village pins (red) for predefined village data</li>
            </ul>
          </div>
        </div>
        
        {/* Center - Map */}
        <div className="flex-1 h-full">
          {leafletLoaded ? (
            <LeafletMap 
              villages={villages} 
              onVillageSelect={handleVillageSelect}
              onLocationSelect={handleLocationSelect}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <p className="text-gray-600">Loading map...</p>
            </div>
          )}
        </div>
        
        {/* Right sidebar - details panel */}
        <div className="w-96 bg-white shadow-inner overflow-y-auto">
          {selectedVillage ? (
            <div className="h-full">
              <div className="bg-green-600 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">{selectedVillage.name}</h2>
                <button 
                  onClick={() => setSelectedVillage(null)} 
                  className="p-1 hover:bg-green-500 rounded text-white"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <p className="text-gray-700 mb-4">{selectedVillage.description}</p>
                
                <h3 className="text-lg font-semibold mb-2">Village Overview</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Population</span>
                    <p className="font-semibold">{selectedVillage.population.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Total Area</span>
                    <p className="font-semibold">{selectedVillage.area.size} km²</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">Land Distribution</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Agricultural</span>
                    <p className="font-semibold">{selectedVillage.area.agricultural}%</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Residential</span>
                    <p className="font-semibold">{selectedVillage.area.residential}%</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Forest</span>
                    <p className="font-semibold">{selectedVillage.area.forest}%</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Other</span>
                    <p className="font-semibold">{selectedVillage.area.other}%</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">Water Resources</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Ponds</span>
                    <p className="font-semibold">{selectedVillage.waterBodies.ponds}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Lakes</span>
                    <p className="font-semibold">{selectedVillage.waterBodies.lakes}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Rivers</span>
                    <p className="font-semibold">{selectedVillage.waterBodies.rivers ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Groundwater Level</span>
                    <p className="font-semibold">{selectedVillage.waterBodies.groundwaterLevel} m</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">Environmental Conditions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Humidity</span>
                    <p className="font-semibold">{selectedVillage.environment.humidity}%</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Rainfall</span>
                    <p className="font-semibold">{selectedVillage.environment.averageRainfall} mm/year</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Soil Type</span>
                    <p className="font-semibold">{selectedVillage.environment.soilType}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Avg. Temperature</span>
                    <p className="font-semibold">{selectedVillage.environment.averageTemperature}°C</p>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedLocation ? (
            <div className="h-full">
              <div className="bg-green-600 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Location Details</h2>
                <button 
                  onClick={() => setSelectedLocation(null)} 
                  className="p-1 hover:bg-green-500 rounded text-white"
                >
                  ✕
                </button>
              </div>
              <LocationDetails 
                location={selectedLocation} 
                onClose={() => setSelectedLocation(null)} 
                embedded={true}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center p-8">
                <p className="text-lg mb-2">No Location Selected</p>
                <p className="text-sm">Click anywhere on the map or select a village to see detailed information</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}