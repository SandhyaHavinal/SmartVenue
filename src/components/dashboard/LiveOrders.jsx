import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function LiveOrders({ orders = [] }) {
  return (
    <div className="live-orders-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-title text-gradient">
        <ShoppingCart style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Express Queue Map
      </div>

      <div style={{ flex: 1, overflowY: 'auto', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {orders.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px' }}>
            No active orders. Awaiting incoming requests...
          </div>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="glass-card animate-fade-in" style={{ padding: '12px', borderLeft: '3px solid var(--accent-primary)' }}>
              <div className="flex-between">
                <span style={{ fontWeight: '600' }}>{o.name}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{o.price}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Order #{String(o.id).slice(-4)} • Seat Delivery
              </div>
            </div>
          )).reverse()
        )}
      </div>
    </div>
  );
}
