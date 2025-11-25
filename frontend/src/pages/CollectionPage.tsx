import React, { useEffect, useState } from 'react';
import { getQuotes, type Quote } from '../services/quoteService';
import { useNavigate } from 'react-router-dom';
import { AddQuoteForm } from '../components/AddQuoteForm';

export const CollectionPage: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const quotesData = await getQuotes();
      setQuotes(quotesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching quotes:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1b1b1b] text-white pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4fd1c5]"></div>
            <p className="text-center text-gray-400 mt-4">Loading collection...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1b1b1b] text-white pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
            <p className="text-center text-red-400 mb-2">Error: {error}</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={fetchQuotes}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Retry
              </button>
              <button 
                onClick={handleBackToHome}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1b1b1b] text-white pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Collection</h1>
            <button 
              onClick={handleBackToHome}
              className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </div>
          <AddQuoteForm onQuoteAdded={fetchQuotes} />
        </div>
        
        {/* Content Section */}
        {quotes.length === 0 ? (
          <div className="text-center bg-gray-800/20 rounded-lg p-16 border border-gray-700">
            <p className="text-gray-400 text-lg mb-6">No quotes in collection yet.</p>
            <button 
              onClick={handleBackToHome}
              className="px-6 py-2 bg-[#4fd1c5] hover:bg-[#38b2ac] text-white rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quotes.map((quote, index) => (
              <div
                key={quote.id}
                onClick={() => navigate(`/quote/${quote.id}`)}
                className="bg-[#2a2a2a] rounded-xl border border-gray-700 overflow-hidden hover:border-[#4fd1c5] transition-all duration-300 group cursor-pointer"
              >
                {index === 0 ? (
                  <div className="flex h-full">
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Quote</span>
                        <h3 className="text-xl font-bold text-white mt-2 mb-2 line-clamp-3">
                          {quote.text}
                        </h3>
                        <p className="text-sm text-gray-300 line-clamp-2">{quote.meaning}</p>
                      </div>
                    </div>
                    <div className="w-32 bg-gradient-to-br from-[#144272] to-[#1d8496] flex items-center justify-center relative overflow-hidden">
                      {quote.image_url ? (
                        <img
                          src={quote.image_url}
                          alt={quote.text}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-white/30 text-xs">Image</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-4">
                        {quote.text}
                      </h3>
                      <p className="text-sm text-gray-300 line-clamp-3">{quote.meaning}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};