import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingDown } from 'lucide-react';

const data = [
  { time: 'Pre-Game', traditionalWait: 15, smartWait: 5 },
  { time: 'Q1', traditionalWait: 22, smartWait: 6 },
  { time: 'Q2', traditionalWait: 35, smartWait: 8 },
  { time: 'Halftime', traditionalWait: 45, smartWait: 12 },
  { time: 'Q3', traditionalWait: 25, smartWait: 7 },
  { time: 'Q4', traditionalWait: 18, smartWait: 5 },
  { time: 'Post-Game', traditionalWait: 40, smartWait: 15 },
];

export default function ComparisonAnalytics() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-title flex-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingDown size={22} color="var(--accent-primary)" />
          System Efficiency Comparison
        </div>
        <span className="badge badge-good">SmartVenue Impact</span>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
        Average Attendee Queue Wait Times (Minutes)
      </p>

      <div style={{ flex: 1, minHeight: '260px', marginTop: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis dataKey="time" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
            <Tooltip 
              contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)' }}
              itemStyle={{ fontSize: '0.9rem' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '0.85rem' }} />
            <Line 
               name="Traditional System" 
               type="monotone" 
               dataKey="traditionalWait" 
               stroke="var(--status-critical)" 
               strokeWidth={3} 
               dot={{ r: 4, fill: 'var(--status-critical)', strokeWidth: 0 }}
               activeDot={{ r: 6, fill: '#fff', stroke: 'var(--status-critical)', strokeWidth: 2 }}
            />
            <Line 
               name="SmartVenue (Live Demo)" 
               type="monotone" 
               dataKey="smartWait" 
               stroke="var(--accent-primary)" 
               strokeWidth={3} 
               dot={{ r: 4, fill: 'var(--accent-primary)', strokeWidth: 0 }}
               activeDot={{ r: 6, fill: '#fff', stroke: 'var(--accent-primary)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
