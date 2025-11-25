import { supabase } from '../supabase';

export interface Word {
  id?: string;
  chinese_word: string;      // Chinese characters
  pinyin?: string;           // Pronunciation (e.g., "nǐ hǎo")
  meaning: string;           // English or Khmer meaning
  part_of_speech?: string;   // noun, verb, adjective, etc.
  example?: string;          // Example sentence
  image_url?: string;        // Optional image URL
  created_at?: string;
}

const TABLE_NAME = 'words';

// Get all words
export const getWords = async (): Promise<Word[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching words:', error);
    throw error;
  }
};

// Get a single word by ID
export const getWordById = async (id: string): Promise<Word | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching word:', error);
    throw error;
  }
};

// Add a new word
export const addWord = async (word: Omit<Word, 'id' | 'created_at'>): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([{
        ...word,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding word:', error);
    throw error;
  }
};

// Update a word
export const updateWord = async (id: string, word: Partial<Word>): Promise<void> => {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update(word)
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating word:', error);
    throw error;
  }
};

// Delete a word
export const deleteWord = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting word:', error);
    throw error;
  }
};
