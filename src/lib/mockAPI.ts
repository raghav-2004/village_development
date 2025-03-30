// Mock data for authentication and API responses
import { villages } from './mockData';

// Mock user data
interface User {
  id: string;
  email: string;
  role: 'villager' | 'admin' | 'official';
}

// Mock feedback data
interface FeedbackItem {
  id: number;
  type: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  submittedBy: string;
  date: string;
}

// Mock community suggestions
interface Suggestion {
  id: number;
  title: string;
  description: string;
  category: string;
  votes: {
    up: number;
    down: number;
  };
  submittedBy: string;
  date: string;
}

// Mock analytics data
interface LandUseData {
  landUseTypes: { name: string; value: number }[];
  totalArea: number;
}

interface DevelopmentPriority {
  name: string;
  count: number;
}

// Mock reports
interface Report {
  id: string;
  villageId: string;
  title: string;
  createdAt: string;
  status: 'draft' | 'sent';
  recommendations: string[];
  feedbackReferences: string[];
}

// Default admin user that will be used for auto-login
export const DEFAULT_USER: User = {
  id: '1',
  email: 'admin@example.com',
  role: 'admin'
};

// Default token that will be used for auto-login
export const DEFAULT_TOKEN = `mock-token-${DEFAULT_USER.id}-${Date.now()}`;

// Auto-login helper function
export const autoLogin = () => {
  localStorage.setItem('token', DEFAULT_TOKEN);
  localStorage.setItem('user', JSON.stringify(DEFAULT_USER));
  return {
    token: DEFAULT_TOKEN,
    user: DEFAULT_USER
  };
};

// Mock users for login
const mockUsers: User[] = [
  DEFAULT_USER,
  {
    id: '2',
    email: 'villager@example.com',
    role: 'villager'
  },
  {
    id: '3',
    email: 'official@example.com',
    role: 'official'
  }
];

// Default password for all mock users
const DEFAULT_PASSWORD = 'password123';

// Mock feedback items
const mockFeedback: FeedbackItem[] = [
  {
    id: 1,
    type: 'Infrastructure',
    description: 'The bridge over the river needs repairs urgently.',
    status: 'pending',
    priority: 'high',
    submittedBy: 'villager@example.com',
    date: '2023-10-15'
  },
  {
    id: 2,
    type: 'Utilities',
    description: 'Water supply is inconsistent in the eastern part of the village.',
    status: 'in-progress',
    priority: 'medium',
    submittedBy: 'villager@example.com',
    date: '2023-10-20'
  },
  {
    id: 3,
    type: 'Environment',
    description: 'Need more trees along the main road for shade and air quality.',
    status: 'resolved',
    priority: 'low',
    submittedBy: 'admin@example.com',
    date: '2023-11-05'
  }
];

// Mock community suggestions
const mockSuggestions: Suggestion[] = [
  {
    id: 1,
    title: 'Community Garden',
    description: 'Create a community garden where villagers can grow vegetables and herbs together.',
    category: 'Environment',
    votes: { up: 15, down: 2 },
    submittedBy: 'villager@example.com',
    date: '2023-09-10'
  },
  {
    id: 2,
    title: 'Weekly Market Day',
    description: 'Organize a weekly market day for local artisans and farmers to sell their products.',
    category: 'Economy',
    votes: { up: 20, down: 3 },
    submittedBy: 'official@example.com',
    date: '2023-09-15'
  },
  {
    id: 3,
    title: 'Youth Training Program',
    description: 'Start a training program to teach digital skills to young people in the village.',
    category: 'Education',
    votes: { up: 18, down: 0 },
    submittedBy: 'admin@example.com',
    date: '2023-09-28'
  }
];

// Mock analytics data
const mockLandUseData: LandUseData = {
  landUseTypes: [
    { name: 'Agricultural', value: 65 },
    { name: 'Residential', value: 20 },
    { name: 'Forest', value: 10 },
    { name: 'Other', value: 5 }
  ],
  totalArea: 12.5
};

