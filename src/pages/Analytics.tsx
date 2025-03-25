import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brain, TrendingUp } from 'lucide-react';

const mockData = [
  { name: 'Agriculture', value: 65 },
  { name: 'Residential', value: 45 },
  { name: 'Commercial', value: 25 },
  { name: 'Industrial', value: 15 },
];

const developmentPriorities = [
  { name: 'Road Infrastructure', score: 85 },
  { name: 'Healthcare Facilities', score: 75 },
  { name: 'Education', score: 70 },
  { name: 'Water Supply', score: 65 },
];

export function Analytics() {
  const [activeTab, setActiveTab] = useState('landUse');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Brain className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">AI-Powered Analytics</h1>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`${
                  activeTab === 'landUse'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('landUse')}
              >
                Land Use Analysis
              </button>
              <button
                className={`${
                  activeTab === 'priorities'
                    ? 'border-blue-500 text-blue-600'
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
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" name="Percentage" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-4">AI-Recommended Development Priorities</h2>
              <div className="space-y-4">
                {developmentPriorities.map((priority, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{priority.name}</span>
                      <span className="text-blue-600 font-semibold">{priority.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${priority.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}