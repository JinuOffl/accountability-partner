import React from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';

const LoginComponent = ({ user, onAuthStateChange }) => {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onAuthStateChange(result.user);
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onAuthStateChange(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <div style={{textAlign: 'center', padding: '60px 20px'}}>
        <h1 style={{marginBottom: '20px'}}>Accountability Partnerr</h1>
        <p style={{color: '#666', marginBottom: '30px'}}>
          Track your bad habits and stay accountable
        </p>
        <button 
          className="btn btn-primary"
          onClick={handleGoogleLogin}
          style={{padding: '12px 32px', fontSize: '16px'}}
        >
          🔐 Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="auth-section">
      <div className="user-info">
        <div className="user-name">{user.displayName || user.email || 'User'}</div>
        <small style={{color: '#999'}}>{user.email}</small>
      </div>
      <button 
        className="btn btn-secondary"
        onClick={handleLogout}
        style={{padding: '8px 16px', fontSize: '13px'}}
      >
        Logout
      </button>
    </div>
  );
};

export default LoginComponent;
