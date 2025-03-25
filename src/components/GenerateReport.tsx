import React, { useState } from 'react';
import { Mail, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { reportsAPI } from '../lib/api';

interface RecommendationData {
  priority: 'high' | 'medium' | 'low';
  crops: string[];
  waterManagement: string;
  infrastructure: string;
  renewableEnergy: string;
}

interface GenerateReportProps {
  villageId: string;
  villageName: string;
  recommendations: RecommendationData;
}

export function GenerateReport({ villageId, villageName, recommendations }: GenerateReportProps) {
  const [loading, setLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any>(null);

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await reportsAPI.generateReport(villageId, recommendations);
      
      if (response.success) {
        setReport(response.report);
        setReportGenerated(true);
      } else {
        setError('Failed to generate report. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReport = async () => {
    try {
      if (!report || !report.id) {
        setError('No report to send. Please generate a report first.');
        return;
      }
      
      setLoading(true);
      setError(null);
      
      const response = await reportsAPI.sendReport(report.id);
      
      if (response.success) {
        setReportSent(true);
      } else {
        setError('Failed to send report. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <FileText className="mr-2" size={20} />
        Generate Official Report
      </h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle size={16} className="mr-2" />
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <p className="mb-2">
          Generate a formal report and letter for <strong>{villageName}</strong> officials based on the AI recommendations 
          and environmental data analyzed by gramMITRA.
        </p>
        
        <div className="bg-gray-100 p-3 rounded-md mb-3">
          <div className="font-semibold mb-1">Priority Level: 
            <span className={`ml-2 px-2 py-1 rounded-full text-white ${
              recommendations.priority === 'high' ? 'bg-red-500' : 
              recommendations.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
            }`}>
              {recommendations.priority.toUpperCase()}
            </span>
          </div>
          <div className="text-sm">
            This report will include recommendations for crops, water management, 
            infrastructure development, and renewable energy options.
          </div>
        </div>
      </div>
      
      {reportGenerated && report && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex items-center mb-2">
            <CheckCircle className="text-green-500 mr-2" size={18} />
            <h4 className="font-semibold">Report Generated Successfully</h4>
          </div>
          <p className="text-sm mb-2">
            <strong>Title:</strong> {report.title}
          </p>
          <p className="text-sm mb-2">
            <strong>Recipient:</strong> {report.officialName} ({report.officialEmail})
          </p>
          <div className="text-sm mb-2">
            <strong>Recommendations:</strong>
            <ul className="list-disc pl-5 mt-1">
              {report.recommendations.map((rec: string, index: number) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <div className="flex mt-4">
        <button
          className={`mr-2 flex items-center px-4 py-2 rounded text-white ${
            loading || reportSent ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={handleGenerateReport}
          disabled={loading || reportSent}
        >
          {loading && !reportGenerated ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <FileText size={16} className="mr-2" />
          )}
          Generate Report
        </button>
        
        {reportGenerated && !reportSent && (
          <button
            className={`flex items-center px-4 py-2 rounded text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            }`}
            onClick={handleSendReport}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Mail size={16} className="mr-2" />
            )}
            Send to Official
          </button>
        )}
      </div>
      
      {reportSent && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
          <CheckCircle size={18} className="mr-2" />
          <div>
            <strong>Success!</strong> The report has been sent to {report.officialName} ({report.officialEmail}).
          </div>
        </div>
      )}
    </div>
  );
} 