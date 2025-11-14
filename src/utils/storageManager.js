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
  writeBatch,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Create new user document
export const createUser = async (userId, email) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      id: userId,
      email,
      name: 'You',
      createdAt: serverTimestamp(),
      totalPenalty: 0,
      upiId: '',
      friendId: null
    }, { merge: true });
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

// Get user data
export const getUser = async (userId) => {
  try {
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

// Toggle habit completion - RETURNS NEW STATE
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
    let newState = true;
    
    if (snapshot.empty) {
      // Create new tracking entry
      await addDoc(trackingRef, {
        userId,
        habitId,
        date,
        completed: true,
        createdAt: serverTimestamp()
      });
      newState = true;
    } else {
      // Toggle existing entry
      const docId = snapshot.docs[0].id;
      const currentValue = snapshot.docs[0].data().completed;
      newState = !currentValue;
      
      await updateDoc(doc(db, 'tracking', docId), {
        completed: newState
      });
    }
    
    return newState;
  } catch (error) {
    console.error('Error toggling completion:', error);
    return false;
  }
};

// Get ALL tracking data for user
export const getAllTrackingData = async (userId) => {
  try {
    const q = query(
      collection(db, 'tracking'),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    const data = {};
    
    snapshot.docs.forEach(doc => {
      const trackData = doc.data();
      const key = `${trackData.habitId}_${trackData.date}`;
      data[key] = trackData.completed;
    });
    
    return data;
  } catch (error) {
    console.error('Error getting tracking data:', error);
    return {};
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

// Get friend's data by friend ID or email
export const getFriendData = async (friendId) => {
  try {
    const habitsSnapshot = await getDocs(query(
      collection(db, 'habits'),
      where('userId', '==', friendId)
    ));
    
    const habits = habitsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      id: friendId,
      habits,
      totalPenalty: 0
    };
  } catch (error) {
    console.error('Error getting friend data:', error);
    return null;
  }
};

export default {
  createUser,
  getUser,
  addHabit,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion,
  getAllTrackingData,
  getTrackingData,
  updateUserUPI,
  getFriendData
};
