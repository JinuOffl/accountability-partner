import React, { useState } from 'react';

const AddHabitModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'bad',
    penaltyAmount: 10,
    gracePeriod: 0
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'penaltyAmount' || name === 'gracePeriod' 
        ? parseInt(value) || 0 
        : value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Habit name is required');
      return;
    }
    if (formData.penaltyAmount < 10) {
      setError('Penalty amount must be at least ₹10');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add Habit</h2>
        
        {error && <div style={{color: '#ef4444', marginBottom: '12px', fontSize: '14px'}}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Habit Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Smoking, Junk Food"
              required
            />
          </div>

          <div className="form-group">
            <label>Type *</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="bad">Bad Habit (to break)</option>
              <option value="good">Good Habit (to build)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Penalty Amount (₹) * (increments of 10)</label>
            <input
              type="number"
              name="penaltyAmount"
              value={formData.penaltyAmount}
              onChange={handleChange}
              min="10"
              step="10"
              required
            />
          </div>

          {formData.type === 'good' && (
            <div className="form-group">
              <label>Grace Period (days)</label>
              <input
                type="number"
                name="gracePeriod"
                value={formData.gracePeriod}
                onChange={handleChange}
                min="0"
                max="7"
              />
              <small style={{color: '#666', fontSize: '12px'}}>
                Days to miss before penalty applies
              </small>
            </div>
          )}

          <div className="modal-buttons">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabitModal;
