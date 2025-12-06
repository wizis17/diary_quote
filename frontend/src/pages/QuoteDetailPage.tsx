import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuoteById, updateQuote, deleteQuote, type Quote } from '../services/quoteService';
import { ArrowLeft, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../supabase';

export const QuoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ text: '', meaning: '', imageUrl: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageInputType, setImageInputType] = useState<'file' | 'url'>('file');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);

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
      if (quoteData) {
        setEditForm({ text: quoteData.text, meaning: quoteData.meaning, imageUrl: quoteData.image_url || '' });
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching quote:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (quote) {
      setEditForm({ text: quote.text, meaning: quote.meaning, imageUrl: quote.image_url || '' });
    }
    setImageFile(null);
    setImageInputType('file');
    setUploadProgress(0);
  };

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

  const handleSave = async () => {
    if (!id || !quote) return;

    if (!editForm.text || !editForm.meaning) {
      alert('Quote text and meaning are required!');
      return;
    }

    setSaving(true);
    setUploadProgress(0);

    try {
      // Get image URL - either from file upload, direct URL input, or keep existing
      let image_url = quote.image_url;
      if (imageInputType === 'file' && imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          image_url = uploadedUrl;
        }
      } else if (imageInputType === 'url' && editForm.imageUrl.trim()) {
        image_url = editForm.imageUrl.trim();
      }

      await updateQuote(id, {
        text: editForm.text,
        meaning: editForm.meaning,
        image_url: image_url,
      });

      const updatedQuote = await getQuoteById(id);
      setQuote(updatedQuote);
      setIsEditing(false);
      setImageFile(null);
      setImageInputType('file');
      setUploadProgress(0);
      alert('Quote updated successfully!');
    } catch (error) {
      console.error('Error updating quote:', error);
      alert('Failed to update quote. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this quote? This action cannot be undone.'
    );

    if (!confirmDelete) return;

    try {
      await deleteQuote(id);
      alert('Quote deleted successfully!');
      navigate('/collection');
    } catch (error) {
      console.error('Error deleting quote:', error);
      alert('Failed to delete quote. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
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
        {/* Header with Back and Action Buttons */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/collection')}
            className="flex items-center gap-2 text-gray-400 hover:text-[#4fd1c5] transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Collection
          </button>

          {!isEditing && (
            <div className="flex gap-3">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2"
              >
                <Edit2 size={18} />
                
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 "
              >
                <Trash2 size={18} />
                
              </button>
            </div>
          )}

          {isEditing && (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-[#4fd1c5] hover:bg-[#3db8a8] text-[#1b1b1b] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-[#2a2a2a] rounded-xl border border-gray-700 overflow-hidden">
          {/* Image Section */}
          {!isEditing && quote.image_url && (
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
            {!isEditing ? (
              <>
                {/* View Mode */}
                <div className="mb-8">
                  <h2 className="text-sm font-semibold text-[#4fd1c5] mb-3 uppercase tracking-wide">
                    Quote
                  </h2>
                  <h1 className="text-2xl md:text-3xl font-bold text-white leading-[3] font-chinese">
                    {quote.text}
                  </h1>
                </div>

                <div className="mb-6 pt-6 border-t border-gray-700">
                  <h2 className="text-xl font-semibold text-[#4fd1c5] mb-3">
                    Meaning
                  </h2>
                  <p className="text-lg text-gray-200 leading-relaxed">{quote.meaning}</p>
                </div>

                {quote.created_at && (
                  <div className="pt-6 border-t border-gray-700">
                    <p className="text-sm text-gray-500">
                      Added on {new Date(quote.created_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Edit Mode */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Quote Text <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="text"
                      value={editForm.text}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-[#111827] border border-gray-600 rounded-lg text-white text-lg focus:outline-none focus:border-[#4fd1c5] transition-colors resize-none font-chinese"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Meaning / Translation <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="meaning"
                      value={editForm.meaning}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#111827] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#4fd1c5] transition-colors resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Change Image (Optional)
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
                        value={editForm.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#4fd1c5] transition-colors"
                      />
                    )}
                    {quote.image_url && imageInputType === 'file' && !imageFile && (
                      <p className="text-xs text-gray-500 mt-1">Current image will be kept if no new image is selected</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
