import React, { useEffect, useState } from 'react';
import { X, Droplets, Wind, Thermometer, MapPin, Lightbulb, Sprout, Zap } from 'lucide-react';
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
  recommendations?: {
    crops: string[];
    waterManagement: string;
    renewableEnergy: string;
    infrastructure: string;
    priority: 'high' | 'medium' | 'low';
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
      
      // Generate AI recommendations based on environmental data
      const recommendations = generateRecommendations(data);
      
      setLocationData(prev => ({
        ...prev,
        environmentalData: data,
        recommendations
      }));
    } catch (error) {
      console.error("Error fetching environmental data:", error);
    }
  };

  // Generate recommendations based on environmental data
  const generateRecommendations = (data: any) => {
    const { temperature, humidity, rainfall, soilMoisture } = data;
    
    // Determine suitable crops based on environmental factors and Indian agricultural regions
    let crops = [];
    if (temperature > 28 && rainfall > 1200 && soilMoisture > 35) {
      // Hot, wet conditions - suitable for tropical crops
      crops = ['Rice', 'Coconut', 'Rubber', 'Spices'];
    } else if (temperature > 25 && rainfall > 1000 && soilMoisture > 30) {
      // Warm, humid conditions
      crops = ['Rice', 'Sugarcane', 'Jute', 'Tropical Fruits'];
    } else if (temperature > 22 && rainfall > 800 && soilMoisture > 25) {
      // Moderate rainfall zones
      crops = ['Cotton', 'Pulses', 'Sorghum', 'Millet'];
    } else if (temperature > 20 && rainfall > 600 && soilMoisture > 20) {
      // Semi-arid regions
      crops = ['Wheat', 'Barley', 'Mustard', 'Chickpeas'];
    } else if (temperature < 20 && rainfall > 500) {
      // Cooler highland regions
      crops = ['Potatoes', 'Apples', 'Tea', 'Peas'];
    } else {
      // Arid/drought-prone regions
      crops = ['Pearl Millet (Bajra)', 'Cluster Bean (Guar)', 'Moth Bean', 'Drought-resistant Wheat'];
    }
    
    // Water management recommendations based on rainfall patterns
    let waterManagement;
    if (rainfall < 600) {
      waterManagement = 'Critical drought mitigation: Implement micro-irrigation, rainwater harvesting structures, and drought-resistant farming techniques';
    } else if (rainfall < 800) {
      waterManagement = 'Water conservation focus: Drip irrigation systems, farm ponds, and moisture retention techniques essential';
    } else if (rainfall < 1200) {
      waterManagement = 'Balanced water management: Periodic irrigation infrastructure with groundwater recharge systems';
    } else if (rainfall < 1800) {
      waterManagement = 'Excess water management: Drainage systems and water storage for dry seasons needed';
    } else {
      waterManagement = 'Flood control priority: Embankments, drainage networks, and water diversion structures essential';
    }
    
    // Renewable energy recommendations based on climate
    let renewableEnergy;
    if (temperature > 25 && rainfall < 1000) {
      renewableEnergy = 'High solar potential: Industrial-scale solar farms with battery storage systems';
    } else if (temperature > 22 && humidity < 60) {
      renewableEnergy = 'Mixed solar-wind potential: Hybrid renewable systems with grid integration';
    } else if (rainfall > 1500) {
      renewableEnergy = 'Micro-hydropower potential: Small-scale hydro installations combined with solar backup';
    } else if (humidity > 70 && temperature > 25) {
      renewableEnergy = 'Biomass potential: Agricultural waste to energy systems with solar augmentation';
    } else {
      renewableEnergy = 'Community solar microgrids with decentralized energy management systems';
    }
    
    // Infrastructure recommendations based on environmental challenges
    let infrastructure;
    let priority: 'high' | 'medium' | 'low' = 'medium';
    
    if (rainfall > 1800) {
      infrastructure = 'Flood-resistant architecture, elevated roadways, and comprehensive drainage systems';
      priority = 'high';
    } else if (rainfall < 600 && soilMoisture < 20) {
      infrastructure = 'Water conservation infrastructure including rainwater harvesting mandates and irrigation canals';
      priority = 'high';
    } else if (temperature > 32) {
      infrastructure = 'Heat-resistant building materials, green spaces, and cooling centers for vulnerable populations';
      priority = 'high';
    } else if (temperature < 15) {
      infrastructure = 'Cold-resistant infrastructure with improved insulation and heating systems';
      priority = 'medium';
    } else if (humidity > 75) {
      infrastructure = 'Mold-resistant construction and improved ventilation systems';
      priority = 'medium';
    } else {
      infrastructure = 'Balanced rural infrastructure focusing on connectivity, utilities, and community facilities';
      priority = 'low';
    }
    
    return {
      crops,
      waterManagement,
      renewableEnergy,
      infrastructure,
      priority
    };
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
            
            {/* AI Recommendations Section */}
            {locationData.recommendations && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Lightbulb className="mr-2 text-green-600" size={20} />
                  AI Development Recommendations
                </h3>
                
                <div className={`mb-3 p-2 rounded ${
                  locationData.recommendations.priority === 'high' 
                    ? 'bg-red-50 border-l-4 border-red-400' 
                    : locationData.recommendations.priority === 'medium'
                      ? 'bg-yellow-50 border-l-4 border-yellow-400'
                      : 'bg-green-50 border-l-4 border-green-400'
                }`}>
                  <span className="text-sm font-medium">
                    Priority: {locationData.recommendations.priority.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="flex items-center mb-1">
                      <Sprout className="text-green-600 mr-2" size={18} />
                      <span className="font-medium">Recommended Crops</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {locationData.recommendations.crops.map((crop, index) => (
                        <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="flex items-center mb-1">
                      <Droplets className="text-blue-600 mr-2" size={18} />
                      <span className="font-medium">Water Management</span>
                    </div>
                    <p className="text-sm">{locationData.recommendations.waterManagement}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="flex items-center mb-1">
                      <Zap className="text-yellow-600 mr-2" size={18} />
                      <span className="font-medium">Renewable Energy</span>
                    </div>
                    <p className="text-sm">{locationData.recommendations.renewableEnergy}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="flex items-center mb-1">
                      <MapPin className="text-green-600 mr-2" size={18} />
                      <span className="font-medium">Infrastructure Needed</span>
                    </div>
                    <p className="text-sm">{locationData.recommendations.infrastructure}</p>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-3">
                  These recommendations are AI-generated based on environmental conditions and may require expert verification.
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
            
            {/* AI Recommendations Section */}
            {locationData.recommendations && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Lightbulb className="mr-2 text-green-600" size={20} />
                  AI Development Recommendations
                </h3>
                
                <div className={`mb-3 p-2 rounded ${
                  locationData.recommendations.priority === 'high' 
                    ? 'bg-red-50 border-l-4 border-red-400' 
                    : locationData.recommendations.priority === 'medium'
                      ? 'bg-yellow-50 border-l-4 border-yellow-400'
                      : 'bg-green-50 border-l-4 border-green-400'
                }`}>
                  <span className="text-sm font-medium">
                    Priority: {locationData.recommendations.priority.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="flex items-center mb-1">
                      <Sprout className="text-green-600 mr-2" size={18} />
                      <span className="font-medium">Recommended Crops</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {locationData.recommendations.crops.map((crop, index) => (
                        <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="flex items-center mb-1">
                      <Droplets className="text-blue-600 mr-2" size={18} />
                      <span className="font-medium">Water Management</span>
                    </div>
                    <p className="text-sm">{locationData.recommendations.waterManagement}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="flex items-center mb-1">
                      <Zap className="text-yellow-600 mr-2" size={18} />
                      <span className="font-medium">Renewable Energy</span>
                    </div>
                    <p className="text-sm">{locationData.recommendations.renewableEnergy}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="flex items-center mb-1">
                      <MapPin className="text-green-600 mr-2" size={18} />
                      <span className="font-medium">Infrastructure Needed</span>
                    </div>
                    <p className="text-sm">{locationData.recommendations.infrastructure}</p>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-3">
                  These recommendations are AI-generated based on environmental conditions and may require expert verification.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 