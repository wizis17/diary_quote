import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuoteById, type Quote } from '../services/quoteService';
import { ArrowLeft } from 'lucide-react';

export const QuoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchQuote(id);
    }
  }, [id]);

  const fetchQuote = async (quoteId: string) => {
    try {
      setLoading(true);
      const quoteData = await getQuoteById(quoteId);
      setQuote(quoteData);
      setError(null);
    } catch (err) {
      console.error('Error fetching quote:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1b1b1b] text-white pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4fd1c5]"></div>
            <p className="text-center text-gray-400 mt-4">Loading quote...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-[#1b1b1b] text-white pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/collection')}
            className="flex items-center gap-2 text-gray-400 hover:text-[#4fd1c5] mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Collection
          </button>
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
            <p className="text-center text-red-400">
              {error || 'Quote not found'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1b1b1b] text-white pt-24 px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/collection')}
          className="flex items-center gap-2 text-gray-400 hover:text-[#4fd1c5] mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Collection
        </button>

        {/* Main Content */}
        <div className="bg-[#2a2a2a] rounded-xl border border-gray-700 overflow-hidden">
          {/* Image Section (if available) */}
          {quote.image_url && (
            <div className="w-full h-80 bg-gradient-to-br from-[#144272] to-[#1d8496] flex items-center justify-center relative overflow-hidden">
              <img
                src={quote.image_url}
                alt="Quote illustration"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Content Section */}
          <div className="p-8">
            {/* Quote Text */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-[#4fd1c5] mb-3 uppercase tracking-wide">
                Quote
              </h2>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-relaxed">
                {quote.text}
              </h1>
            </div>

            {/* Meaning */}
            <div className="mb-6 pt-6 border-t border-gray-700">
              <h2 className="text-xl font-semibold text-[#4fd1c5] mb-3">
                Meaning
              </h2>
              <p className="text-lg text-gray-200 leading-relaxed">{quote.meaning}</p>
            </div>

            {/* Metadata */}
            {quote.created_at && (
              <div className="pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-500">
                  Added on {new Date(quote.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
