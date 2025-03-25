import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brain, TrendingUp, AlertCircle } from 'lucide-react';
import { analyticsAPI } from '../lib/api';

interface LandUseData {
  name: string;
  value: number;
}

interface DevelopmentPriority {
  name: string;
  score: number;
}

export function Analytics() {
  const [activeTab, setActiveTab] = useState('landUse');
  const [landUseData, setLandUseData] = useState<LandUseData[]>([]);
  const [developmentPriorities, setDevelopmentPriorities] = useState<DevelopmentPriority[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [landUseData, prioritiesData] = await Promise.all([
        analyticsAPI.getLandUseData(),
        analyticsAPI.getDevelopmentPriorities()
      ]);
      setLandUseData(landUseData);
      setDevelopmentPriorities(prioritiesData);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Brain className="h-8 w-8 text-green-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">AI-Powered Analytics</h1>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

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

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></div>
              <p>Loading analytics data...</p>
            </div>
          </div>
        ) : (
          <div className="h-96">
            {activeTab === 'landUse' ? (
              <div>
                <h2 className="text-lg font-semibold mb-4">Current Land Usage Distribution</h2>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={landUseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#4CAF50" name="Percentage" />
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
                        <span className="text-green-600 font-semibold">{priority.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: `${priority.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}