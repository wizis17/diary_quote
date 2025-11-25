import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HeroSection } from "./components/hero-section-3";

// Lazy load pages for code splitting
const CollectionPage = lazy(() => import("./pages/CollectionPage").then(module => ({ default: module.CollectionPage })));
const QuoteDetailPage = lazy(() => import("./pages/QuoteDetailPage").then(module => ({ default: module.QuoteDetailPage })));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#1b1b1b] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4fd1c5]"></div>
  </div>
);

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-black text-white">
      <HeroSection />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/quote/:id" element={<QuoteDetailPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;