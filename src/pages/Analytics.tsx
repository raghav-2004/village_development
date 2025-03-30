import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Brain, Info } from 'lucide-react';

// Land use distribution data
const LAND_USE_DATA = [
  { name: 'Agricultural', value: 65, color: '#4CAF50' },
  { name: 'Residential', value: 20, color: '#8BC34A' },
  { name: 'Forest', value: 10, color: '#CDDC39' },
  { name: 'Industrial', value: 5, color: '#FFC107' }
];

// Development priorities data
const DEVELOPMENT_PRIORITIES = [
  { name: 'Road Infrastructure', score: 82, upvotes: 125 },
  { name: 'Healthcare Facilities', score: 75, upvotes: 108 },
  { name: 'Education', score: 65, upvotes: 97 },
  { name: 'Water Supply', score: 60, upvotes: 86 },
  { name: 'Electricity', score: 55, upvotes: 75 },
  { name: 'Agriculture Support', score: 45, upvotes: 63 }
];

// Priority colors
const BAR_COLORS = {
  high: '#ef4444',   // Red for high priority
  medium: '#f59e0b', // Amber for medium priority 
  low: '#10b981'     // Green for low priority
};

export function Analytics() {
  const [activeTab, setActiveTab] = useState('landUse');

  // Function to determine priority color based on score
  const getPriorityColor = (score: number) => {
    if (score >= 70) return BAR_COLORS.high;
    if (score >= 50) return BAR_COLORS.medium;
    return BAR_COLORS.low;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Brain className="h-8 w-8 text-green-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">AI-Powered Analytics</h1>
        </div>

        <div className="bg-blue-50 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Analysis Dashboard</h3>
              <p className="text-sm text-blue-700 mt-1">
                This dashboard shows land usage distribution and development priorities based on community feedback and survey data.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`${
                  activeTab === 'landUse'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('landUse')}
              >
                Land Use Analysis
              </button>
              <button
                className={`${
                  activeTab === 'priorities'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('priorities')}
              >
                Development Priorities
              </button>
            </nav>
          </div>
        </div>

        <div className="h-96">
          {activeTab === 'landUse' ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">Current Land Usage Distribution</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={LAND_USE_DATA}
                      cx="50%"
                      cy="45%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {LAND_USE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Coverage']} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '30px' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 text-sm text-gray-500">
                <p>* Land usage data based on satellite imagery analysis and survey records from 2023.</p>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-4">Development Priorities Based on Community Feedback</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={DEVELOPMENT_PRIORITIES}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip 
                      formatter={(value, name) => [`${value} points`, 'Priority Score']}
                      labelFormatter={() => 'Community Feedback'}
                    />
                    <Bar 
                      dataKey="score" 
                      name="Priority Score"
                      barSize={20}
                      radius={[0, 4, 4, 0]}
                    >
                      {DEVELOPMENT_PRIORITIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getPriorityColor(entry.score)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                    <span className="text-gray-700">High Priority</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-1"></div>
                    <span className="text-gray-700">Medium Priority</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-gray-700">Low Priority</span>
                  </div>
                </div>
                <p className="mt-2 text-gray-500">* Priority scores are calculated based on community feedback and upvotes.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}