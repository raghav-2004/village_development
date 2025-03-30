import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Remove StrictMode to prevent double rendering in development
// This improves stability for the demo
createRoot(document.getElementById('root')!).render(<App />);
