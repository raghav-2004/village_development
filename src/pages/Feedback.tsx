import { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { feedbackAPI } from '../lib/api';

interface FeedbackItem {
  id: number;
  type: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved' | string;
  priority: 'low' | 'medium' | 'high' | string;
  submittedBy: string;
  date: string;
}

export function Feedback() {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [newFeedback, setNewFeedback] = useState({
    type: 'Infrastructure',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await feedbackAPI.getAll();
      setFeedbackList(data);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Failed to load feedback. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      const feedback = await feedbackAPI.submit({
        ...newFeedback,
        submittedBy: user.email
      });
      setFeedbackList([...feedbackList, feedback]);
      setNewFeedback({
        type: 'Infrastructure',
        description: '',
        priority: 'medium'
      });
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <MessageSquare className="h-8 w-8 text-green-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Feedback System</h1>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 p-4 rounded-md text-red-800">
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

        {user && (
          <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Submit New Feedback</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  value={newFeedback.type}
                  onChange={e => setNewFeedback({...newFeedback, type: e.target.value})}
                  disabled={isLoading}
                >
                  <option>Infrastructure</option>
                  <option>Utilities</option>
                  <option>Environment</option>
                  <option>Public Services</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  value={newFeedback.description}
                  onChange={e => setNewFeedback({...newFeedback, description: e.target.value})}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  value={newFeedback.priority}
                  onChange={e => setNewFeedback({...newFeedback, priority: e.target.value as 'low' | 'medium' | 'high'})}
                  disabled={isLoading}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          {isLoading && feedbackList.length === 0 ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></div>
              <p>Loading feedback...</p>
            </div>
          ) : feedbackList.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No feedback yet. Be the first to contribute!</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feedbackList.map(feedback => (
                  <tr key={feedback.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{feedback.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{feedback.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(feedback.status)}`}>
                        {feedback.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(feedback.priority)}`}>
                        {feedback.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feedback.submittedBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feedback.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}