import React, { useState } from 'react';

const Heatmap = ({ heatmapData, userId, habitType = 'good' }) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  const heatmapPayload = heatmapData || {};

  const generateWeeks = () => {
    const weeks = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let week = 0; week < 52; week++) {
      const days = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - ((51 - week) * 7 + (6 - day)));
        
        if (date > today) continue;
        
        const dateStr = date.toISOString().split('T')[0];
        const count = heatmapPayload[dateStr] || 0;
        
        days.push({
          date: dateStr,
          count: count,
          dayOfWeek: day
        });
      }
      if (days.length > 0) {
        weeks.push(days);
      }
    }
    
    return weeks;
  };

  const weeks = generateWeeks();

  const getIntensityClass = (count) => {
    if (count === 0) return 'intensity-0';
    if (count === 1) return 'intensity-1';
    if (count === 2) return 'intensity-2';
    if (count === 3) return 'intensity-3';
    return 'intensity-4';
  };

  return (
    <div className="heatmap-container">
      <div className="heatmap-label" style={{color: habitType === 'bad' ? '#ef4444' : '#10b981'}}>
        {habitType === 'bad' ? '❌ Bad Habits' : '✓ Good Habits'} - Last 52 Weeks
      </div>

      <div style={{overflowX: 'auto'}}>
        <div className="heatmap-grid">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="heatmap-week">
              {week.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  className={`heatmap-cell ${habitType} ${getIntensityClass(day.count)}`}
                  onMouseEnter={() => setHoveredCell(day)}
                  onMouseLeave={() => setHoveredCell(null)}
                  title={`${day.date}: ${day.count} habits completed`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {hoveredCell && (
        <div style={{
          marginTop: '8px',
          fontSize: '12px',
          color: '#666',
          textAlign: 'center'
        }}>
          {hoveredCell.date}: {hoveredCell.count} completed
        </div>
      )}
    </div>
  );
};

export default Heatmap;
