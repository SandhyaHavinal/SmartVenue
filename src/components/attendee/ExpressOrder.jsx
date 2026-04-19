import React, { useState } from 'react';
import { Plus, Check, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ExpressOrder({ socket }) {
  const [ordered, setOrdered] = useState(false);
  const [cart, setCart] = useState([]);
  
  const menu = [
    { id: 1, name: 'Stadium Hot Dog', price: '$8.00', category: 'Food' },
    { id: 2, name: 'Craft Beer (IPA)', price: '$12.00', category: 'Drinks' },
    { id: 3, name: 'Nachos Supreme', price: '$10.00', category: 'Food' },
    { id: 4, name: 'Pretzel w/ Cheese', price: '$7.50', category: 'Food' }
  ];

  const addToCart = (item) => {
    setCart([item]);
    toast.success(`${item.name} ready for checkout`);
  };

  const handleCheckout = () => {
    if(cart.length === 0) {
      toast.error('Cart is empty!');
      return;
    }
    // Emit order to real-time backend
    cart.forEach(item => {
      socket.emit('place_express_order', item);
    });
    setOrdered(true);
    setCart([]);
  };

  if (ordered) {
    return (
      <div className="flex-center animate-fade-in" style={{ flexDirection: 'column', height: '60vh', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--status-good-dim)', color: 'var(--status-good)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 0 30px rgba(0, 230, 118, 0.4)' }}>
          <Check size={40} />
        </div>
        <h2 style={{ marginBottom: '8px' }}>Order Sent!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>The Operations team received your order. Skipping the lines!</p>
        <button className="btn btn-secondary" onClick={() => setOrdered(false)}>
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="express-order-container">
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <h2 className="text-gradient-alt">Express Delivery</h2>
        <Zap size={24} color="var(--accent-secondary)" />
      </div>
      
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
        Order from your seat. We'll bring it right to you.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        {menu.map(item => (
          <div key={item.id} className="glass-card flex-between" style={{ padding: '16px', border: cart.includes(item) ? '1px solid var(--accent-primary)' : '' }}>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.price} • {item.category}</div>
            </div>
            <button className="btn-icon" onClick={() => addToCart(item)} style={{ background: cart.includes(item) ? 'var(--accent-primary-dim)' : ''}}>
              <Plus size={20} color={cart.includes(item) ? 'var(--accent-primary)' : 'inherit'} />
            </button>
          </div>
        ))}
      </div>
      
      <div style={{ position: 'sticky', bottom: '85px' }}>
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', background: cart.length > 0 ? 'linear-gradient(135deg, var(--accent-secondary), #FF0099)' : 'var(--bg-panel)', color: cart.length > 0 ? '#fff' : 'gray' }} 
          disabled={cart.length === 0}
          onClick={handleCheckout}
        >
          Checkout {cart.length > 0 && `(${cart[0].price})`}
        </button>
      </div>
    </div>
  );
}
