import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createVenueGrid, findShortestPath } from '../../utils/pathfinding';

export default function VenueMap({ crowdDensity = [] }) {
  const [selectedZone, setSelectedZone] = useState('Sec A');
  const [activeRoutePath, setActiveRoutePath] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  
  const getZoneStatus = (zoneName) => {
    const node = crowdDensity.find(n => n.name === zoneName);
    if(!node) return { color: 'var(--bg-panel)', status: 'Unknown', fill: 'var(--border-subtle)' };
    
    if(node.count >= node.capacity) return { color: 'var(--status-critical-dim)', status: 'High Congestion', fill: 'var(--status-critical)' };
    if(node.count > node.capacity * 0.7) return { color: 'var(--status-warning-dim)', status: 'Moderate Traffic', fill: 'var(--status-warning)' };
    return { color: 'var(--status-good-dim)', status: 'Clear Path', fill: 'var(--status-good)' };
  };

  const aStatus = getZoneStatus('Sec A');
  const bStatus = getZoneStatus('Sec B');
  const cStatus = getZoneStatus('Sec C');
  const currentStatus = getZoneStatus(selectedZone);

  // Mapping venue targets to 14x14 grid coordinates
  const spatialNodes = {
    'Start': { x: 7, y: 13 }, // Bottom center, right above bottom 
    'Sec A': { x: 7, y: 1 },  // Top center
    'Sec B': { x: 7, y: 12 }, // Bottom Center
    'Sec C': { x: 1, y: 7 },  // Middle Left
  };

  const handleRouteClick = () => {
    setActiveRoutePath('');
    setIsCalculating(true);
    
    toast(`Initiating A* Spatial Pathfinding Engine...\nScanning grid for optimal clearance.`, {
      icon: '⚙️',
      duration: 1500,
      style: {
        background: 'rgba(11, 14, 20, 0.95)',
        border: '1px solid var(--status-warning)',
        color: '#fff'
      }
    });

    // Simulate small backend computation latency
    setTimeout(() => {
      // 1. Initialize mathematical grid (with Field Obstacle dead center)
      const grid = createVenueGrid(15, 15);
      
      // 2. Run AStar calculation
      const pathArray = findShortestPath(grid, spatialNodes['Start'], spatialNodes[selectedZone]);
      
      // 3. Map virtual nodes to physical SVG coordinates (cell size 280px / 14 = 20px)
      // M x1 y1 L x2 y2 ...
      if (pathArray.length > 0) {
        let svgPathString = pathArray.map((node, i) => {
          const pxX = node.x * 20; // Scale grid to SVG pixels
          const pxY = node.y * 20;
          return `${i === 0 ? 'M' : 'L'} ${pxX} ${pxY}`;
        }).join(" ");
        
        setActiveRoutePath(svgPathString);
        
        toast.success(`A* Search Complete! Shortest path mapped.`, {
           style: { background: 'rgba(11, 14, 20, 0.95)', border: '1px solid #00E676', color: '#fff' }
        });
      } else {
        toast.error(`Path blocked! Cannot route to ${selectedZone}.`);
      }
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <div className="venue-map-container">
      <div className="flex-between" style={{ marginBottom: '16px' }}>
        <h2 className="text-gradient">Smart Navigation</h2>
        <span className="badge" style={{ background: currentStatus.color, color: currentStatus.fill, border: `1px solid ${currentStatus.fill}` }}>
          {currentStatus.status}
        </span>
      </div>
      
      <div className="glass-card" style={{ padding: '20px', position: 'relative', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Render container matching SVG geometry 280x280 */}
        <div style={{ position: 'relative', width: '280px', height: '280px', borderRadius: '50%', border: '4px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)', overflow: 'hidden' }}>
          
          {/* Spatial Grid Engine Map */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

          {/* Physically generated routing layer */}
          {activeRoutePath && (
             <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none' }}>
               <path 
                 d={activeRoutePath} 
                 fill="none" 
                 stroke="var(--accent-primary)" 
                 strokeWidth="4"
                 strokeLinejoin="round"
                 strokeDasharray="10, 8"
                 style={{ 
                   animation: 'dashOffset 20s linear infinite', 
                   filter: 'drop-shadow(0 0 6px var(--accent-primary))' 
                 }}
               />
             </svg>
          )}

          {/* Embedded keyframe for dash offset animation */}
          <style>
            {`@keyframes dashOffset { to { stroke-dashoffset: -1000; } }`}
          </style>

          {/* Physical Field Obstacle (Matches our grid obstacle mapping 4-9x, 3-10y) */}
          <div style={{ position: 'absolute', top: '60px', left: '80px', width: '120px', height: '160px', background: 'var(--bg-surface)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}></div>
          
          {/* Section A Target Box */}
          <div 
            style={{ position: 'absolute', top: '0', left: '100px', width: '80px', height: '30px', background: selectedZone === 'Sec A' ? aStatus.color : 'var(--bg-panel)', border: `2px solid ${aStatus.fill}`, borderRadius: '10px', cursor: 'pointer', zIndex: 5 }}
            onClick={() => { setSelectedZone('Sec A'); setActiveRoutePath(''); }}
          />
          {/* Section B Target Box */}
          <div 
            style={{ position: 'absolute', top: '230px', left: '100px', width: '80px', height: '30px', background: selectedZone === 'Sec B' ? bStatus.color : 'var(--bg-panel)', border: `2px solid ${bStatus.fill}`, borderRadius: '10px', cursor: 'pointer', zIndex: 5 }}
            onClick={() => { setSelectedZone('Sec B'); setActiveRoutePath(''); }}
          />
          {/* Section C Target Box */}
          <div 
             style={{ position: 'absolute', top: '100px', left: '0', width: '30px', height: '80px', background: selectedZone === 'Sec C' ? cStatus.color : 'var(--bg-panel)', border: `2px solid ${cStatus.fill}`, borderRadius: '10px', cursor: 'pointer', zIndex: 5 }}
             onClick={() => { setSelectedZone('Sec C'); setActiveRoutePath(''); }}
          />
          
          {/* Start Marker */}
          <div style={{ position: 'absolute', top: '240px', left: '130px', color: 'var(--accent-primary)', zIndex: 20 }}>
            <MapPin size={24} fill="var(--bg-base)" style={{ animation: 'pulseGlow 2s infinite' }} />
          </div>
        </div>
      </div>
      
      <div className="glass-card" style={{ marginTop: '20px', padding: '16px' }}>
        <h3 style={{ marginBottom: '12px', fontSize: '1rem' }}>Selected: {selectedZone}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
           Real-time density scan indicates [{currentStatus.status}]. 
        </p>
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', filter: isCalculating ? 'brightness(0.7)' : 'none' }}
          onClick={handleRouteClick}
          disabled={isCalculating || activeRoutePath.length > 0}
        >
          <Navigation size={18} /> 
          {isCalculating ? 'Computing A* Path...' : activeRoutePath.length > 0 ? `Target ${selectedZone} Routed` : `Route to ${selectedZone}`}
        </button>
      </div>
    </div>
  );
}
