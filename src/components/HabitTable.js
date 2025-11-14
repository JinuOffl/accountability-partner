import React from 'react';

const HabitTable = ({ user, habits, last7DaysData, onHabitClick, readOnly }) => {
  const userPayload = user || { name: 'You', totalPenalty: 0 };
  const habitsArray = habits || [];
  
  const today = new Date();
  const todayStr = today.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

  return (
    <div className="habits-section">
      <div className="section-header">
        <h2>{userPayload.name}'s Habits</h2>
        <div className="total-penalty">
          Total Penalties: ₹{(userPayload.totalPenalty || 0).toLocaleString()}
        </div>
      </div>

      {habitsArray.length === 0 ? (
        <div className="empty-state">
          <p>No habits tracked yet. Click "➕ Add Habit" to get started.</p>
        </div>
      ) : (
        <table className="habit-table">
          <thead>
            <tr>
              <th style={{width: '30%'}}>Habit Name</th>
              <th style={{width: '15%'}}>Type</th>
              <th style={{width: '15%'}}>Penalty</th>
              <th style={{width: '40%'}}>Last 7 Days ({todayStr})</th>
            </tr>
          </thead>
          <tbody>
            {habitsArray.map(habit => {
              const last7 = (last7DaysData && last7DaysData[habit.id]) || [];
              
              return (
                <tr key={habit.id}>
                  <td className="habit-name-cell">{habit.name || 'Unnamed'}</td>
                  
                  <td>
                    <span className={`type-badge ${habit.type || 'bad'}`}>
                      {habit.type === 'good' ? 'Good' : 'Bad'}
                    </span>
                  </td>
                  
                  <td className="penalty-amount">
                    ₹{(habit.penaltyAmount || 0).toLocaleString()}
                  </td>
                  
                  <td>
                    <div className="last-7-days">
                      {last7.map((day, idx) => (
                        <div key={idx} style={{textAlign: 'center', cursor: readOnly ? 'default' : 'pointer'}}>
                          <div
                            className="day-checkbox-visual"
                            onClick={() => !readOnly && onHabitClick(habit.id, day.date)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '32px',
                              height: '32px',
                              border: '2px solid #000',
                              borderRadius: '4px',
                              background: day.completed ? '#10b981' : '#fff',
                              color: day.completed ? '#fff' : '#000',
                              fontWeight: 'bold',
                              fontSize: '18px',
                              cursor: readOnly ? 'default' : 'pointer',
                              userSelect: 'none',
                              transition: 'all 0.2s ease'
                            }}
                            title={`${day.date}: ${day.completed ? 'Done' : 'Pending'}`}
                          >
                            {day.completed ? '✓' : '✗'}
                          </div>
                          <div className="day-label">
                            {new Date(day.date + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HabitTable;
