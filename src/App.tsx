import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AudioPlayer } from './components/AudioPlayer';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <div className="min-h-screen bg-[#06050a] text-white flex flex-col font-sans selection:bg-[#ff007a] selection:text-white">
            {/* Top Navigation */}
            <Navbar />

            {/* Main View Router */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            {/* Ambient Vice City Radio Player */}
            <AudioPlayer />

            {/* Footer */}
            <Footer />
          </div>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
