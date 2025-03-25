import React, { useEffect, useState } from 'react';
import { X, Droplets, Wind, Thermometer, MapPin } from 'lucide-react';
import { villagesAPI } from '../lib/api';

interface LocationDetailsProps {
  location: {
    lat: number;
    lng: number;
    displayName?: string;
  };
  onClose: () => void;
  embedded?: boolean; // New prop to support embedded mode
}

interface LocationData {
  address?: {
    village?: string;
    town?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
  };
  displayName: string;
  environmentalData?: {
    temperature?: number;
    humidity?: number;
    rainfall?: number;
    soilMoisture?: number;
  };
  loading: boolean;
}

export function LocationDetails({ location, onClose, embedded = false }: LocationDetailsProps) {
  const [locationData, setLocationData] = useState<LocationData>({
    displayName: "Loading location data...",
    loading: true
  });

  // Fetch location details from Nominatim
  useEffect(() => {
    const fetchLocationInfo = async () => {
      try {
        // Reverse geocoding with Nominatim
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
        );
        const data = await response.json();
        
        setLocationData(prev => ({
          ...prev,
          address: data.address,
          displayName: location.displayName || data.display_name || `Location (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`,
          loading: false
        }));

        // Fetch environmental data from our API
        fetchEnvironmentalData(location.lat, location.lng);
      } catch (error) {
        console.error("Error fetching location info:", error);
        setLocationData(prev => ({
          ...prev,
          displayName: `Location (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`,
          loading: false
        }));
      }
    };

    fetchLocationInfo();
  }, [location]);

  // Fetch environmental data from our API
  const fetchEnvironmentalData = async (lat: number, lng: number) => {
    try {
      const data = await villagesAPI.getEnvironmentalData(lat, lng);
      
      setLocationData(prev => ({
        ...prev,
        environmentalData: data
      }));
    } catch (error) {
      console.error("Error fetching environmental data:", error);
    }
  };

  const getAreaName = () => {
    const { address } = locationData;
    if (!address) return "Unknown Area";
    
    return address.village || address.town || address.city || address.county || "Unknown Area";
  };

  // For embedded mode, render content without the outer container
  if (embedded) {
    return (
      <div className="p-5 space-y-6">
        {locationData.loading ? (
          <div className="py-10 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mb-2"></div>
            <p>Loading location data...</p>
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-lg font-semibold mb-2">Location Details</h3>
              <p className="text-gray-700 mb-4">{locationData.displayName}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-500">Latitude</span>
                  <p className="font-semibold">{location.lat.toFixed(6)}°</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-500">Longitude</span>
                  <p className="font-semibold">{location.lng.toFixed(6)}°</p>
                </div>
              </div>
            </div>

            {locationData.address && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Administrative Area</h3>
                <div className="space-y-2">
                  {locationData.address.village && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-500">Village</span>
                      <p className="font-semibold">{locationData.address.village}</p>
                    </div>
                  )}
                  {locationData.address.county && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-500">District/County</span>
                      <p className="font-semibold">{locationData.address.county}</p>
                    </div>
                  )}
                  {locationData.address.state && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-500">State</span>
                      <p className="font-semibold">{locationData.address.state}</p>
                    </div>
                  )}
                  {locationData.address.country && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-500">Country</span>
                      <p className="font-semibold">{locationData.address.country}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {locationData.environmentalData && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Wind className="mr-2 text-green-600" size={20} />
                  Environmental Conditions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Temperature</span>
                    <p className="font-semibold">{locationData.environmentalData.temperature}°C</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Humidity</span>
                    <p className="font-semibold">{locationData.environmentalData.humidity}%</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Annual Rainfall</span>
                    <p className="font-semibold">{locationData.environmentalData.rainfall} mm/year</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Soil Moisture</span>
                    <p className="font-semibold">{locationData.environmentalData.soilMoisture}%</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Note: This is estimated environmental data for demonstration purposes.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // Standard non-embedded mode
  return (
    <div className="fixed right-4 top-20 bg-white shadow-xl rounded-lg w-96 z-10 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="flex justify-between items-center bg-green-600 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold flex items-center">
          <MapPin className="mr-2" size={20} />
          {locationData.loading ? "Loading..." : getAreaName()}
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-green-500 rounded">
          <X size={20} />
        </button>
      </div>
      
      <div className="p-5 space-y-6">
        {locationData.loading ? (
          <div className="py-10 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mb-2"></div>
            <p>Loading location data...</p>
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-lg font-semibold mb-2">Location Details</h3>
              <p className="text-gray-700 mb-4">{locationData.displayName}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-500">Latitude</span>
                  <p className="font-semibold">{location.lat.toFixed(6)}°</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-500">Longitude</span>
                  <p className="font-semibold">{location.lng.toFixed(6)}°</p>
                </div>
              </div>
            </div>

            {locationData.address && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Administrative Area</h3>
                <div className="space-y-2">
                  {locationData.address.village && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-500">Village</span>
                      <p className="font-semibold">{locationData.address.village}</p>
                    </div>
                  )}
                  {locationData.address.county && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-500">District/County</span>
                      <p className="font-semibold">{locationData.address.county}</p>
                    </div>
                  )}
                  {locationData.address.state && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-500">State</span>
                      <p className="font-semibold">{locationData.address.state}</p>
                    </div>
                  )}
                  {locationData.address.country && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-500">Country</span>
                      <p className="font-semibold">{locationData.address.country}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {locationData.environmentalData && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Wind className="mr-2 text-green-600" size={20} />
                  Environmental Conditions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Temperature</span>
                    <p className="font-semibold">{locationData.environmentalData.temperature}°C</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Humidity</span>
                    <p className="font-semibold">{locationData.environmentalData.humidity}%</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Annual Rainfall</span>
                    <p className="font-semibold">{locationData.environmentalData.rainfall} mm/year</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Soil Moisture</span>
                    <p className="font-semibold">{locationData.environmentalData.soilMoisture}%</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Note: This is estimated environmental data for demonstration purposes.
                </p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Click anywhere on the map to get information about different locations.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 