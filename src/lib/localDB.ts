// Local Storage Database
// This file provides a simple local storage-based database system
// for storing community suggestions and reports

export interface CommunitySuggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  status: 'pending' | 'approved' | 'implemented';
  upvotes: number;
  downvotes: number;
  villageId?: string;
}

export interface Report {
  id: string;
  villageId: string;
  title: string;
  createdAt: string;
  status: 'draft' | 'sent' | 'read' | 'actioned';
  recommendations: string[];
  feedbackReferences: string[];
  communitySuggestions: string[]; // IDs of community suggestions
  priority?: string;
  sentDate?: string;
  officialName?: string;
  summary?: string;
  letterContent?: string;
}

// Generate unique ID
const generateId = (): string => {
  return `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Initialize the local database with some default data if it doesn't exist
export const initializeLocalDB = () => {
  // Initialize community suggestions if they don't exist
  if (!localStorage.getItem('communitySuggestions')) {
    const defaultSuggestions: CommunitySuggestion[] = [
      {
        id: 'cs1',
        title: 'Improve road access to eastern farms',
        description: 'The road to the eastern farming area becomes inaccessible during monsoon season. We need proper drainage and paving.',
        category: 'Infrastructure',
        author: 'Priya Sharma',
        date: '2023-05-10',
        status: 'approved',
        upvotes: 24,
        downvotes: 2,
        villageId: 'v1'
      },
      {
        id: 'cs2',
        title: 'Community water harvesting project',
        description: 'We should implement rainwater harvesting structures across the village to improve groundwater levels.',
        category: 'Water',
        author: 'Rajesh Kumar',
        date: '2023-06-15',
        status: 'pending',
        upvotes: 18,
        downvotes: 3,
        villageId: 'v1'
      },
      {
        id: 'cs3',
        title: 'Solar lights for main street',
        description: 'Installing solar-powered streetlights will improve safety and reduce dependence on the unreliable grid.',
        category: 'Energy',
        author: 'Meena Devi',
        date: '2023-04-22',
        status: 'implemented',
        upvotes: 35,
        downvotes: 1,
        villageId: 'v2'
      },
      {
        id: 'cs4',
        title: 'Weekly health camp',
        description: 'We need a regular health camp where doctors from the district hospital can visit for basic health checkups.',
        category: 'Healthcare',
        author: 'Dr. Anand',
        date: '2023-07-05',
        status: 'approved',
        upvotes: 42,
        downvotes: 0,
        villageId: 'v2'
      },
      {
        id: 'cs5',
        title: 'School renovation',
        description: 'The village school building needs urgent repairs before monsoon. The roof leaks and some walls have cracks.',
        category: 'Education',
        author: 'Sunita Teacher',
        date: '2023-03-30',
        status: 'pending',
        upvotes: 28,
        downvotes: 2,
        villageId: 'v3'
      }
    ];
    
    localStorage.setItem('communitySuggestions', JSON.stringify(defaultSuggestions));
  }
  
  // Initialize reports if they don't exist
  if (!localStorage.getItem('reports')) {
    const defaultReports: Report[] = [
      {
        id: 'r1',
        villageId: 'v1',
        title: 'Development Needs Assessment for Sundarpur Village',
        createdAt: '2023-06-15',
        status: 'draft',
        recommendations: [
          'Improve eastern access road with proper drainage',
          'Implement community water harvesting project',
          'Renovate the village community center'
        ],
        feedbackReferences: ['feedback123', 'feedback456'],
        communitySuggestions: ['cs1', 'cs2'],
        priority: 'high',
        officialName: 'District Development Officer'
      },
      {
        id: 'r2',
        villageId: 'v2',
        title: 'Infrastructure Development Plan for Chandrapur',
        createdAt: '2023-05-10',
        status: 'sent',
        sentDate: '2023-05-12',
        recommendations: [
          'Install solar streetlights on main village road',
          'Construct drainage system in low-lying areas',
          'Build additional classroom in primary school'
        ],
        feedbackReferences: ['feedback789'],
        communitySuggestions: ['cs3', 'cs4'],
        priority: 'medium',
        officialName: 'Block Development Officer'
      }
    ];
    
    localStorage.setItem('reports', JSON.stringify(defaultReports));
  }
};

// Community Suggestions CRUD operations
export const communitySuggestionsDB = {
  getAll: () => {
    const suggestions = localStorage.getItem('communitySuggestions');
    return suggestions ? JSON.parse(suggestions) : [];
  },
  
  getById: (id: string) => {
    const suggestions = communitySuggestionsDB.getAll();
    return suggestions.find((s: CommunitySuggestion) => s.id === id) || null;
  },
  
  add: (suggestion: Partial<CommunitySuggestion>) => {
    const suggestions = communitySuggestionsDB.getAll();
    const newSuggestion = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      upvotes: 0,
      downvotes: 0,
      ...suggestion
    };
    
    const updatedSuggestions = [...suggestions, newSuggestion];
    localStorage.setItem('communitySuggestions', JSON.stringify(updatedSuggestions));
    return newSuggestion;
  },
  
  update: (id: string, updates: Partial<CommunitySuggestion>) => {
    const suggestions = communitySuggestionsDB.getAll();
    const suggestionIndex = suggestions.findIndex((s: CommunitySuggestion) => s.id === id);
    
    if (suggestionIndex !== -1) {
      const updatedSuggestion = { ...suggestions[suggestionIndex], ...updates };
      suggestions[suggestionIndex] = updatedSuggestion;
      localStorage.setItem('communitySuggestions', JSON.stringify(suggestions));
      return updatedSuggestion;
    }
    
    return null;
  },
  
  delete: (id: string) => {
    const suggestions = communitySuggestionsDB.getAll();
    const filtered = suggestions.filter((s: CommunitySuggestion) => s.id !== id);
    localStorage.setItem('communitySuggestions', JSON.stringify(filtered));
    return true;
  },
  
  vote: (id: string, voteType: 'up' | 'down') => {
    const suggestion = communitySuggestionsDB.getById(id);
    if (!suggestion) return null;
    
    const updates = voteType === 'up' 
      ? { upvotes: suggestion.upvotes + 1 } 
      : { downvotes: suggestion.downvotes + 1 };
    
    return communitySuggestionsDB.update(id, updates);
  }
};

// Reports CRUD operations
export const reportsDB = {
  getAll: () => {
    const reports = localStorage.getItem('reports');
    return reports ? JSON.parse(reports) : [];
  },
  
  getById: (id: string) => {
    const reports = reportsDB.getAll();
    return reports.find((r: Report) => r.id === id) || null;
  },
  
  add: (report: Partial<Report>) => {
    const reports = reportsDB.getAll();
    const newReport = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: 'draft',
      recommendations: [],
      feedbackReferences: [],
      communitySuggestions: [],
      ...report,
    };
    
    const updatedReports = [...reports, newReport];
    localStorage.setItem('reports', JSON.stringify(updatedReports));
    return newReport;
  },
  
  update: (id: string, updates: Partial<Report>) => {
    const reports = reportsDB.getAll();
    const reportIndex = reports.findIndex((r: Report) => r.id === id);
    
    if (reportIndex !== -1) {
      const updatedReport = { ...reports[reportIndex], ...updates };
      reports[reportIndex] = updatedReport;
      localStorage.setItem('reports', JSON.stringify(reports));
      return updatedReport;
    }
    
    return null;
  },
  
  delete: (id: string) => {
    const reports = reportsDB.getAll();
    const filtered = reports.filter((r: Report) => r.id !== id);
    localStorage.setItem('reports', JSON.stringify(filtered));
    return true;
  },
  
  // Add community suggestions to a report
  addSuggestionToReport: (reportId: string, suggestionId: string) => {
    const report = reportsDB.getById(reportId);
    if (!report) return null;
    
    const suggestions = report.communitySuggestions || [];
    if (suggestions.includes(suggestionId)) return report;
    
    const updatedSuggestions = [...suggestions, suggestionId];
    return reportsDB.update(reportId, { communitySuggestions: updatedSuggestions });
  },
  
  // Remove community suggestions from a report
  removeSuggestionFromReport: (reportId: string, suggestionId: string) => {
    const report = reportsDB.getById(reportId);
    if (!report) return null;
    
    const suggestions = report.communitySuggestions || [];
    if (!suggestions.includes(suggestionId)) return report;
    
    const updatedSuggestions = suggestions.filter((id: string) => id !== suggestionId);
    return reportsDB.update(reportId, { communitySuggestions: updatedSuggestions });
  }
};

// Initialize the database on module load
initializeLocalDB(); 