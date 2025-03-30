import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { MapView } from './pages/MapView';
import { Community } from './pages/Community';
import { Analytics } from './pages/Analytics';
import { Feedback } from './pages/Feedback';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AuthProvider } from './contexts/AuthContext';
import { Reports } from './pages/Reports';
import { ReportDetail } from './pages/ReportDetail';
import { autoLogin } from './lib/mockAPI';

// Perform auth initialization immediately on module load
// This ensures authentication is set before rendering begins
const authData = autoLogin();
localStorage.setItem('token', authData.token);
localStorage.setItem('user', JSON.stringify(authData.user));
console.log('Authentication initialized at app startup');

function App() {
  return (
    <AuthProvider>
      {/* Use HashRouter with no basename for maximum stability */}
      <HashRouter>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/community" element={<Community />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/reports/:reportId" element={<ReportDetail />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;