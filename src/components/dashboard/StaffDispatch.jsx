import React, { useState } from 'react';
import { ShieldAlert, Crosshair, CheckCircle2 } from 'lucide-react';

export default function StaffDispatch() {
  const [dispatched, setDispatched] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const units = [
    { id: 1, name: 'Security Alpha', status: 'idle', location: 'Gate A' },
    { id: 2, name: 'Medical Team 1', status: 'idle', location: 'Sec 104' },
    { id: 3, name: 'Crowd Control Beta', status: 'busy', location: 'Sec 220' },
  ];

  return (
    <div className="staff-dispatch-container">
      <div className="panel-title">
        <Crosshair /> Tactical Dispatch
      </div>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
        Assign available units to high-density zones immediately.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {units.map(u => (
          <div 
            key={u.id} 
            className={`glass-card ${selectedUnit === u.id ? 'active' : ''}`}
            style={{ 
              padding: '12px 16px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              cursor: u.status === 'idle' ? 'pointer' : 'not-allowed',
              opacity: u.status === 'busy' ? 0.5 : 1,
              borderColor: selectedUnit === u.id ? 'var(--accent-primary)' : 'var(--border-subtle)'
            }}
            onClick={() => u.status === 'idle' && setSelectedUnit(u.id)}
          >
            <div>
              <div style={{ fontWeight: '600' }}>{u.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {u.location}</div>
            </div>
            {u.status === 'idle' ? (
              <span className="badge badge-good">Available</span>
            ) : (
              <span className="badge badge-critical">Deployed</span>
            )}
          </div>
        ))}
      </div>

      {!dispatched ? (
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', opacity: selectedUnit ? 1 : 0.5 }}
          disabled={!selectedUnit}
          onClick={() => setDispatched(true)}
        >
          <ShieldAlert size={18} /> Deploy to Concourse 1 (High Alert)
        </button>
      ) : (
        <div className="glass-panel" style={{ padding: '16px', textAlign: 'center', borderColor: 'var(--status-good)' }}>
          <CheckCircle2 color="var(--status-good)" style={{ margin: '0 auto 8px' }} size={32} />
          <h4 style={{ color: 'var(--status-good)' }}>Unit Dispatched</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ETA: 45 seconds</p>
          <button 
            className="btn btn-secondary" 
            style={{ marginTop: '12px', width: '100%', padding: '8px' }}
            onClick={() => { setDispatched(false); setSelectedUnit(null); }}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
