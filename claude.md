# EU Critical Materials Supply Chain Visualizer

## Project Context
We're building a web application for a one-day hackathon that visualizes EU supply chain bottlenecks for critical electrification materials (lithium, cobalt, rare earths). The app should show real-time material flows from global sources to EU ports and factories, with the ability to simulate disruptions.

## Tech Stack
- Frontend: React + Vite
- 3D Visualization: Three.js (using react-three-fiber)
- Backend: Supabase (database + real-time subscriptions)
- Deployment: Vercel or Netlify

## Core Features to Build

### 1. 3D Globe Visualization
- Interactive 3D globe showing Europe and material source countries
- Animated ships moving along trade routes (great circle paths)
- EU ports marked with color-coded congestion indicators
- Material flow paths from origins (Chile, DRC, China) to EU ports

### 2. Material Tracking
Focus on 2-3 critical materials:
- Lithium (from Chile/Australia)
- Cobalt (from DRC)
- Rare Earths (from China)

Show:
- Ships in transit with cargo info
- Port utilization levels
- Route paths with material type indicators

### 3. Disruption Simulator
Key feature - ability to simulate:
- "Block Suez Canal" - reroute ships around Africa
- "Close Rotterdam Port" - redirect to other ports
- "China export ban" - show supply impact

Display impact metrics:
- Days of supply remaining
- Number of affected shipments
- Additional transit time
- Cost impact

### 4. Database Schema (Supabase)
Create tables for:
- materials (id, name, criticality_level)
- ports (id, name, lat, lng, capacity, utilization)
- supply_routes (id, material_id, origin, destination_port_id)
- shipments (id, route_id, current_position, progress, eta, cargo)
- disruptions (id, type, affected_entity, impact)

Enable real-time on shipments table.

### 5. UI Components
- Main 3D globe view (full screen)
- Control panel (top right):
  - Material filter buttons
  - Disruption scenario buttons
  - Reset button
- Status dashboard (bottom):
  - Active shipments count
  - Port congestion levels
  - Days of supply for each material

## Implementation Priority (MVP)
1. Set up React + Three.js with a basic globe
2. Create Supabase tables and seed with sample data
3. Add animated ships on 2-3 preset routes
4. Implement one disruption scenario (Suez blockage)
5. Add real-time updates for ship positions
6. Create simple control panel
7. Deploy to Vercel

## Key Code Snippets Needed
1. Three.js globe with texture mapping
2. Great circle path calculation for ship routes
3. Ship mesh creation and animation
4. Supabase real-time subscription setup
5. Port congestion heat map overlay

## Visual Design
- Dark theme with blue ocean
- Material-specific colors: Lithium (green), Cobalt (blue), Rare Earths (orange)
- Glowing effect for active routes
- Red highlighting for disrupted routes
- Smooth animations for ship movement

## Demo Scenario
1. Start: Show normal operations with ships en route
2. User clicks "Block Suez Canal"
3. Ships reroute in real-time around Africa
4. Dashboard shows +21 days transit time
5. Port congestion increases at alternative routes
6. "Days of supply" counter starts decreasing

## Data Sources (for seeding)
- Use static positions for major ports (Rotterdam, Hamburg, Antwerp)
- Create 5-10 sample shipments with different progress levels
- Hardcode material source locations
- Generate realistic ETAs based on standard shipping times

Build this as a single-page application that can run locally and be easily deployed. Focus on visual impact and smooth animations over complex features.