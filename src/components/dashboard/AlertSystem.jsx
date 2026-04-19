import React, { useState } from 'react';
import { Megaphone, Send } from 'lucide-react';

export default function AlertSystem({ socket }) {
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if(!msg) return;
    
    // Broadcast via WebSockets to all clients instantly
    socket.emit('send_alert', { message: msg, timestamp: Date.now() });

    setSent(true);
    setTimeout(() => {
      setMsg('');
      setSent(false);
    }, 2000);
  };

  return (
    <div className="alert-system-container">
      <div className="panel-title text-gradient-alt">
        <Megaphone /> Broadcast Hub
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
           <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Push Notification Payload
          </label>
          <textarea 
            rows="3" 
            placeholder="Type emergency alert or instant concourse update here to warn all attendees..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: 'rgba(0,0,0,0.2)', 
              border: '1px solid var(--border-subtle)', 
              color: 'var(--text-primary)', 
              borderRadius: '8px',
              fontFamily: 'inherit',
              resize: 'none',
              outline: 'none'
            }}
          />
        </div>

        <button 
          className="btn" 
          style={{ 
            background: sent ? 'var(--status-good)' : 'linear-gradient(135deg, var(--accent-secondary), #FF0099)', 
            color: '#fff',
            marginTop: '8px',
            border: 'none'
          }}
          onClick={handleSend}
        >
          {sent ? 'Broadcast Pushed!' : <><Send size={18} /> Send Push Notification</>}
        </button>
      </div>
    </div>
  );
}
