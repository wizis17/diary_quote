import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { WordCard } from '../components/WordCard';
import { AddWordForm } from '../components/AddWordForm';

interface Word {
  id: string;
  chinese_word: string;
  pinyin?: string;
  meaning: string;
  part_of_speech?: string;
  example?: string;
}

export const WordsPage: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      setLoading(true);
      const wordsRef = collection(db, 'words');
      const q = query(wordsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const wordsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      } as Word));
      
      setWords(wordsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching words:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1b1b1b] text-white pt-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4fd1c5]"></div>
            <p className="text-center text-gray-400 mt-4">Loading words...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1b1b1b] text-white pt-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
            <p className="text-center text-red-400 mb-2">Error: {error}</p>
            <p className="text-center text-gray-400 text-sm mb-4">
              Make sure you have added data to Firestore 'words' collection
            </p>
            <button 
              onClick={fetchWords}
              className="mx-auto block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1b1b1b] text-white pt-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">Chinese Words</h1>
            <p className="text-gray-400">Manage and learn your vocabulary</p>
          </div>
          <AddWordForm onWordAdded={fetchWords} />
        </div>

        {/* Words Grid */}
        {words.length === 0 ? (
          <div className="text-center bg-gray-800/50 rounded-lg p-12">
            <p className="text-gray-400 text-lg mb-4">No words found in your collection.</p>
            <p className="text-gray-500 text-sm">Click "Add Word" to create your first word card!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {words.map((word) => (
              <WordCard
                key={word.id}
                chinese_word={word.chinese_word}
                pinyin={word.pinyin}
                meaning={word.meaning}
                part_of_speech={word.part_of_speech}
                example={word.example}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
