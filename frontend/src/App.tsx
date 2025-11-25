import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HeroSection } from "./components/hero-section-3";
import { WordsPage } from "./pages/WordsPage";
import { CollectionPage } from "./pages/CollectionPage";
import { QuoteDetailPage } from "./pages/QuoteDetailPage";

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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/words" element={<WordsPage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/quote/:id" element={<QuoteDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;