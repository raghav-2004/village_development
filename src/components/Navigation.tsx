import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, BarChart2, MessageSquare, LogIn } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <MapPin className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold">Digital Land Survey</span>
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
            <Link to="/login" className="flex items-center px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700">
              <LogIn className="h-5 w-5 mr-1" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}