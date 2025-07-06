import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './config';

// Types
export interface Member {
  id: string;
  name: string;
  email?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  paidBy: string;
  category?: string;
  splitWith: string[];
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: Member[];
  expenses: Expense[];
  createdAt: string;
  createdBy: string;
}

// Collections
const GROUPS_COLLECTION = 'groups';
const EXPENSES_COLLECTION = 'expenses';
const MEMBERS_COLLECTION = 'members';

// Group operations
export const createGroup = async (groupData: Omit<Group, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, GROUPS_COLLECTION), {
      ...groupData,
      createdAt: serverTimestamp(),
    });
    return { 
      id: docRef.id, 
      ...groupData,
      createdAt: new Date().toISOString() // Provide a fallback createdAt
    };
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

export const getGroups = async (userId: string): Promise<Group[]> => {
  try {
    const q = query(
      collection(db, GROUPS_COLLECTION),
      where('createdBy', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Group[];
  } catch (error) {
    console.error('Error getting groups:', error);
    throw error;
  }
};

export const updateGroup = async (groupId: string, updates: Partial<Group>) => {
  try {
    const groupRef = doc(db, GROUPS_COLLECTION, groupId);
    await updateDoc(groupRef, updates);
  } catch (error) {
    console.error('Error updating group:', error);
    throw error;
  }
};

export const deleteGroup = async (groupId: string) => {
  try {
    const groupRef = doc(db, GROUPS_COLLECTION, groupId);
    await deleteDoc(groupRef);
  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
};

// Expense operations
export const addExpense = async (groupId: string, expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, EXPENSES_COLLECTION), {
      ...expenseData,
      groupId,
      createdAt: serverTimestamp(),
    });
    return { 
      id: docRef.id, 
      ...expenseData,
      createdAt: new Date().toISOString() // Provide a fallback createdAt
    };
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

export const getExpenses = async (groupId: string): Promise<Expense[]> => {
  try {
    const q = query(
      collection(db, EXPENSES_COLLECTION),
      where('groupId', '==', groupId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Expense[];
  } catch (error) {
    console.error('Error getting expenses:', error);
    throw error;
  }
};

export const deleteExpense = async (expenseId: string) => {
  try {
    const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
    await deleteDoc(expenseRef);
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

// Member operations
export const addMember = async (groupId: string, memberData: Omit<Member, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, MEMBERS_COLLECTION), {
      ...memberData,
      groupId,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...memberData };
  } catch (error) {
    console.error('Error adding member:', error);
    throw error;
  }
};

export const getMembers = async (groupId: string): Promise<Member[]> => {
  try {
    const q = query(
      collection(db, MEMBERS_COLLECTION),
      where('groupId', '==', groupId),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Member[];
  } catch (error) {
    console.error('Error getting members:', error);
    throw error;
  }
};

export const removeMember = async (memberId: string) => {
  try {
    const memberRef = doc(db, MEMBERS_COLLECTION, memberId);
    await deleteDoc(memberRef);
  } catch (error) {
    console.error('Error removing member:', error);
    throw error;
  }
}; 