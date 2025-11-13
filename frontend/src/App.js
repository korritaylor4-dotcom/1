import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import CategoryPage from "./pages/CategoryPage";
import Breeds from "./pages/Breeds";
import BreedDetail from "./pages/BreedDetail";
import SpeciesPage from "./pages/SpeciesPage";

// Admin Pages
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ArticlesList from "./pages/admin/ArticlesList";
import ArticleEditor from "./pages/admin/ArticleEditor";
import BreedsList from "./pages/admin/BreedsList";
import BreedEditor from "./pages/admin/BreedEditor";
import Analytics from "./pages/admin/Analytics";
import SEOSettings from "./pages/admin/SEOSettings";

import { isAuthenticated } from "./utils/auth";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/admin/login" />;
};

// Public Layout with Header/Footer
const PublicLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/articles" element={<PublicLayout><Articles /></PublicLayout>} />
          <Route path="/articles/:id" element={<PublicLayout><ArticleDetail /></PublicLayout>} />
          <Route path="/breeds" element={<PublicLayout><Breeds /></PublicLayout>} />
          <Route path="/breeds/:id" element={<PublicLayout><BreedDetail /></PublicLayout>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          <Route path="/admin/articles" element={<ProtectedRoute><ArticlesList /></ProtectedRoute>} />
          <Route path="/admin/articles/new" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
          <Route path="/admin/articles/edit/:id" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
          
          <Route path="/admin/breeds" element={<ProtectedRoute><BreedsList /></ProtectedRoute>} />
          <Route path="/admin/breeds/new" element={<ProtectedRoute><BreedEditor /></ProtectedRoute>} />
          <Route path="/admin/breeds/edit/:id" element={<ProtectedRoute><BreedEditor /></ProtectedRoute>} />
          
          <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/admin/seo" element={<ProtectedRoute><SEOSettings /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
