import React, { useState } from 'react';

const SettingsModal = ({ user, habits, onClose, onEditHabit, onDeleteHabit, onUpdateUser }) => {
  const userPayload = user || { upiId: '', name: 'You' };
  
  const [editingHabit, setEditingHabit] = useState(null);
  const [upiId, setUpiId] = useState(userPayload.upiId || '');

  const handleEditClick = (habit) => {
    setEditingHabit({ ...habit });
  };

  const handleSaveEdit = () => {
    if (editingHabit && editingHabit.name && editingHabit.name.trim()) {
      onEditHabit(editingHabit.id, editingHabit);
      setEditingHabit(null);
    }
  };

  const handleDeleteClick = (habitId) => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      onDeleteHabit(habitId);
    }
  };

  const handleUpdateUPI = () => {
    if (upiId && upiId.trim()) {
      onUpdateUser({ upiId });
      alert('UPI ID updated!');
    } else {
      alert('Please enter a valid UPI ID');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{maxWidth: '600px'}}>
        <h2>Settings</h2>
        
        <div style={{marginBottom: '30px'}}>
          <h3 style={{fontSize: '16px', fontWeight: '600', marginBottom: '12px'}}>Payment UPI ID</h3>
          <div style={{display: 'flex', gap: '8px'}}>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              style={{flex: 1}}
            />
            <button className="btn btn-primary" onClick={handleUpdateUPI}>
              Update
            </button>
          </div>
        </div>

        <div>
          <h3 style={{fontSize: '16px', fontWeight: '600', marginBottom: '12px'}}>Manage Habits</h3>
          
          {!habits || habits.length === 0 && (
            <p style={{color: '#999', textAlign: 'center', padding: '20px'}}>
              No habits yet.
            </p>
          )}
          
          {habits && habits.map(habit => (
            <div key={habit.id} style={{
              padding: '12px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              {editingHabit && editingHabit.id === habit.id ? (
                <div>
                  <input
                    type="text"
                    value={editingHabit.name || ''}
                    onChange={(e) => setEditingHabit({...editingHabit, name: e.target.value})}
                    style={{width: '100%', marginBottom: '8px', padding: '8px'}}
                  />
                  <div style={{display: 'flex', gap: '8px'}}>
                    <input
                      type="number"
                      value={editingHabit.penaltyAmount || 0}
                      onChange={(e) => setEditingHabit({...editingHabit, penaltyAmount: parseInt(e.target.value) || 0})}
                      placeholder="Penalty"
                      style={{flex: 1, padding: '8px'}}
                    />
                    <button className="btn btn-primary" style={{padding: '8px 16px'}} onClick={handleSaveEdit}>
                      Save
                    </button>
                    <button className="btn btn-secondary" style={{padding: '8px 16px'}} onClick={() => setEditingHabit(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <div style={{fontWeight: '600', marginBottom: '4px'}}>{habit.name}</div>
                    <div style={{fontSize: '13px', color: '#666'}}>
                      ₹{(habit.penaltyAmount || 0).toLocaleString()} • {habit.type}
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '6px'}}>
                    <button 
                      className="btn btn-secondary"
                      style={{padding: '6px 12px', fontSize: '13px'}}
                      onClick={() => handleEditClick(habit)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger"
                      style={{padding: '6px 12px', fontSize: '13px'}}
                      onClick={() => handleDeleteClick(habit.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="modal-buttons" style={{marginTop: '24px'}}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
