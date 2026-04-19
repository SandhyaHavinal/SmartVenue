import React from 'react';
import CrowdHeatmap from './CrowdHeatmap';
import StaffDispatch from './StaffDispatch';
import AlertSystem from './AlertSystem';
import LiveOrders from './LiveOrders';
import ComparisonAnalytics from './ComparisonAnalytics';

export default function OpsDashboard({ socket, globalState }) {
  return (
    <div className="dashboard-layout animate-fade-in" style={{ gridTemplateColumns: '1fr 1fr', paddingBottom: '100px' }}>
      
      {/* Column 1: Analytics & Live Tracking */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '20px', flex: 1, minHeight: '350px' }}>
          <ComparisonAnalytics />
        </div>
        <div className="glass-panel" style={{ padding: '20px', flex: 1, minHeight: '350px' }}>
          <CrowdHeatmap data={globalState.crowdDensity} socket={socket} />
        </div>
      </div>
      
      {/* Column 2: Action Centers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <LiveOrders orders={globalState.liveOrders} />
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <StaffDispatch />
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <AlertSystem socket={socket} />
        </div>
      </div>
      
    </div>
  );
}
