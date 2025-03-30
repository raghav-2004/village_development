import React from 'react';
import { autoLogin } from '../lib/mockAPI';

interface RequireAuthProps {
  children: JSX.Element;
}

// Simplified version that always allows access
export function RequireAuth({ children }: RequireAuthProps) {
  // Always ensure a user is set for demo mode
  autoLogin();
  
  // Always render children without any auth checks
  return children;
} 