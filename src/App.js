import React, { useState, useEffect } from 'react';
import './App.css';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import HabitTable from './components/HabitTable';
import Heatmap from './components/Heatmap';
import AddHabitModal from './components/AddHabitModal';
import SettingsModal from './components/SettingsModal';
import PaymentModal from './components/PaymentModal';
import LoginComponent from './components/LoginComponent';
import * as storage from './utils/storageManager';

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [tracking, setTracking] = useState({});
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setAuthUser(currentUser);
      if (currentUser) {
        // Initialize user in Firestore
        storage.createUser(currentUser.uid, currentUser.email);
        loadUserData(currentUser.uid);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserData = async (userId) => {
    try {
      const userData = await storage.getUser(userId);
      if (userData) {
        setUser({
          id: userId,
          name: 'You',
          totalPenalty: userData.totalPenalty || 0,
          upiId: userData.upiId || '',
          ...userData
        });
        setHabits(userData.habits || []);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleAddHabit = async (habitData) => {
    if (authUser) {
      const newHabit = await storage.addHabit(authUser.uid, habitData);
      if (newHabit) {
        setHabits([...habits, newHabit]);
      }
    }
  };

  const handleEditHabit = async (habitId, updates) => {
    await storage.updateHabit(habitId, updates);
    setHabits(habits.map(h => h.id === habitId ? {...h, ...updates} : h));
  };

  const handleDeleteHabit = async (habitId) => {
    await storage.deleteHabit(habitId);
    setHabits(habits.filter(h => h.id !== habitId));
  };

  const handleHabitClick = async (habitId, date) => {
    if (authUser) {
      await storage.toggleHabitCompletion(authUser.uid, habitId, date);
      // Reload tracking data
      const trackingData = await storage.getTrackingData(authUser.uid, habitId, date, date);
      setTracking({...tracking, ...trackingData});
    }
  };

  const handleUpdateUser = async (updates) => {
    if (authUser) {
      if (updates.upiId) {
        await storage.updateUserUPI(authUser.uid, updates.upiId);
      }
      setUser({...user, ...updates});
    }
  };

  const getLast7Days = (habitId) => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      days.push({
        date: dateStr,
        completed: tracking[`${habitId}_${dateStr}`] || false
      });
    }
    
    return days;
  };

  const getHeatmapData = (type = 'bad') => {
    const heatmap = {};
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      let count = 0;
      habits.forEach(habit => {
        if (habit.type === type && tracking[`${habit.id}_${dateStr}`]) {
          count++;
        }
      });
      
      heatmap[dateStr] = count;
    }
    
    return heatmap;
  };

  if (loading) {
    return <div style={{padding: '40px', textAlign: 'center'}}>Loading...</div>;
  }

  if (!authUser) {
    return (
      <div className="app">
        <LoginComponent user={null} onAuthStateChange={setAuthUser} />
      </div>
    );
  }

  // Safe null checks for user
  if (!user) {
    return <div style={{padding: '40px', textAlign: 'center'}}>Setting up your profile...</div>;
  }

  const last7DaysData = {};
  habits.forEach(habit => {
    last7DaysData[habit.id] = getLast7Days(habit.id);
  });

  const badHabits = habits.filter(h => h.type === 'bad');
  const goodHabits = habits.filter(h => h.type === 'good');

  // Safe null check for friendUser
  const friendUser = {
    name: 'Friend',
    upiId: user && user.upiId ? user.upiId : 'friend@upi'
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📱 Bad Habit Tracker</h1>
        {authUser && <LoginComponent user={authUser} onAuthStateChange={setAuthUser} />}
      </header>

      <div className="main-content">
        {/* Bad Habits Table */}
        <HabitTable
          user={{
            id: user.id || '',
            name: user.name || 'You',
            totalPenalty: user.totalPenalty || 0,
            upiId: user.upiId || ''
          }}
          habits={badHabits}
          last7DaysData={last7DaysData}
          onHabitClick={handleHabitClick}
          readOnly={false}
        />

        {/* Heatmaps */}
        {badHabits.length > 0 && (
          <div className="heatmap-section">
            <div className="heatmap-title">Activity Tracking</div>
            <Heatmap
              heatmapData={getHeatmapData('bad')}
              userId={authUser?.uid}
              habitType="bad"
            />
            
            {goodHabits.length > 0 && (
              <Heatmap
                heatmapData={getHeatmapData('good')}
                userId={authUser?.uid}
                habitType="good"
              />
            )}
          </div>
        )}

        {badHabits.length === 0 && (
          <div className="empty-state">
            <p>No bad habits tracked yet. Click "➕ Add Habit" to get started!</p>
          </div>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="floating-buttons">
        <button className="btn btn-primary" onClick={() => setShowSettings(true)}>
          ⚙️ Settings
        </button>
        {user && user.totalPenalty && user.totalPenalty > 0 && (
          <button className="btn btn-primary" onClick={() => setShowPayment(true)}>
            💳 Pay (₹{(user.totalPenalty || 0).toLocaleString()})
          </button>
        )}
        <button className="btn btn-primary" style={{background: '#10b981'}} onClick={() => setShowAddHabit(true)}>
          ➕ Add Habit
        </button>
      </div>

      {/* Modals */}
      {showAddHabit && (
        <AddHabitModal
          onClose={() => setShowAddHabit(false)}
          onSave={handleAddHabit}
        />
      )}

      {showSettings && user && (
        <SettingsModal
          user={user}
          habits={habits}
          onClose={() => setShowSettings(false)}
          onEditHabit={handleEditHabit}
          onDeleteHabit={handleDeleteHabit}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {showPayment && user && (
        <PaymentModal
          user={user}
          friendUser={friendUser}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}

export default App;
