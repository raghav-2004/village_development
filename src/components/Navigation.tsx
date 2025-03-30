import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Users, BarChart2, MessageSquare, LogOut, FileText, User } from 'lucide-react';

export function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <MapPin size={24} className="text-green-600" />
              <span className="ml-2 text-xl font-bold">gramMITRA</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/map" className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-50">
              <MapPin className="h-5 w-5 mr-1" />
              <span>Map</span>
            </Link>
            <Link to="/community" className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-50">
              <Users className="h-5 w-5 mr-1" />
              <span>Community</span>
            </Link>
            <Link to="/analytics" className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-50">
              <BarChart2 className="h-5 w-5 mr-1" />
              <span>Analytics</span>
            </Link>
            <Link to="/feedback" className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-50">
              <MessageSquare className="h-5 w-5 mr-1" />
              <span>Feedback</span>
            </Link>
            <Link to="/reports" className={`flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-50 ${
              location.pathname === '/reports' ? 'bg-gray-100' : ''
            }`}>
              <FileText className="h-5 w-5 mr-1" />
              <span>Reports</span>
            </Link>
            
            {/* Always show user as logged in for demo mode */}
            <div className="flex items-center text-gray-700 px-3 py-2">
              <User className="h-5 w-5 text-green-600 mr-1" />
              <span className="font-medium">Demo User</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}