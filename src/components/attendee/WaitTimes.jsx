import React from 'react';
import { Droplets, Utensils, Coffee, AlertTriangle } from 'lucide-react';

export default function WaitTimes({ waitTimes = [] }) {
  const getIcon = (type) => {
    switch(type) {
      case 'droplets': return <Droplets />;
      case 'utensils': return <Utensils />;
      case 'coffee': return <Coffee />;
      default: return <AlertTriangle />;
    }
  };

  return (
    <div className="wait-times-container">
      <h2 className="text-gradient" style={{ marginBottom: '20px' }}>Live Wait Times</h2>
      
      {waitTimes.length === 0 ? (
        <div style={{ color: 'var(--text-muted)' }}>Syncing live data...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {waitTimes.map(wait => (
            <div key={wait.id} className="glass-card animate-fade-in" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '10px', background: `var(--status-${wait.status}-dim)`, color: `var(--status-${wait.status})` }}>
                  {getIcon(wait.iconType)}
                </div>
                <span style={{ fontWeight: '500' }}>{wait.name}</span>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: `var(--status-${wait.status})` }}>
                  {wait.time}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Estimated</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="glass-panel" style={{ marginTop: '24px', padding: '16px', borderLeft: '4px solid var(--accent-primary)' }}>
        <h4 style={{ color: 'var(--accent-primary)', marginBottom: '4px' }}>Pro Tip</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          Use the Express Order tab to skip concession lines completely! Orders are delivered directly to your row.
        </p>
      </div>
    </div>
  );
}
