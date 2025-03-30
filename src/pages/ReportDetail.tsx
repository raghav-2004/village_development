import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Mail, Download, ArrowLeft, CheckCircle, AlertCircle, User, MapPin, Clock, Info, MessageSquare } from 'lucide-react';
import { villages } from '../lib/mockData';
import { reportsDB, communitySuggestionsDB, CommunitySuggestion } from '../lib/localDB';

interface Report {
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
  villageName?: string;
  summary?: string;
  reportType?: string;
  officialEmail?: string;
  letterContent?: string;
}

export function ReportDetail() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [suggestions, setSuggestions] = useState<CommunitySuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [emailSuccess, setEmailSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (reportId) {
      fetchReportDetails(reportId);
    }
  }, [reportId]);

  const fetchReportDetails = (id: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching report details for ID:", id);
      
      // Get report from local database
      const localReport = reportsDB.getById(id);
      console.log("Report details from local DB:", localReport);
      
      if (localReport) {
        const village = villages.find(v => v.id === localReport.villageId);
        
        // Create a complete report object with all required fields
        const completeReport: Report = {
          ...localReport,
          villageName: village?.name || 'Unknown Village',
          officialName: localReport.officialName || 'District Official',
          officialEmail: 'official@district.gov',
          reportType: 'Development Recommendation',
          priority: localReport.priority || 'medium',
          summary: localReport.summary || `This report contains ${localReport.recommendations.length} recommendations for the village of ${village?.name || 'Unknown'}.`,
          communitySuggestions: localReport.communitySuggestions || [],
          // Generate letter content if not provided
          letterContent: localReport.letterContent || `
            <div style="font-family: serif;">
              <div style="text-align: right">Date: ${new Date().toLocaleDateString()}</div>
              <div style="margin-top: 20px">
                <div>To,</div>
                <div>The District Official,</div>
                <div>Rural Development Department</div>
                <div>District Administration</div>
              </div>
              
              <div style="margin-top: 20px">
                <div>Subject: <strong>${localReport.title}</strong></div>
              </div>
              
              <div style="margin-top: 20px">
                <p>Dear Sir/Madam,</p>
                
                <p>I am writing to submit this report regarding the development needs of ${village?.name || 'our village'}.</p>
                
                <p>Based on our assessment, we have identified the following recommendations:</p>
                
                <ul style="margin-left: 20px">
                  ${localReport.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
                </ul>
                
                <p>We kindly request your attention to these matters and look forward to your support in implementing these recommendations.</p>
                
                <p>Yours sincerely,</p>
                <div style="margin-top: 40px">Digital Land Survey System</div>
                <div>Rural Development Initiative</div>
              </div>
            </div>
          `
        };
        
        setReport(completeReport);
        
        // Fetch community suggestions if there are any
        if (completeReport.communitySuggestions && completeReport.communitySuggestions.length > 0) {
          fetchCommunityData(completeReport.communitySuggestions);
        }
      } else {
        setError('Failed to fetch report details');
      }
    } catch (err) {
      console.error('Error fetching report details:', err);
      setError('An error occurred while fetching report details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch community suggestions data
  const fetchCommunityData = (suggestionIds: string[]) => {
    try {
      const fetchedSuggestions: CommunitySuggestion[] = [];
      
      // Get each suggestion from the database
      for (const id of suggestionIds) {
        const suggestion = communitySuggestionsDB.getById(id);
        if (suggestion) {
          fetchedSuggestions.push(suggestion);
        }
      }
      
      setSuggestions(fetchedSuggestions);
    } catch (err) {
      console.error('Error fetching community suggestions:', err);
    }
  };

  const handleSendReport = () => {
    if (!report) return;
    
    try {
      setSendingEmail(true);
      setError(null);
      console.log("Sending report:", report.id);
      
      // Update report status in local database
      const updatedReport = reportsDB.update(report.id, { 
        status: 'sent', 
        sentDate: new Date().toISOString().split('T')[0] 
      });
      
      if (updatedReport) {
        setReport({
          ...report,
          status: 'sent',
          sentDate: new Date().toISOString()
        });
        setEmailSuccess(true);
      } else {
        setError('Failed to send report. Please try again.');
      }
    } catch (err) {
      console.error('Error sending report:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };

  // Helper function to get status label and color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Approved</span>;
      case 'implemented':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Implemented</span>;
      case 'pending':
      default:
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <AlertCircle size={20} className="mr-2 inline" />
          {error || 'Report not found'}
        </div>
        <button 
          className="flex items-center text-blue-600 hover:text-blue-800"
          onClick={() => navigate('/reports')}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Reports
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <button 
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          onClick={() => navigate('/reports')}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Reports
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">{report.title}</h1>
          
          <div className="mt-2 md:mt-0 flex items-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
              report.priority === 'high' ? 'bg-red-500' : 
              report.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
            }`}>
              {(report.priority || 'MEDIUM').toUpperCase()} PRIORITY
            </span>
            
            <span className={`ml-3 px-3 py-1 rounded-full text-sm ${
              report.status === 'draft' ? 'bg-gray-200 text-gray-800' :
              report.status === 'sent' ? 'bg-blue-100 text-blue-800' :
              report.status === 'read' ? 'bg-purple-100 text-purple-800' :
              'bg-green-100 text-green-800'
            }`}>
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Community Integration</h3>
            <p className="text-sm text-blue-700 mt-1">
              {suggestions.length > 0 
                ? `This report includes ${suggestions.length} community suggestions from villagers.` 
                : "This report doesn't include any community suggestions yet."}
            </p>
          </div>
        </div>
      </div>
      
      {emailSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <CheckCircle size={20} className="mr-2" />
          <span>Report has been successfully sent to {report.officialName} ({report.officialEmail})</span>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Report Information</h2>
        </div>
        
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-start">
              <MapPin className="text-gray-500 mr-2 mt-1" size={16} />
              <div>
                <div className="text-sm text-gray-500">Village</div>
                <div className="font-medium">{report.villageName || 'Unknown Village'}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <User className="text-gray-500 mr-2 mt-1" size={16} />
              <div>
                <div className="text-sm text-gray-500">Recipient</div>
                <div className="font-medium">{report.officialName || 'District Official'}</div>
                <div className="text-sm text-gray-500">{report.officialEmail || 'official@district.gov'}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <FileText className="text-gray-500 mr-2 mt-1" size={16} />
              <div>
                <div className="text-sm text-gray-500">Report Type</div>
                <div className="font-medium capitalize">{report.reportType || 'Development Report'}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="text-gray-500 mr-2 mt-1" size={16} />
              <div>
                <div className="text-sm text-gray-500">Date</div>
                <div className="font-medium">
                  {report.status === 'draft' 
                    ? `Created: ${new Date(report.createdAt).toLocaleDateString()}`
                    : `Sent: ${new Date(report.sentDate || report.createdAt).toLocaleDateString()}`
                  }
                </div>
              </div>
            </div>
          </div>
          
          {report.summary && (
            <div className="mt-4">
              <div className="text-sm text-gray-500 mb-1">Summary</div>
              <p className="text-gray-700">{report.summary}</p>
          </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden col-span-1">
        <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Recommendations</h2>
        </div>
        
        <div className="px-6 py-4">
            {report.recommendations && report.recommendations.length > 0 ? (
              <ul className="list-disc pl-5 space-y-3">
                {report.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-gray-700">{recommendation}</li>
            ))}
          </ul>
            ) : (
              <p className="text-gray-500 italic">No recommendations available</p>
            )}
      </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden col-span-2">
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Community Suggestions</h2>
            {suggestions.length > 0 && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <div className="p-6">
            {suggestions.length > 0 ? (
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <h3 className="font-medium text-gray-900 mr-2">{suggestion.title}</h3>
                          {getStatusBadge(suggestion.status)}
                        </div>
                        <p className="text-sm text-gray-500">
                          From: {suggestion.author} • {suggestion.date} • 
                          <span className="ml-1 text-green-600">
                            {suggestion.upvotes} upvotes
                          </span>
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {suggestion.category}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600">{suggestion.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
                <h3 className="text-lg font-medium text-gray-900">No Community Suggestions</h3>
                <p className="text-gray-500 max-w-md mt-1">
                  This report doesn't include any community suggestions yet. You can generate a new report that includes community feedback.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
        {report.status === 'draft' && (
        <div className="mt-6 flex justify-end">
          <button
            className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md text-sm font-medium mr-4 hover:bg-blue-50"
            onClick={() => {
              const blob = new Blob([report.letterContent || ''], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${report.title.replace(/\s+/g, '_')}.html`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          >
            <Download size={16} className="inline mr-1" />
            Download as HTML
          </button>
          
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
            onClick={handleSendReport}
            disabled={sendingEmail}
          >
            {sendingEmail ? (
              <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Mail size={16} className="mr-1" />
                Send Report
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
} 