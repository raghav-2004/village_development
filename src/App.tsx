import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { RequireAuth } from './components/RequireAuth';
import { ReportDetail } from './pages/ReportDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
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
              <Route path="/reports" element={
                <RequireAuth>
                  <Reports />
                </RequireAuth>
              } />
              <Route path="/reports/:reportId" element={
                <RequireAuth>
                  <ReportDetail />
                </RequireAuth>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;