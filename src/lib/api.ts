import { Village } from './mockData';

// Use environment variable for API base URL if available, otherwise fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },
  
  register: async (email: string, password: string, role: 'villager' | 'admin' | 'official') => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, role }),
    });
    return handleResponse(response);
  },
  
  logout: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  }
};

// Villages API functions
export const villagesAPI = {
  getAll: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/villages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
  
  getById: async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/villages/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
  
  getEnvironmentalData: async (lat: number, lng: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/villages/environmental-data?lat=${lat}&lng=${lng}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return handleResponse(response);
  }
};

// Feedback API functions
export const feedbackAPI = {
  getAll: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
  
  submit: async (feedback: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(feedback),
    });
    return handleResponse(response);
  }
};

// Community suggestions API functions
export const communityAPI = {
  getSuggestions: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/community`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
  
  submitSuggestion: async (suggestion: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/community`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(suggestion),
    });
    return handleResponse(response);
  },
  
  vote: async (id: number, voteType: 'up' | 'down') => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/community/${id}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ voteType }),
    });
    return handleResponse(response);
  }
};

// Analytics API functions
export const analyticsAPI = {
  getLandUseData: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/analytics/land-use`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
  
  getDevelopmentPriorities: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/analytics/development-priorities`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  }
}; 