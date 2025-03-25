import React from 'react';
import { X, Droplets, Wind, Thermometer, Map } from 'lucide-react';
import { Village } from '../lib/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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

  return (
    <div className="fixed right-4 top-20 bg-white shadow-xl rounded-lg w-96 z-10 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="flex justify-between items-center bg-green-600 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">{village.name}</h2>
        <button onClick={onClose} className="p-1 hover:bg-green-500 rounded">
          <X size={20} />
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
      </div>
    </div>
  );
} 