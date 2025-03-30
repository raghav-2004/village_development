import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../lib/api';
import { Mail, FileText, CheckCircle, AlertCircle, Clock, Filter, Info, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { villages } from '../lib/mockData';
import { communitySuggestionsDB, reportsDB, CommunitySuggestion } from '../lib/localDB';

interface Report {
  id: string;
  villageId: string;
  title: string;
  createdAt: string;
  status: 'draft' | 'sent' | 'read' | 'actioned';
  recommendations: string[];
  feedbackReferences: string[];
  communitySuggestions: string[];
  priority?: string;
  sentDate?: string;
  officialName?: string;
  villageName?: string;
}

export function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [suggestions, setSuggestions] = useState<CommunitySuggestion[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
    fetchSuggestions();
  }, []);

  const fetchReports = () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching reports...");
      
      const localReports = reportsDB.getAll();
      console.log("Reports from local DB:", localReports);
      
      const formattedReports = localReports.map((report: any) => {
        const village = villages.find(v => v.id === report.villageId);
        return {
          ...report,
          villageName: village ? village.name : 'Unknown Village',
          officialName: 'District Official',
          priority: report.priority || 'medium',
          sentDate: report.status === 'sent' ? report.createdAt : undefined,
          communitySuggestions: report.communitySuggestions || []
        };
      });
      
      setReports(formattedReports);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError('An error occurred while fetching reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = () => {
    try {
      const allSuggestions = communitySuggestionsDB.getAll();
      setSuggestions(allSuggestions);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  const handleSendReport = async (reportId: string) => {
    try {
      setLoading(true);
      console.log("Sending report:", reportId);
      
      const updatedReport = reportsDB.update(reportId, { status: 'sent', sentDate: new Date().toISOString().split('T')[0] });
      
      if (updatedReport) {
        setReports(reports.map(report => 
          report.id === reportId ? { ...report, status: 'sent', sentDate: new Date().toISOString().split('T')[0] } : report
        ));
      } else {
        setError('Failed to send report');
      }
    } catch (err) {
      console.error("Error sending report:", err);
      setError('An error occurred while sending the report');
    } finally {
      setLoading(false);
    }
  };

  const createReportWithSuggestions = () => {
    try {
      const approvedSuggestions = suggestions.filter(s => s.status === 'approved');
      
      if (approvedSuggestions.length === 0) {
        setError('No approved community suggestions available for reporting');
        return;
      }
      
      const newReport = reportsDB.add({
        villageId: 'v1',
        title: `Community Feedback Report - ${new Date().toLocaleDateString()}`,
        recommendations: [
          'Based on community feedback, prioritize infrastructure improvements',
          'Address environmental concerns raised by community members',
          'Implement educational programs requested by the village'
        ],
        feedbackReferences: [],
        communitySuggestions: approvedSuggestions.map(s => s.id),
        priority: 'high',
        status: 'draft'
      });
      
      fetchReports();
      
      setError(null);
    } catch (err) {
      console.error("Error creating report:", err);
      setError('Failed to create report with community suggestions');
    }
  };

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.status === filter;
  });

  const getSuggestionCount = (report: Report) => {
    return report.communitySuggestions?.length || 0;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Official Reports</h1>
        
        <div className="flex items-center space-x-4">
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
            onClick={createReportWithSuggestions}
          >
            Generate Report from Community Suggestions
          </button>
          
          <div className="flex items-center">
            <Filter size={16} className="mr-2 text-gray-600" />
            <select
              className="border rounded-md px-3 py-1.5 text-sm bg-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Reports</option>
              <option value="draft">Drafts</option>
              <option value="sent">Sent</option>
              <option value="read">Read</option>
              <option value="actioned">Actioned</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Community Feedback Integration</h3>
            <p className="text-sm text-blue-700 mt-1">
              Reports now can include community suggestions. Click "Generate Report from Community Suggestions" to create a new report that includes approved community feedback.
            </p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle size={16} className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {loading && !reports.length ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <FileText className="mx-auto text-gray-400 mb-2" size={40} />
          <h3 className="text-lg font-medium text-gray-900">No Reports Found</h3>
          <p className="text-gray-600 mt-1">
            {filter === 'all' 
              ? 'No reports have been generated yet. Generate reports from village details or community suggestions.' 
              : `No ${filter} reports available.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg truncate" title={report.title}>
                    {report.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    report.priority === 'high' ? 'bg-red-100 text-red-800' :
                    report.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {(report.priority || 'MEDIUM').toUpperCase()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 mb-2">
                  Village: <span className="font-medium">{report.villageName || 'Unknown'}</span>
                </p>
                
                <p className="text-sm text-gray-500 mb-3">
                  Recipient: <span className="font-medium">{report.officialName || 'District Official'}</span>
                </p>
                
                {getSuggestionCount(report) > 0 && (
                  <div className="flex items-center text-sm text-blue-600 mb-3">
                    <MessageSquare size={14} className="mr-1" />
                    <span>{getSuggestionCount(report)} Community Suggestions</span>
                  </div>
                )}
                
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <Clock size={14} className="mr-1" />
                  <span>
                    {report.status === 'sent' 
                      ? `Sent: ${new Date(report.sentDate || report.createdAt).toLocaleDateString()}`
                      : `Created: ${new Date(report.createdAt).toLocaleDateString()}`
                    }
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div className={`flex items-center ${
                    report.status === 'draft' ? 'text-gray-500' :
                    report.status === 'sent' ? 'text-blue-500' :
                    report.status === 'read' ? 'text-purple-500' :
                    'text-green-500'
                  }`}>
                    {report.status === 'draft' ? (
                      <>
                        <Clock size={16} className="mr-1" />
                        <span className="text-sm">Draft</span>
                      </>
                    ) : report.status === 'sent' ? (
                      <>
                        <Mail size={16} className="mr-1" />
                        <span className="text-sm">Sent</span>
                      </>
                    ) : report.status === 'read' ? (
                      <>
                        <CheckCircle size={16} className="mr-1" />
                        <span className="text-sm">Read</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} className="mr-1" />
                        <span className="text-sm">Actioned</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      onClick={() => handleViewReport(report.id)}
                    >
                      View
                    </button>
                    
                    {report.status === 'draft' && (
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() => handleSendReport(report.id)}
                      >
                        Send
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 