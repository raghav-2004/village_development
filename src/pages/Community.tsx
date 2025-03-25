import { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Suggestion {
  id: number;
  title: string;
  description: string;
  author: string;
  votes: number;
  userVote: 'up' | 'down' | null;
  category: string;
}

const mockSuggestions: Suggestion[] = [
  {
    id: 1,
    title: 'New Community Center',
    description: 'We need a community center for social gatherings and events.',
    author: 'John Doe',
    votes: 15,
    userVote: null,
    category: 'Infrastructure'
  },
  {
    id: 2,
    title: 'Road Improvement',
    description: 'The main road needs repairs and better drainage system.',
    author: 'Jane Smith',
    votes: 23,
    userVote: null,
    category: 'Infrastructure'
  }
];

export function Community() {
  const [suggestions, setSuggestions] = useState(mockSuggestions);
  const [newSuggestion, setNewSuggestion] = useState({ title: '', description: '', category: 'Infrastructure' });
  const { user } = useAuth();

  const handleVote = (id: number, voteType: 'up' | 'down') => {
    setSuggestions(suggestions.map(suggestion => {
      if (suggestion.id === id) {
        const voteChange = suggestion.userVote === voteType ? -1 : 1;
        return {
          ...suggestion,
          votes: suggestion.votes + voteChange,
          userVote: suggestion.userVote === voteType ? null : voteType
        };
      }
      return suggestion;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newId = Math.max(...suggestions.map(s => s.id)) + 1;
    setSuggestions([...suggestions, {
      ...newSuggestion,
      id: newId,
      author: user.email,
      votes: 0,
      userVote: null
    }]);
    setNewSuggestion({ title: '', description: '', category: 'Infrastructure' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <MessageSquare className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Community Suggestions</h1>
        </div>

        {user && (
          <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Submit New Suggestion</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newSuggestion.title}
                  onChange={e => setNewSuggestion({...newSuggestion, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newSuggestion.description}
                  onChange={e => setNewSuggestion({...newSuggestion, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newSuggestion.category}
                  onChange={e => setNewSuggestion({...newSuggestion, category: e.target.value})}
                >
                  <option>Infrastructure</option>
                  <option>Education</option>
                  <option>Healthcare</option>
                  <option>Environment</option>
                </select>
              </div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Suggestion
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {suggestions.map(suggestion => (
            <div key={suggestion.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{suggestion.title}</h3>
                  <p className="text-sm text-gray-500">Posted by {suggestion.author}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                    {suggestion.category}
                  </span>
                </div>
                {user && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleVote(suggestion.id, 'up')}
                      className={`p-1 rounded ${suggestion.userVote === 'up' ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      <ThumbsUp className="h-5 w-5" />
                    </button>
                    <span className="text-gray-700">{suggestion.votes}</span>
                    <button
                      onClick={() => handleVote(suggestion.id, 'down')}
                      className={`p-1 rounded ${suggestion.userVote === 'down' ? 'text-red-600' : 'text-gray-400'}`}
                    >
                      <ThumbsDown className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-2 text-gray-600">{suggestion.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}