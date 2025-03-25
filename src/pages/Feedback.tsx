import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface FeedbackItem {
  id: number;
  type: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  submittedBy: string;
  date: string;
}

const mockFeedback: FeedbackItem[] = [
  {
    id: 1,
    type: 'Infrastructure',
    description: 'Poor road conditions in sector 7',
    status: 'in-progress',
    priority: 'high',
    submittedBy: 'John Doe',
    date: '2024-02-20'
  },
  {
    id: 2,
    type: 'Utilities',
    description: 'Irregular water supply in western zone',
    status: 'pending',
    priority: 'medium',
    submittedBy: 'Jane Smith',
    date: '2024-02-19'
  }
];

export function Feedback() {
  const [feedbackList, setFeedbackList] = useState(mockFeedback);
  const [newFeedback, setNewFeedback] = useState({
    type: 'Infrastructure',
    description: '',
    priority: 'medium' as const
  });
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newId = Math.max(...feedbackList.map(f => f.id)) + 1;
    setFeedbackList([...feedbackList, {
      ...newFeedback,
      id: newId,
      status: 'pending',
      submittedBy: user.email,
      date: new Date().toISOString().split('T')[0]
    }]);
    setNewFeedback({
      type: 'Infrastructure',
      description: '',
      priority: 'medium'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
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
          <MessageSquare className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Feedback System</h1>
        </div>

        {user && (
          <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Submit New Feedback</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newFeedback.type}
                  onChange={e => setNewFeedback({...newFeedback, type: e.target.value})}
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newFeedback.description}
                  onChange={e => setNewFeedback({...newFeedback, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newFeedback.priority}
                  onChange={e => setNewFeedback({...newFeedback, priority: e.target.value as 'low' | 'medium' | 'high'})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
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
        </div>
      </div>
    </div>
  );
}