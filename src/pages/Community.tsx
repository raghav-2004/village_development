import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CommunitySuggestion, communitySuggestionsDB } from '../lib/localDB';

export function Community() {
  const [suggestions, setSuggestions] = useState<CommunitySuggestion[]>([]);
  const [newSuggestion, setNewSuggestion] = useState({ title: '', description: '', category: 'Infrastructure' });
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch suggestions on component mount
  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get suggestions from local database
      const data = communitySuggestionsDB.getAll();
      setSuggestions(data);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError('Failed to load suggestions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = (id: string, voteType: 'up' | 'down') => {
    try {
      // Vote in local database
      const updatedSuggestion = communitySuggestionsDB.vote(id, voteType);
      
      if (updatedSuggestion) {
        // Update local state
        setSuggestions(prev => 
          prev.map(suggestion => suggestion.id === id ? updatedSuggestion : suggestion)
        );
      }
    } catch (err) {
      console.error('Error voting on suggestion:', err);
      setError('Failed to register vote. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Add suggestion to local database
      const addedSuggestion = communitySuggestionsDB.add({
        title: newSuggestion.title,
        description: newSuggestion.description,
        category: newSuggestion.category,
        author: user?.email || 'Anonymous User'
      });
      
      // Update local state with the properly typed suggestion
      setSuggestions(prev => [...prev, addedSuggestion as CommunitySuggestion]);
      
      // Reset form
      setNewSuggestion({ title: '', description: '', category: 'Infrastructure' });
      
      // Show success message
      setSuccessMessage('Your suggestion has been submitted successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error submitting suggestion:', err);
      setError('Failed to submit suggestion. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get status icon based on suggestion status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'implemented':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-amber-600" />;
    }
  };

  // Get status text based on suggestion status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'implemented':
        return 'Implemented';
      case 'pending':
      default:
        return 'Pending Review';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <MessageSquare className="h-8 w-8 text-green-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Community Suggestions</h1>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 p-4 rounded-md text-red-800">
            <div className="flex">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-50 p-4 rounded-md text-green-800">
            <div className="flex">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* Suggestion form */}
        <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Submit New Suggestion</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                placeholder="Brief title for your suggestion"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                value={newSuggestion.title}
                onChange={e => setNewSuggestion({...newSuggestion, title: e.target.value})}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                required
                rows={3}
                placeholder="Describe your suggestion in detail"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                value={newSuggestion.description}
                onChange={e => setNewSuggestion({...newSuggestion, description: e.target.value})}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                value={newSuggestion.category}
                onChange={e => setNewSuggestion({...newSuggestion, category: e.target.value})}
                disabled={isLoading}
              >
                <option>Infrastructure</option>
                <option>Education</option>
                <option>Healthcare</option>
                <option>Environment</option>
                <option>Economy</option>
              </select>
            </div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Suggestion'}
            </button>
          </div>
        </form>

        {/* Suggestions list */}
        <div className="space-y-4">
          {isLoading && suggestions.length === 0 ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></div>
              <p>Loading suggestions...</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No suggestions yet. Be the first to contribute!</p>
            </div>
          ) : (
            suggestions.map(suggestion => (
              <div key={suggestion.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1">
                      <h3 className="text-lg font-medium text-gray-900 mr-2">{suggestion.title}</h3>
                      <div className="flex items-center text-sm">
                        {getStatusIcon(suggestion.status)}
                        <span className="ml-1 text-gray-600">{getStatusText(suggestion.status)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Posted by {suggestion.author} on {suggestion.date}</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                      {suggestion.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleVote(suggestion.id, 'up')}
                      className="p-1 rounded text-gray-400 hover:text-green-600"
                      aria-label="Upvote"
                    >
                      <ThumbsUp className="h-5 w-5" />
                    </button>
                    <div className="flex flex-col items-center text-xs">
                      <span className="text-green-600 font-medium">{suggestion.upvotes}</span>
                      <span className="text-red-600 font-medium">{suggestion.downvotes}</span>
                    </div>
                    <button
                      onClick={() => handleVote(suggestion.id, 'down')}
                      className="p-1 rounded text-gray-400 hover:text-red-600"
                      aria-label="Downvote"
                    >
                      <ThumbsDown className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-gray-600">{suggestion.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}