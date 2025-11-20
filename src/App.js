import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './views/HomePage';
import DiagnosticToolPage from './views/DiagnosticToolPage';
// import DiseaseFinderPage from './views/DiseaseFinderPage';
import AboutPage from './views/AboutPage';
import AboutUsPage from './views/AboutUsPage';
import LoginPage from './views/LoginPage';
import ExpertHomePage from './views/expertHome';
import { AuthProvider, useAuth } from './context/AuthContext';
import SymptomsPage from './views/SymptomsPage';
import AdvicePage from './views/AdvicePage';
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // wait for cookie check
  if (!isAuthenticated) return <Navigate to="/sign-in" />;
  return children;
};


function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/crops/:cid/disease" element={<DiagnosticToolPage />} />
          <Route path="/crops/:cid/disease/:disId" element={<AdvicePage />} />
          <Route path="/crops/:cid/symptom/level/:level" element={<SymptomsPage />} />
          {/* <Route path="disease-finder/:disId" element={<DiseaseFinderPage />} /> */}
          <Route path="about" element={<AboutPage />} />
          <Route path="about-us" element={<AboutUsPage />} />
          <Route path="sign-in" element={<LoginPage />} />
          <Route
            path="/expert-home"
            element={
              <ProtectedRoute>
                <ExpertHomePage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;