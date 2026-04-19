# SmartVenue: Event Experience Platform

![SmartVenue Header Setup](https://img.shields.io/badge/Status-Prototype-success?style=for-the-badge) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

**SmartVenue** is a comprehensive, dual-interface web application designed to solve common pain points at large-scale sporting and entertainment venues. By shifting from a traditional "reactive" experience to a data-driven "proactive" system, the platform effectively mitigates crowd congestion, significantly reduces concession wait times, and provides operations staff with a synchronized God’s-eye view of the entire facility.

---

## ⚡ Key Features

### 1. Dual-Persona Architecture
The platform is built to simultaneously service two distinct user flows functioning in real-time synergy:
- **Attendee Companion App (Mobile-First):** Features smart routing, express digital concession ordering from their seat, and live wait-time analysis for restrooms.
- **Ops Dashboard (Command Center):** Features proactive crowd-density monitoring, live queue metrics, tactical staff dispatching, and emergency broadcasting.

### 2. Live WebSocket Triggers (Real-Time Backend)
SmartVenue utilizes a proprietary Node.js & `socket.io` server ensuring zero-latency data transmission.
- *Digital Commerce:* When attendees initiate an `ExpressOrder`, the packet is instantly streamed and rendered to the Admin Dashboard's `LiveOrders` queue.
- *Emergency Hub:* Admins can deploy textual push alerts via the Dashboard that trigger instant, glassy toast pop-ups (`react-hot-toast`) on every single connected Attendee device.

### 3. A-Star (A*) Spatial Pathfinding Engine
Because standard GPS frameworks struggle with abstract indoor architecture, we built the industry-standard algorithm directly into the client.
- The `VenueMap` layers an invisible mathematical matrix across the CSS grid. When an attendee requests a route, the **A* Search Algorithm** instantly maps the absolute shortest path to the target sector while explicitly routing structurally *around* defined physical boundaries (like the game field), rendering the unblocked nodes dynamically to a glowing SVG vector line.

### 4. Advanced Comparative Analytics
Integrated with `recharts`, the dashboard calculates and charts live efficiency benchmarks, aggressively plotting the dropoff in queue traffic between a traditional blind-guess event model versus the synchronized SmartVenue platform tracking over the timeline of an event.

---

## 🛠 Tech Stack

- **Frontend Framework:** React 18, Vite
- **Global State / Connect:** Socket.io-client
- **Styling UI/UX:** Vanilla CSS (Modern Dark Mode, Glassmorphism, Micro-animations)
- **Data Visualization:** Recharts
- **Iconography:** Lucide-React
- **Backend:** Node.js, Express, Socket.io
- **Notifications:** React-Hot-Toast

---

## 🚀 Running the Project Locally

Because this relies on a real-time interconnected client-server network, you need to spin up both engines.

### 1. Start the WebSocket Backend Server
Open your terminal to the project root and navigate to the backend service:
```bash
cd server
npm install
node index.js
```
*The active node socket tunnel will connect and listen on port `3001`.*

### 2. Start the Vite React Client
Open a **new, split terminal** tab in the project root:
```bash
npm install
npm run dev
```
*The Vite UI application will spin up successfully on port `5173`. Open `http://localhost:5173/` in your browser.*

> **Testing Tip:** To witness the real-time logic properly, open **two separate tabs** on `localhost:5173`. Switch one to the "Ops Dashboard" header tab, and keep the other on the "Attendee" view to see instant push communications!

---

## ☁️ Cloud Deployment

For permanent hosting, we recommend a dual-cloud strategy using specialized providers:

### Backend (Render)
The `server/` directory functions as an autonomous Node/Socket instance.
1. Connect this repository to your [Render](https://render.com/) account.
2. The included `render.yaml` infrastructure-as-code file will automatically detect the backend and deploy the `smartvenue-backend` service.

### Frontend (Vercel)
The Vite/React UI relies on a single environment variable to bridge to your new live backend.
1. Connect this repository to your [Vercel](https://vercel.com/) account.
2. Before deploying, add the `VITE_SOCKET_URL` environment variable containing your new Render backend URL (e.g., `https://smartvenue-backend.onrender.com`).
3. Vercel will automatically configure routing based on the existing `vercel.json`.
