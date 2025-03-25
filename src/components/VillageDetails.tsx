import React from 'react';
import { X, Droplets, Wind, Thermometer, Map, Lightbulb, Sprout, Zap } from 'lucide-react';
import { Village } from '../lib/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import { GenerateReport } from './GenerateReport';

interface VillageDetailsProps {
  village: Village;
  onClose: () => void;
}

export function VillageDetails({ village, onClose }: VillageDetailsProps) {
  const areaData = [
    { name: 'Agricultural', value: village.area.agricultural },
    { name: 'Residential', value: village.area.residential },
    { name: 'Forest', value: village.area.forest },
    { name: 'Other', value: village.area.other },
  ];

  const COLORS = ['#4CAF50', '#8BC34A', '#66BB6A', '#9E9E9E'];

  // Generate AI-driven development recommendations based on village data
  const getRecommendations = () => {
    const { area, environment, waterBodies, infrastructure } = village;
    
    // Determine priority level based on multiple factors
    let priority: 'high' | 'medium' | 'low' = 'medium';
    
    // High priority situations
    if (
      environment.averageRainfall < 700 || // Drought-prone regions
      environment.humidity < 40 || // Very dry regions
      waterBodies.groundwaterLevel > 35 || // Critical groundwater depletion
      (infrastructure.hospitals === 0 && village.population > 500) || // No healthcare for significant population
      (!infrastructure.waterSupply && village.population > 300) // No water supply system
    ) {
      priority = 'high';
    } 
    // Medium priority situations
    else if (
      (area.agricultural > 65 && environment.soilType === 'Alluvial') || // High agricultural potential
      (environment.averageRainfall > 1500) || // High rainfall regions needing management
      (infrastructure.roads < 3 && village.population > 800) || // Poor connectivity for larger villages
      (!infrastructure.electricity && village.population > 200) // No electricity
    ) {
      priority = 'medium';
    } 
    // Low priority (relatively stable conditions)
    else {
      priority = 'low';
    }
    
    // Recommended crops based on soil type and climate in Indian context
    let crops = [];
    
    // Soil-based recommendations for Indian agricultural zones
    if (environment.soilType === 'Alluvial') {
      if (environment.averageRainfall > 1000) {
        crops = ['Rice', 'Jute', 'Sugarcane', 'Maize'];
      } else {
        crops = ['Wheat', 'Pulses', 'Oilseeds', 'Vegetables'];
      }
    } else if (environment.soilType === 'Black') {
      if (environment.averageRainfall > 800) {
        crops = ['Cotton', 'Sugarcane', 'Jowar', 'Vegetables'];
      } else {
        crops = ['Cotton', 'Pulses', 'Citrus Fruits', 'Millets'];
      }
    } else if (environment.soilType === 'Red') {
      if (environment.averageRainfall > 800) {
        crops = ['Rice', 'Ragi', 'Groundnut', 'Millets'];
      } else {
        crops = ['Millets', 'Pulses', 'Oilseeds', 'Drought-resistant Crops'];
      }
    } else if (environment.soilType === 'Laterite') {
      crops = ['Cashew', 'Rubber', 'Coconut', 'Tea/Coffee'];
    } else if (environment.soilType === 'Desert') {
      crops = ['Bajra', 'Jowar', 'Moth Beans', 'Date Palm'];
    } else {
      // Mountain/Other soils
      crops = ['Buckwheat', 'Barley', 'Medicinal Herbs', 'Temperate Fruits'];
    }
    
    // Water management recommendation
    let waterManagement;
    
    // Check for critical water situations
    if (environment.averageRainfall < 600) {
      waterManagement = 'Critical water conservation needed: Implement comprehensive rainwater harvesting, micro-irrigation systems, and drought-resistant farming practices';
    } else if (waterBodies.groundwaterLevel > 30) {
      waterManagement = 'Groundwater recharge critical: Construct recharge wells, percolation tanks, and implement regulated extraction policies';
    } else if (waterBodies.rivers && environment.averageRainfall > 1500) {
      waterManagement = 'Flood management priority: Develop embankments, proper drainage networks, and flood warning systems';
    } else if (waterBodies.ponds >= 3 || waterBodies.lakes >= 1) {
      waterManagement = 'Water body restoration and protection: Desilt existing ponds/lakes, implement catchment management, and establish buffer zones';
    } else if (!infrastructure.waterSupply) {
      waterManagement = 'Basic water infrastructure needed: Develop drinking water supply system, storage tanks, and community management committee';
    } else {
      waterManagement = 'Sustainable water management: Maintain existing resources with regular monitoring, water quality testing, and community participation';
    }
    
    // Infrastructure recommendation
    let infrastructureRec;
    
    // Assess critical infrastructure needs
    if (infrastructure.roads < 2 && village.population > 500) {
      infrastructureRec = 'Road connectivity priority: All-weather road construction connecting major facilities and nearest markets';
    } else if (infrastructure.hospitals === 0) {
      infrastructureRec = 'Healthcare facilities needed: Establish primary health center with basic emergency services and regular health camps';
    } else if (infrastructure.schools === 0) {
      infrastructureRec = 'Education infrastructure priority: Establish primary school with digital learning facilities and mid-day meal program';
    } else if (!infrastructure.electricity) {
      infrastructureRec = 'Electrification needed: Rural electrification with focus on reliability and three-phase supply for agricultural use';
    } else if (area.residential > 40) {
      infrastructureRec = 'Housing and sanitation focus: Improved housing, toilet facilities, and waste management systems';
    } else if (area.agricultural > 60) {
      infrastructureRec = 'Agricultural infrastructure: Develop storage facilities, cold chains, processing units, and market linkages';
    } else {
      infrastructureRec = 'Balanced community infrastructure: Focus on community centers, improved connectivity, and utility maintenance';
    }
    
    // Renewable energy recommendation based on available resources
    let renewableEnergy;
    
    if (environment.averageTemperature > 25 && environment.humidity < 70) {
      renewableEnergy = 'Solar power priority: Implement rooftop solar for public buildings and solar microgrids with battery storage';
    } else if (waterBodies.rivers && environment.averageRainfall > 1200) {
      renewableEnergy = 'Micro-hydro potential: Develop run-of-river micro hydropower plants with minimal environmental impact';
    } else if (area.agricultural > 60) {
      renewableEnergy = 'Biomass energy: Establish biogas plants using agricultural waste and create biomass supply chains';
    } else if (environment.averageRainfall > 1200 && environment.averageTemperature < 25) {
      renewableEnergy = 'Hybrid renewable system: Combine solar with efficient biomass or micro-hydro options for reliable supply';
    } else {
      renewableEnergy = 'Distributed solar: Implement individual solar home systems with pay-as-you-go financing options';
    }
    
    return {
      priority,
      crops,
      waterManagement,
      infrastructure: infrastructureRec,
      renewableEnergy
    };
  };
  
  const recommendations = getRecommendations();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">{village.name} Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-5 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Map className="mr-2 text-green-600" size={20} />
              Village Overview
            </h3>
            <p className="text-gray-700 mb-2">{village.description}</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-500">Population</span>
                <p className="font-semibold">{village.population.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-500">Total Area</span>
                <p className="font-semibold">{village.area.size} km²</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Land Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={areaData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {areaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Droplets className="mr-2 text-green-600" size={20} />
              Water Resources
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-500">Ponds</span>
                <p className="font-semibold">{village.waterBodies.ponds}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-500">Lakes</span>
                <p className="font-semibold">{village.waterBodies.lakes}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-500">Rivers</span>
                <p className="font-semibold">{village.waterBodies.rivers ? 'Yes' : 'No'}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-500">Groundwater Level</span>
                <p className="font-semibold">{village.waterBodies.groundwaterLevel} m</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Wind className="mr-2 text-green-600" size={20} />
              Environmental Conditions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-500">Humidity</span>
                <p className="font-semibold">{village.environment.humidity}%</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-500">Rainfall</span>
                <p className="font-semibold">{village.environment.averageRainfall} mm/year</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-500">Soil Type</span>
                <p className="font-semibold">{village.environment.soilType}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-500">Avg. Temperature</span>
                <p className="font-semibold">{village.environment.averageTemperature}°C</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Infrastructure</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-500">Roads</span>
                <p className="font-semibold">{village.infrastructure.roads} km</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-500">Schools</span>
                <p className="font-semibold">{village.infrastructure.schools}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-500">Hospitals</span>
                <p className="font-semibold">{village.infrastructure.hospitals}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-500">Utilities</span>
                <p className="font-semibold">
                  {village.infrastructure.waterSupply ? 'Water, ' : ''}
                  {village.infrastructure.electricity ? 'Electricity' : ''}
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 pt-4 pb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Lightbulb className="mr-2 text-green-600" size={22} />
              AI Development Recommendations
            </h2>
            
            <div className="mb-4">
              <div className="flex items-center">
                <div className={`px-3 py-1 rounded-full text-white font-medium ${
                  recommendations.priority === 'high' ? 'bg-red-500' : 
                  recommendations.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}>
                  {recommendations.priority.toUpperCase()} PRIORITY
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-semibold mb-2">Recommended Crops</h4>
                <div className="flex flex-wrap gap-2">
                  {recommendations.crops.map((crop, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-semibold mb-2">Water Management</h4>
                <p className="text-sm text-gray-700">{recommendations.waterManagement}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-semibold mb-2">Infrastructure Focus</h4>
                <p className="text-sm text-gray-700">{recommendations.infrastructure}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-semibold mb-2">Renewable Energy</h4>
                <p className="text-sm text-gray-700">{recommendations.renewableEnergy}</p>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 mb-4">
              These recommendations are AI-generated based on village data and may require expert verification before implementation.
            </div>
            
            <GenerateReport 
              villageId={village.id}
              villageName={village.name}
              recommendations={recommendations}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 