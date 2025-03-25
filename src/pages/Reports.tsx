import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../lib/api';
import { Mail, FileText, CheckCircle, AlertCircle, Clock, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportsAPI.getReports();
      
      if (response.success) {
        setReports(response.reports || []);
      } else {
        setError('Failed to fetch reports');
      }
    } catch (err) {
      setError('An error occurred while fetching reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  const handleSendReport = async (reportId: string) => {
    try {
      setLoading(true);
      const response = await reportsAPI.sendReport(reportId);
      
      if (response.success) {
        // Update report status in the list
        setReports(reports.map(report => 
          report.id === reportId ? { ...report, status: 'sent' } : report
        ));
      } else {
        setError('Failed to send report');
      }
    } catch (err) {
      setError('An error occurred while sending the report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.status === filter;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Official Reports</h1>
        
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
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <AlertCircle size={16} className="mr-2 inline" />
          {error}
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
              ? 'No reports have been generated yet. Generate reports from village details.' 
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
                    {report.priority.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 mb-2">
                  Village: <span className="font-medium">{report.villageName}</span>
                </p>
                
                <p className="text-sm text-gray-500 mb-3">
                  Recipient: <span className="font-medium">{report.officialName}</span>
                </p>
                
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <Clock size={14} className="mr-1" />
                  <span>
                    {report.status === 'sent' 
                      ? `Sent: ${new Date(report.sentDate).toLocaleDateString()}`
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