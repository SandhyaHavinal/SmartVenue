const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Centralized In-Memory State
let state = {
  waitTimes: [
    { id: 1, name: 'Restroom (Sec 102)', iconType: 'droplets', time: '2 min', status: 'good' },
    { id: 2, name: 'Main Concourse Grill', iconType: 'utensils', time: '15 min', status: 'warning' },
    { id: 3, name: 'Express Beverages', iconType: 'coffee', time: '25 min', status: 'critical' },
  ],
  crowdDensity: [
    { name: 'Sec A', count: 400, capacity: 500, fill: '#00E676' },
    { name: 'Sec B', count: 480, capacity: 500, fill: '#FFAB00' },
    { name: 'Sec C', count: 520, capacity: 500, fill: '#FF3D71' },
    { name: 'North Exit', count: 850, capacity: 1000, fill: '#FFAB00' },
    { name: 'South Exit', count: 300, capacity: 1000, fill: '#00E676' },
    { name: 'Concourse 1', count: 1200, capacity: 1000, fill: '#FF3D71' },
  ],
  liveOrders: []
};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial state upon connection
  socket.emit('initial_state', state);

  socket.on('send_alert', (payload) => {
    console.log('Emergency Alert Dispatched:', payload);
    // Broadcast the alert to everyone (including the sender for confirmation)
    io.emit('receive_alert', payload);
  });

  socket.on('place_express_order', (order) => {
    console.log('New Order Received:', order);
    state.liveOrders.push({ ...order, id: Date.now(), socketId: socket.id });
    io.emit('order_queue_updated', state.liveOrders);
  });
  
  socket.on('update_crowd_density', (newDensity) => {
    state.crowdDensity = newDensity;
    io.emit('crowd_density_updated', state.crowdDensity);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`SmartVenue backend running on port ${PORT}`);
});