const mockDevelopmentPriorities: DevelopmentPriority[] = [
  { name: 'Infrastructure', count: 35 },
  { name: 'Education', count: 25 },
  { name: 'Healthcare', count: 20 },
  { name: 'Agriculture', count: 15 },
  { name: 'Environment', count: 5 }
];

// Mock reports
export const mockReports: Report[] = [
  {
    id: 'r1',
    villageId: 'v1',
    title: 'Sundarpur Development Report - Q3 2023',
    createdAt: '2023-09-30',
    status: 'sent',
    recommendations: [
      'Improve irrigation systems in agricultural areas',
      'Expand the primary school to accommodate more students',
      'Upgrade the village clinic with new equipment'
    ],
    feedbackReferences: ['1', '2']
  },
  {
    id: 'r2',
    villageId: 'v2',
    title: 'Greenvalley Infrastructure Assessment',
    createdAt: '2023-10-15',
    status: 'draft',
    recommendations: [
      'Install water harvesting systems to address summer water shortage',
      'Repair the main road connecting to the highway',
      'Implement solar powered street lights'
    ],
    feedbackReferences: ['3']
  }
];

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API implementations
export const mockAuthAPI = {
  login: async (email: string, password: string) => {
    await delay(300); // Shorter delay for better response
    
    try {
      // Always succeed with the default user for demo purposes
      return autoLogin();
    } catch (error) {
      console.error("Mock login error:", error);
      throw new Error('Login failed');
    }
  },
  
  register: async (email: string, password: string, role: 'villager' | 'admin' | 'official') => {
    await delay(300);
    
    try {
      // Always succeed with the default user for demo purposes
      return autoLogin();
    } catch (error) {
      console.error("Mock register error:", error);
      throw new Error('Registration failed');
    }
  },
  
  logout: async () => {
    await delay(300);
    try {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      console.error("Mock logout error:", error);
      return { success: false };
    }
  }
};

