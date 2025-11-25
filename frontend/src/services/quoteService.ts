import { supabase } from '../supabase';

export interface Quote {
  id?: string;
  text: string;              // Chinese quote text
  image_url?: string;        // Optional image URL (snake_case for DB)
  meaning: string;           // Translation/meaning
  created_at?: string;       // snake_case for DB
}

const TABLE_NAME = 'quotes';

// Get all quotes
export const getQuotes = async (): Promise<Quote[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }
};

// Get a single quote by ID
export const getQuoteById = async (id: string): Promise<Quote | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching quote:', error);
    throw error;
  }
};

// Add a new quote
export const addQuote = async (quote: Omit<Quote, 'id' | 'created_at'>): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([{
        text: quote.text,
        meaning: quote.meaning,
        image_url: quote.image_url,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding quote:', error);
    throw error;
  }
};

// Update a quote
export const updateQuote = async (id: string, quote: Partial<Quote>): Promise<void> => {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update(quote)
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating quote:', error);
    throw error;
  }
};

// Delete a quote
export const deleteQuote = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting quote:', error);
    throw error;
  }
};
