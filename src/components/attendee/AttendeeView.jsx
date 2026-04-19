import React, { useState } from 'react';
import { Map as MapIcon, Clock, ShoppingBag } from 'lucide-react';
import VenueMap from './VenueMap';
import WaitTimes from './WaitTimes';
import ExpressOrder from './ExpressOrder';

export default function AttendeeView({ socket, globalState }) {
  const [activeTab, setActiveTab] = useState('map');

  return (
    <div className="attendee-layout animate-fade-in">
      <div className="tab-content">
        {activeTab === 'map' && <VenueMap crowdDensity={globalState.crowdDensity} />}
        {activeTab === 'wait' && <WaitTimes waitTimes={globalState.waitTimes} />}
        {activeTab === 'order' && <ExpressOrder socket={socket} />}
      </div>

      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          <MapIcon size={24} />
          <span>Venue Map</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'wait' ? 'active' : ''}`}
          onClick={() => setActiveTab('wait')}
        >
          <Clock size={24} />
          <span>Live Waits</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'order' ? 'active' : ''}`}
          onClick={() => setActiveTab('order')}
        >
          <ShoppingBag size={24} />
          <span>Express</span>
        </button>
      </nav>
    </div>
  );
}
