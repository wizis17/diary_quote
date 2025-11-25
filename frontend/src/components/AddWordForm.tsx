import React, { useState } from 'react';
import { addWord } from '../services/wordService';

export const AddWordForm: React.FC<{ onWordAdded?: () => void }> = ({ onWordAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    chinese_word: '',
    pinyin: '',
    meaning: '',
    part_of_speech: '',
    example: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.chinese_word || !formData.meaning) {
      alert('Chinese word and meaning are required!');
      return;
    }

    setLoading(true);
    try {
      await addWord({
        chinese_word: formData.chinese_word,
        pinyin: formData.pinyin || undefined,
        meaning: formData.meaning,
        part_of_speech: formData.part_of_speech || undefined,
        example: formData.example || undefined,
      });
      
      // Reset form
      setFormData({
        chinese_word: '',
        pinyin: '',
        meaning: '',
        part_of_speech: '',
        example: ''
      });
      
      setIsOpen(false);
      if (onWordAdded) onWordAdded();
      
      alert('Word added successfully!');
    } catch (error) {
      console.error('Error adding word:', error);
      alert('Failed to add word. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 !bg-[#4fd1c5] hover:!bg-[#3db8a8] text-[#1b1b1b] font-semibold rounded-lg transition-colors shadow-lg text-sm"
        >
          + Add Word
        </button>
      ) : (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setIsOpen(false)}>
        <div className="max-w-2xl w-full bg-[#1f2937] rounded-xl border border-gray-700 p-8" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Add New Word</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Chinese Word */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Chinese Word <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="chinese_word"
                value={formData.chinese_word}
                onChange={handleChange}
                placeholder="你好"
                className="w-full px-4 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white text-2xl focus:outline-none focus:border-[#4fd1c5] transition-colors"
                required
              />
            </div>

            {/* Pinyin */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Pinyin (Optional)
              </label>
              <input
                type="text"
                name="pinyin"
                value={formData.pinyin}
                onChange={handleChange}
                placeholder="nǐ hǎo"
                className="w-full px-4 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#4fd1c5] transition-colors"
              />
            </div>

            {/* Part of Speech */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Part of Speech (Optional)
              </label>
              <select
                name="part_of_speech"
                value={formData.part_of_speech}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#4fd1c5] transition-colors"
              >
                <option value="">Select...</option>
                <option value="noun">Noun</option>
                <option value="verb">Verb</option>
                <option value="adjective">Adjective</option>
                <option value="adverb">Adverb</option>
                <option value="pronoun">Pronoun</option>
                <option value="phrase">Phrase</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Meaning */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meaning <span className="text-red-400">*</span>
              </label>
              <textarea
                name="meaning"
                value={formData.meaning}
                onChange={handleChange}
                placeholder="Hello (greeting)"
                rows={3}
                className="w-full px-4 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#4fd1c5] transition-colors resize-none"
                required
              />
            </div>

            {/* Example */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Example (Optional)
              </label>
              <textarea
                name="example"
                value={formData.example}
                onChange={handleChange}
                placeholder="你好，很高兴见到你。(Hello, nice to meet you.)"
                rows={2}
                className="w-full px-4 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#4fd1c5] transition-colors resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 !bg-[#4fd1c5] hover:!bg-[#3db8a8] text-[#1b1b1b] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Word'}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        </div>
      )}
    </div>
  );
};