export const mockVillagesAPI = {
  getAll: async () => {
    await delay(300);
    return villages;
  },
  
  getById: async (id: string) => {
    await delay(300);
    const village = villages.find(v => v.id === id);
    
    if (!village) {
      throw new Error('Village not found');
    }
    
    return village;
  },
  
  getEnvironmentalData: async (lat: number, lng: number) => {
    await delay(300);
    
    // Define regions based on coordinates (Indian subregions)
    const isNorthern = lat > 28; // Northern India (Himalayan regions)
    const isSouthern = lat < 15; // Southern India
    const isWestern = lng < 77;  // Western India
    const isEastern = lng > 85;  // Eastern India
    const isCoastal = (isSouthern && (lng < 76 || lng > 80)) || // Kerala, TN coasts
                     (isEastern && lat < 22) ||  // Bengal coast
                     (isWestern && lat < 22);    // Western coast
    const isDesert = isWestern && lat > 23 && lat < 30; // Thar Desert region
    const isHilly = (isNorthern) || // Himalayan
                   (isWestern && isSouthern) || // Western Ghats
                   (isEastern && lat > 18 && lat < 26); // Eastern Ghats

    // Calculate seasonal factors (simplified mock)
    const now = new Date();
    const month = now.getMonth();
    const isSummer = month >= 2 && month <= 5;  // March to June
    const isMonsoon = month >= 6 && month <= 8; // July to September
    const isWinter = month >= 10 || month <= 1; // November to February

    // Generate consistent but varied environmental data based on region and season
    // Combine lat,lng to create a consistent pseudo-random value for a location
    const locationSeed = (lat * 10 + lng * 10) % 100;
    const randomVariation = (min: number, max: number) => 
      min + ((locationSeed / 100) * (max - min));

    // Temperature calculation 
    let baseTemperature = 26;
    if (isNorthern) baseTemperature -= 10;
    if (isSouthern) baseTemperature += 3;
    if (isDesert) baseTemperature += 5;
    if (isCoastal) baseTemperature -= 2;
    if (isHilly) baseTemperature -= 7;
    
    if (isSummer) baseTemperature += 8;
    if (isMonsoon) baseTemperature += 2;
    if (isWinter) baseTemperature -= 10;

    const temperature = parseFloat((baseTemperature + randomVariation(-2, 2)).toFixed(1));

    // Humidity calculation
    let baseHumidity = 60;
    if (isCoastal) baseHumidity += 25;
    if (isDesert) baseHumidity -= 30;
    if (isEastern) baseHumidity += 10;
    if (isHilly && !isNorthern) baseHumidity += 5;
    
    if (isMonsoon) baseHumidity += 25;
    if (isSummer && !isCoastal) baseHumidity -= 15;
    if (isWinter && !isCoastal) baseHumidity -= 10;

    const humidity = parseFloat((baseHumidity + randomVariation(-8, 8)).toFixed(1));

    // Rainfall calculation (annual in mm)
    let baseRainfall = 900;
    if (isCoastal && isWestern) baseRainfall += 1500; // Western coastal gets highest rainfall
    if (isCoastal && isEastern) baseRainfall += 800;
    if (isNorthern && !isDesert) baseRainfall += 200;
    if (isDesert) baseRainfall -= 700;
    if (isHilly && isEastern) baseRainfall += 500;
    if (isHilly && isWestern && isSouthern) baseRainfall += 1200; // Western Ghats
    
    const rainfall = Math.round(baseRainfall + randomVariation(-100, 100));

    // Soil moisture calculation
    let baseSoilMoisture = 30;
    if (isDesert) baseSoilMoisture -= 15;
    if (isCoastal) baseSoilMoisture += 10;
    if (isMonsoon) baseSoilMoisture += 15;
    if (isSummer) baseSoilMoisture -= 10;
    if (rainfall > 1200) baseSoilMoisture += 10;
    if (rainfall < 600) baseSoilMoisture -= 10;
    
    const soilMoisture = parseFloat((baseSoilMoisture + randomVariation(-5, 5)).toFixed(1));

    // Air quality based on region type
    let baseAQI = 45;
    if (lat > 28 && lng > 76 && lng < 78) baseAQI += 100; // Delhi NCR region
    if (isHilly && !isNorthern) baseAQI -= 20;
    if (isCoastal) baseAQI -= 15;
    if (isDesert) baseAQI += 20; // Dust
    if (isSummer && isDesert) baseAQI += 15; // More dust in summer
    
    const aqi = Math.round(baseAQI + randomVariation(-10, 10));

    // Biodiversity varies by region
    let floraBase = 90;
    let faunaBase = 40;
    let endangeredBase = 3;
    
    if (isHilly && isWestern && isSouthern) { // Western Ghats - biodiversity hotspot
      floraBase += 100;
      faunaBase += 35;
      endangeredBase += 7;
    } 
    if (isCoastal && isEastern) { // Mangrove regions
      floraBase += 30;
      faunaBase += 20;
      endangeredBase += 4;
    }
    if (isDesert) {
      floraBase -= 60;
      faunaBase -= 25;
    }
    if (isNorthern && !isDesert) {
      floraBase += 20;
      faunaBase += 10;
      endangeredBase += 2;
    }
    
    const floraSpecies = Math.round(floraBase + randomVariation(-10, 10));
    const faunaSpecies = Math.round(faunaBase + randomVariation(-5, 5));
    const endangeredSpecies = Math.round(endangeredBase + randomVariation(-1, 1));

    // Water quality (pH, turbidity, dissolved oxygen)
    let basePH = 7.2;
    let baseTurbidity = 2.8;
    let baseDO = 6.5;
    
    if (isDesert) {
      basePH += 0.4;
      baseTurbidity += 1.2;
      baseDO -= 0.8;
    }
    if (isCoastal) {
      basePH += 0.2;
      baseTurbidity += 0.5;
    }
    if (rainfall > 1500) {
      baseTurbidity += 0.7;
    }
    
    const ph = parseFloat((basePH + randomVariation(-0.3, 0.3)).toFixed(1));
    const turbidity = parseFloat((baseTurbidity + randomVariation(-0.5, 0.5)).toFixed(1));
    const dissolvedOxygen = parseFloat((baseDO + randomVariation(-0.5, 0.5)).toFixed(1));

    const environmentalData = {
      temperature,
      humidity,
      rainfall,
      soilMoisture,
      
      // Air quality data
      airQuality: {
        aqi,
        pollutants: {
          pm25: parseFloat((aqi * 0.3 + randomVariation(-2, 2)).toFixed(1)),
          pm10: parseFloat((aqi * 0.6 + randomVariation(-3, 3)).toFixed(1)),
          ozone: parseFloat((aqi * 0.8 + randomVariation(-5, 5)).toFixed(1))
        }
      },
      
      // Biodiversity data
      biodiversity: {
        floraSpecies,
        faunaSpecies,
        endangeredSpecies
      },
      
      // Water quality data
      waterQuality: {
        ph,
        turbidity,
        dissolvedOxygen
      }
    };
    
    return environmentalData;
  }
};

