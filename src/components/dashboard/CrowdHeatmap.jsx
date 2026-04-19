import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Users, Activity } from 'lucide-react';

export default function CrowdHeatmap({ data = [] }) {
  const [pulse, setPulse] = useState(false);

  // Trigger brief pulse animation when data changes
  useEffect(() => {
    if(data.length > 0) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 800);
      return () => clearTimeout(t);
    }
  }, [data]);

  const sortedData = [...data].sort((a,b) => b.count - a.count);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-title flex-between">
        <div>
          <Users style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Crowd Density Analytics
          {pulse && <Activity size={16} color="var(--accent-primary)" style={{ marginLeft: '8px', display: 'inline' }} />}
        </div>
      </div>
      
      <div style={{ flex: 1, minHeight: '300px', marginTop: '24px', opacity: pulse ? 0.7 : 1, transition: 'opacity 0.2s' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} horizontal={false} />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
              contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }} 
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} animationDuration={500}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.count >= entry.capacity ? '#FF3D71' : entry.count > (entry.capacity * 0.7) ? '#FFAB00' : '#00E676'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00E676' }}></div> Under Capacity</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFAB00' }}></div> Near Capacity</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF3D71' }}></div> Over Capacity</div>
      </div>
    </div>
  );
}
