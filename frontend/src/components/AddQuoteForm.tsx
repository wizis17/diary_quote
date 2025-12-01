import React, { useState } from 'react';
import { addQuote } from '../services/quoteService';
import { supabase } from '../supabase';

export const AddQuoteForm: React.FC<{ onQuoteAdded?: () => void }> = ({ onQuoteAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    text: '',
    meaning: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageInputType, setImageInputType] = useState<'file' | 'url'>('file');

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${imageFile.name}`;
      const filePath = `quotes/${fileName}`;

      setUploadProgress(50);

      const { error } = await supabase.storage
        .from('quote-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      setUploadProgress(75);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('quote-images')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.text || !formData.meaning) {
      alert('Quote text and meaning are required!');
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    
    try {
      // Get image URL - either from file upload or direct URL input
      let image_url: string | undefined;
      if (imageInputType === 'file' && imageFile) {
        image_url = await uploadImage() || undefined;
      } else if (imageInputType === 'url' && formData.imageUrl.trim()) {
        image_url = formData.imageUrl.trim();
      }

      await addQuote({
        text: formData.text,
        meaning: formData.meaning,
        image_url: image_url,
      });
      
      // Reset form
      setFormData({
        text: '',
        meaning: '',
        imageUrl: '',
      });
      setImageFile(null);
      setUploadProgress(0);
      setImageInputType('file');
      
      setIsOpen(false);
      if (onQuoteAdded) onQuoteAdded();
      
      alert('Quote added successfully!');
    } catch (error) {
      console.error('Error adding quote:', error);
      alert('Failed to add quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 !bg-[#4fd1c5] text-[#1b1b1b] font-semibold rounded-lg transition-colors shadow-lg text-sm"
        >
          + Add Quote
        </button>
      ) : (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => setIsOpen(false)}>
        <div className="max-w-2xl w-full bg-gradient-to-br from-[#1f2937] to-[#111827] rounded-2xl border border-gray-700/50 shadow-2xl p-6 sm:p-8 transform transition-all animate-slideUp" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">Add New Quote</h3>
              <p className="text-sm text-gray-400">Share your wisdom with the world</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 rounded-lg p-2 transition-all text-2xl w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Quote Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#4fd1c5] rounded-full"></span>
                Quote Text <span className="text-red-400">*</span>
              </label>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleChange}
                placeholder="路遥知马力，日久见人心"
                rows={4}
                className="w-full px-4 py-3 bg-[#0d1117] border border-gray-600/50 rounded-xl text-white text-lg focus:outline-none focus:border-[#4fd1c5] focus:ring-2 focus:ring-[#4fd1c5]/20 transition-all resize-none font-chinese placeholder:text-gray-600"
                required
              />
            </div>

            {/* Meaning */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#4fd1c5] rounded-full"></span>
                Meaning / Translation <span className="text-red-400">*</span>
              </label>
              <textarea
                name="meaning"
                value={formData.meaning}
                onChange={handleChange}
                placeholder="Distance tests a horse's strength, time reveals a person's heart"
                rows={3}
                className="w-full px-4 py-3 bg-[#0d1117] border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-[#4fd1c5] focus:ring-2 focus:ring-[#4fd1c5]/20 transition-all resize-none placeholder:text-gray-600"
                required
              />
            </div>

            {/* Image Input Type Toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                Image (Optional)
              </label>
              <div className="flex gap-2 mb-3 bg-gray-800/50 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setImageInputType('file')}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    imageInputType === 'file'
                      ? 'bg-[#4fd1c5] text-[#1b1b1b] shadow-lg shadow-[#4fd1c5]/20'
                      : 'bg-transparent text-gray-400'
                  }`}
                >
                  📁 Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputType('url')}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    imageInputType === 'url'
                      ? 'bg-[#4fd1c5] text-[#1b1b1b] shadow-lg shadow-[#4fd1c5]/20'
                      : 'bg-transparent text-gray-400'
                  }`}
                >
                  🔗 Image URL
                </button>
              </div>

              {imageInputType === 'file' ? (
                <>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 bg-[#0d1117] border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-[#4fd1c5] focus:ring-2 focus:ring-[#4fd1c5]/20 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#4fd1c5] file:text-[#1b1b1b] file:cursor-pointer file:transition-colors"
                    />
                  </div>
                  {imageFile && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-[#4fd1c5] bg-[#4fd1c5]/10 px-3 py-2 rounded-lg">
                      <span>✓</span>
                      <span className="truncate">Selected: {imageFile.name}</span>
                    </div>
                  )}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Uploading...</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#4fd1c5] to-[#3db8a8] h-2 rounded-full transition-all duration-300 shadow-lg shadow-[#4fd1c5]/30"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-[#0d1117] border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-[#4fd1c5] focus:ring-2 focus:ring-[#4fd1c5]/20 transition-all placeholder:text-gray-600"
                />
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-[#4fd1c5] to-[#3db8a8] text-[#1b1b1b] font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#4fd1c5]/30 active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : '✨ Add Quote'}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-3.5 bg-gray-700/50 text-white font-semibold rounded-xl transition-all border border-gray-600/50"
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
