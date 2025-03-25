import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportsAPI } from '../lib/api';
import { FileText, Mail, Download, ArrowLeft, CheckCircle, AlertCircle, User, MapPin, Clock } from 'lucide-react';

export function ReportDetail() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [emailSuccess, setEmailSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (reportId) {
      fetchReportDetails(reportId);
    }
  }, [reportId]);

  const fetchReportDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportsAPI.getReportById(id);
      
      if (response.success && response.report) {
        setReport(response.report);
      } else {
        setError('Failed to fetch report details');
      }
    } catch (err) {
      setError('An error occurred while fetching report details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReport = async () => {
    if (!report) return;
    
    try {
      setSendingEmail(true);
      setError(null);
      
      const response = await reportsAPI.sendReport(report.id);
      
      if (response.success) {
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
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setSendingEmail(false);
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
              {report.priority.toUpperCase()} PRIORITY
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
                <div className="font-medium">{report.villageName}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <User className="text-gray-500 mr-2 mt-1" size={16} />
              <div>
                <div className="text-sm text-gray-500">Recipient</div>
                <div className="font-medium">{report.officialName}</div>
                <div className="text-sm text-gray-500">{report.officialEmail}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <FileText className="text-gray-500 mr-2 mt-1" size={16} />
              <div>
                <div className="text-sm text-gray-500">Report Type</div>
                <div className="font-medium capitalize">{report.reportType}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="text-gray-500 mr-2 mt-1" size={16} />
              <div>
                <div className="text-sm text-gray-500">
                  {report.status === 'sent' || report.status === 'read' || report.status === 'actioned' ? 'Sent Date' : 'Created Date'}
                </div>
                <div className="font-medium">
                  {report.status === 'sent' || report.status === 'read' || report.status === 'actioned'
                    ? new Date(report.sentDate).toLocaleString()
                    : new Date(report.createdAt).toLocaleString()
                  }
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-2">
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="text-gray-700 whitespace-pre-line">{report.summary}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Recommendations</h2>
        </div>
        
        <div className="px-6 py-4">
          <ul className="space-y-2">
            {report.recommendations.map((recommendation: string, index: number) => (
              <li key={index} className="pl-2 border-l-4 border-green-500">
                <p className="text-gray-700">{recommendation}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Formal Letter</h2>
        </div>
        
        <div className="px-6 py-4 prose max-w-none">
          <div className="border p-4 rounded bg-gray-50" dangerouslySetInnerHTML={{ __html: report.letterContent }}></div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 mt-6">
        {report.status === 'draft' && (
          <button
            className={`flex items-center px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700 ${
              sendingEmail ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            onClick={handleSendReport}
            disabled={sendingEmail}
          >
            {sendingEmail ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Mail size={16} className="mr-2" />
            )}
            Send to Official
          </button>
        )}
        
        <button
          className="flex items-center px-4 py-2 rounded text-gray-800 bg-gray-200 hover:bg-gray-300"
          onClick={() => window.print()}
        >
          <Download size={16} className="mr-2" />
          Download PDF
        </button>
      </div>
    </div>
  );
} 