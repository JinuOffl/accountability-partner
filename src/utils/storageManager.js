import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Create new user document
export const createUser = async (userId, email) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      email,
      createdAt: serverTimestamp(),
      totalPenalty: 0,
      upiId: '',
      friendId: null
    }).catch(() => {
      // If doc doesn't exist, create it
      return updateDoc(userRef, {
        id: userId,
        email,
        createdAt: serverTimestamp(),
        totalPenalty: 0,
        upiId: '',
        friendId: null
      });
    });
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

// Get user data
export const getUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const habitsSnapshot = await getDocs(query(
      collection(db, 'habits'),
      where('userId', '==', userId)
    ));

    const habits = habitsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      id: userId,
      habits,
      totalPenalty: 0
    };
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Add habit
export const addHabit = async (userId, habitData) => {
  try {
    const docRef = await addDoc(collection(db, 'habits'), {
      userId,
      ...habitData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...habitData };
  } catch (error) {
    console.error('Error adding habit:', error);
  }
};

// Update habit
export const updateHabit = async (habitId, updates) => {
  try {
    await updateDoc(doc(db, 'habits', habitId), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating habit:', error);
  }
};

// Delete habit
export const deleteHabit = async (habitId) => {
  try {
    await deleteDoc(doc(db, 'habits', habitId));
  } catch (error) {
    console.error('Error deleting habit:', error);
  }
};

// Toggle habit completion
export const toggleHabitCompletion = async (userId, habitId, date) => {
  try {
    const trackingRef = collection(db, 'tracking');
    const q = query(
      trackingRef,
      where('userId', '==', userId),
      where('habitId', '==', habitId),
      where('date', '==', date)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Create new tracking entry
      await addDoc(trackingRef, {
        userId,
        habitId,
        date,
        completed: true,
        createdAt: serverTimestamp()
      });
    } else {
      // Toggle existing entry
      const docId = snapshot.docs[0].id;
      const currentValue = snapshot.docs[0].data().completed;
      await updateDoc(doc(db, 'tracking', docId), {
        completed: !currentValue
      });
    }
  } catch (error) {
    console.error('Error toggling completion:', error);
  }
};

// Get tracking data for date range
export const getTrackingData = async (userId, habitId, startDate, endDate) => {
  try {
    const q = query(
      collection(db, 'tracking'),
      where('userId', '==', userId),
      where('habitId', '==', habitId),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );

    const snapshot = await getDocs(q);
    const data = {};

    snapshot.docs.forEach(doc => {
      data[doc.data().date] = doc.data().completed;
    });

    return data;
  } catch (error) {
    console.error('Error getting tracking data:', error);
    return {};
  }
};

// Update user UPI
export const updateUserUPI = async (userId, upiId) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      upiId,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating UPI:', error);
  }
};

export default {
  createUser,
  getUser,
  addHabit,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion,
  getTrackingData,
  updateUserUPI
};
