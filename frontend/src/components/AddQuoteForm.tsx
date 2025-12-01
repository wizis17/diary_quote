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
          className="px-4 py-2 !bg-[#4fd1c5] hover:!bg-[#3db8a8] text-[#1b1b1b] font-semibold rounded-lg transition-colors shadow-lg text-sm"
        >
          + Add Quote
        </button>
      ) : (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setIsOpen(false)}>
        <div className="max-w-2xl w-full bg-[#1f2937] rounded-xl border border-gray-700 p-8" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Add New Quote</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Quote Text */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quote Text <span className="text-red-400">*</span>
              </label>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleChange}
                placeholder="路遥知马力，日久见人心"
                rows={4}
                className="w-full px-4 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white text-lg focus:outline-none focus:border-[#4fd1c5] transition-colors resize-none"
                required
              />
            </div>

            {/* Meaning */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meaning / Translation <span className="text-red-400">*</span>
              </label>
              <textarea
                name="meaning"
                value={formData.meaning}
                onChange={handleChange}
                placeholder="Distance tests a horse's strength, time reveals a person's heart"
                rows={3}
                className="w-full px-4 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#4fd1c5] transition-colors resize-none"
                required
              />
            </div>

            {/* Image Input Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image (Optional)
              </label>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setImageInputType('file')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    imageInputType === 'file'
                      ? 'bg-[#4fd1c5] text-[#1b1b1b]'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputType('url')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    imageInputType === 'url'
                      ? 'bg-[#4fd1c5] text-[#1b1b1b]'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Image URL
                </button>
              </div>

              {imageInputType === 'file' ? (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#4fd1c5] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#4fd1c5] file:text-[#1b1b1b] hover:file:bg-[#3db8a8] file:cursor-pointer"
                  />
                  {imageFile && (
                    <p className="text-sm text-gray-400 mt-2">
                      Selected: {imageFile.name}
                    </p>
                  )}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-[#4fd1c5] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Uploading: {Math.round(uploadProgress)}%</p>
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
                  className="w-full px-4 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#4fd1c5] transition-colors"
                />
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 !bg-[#4fd1c5] hover:!bg-[#3db8a8] text-[#1b1b1b] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Quote'}
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
