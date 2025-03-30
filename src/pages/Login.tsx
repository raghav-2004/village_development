import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export function Login() {
  // No hooks, no effects, no navigation logic - completely static
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-lg">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
            <LogIn className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Demo Mode Active
          </h2>
        </div>
        
        <div className="text-center text-blue-700 my-4">
          <p className="text-lg font-medium">You are automatically logged in</p>
          <p className="text-sm mt-2">Return to the homepage to continue</p>
        </div>

        <div className="mt-6">
          <Link 
            to="/"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}