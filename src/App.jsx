import React, { useState, useEffect } from 'react';
import { RadioTower } from 'lucide-react';
import { io } from 'socket.io-client';
import { Toaster, toast } from 'react-hot-toast';
import './App.css';
import AttendeeView from './components/attendee/AttendeeView';
import OpsDashboard from './components/dashboard/OpsDashboard';

// Pull connection dynamic URL from environment variables 
// so it connects to local backend in Dev, and public backend in Prod 
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
const socket = io(SOCKET_URL, { reconnect: true });

function App() {
  const [role, setRole] = useState('attendee');
  const [globalState, setGlobalState] = useState({
    waitTimes: [],
    crowdDensity: [],
    liveOrders: []
  });
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    
    // Sync full state from backend
    socket.on('initial_state', (state) => {
      setGlobalState(state);
    });

    // Listen to specific partial state updates
    socket.on('crowd_density_updated', (newDensity) => {
      setGlobalState(prev => ({ ...prev, crowdDensity: newDensity }));
    });
    
    socket.on('order_queue_updated', (orders) => {
      setGlobalState(prev => ({ ...prev, liveOrders: orders }));
    });

    // Cross-system real-time alerts via Toast pushing
    socket.on('receive_alert', (payload) => {
      toast(
        (t) => (
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>🚨 VENUE UPDATE</div>
            <div style={{ fontSize: '0.9rem' }}>{payload.message}</div>
          </div>
        ),
        { 
          duration: 6000, 
          position: 'top-center',
          style: {
            background: 'rgba(11, 14, 20, 0.95)',
            border: '1px solid var(--accent-primary)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)'
          }
        }
      );
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('initial_state');
      socket.off('crowd_density_updated');
      socket.off('order_queue_updated');
      socket.off('receive_alert');
    };
  }, []);

  return (
    <div className="app-container">
      {/* Toast Notification Container for entire app */}
      <Toaster />

      <header className="app-header">
        <div className="logo-container">
          <RadioTower className="logo-icon" size={28} />
          <span className="logo-text text-gradient">SmartVenue</span>
          <span className={`badge ${connected ? 'badge-good' : 'badge-critical'}`} style={{ marginLeft: '12px' }}>
            {connected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
        
        <div className="role-toggle">
          <button 
            className={`role-btn ${role === 'attendee' ? 'active' : ''}`}
            onClick={() => setRole('attendee')}
          >
            Attendee View
          </button>
          <button 
            className={`role-btn ${role === 'dashboard' ? 'active' : ''}`}
            onClick={() => setRole('dashboard')}
          >
            Ops Dashboard
          </button>
        </div>
      </header>

      <main className="main-content">
        {role === 'attendee' ? (
          <AttendeeView socket={socket} globalState={globalState} />
        ) : (
          <OpsDashboard socket={socket} globalState={globalState} />
        )}
      </main>
    </div>
  );
}

export default App;
