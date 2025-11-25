import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWordById, type Word } from '../services/wordService';
import { ArrowLeft } from 'lucide-react';

export const WordDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchWord(id);
    }
  }, [id]);

  const fetchWord = async (wordId: string) => {
    try {
      setLoading(true);
      const wordData = await getWordById(wordId);
      setWord(wordData);
      setError(null);
    } catch (err) {
      console.error('Error fetching word:', err);
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
            <p className="text-center text-gray-400 mt-4">Loading word...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !word) {
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
              {error || 'Word not found'}
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
          {word.image_url && (
            <div className="w-full h-64 bg-gradient-to-br from-[#144272] to-[#1d8496] flex items-center justify-center">
              <img
                src={word.image_url}
                alt={word.chinese_word}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Content Section */}
          <div className="p-8">
            {/* Chinese Word */}
            <div className="mb-6">
              <h1 className="text-6xl font-bold text-white mb-3">
                {word.chinese_word}
              </h1>
              {word.pinyin && (
                <p className="text-2xl text-[#4fd1c5]">{word.pinyin}</p>
              )}
              {word.part_of_speech && (
                <span className="inline-block mt-3 text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                  {word.part_of_speech}
                </span>
              )}
            </div>

            {/* Meaning */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#4fd1c5] mb-2">
                Meaning
              </h2>
              <p className="text-lg text-gray-200">{word.meaning}</p>
            </div>

            {/* Example */}
            {word.example && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#4fd1c5] mb-2">
                  Example
                </h2>
                <p className="text-base text-gray-300 italic">"{word.example}"</p>
              </div>
            )}

            {/* Date Added */}
            {word.created_at && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-500">
                  Added on {new Date(word.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