export const mockFeedbackAPI = {
  getAll: async () => {
    await delay(300);
    return mockFeedback;
  },
  
  submit: async (feedback: any) => {
    await delay(300);
    
    const newFeedback: FeedbackItem = {
      id: mockFeedback.length + 1,
      type: feedback.type,
      description: feedback.description,
      status: 'pending',
      priority: feedback.priority,
      submittedBy: feedback.submittedBy,
      date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
    };
    
    // In a real implementation we would add the feedback to mockFeedback
    // For this mock, we'll just return the new item
    
    return newFeedback;
  }
};

export const mockCommunityAPI = {
  getSuggestions: async () => {
    await delay(300);
    return mockSuggestions;
  },
  
  submitSuggestion: async (suggestion: any) => {
    await delay(300);
    
    const newSuggestion: Suggestion = {
      id: mockSuggestions.length + 1,
      title: suggestion.title,
      description: suggestion.description,
      category: suggestion.category,
      votes: { up: 0, down: 0 },
      submittedBy: suggestion.submittedBy,
      date: new Date().toISOString().split('T')[0]
    };
    
    // In a real implementation we would add the suggestion to mockSuggestions
    // For this mock, we'll just return the new item
    
    return newSuggestion;
  },
  
  vote: async (id: number, voteType: 'up' | 'down') => {
    await delay(300);
    
    const suggestion = mockSuggestions.find(s => s.id === id);
    
    if (!suggestion) {
      throw new Error('Suggestion not found');
    }
    
    // In a real implementation we would update the votes
    // For this mock, we'll just return a success message
    
    return { success: true };
  }
};

export const mockAnalyticsAPI = {
  getLandUseData: async () => {
    await delay(300);
    return mockLandUseData;
  },
  
  getDevelopmentPriorities: async () => {
    await delay(300);
    return mockDevelopmentPriorities;
  }
};

export const mockReportsAPI = {
  generateReport: async (villageId: string, recommendationData: any, feedbackIds?: string[]) => {
    await delay(300);
    
    const newReport: Report = {
      id: `r${mockReports.length + 1}`,
      villageId,
      title: `${villages.find(v => v.id === villageId)?.name || 'Village'} - New Report`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'draft',
      recommendations: recommendationData.recommendations || [],
      feedbackReferences: feedbackIds || []
    };
    
    // In a real implementation we would add the report to mockReports
    // For this mock, we'll just return the new item
    
    return newReport;
  },
  
  sendReport: async (reportId: string) => {
    await delay(300);
    
    // Always return success for demo purposes
    return { success: true };
  },
  
  getReports: async () => {
    await delay(300);
    return mockReports;
  },
  
  getReportById: async (reportId: string) => {
    await delay(300);
    
    const report = mockReports.find(r => r.id === reportId);
    
    if (!report) {
      throw new Error('Report not found');
    }
    
    return report;
  }
}; 