import { 
  signInAnonymously, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './config';

// Authentication service
export const signInAnonymouslyUser = async () => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
}; 