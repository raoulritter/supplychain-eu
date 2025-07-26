# EU Critical Materials Supply Chain Visualizer

A 3D interactive web application for visualizing EU supply chain bottlenecks for critical electrification materials (lithium, cobalt, rare earths). Built for hackathon presentation with real-time material flows, disruption simulation, and bottleneck analysis.

## 🌍 Features

- **3D Globe Visualization**: Interactive earth with animated supply routes
- **Bottleneck Analysis**: Critical infrastructure highlighting with risk assessment
- **Disruption Simulation**: Suez Canal blockage, port closures, export bans
- **Real-time Data**: Connected to Supabase for live supply chain metrics
- **Timeline Projection**: 0-24 month supply impact forecasting

## 🚀 Deployment

### Koyeb Deployment (Recommended)

This app is configured for easy deployment on Koyeb:

1. **Connect Repository**: Link your GitHub repository to Koyeb
2. **Deploy**: Koyeb will automatically detect the configuration and deploy
3. **Environment Variables**: Set your Supabase credentials in Koyeb dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

The app includes:
- ✅ `Procfile` for Koyeb deployment
- ✅ `server.js` Express server for production
- ✅ Optimized Vite build configuration
- ✅ Node.js version specification (`.nvmrc`)

### Alternative Deployment Options

**Vercel/Netlify**: 
```bash
npm run build
# Deploy dist/ folder
```

**Docker**:
```bash
docker build -t eu-supply-chain .
docker run -p 8000:8000 eu-supply-chain
```

## 🛠 Development

### Local Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create `.env.local`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the provided SQL script in your Supabase dashboard:
```bash
# See sample-data.sql for complete database schema
```

## 📊 Architecture

- **Frontend**: React + Vite
- **3D Engine**: Three.js + globe.gl
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Koyeb (Express server)

## 🎯 Key Visualizations

- **Port Bottlenecks**: Rotterdam (75% utilization), Hamburg (95%), Antwerp (84%)
- **Source Dependencies**: China (95% rare earths), DRC (90% cobalt), Chile (85% lithium)
- **Disruption Impacts**: Real economic calculations (€2.1B Suez, €15B+ China ban)
- **Timeline Effects**: Supply degradation over 24-month projections

## 🔧 Production Optimizations

- Code splitting for Three.js and globe.gl
- Optimized chunk sizing
- Express server with proper static file serving
- Environment-based configuration
- Health check endpoints

## 📱 Usage

1. **Normal View**: Shows all supply chain infrastructure
2. **Bottleneck Analysis**: Highlights only critical failure points
3. **Timeline Slider**: Project supply impacts 0-24 months ahead
4. **Disruption Scenarios**: Simulate real-world supply chain failures

Perfect for demonstrating EU energy independence vulnerabilities and strategic planning scenarios.
