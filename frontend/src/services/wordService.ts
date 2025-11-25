import { 
  collection, 
  addDoc, 
  getDocs,
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Word {
  id?: string;
  chinese_word: string;      // Chinese characters
  pinyin?: string;           // Pronunciation (e.g., "nǐ hǎo")
  meaning: string;           // English or Khmer meaning
  part_of_speech?: string;   // noun, verb, adjective, etc.
  example?: string;          // Example sentence
  imageUrl?: string;         // Optional image URL
  createdAt?: Timestamp;
}

const COLLECTION_NAME = 'words';

// Get all words
export const getWords = async (): Promise<Word[]> => {
  try {
    const wordsRef = collection(db, COLLECTION_NAME);
    const q = query(wordsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Word));
  } catch (error) {
    console.error('Error fetching words:', error);
    throw error;
  }
};

// Get a single word by ID
export const getWordById = async (id: string): Promise<Word | null> => {
  try {
    const wordRef = doc(db, COLLECTION_NAME, id);
    const wordDoc = await getDoc(wordRef);
    
    if (wordDoc.exists()) {
      return {
        id: wordDoc.id,
        ...wordDoc.data()
      } as Word;
    }
    return null;
  } catch (error) {
    console.error('Error fetching word:', error);
    throw error;
  }
};

// Add a new word
export const addWord = async (word: Omit<Word, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...word,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding word:', error);
    throw error;
  }
};

// Update a word
export const updateWord = async (id: string, word: Partial<Word>): Promise<void> => {
  try {
    const wordRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(wordRef, word);
  } catch (error) {
    console.error('Error updating word:', error);
    throw error;
  }
};

// Delete a word
export const deleteWord = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Error deleting word:', error);
    throw error;
  }
};
