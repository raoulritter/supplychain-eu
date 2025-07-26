-- Sample data for EU Supply Chain Visualization
-- Run this in your Supabase SQL editor to populate tables

-- Insert Materials
INSERT INTO materials (name, type, criticality_level, european_demand, supply_risk, strategic_importance, color_code) VALUES
('Lithium', 'battery_material', 5, 100000, 'high', 9, '#22c55e'),
('Cobalt', 'battery_material', 5, 50000, 'very_high', 10, '#3b82f6'),
('Rare Earth Elements', 'renewable_energy', 5, 80000, 'very_high', 10, '#f59e0b'),
('Nickel', 'battery_material', 4, 200000, 'moderate', 7, '#8b5cf6'),
('Polysilicon', 'solar_material', 4, 150000, 'high', 8, '#06b6d4');

-- Insert Locations (Sources, Ports)
INSERT INTO locations (name, type, lat, lng, country, region, is_eu_facility, capacity, current_output, material_types, risk_level) VALUES
-- EU Ports
('Port of Rotterdam', 'port', 51.9244, 4.4777, 'Netherlands', 'EU', true, 469000000, 400000000, ARRAY['lithium', 'cobalt', 'rare_earths'], 'low'),
('Port of Hamburg', 'port', 53.5511, 9.9937, 'Germany', 'EU', true, 126000000, 120000000, ARRAY['lithium', 'cobalt', 'rare_earths'], 'low'),
('Port of Antwerp', 'port', 51.2665, 4.4014, 'Belgium', 'EU', true, 238000000, 200000000, ARRAY['lithium', 'cobalt'], 'low'),

-- Material Sources
('Albemarle Chile', 'source', -24.5000, -69.2500, 'Chile', 'South America', false, 180000, 150000, ARRAY['lithium'], 'moderate'),
('Tianqi Lithium Australia', 'source', -32.0000, 116.0000, 'Australia', 'Oceania', false, 80000, 75000, ARRAY['lithium'], 'low'),
('Glencore Katanga Mining', 'source', -11.6094, 27.4731, 'DRC', 'Africa', false, 40000, 35000, ARRAY['cobalt'], 'high'),
('Bayan Obo China', 'source', 41.7700, 109.9700, 'China', 'Asia', false, 120000, 110000, ARRAY['rare_earths'], 'very_high'),
('Keliber Lithium Finland', 'source', 63.8403, 23.1306, 'Finland', 'EU', true, 15000, 0, ARRAY['lithium'], 'low');

-- Insert Manufacturing Facilities
INSERT INTO manufacturing_facilities (name, lat, lng, facility_type, materials_needed, output_capacity, eu_strategic_importance, operational_status, country) VALUES
('Tesla Gigafactory Berlin', 52.3988, 13.6878, 'battery_plant', '{"lithium": 50000, "cobalt": 20000, "nickel": 30000}', 500000, 10, 'operational', 'Germany'),
('Northvolt Ett', 65.5845, 22.1567, 'battery_plant', '{"lithium": 30000, "cobalt": 12000, "nickel": 18000}', 60000, 9, 'operational', 'Sweden'),
('Ørsted Wind Farm Production', 55.6761, 12.5683, 'wind_facility', '{"rare_earths": 5000}', 15000, 8, 'operational', 'Denmark'),
('Vestas Manufacturing', 56.1572, 10.2107, 'wind_facility', '{"rare_earths": 8000}', 20000, 8, 'operational', 'Denmark'),
('REC Solar Norway', 59.9139, 10.7522, 'solar_facility', '{"polysilicon": 25000}', 50000, 7, 'operational', 'Norway');

-- Get IDs for supply routes (you may need to adjust these based on actual inserted IDs)
-- Note: These are example UUIDs - in practice, you'd use the actual IDs from the inserts above

-- Insert Supply Routes
WITH material_ids AS (
  SELECT id as lithium_id FROM materials WHERE name = 'Lithium'
  UNION ALL
  SELECT id as cobalt_id FROM materials WHERE name = 'Cobalt'  
  UNION ALL
  SELECT id as rare_earth_id FROM materials WHERE name = 'Rare Earth Elements'
),
location_ids AS (
  SELECT id, name FROM locations
)
INSERT INTO supply_routes (origin_id, destination_id, material_id, volume, transit_time, risk_level, alternative_routes, is_primary, dependency_percentage) 
SELECT 
  o.id as origin_id,
  d.id as destination_id,
  m.id as material_id,
  route_data.volume,
  route_data.transit_time,
  route_data.risk_level::route_risk,
  route_data.alternative_routes,
  route_data.is_primary,
  route_data.dependency_percentage
FROM (
  VALUES 
    ('Albemarle Chile', 'Port of Rotterdam', 'Lithium', 50000, 21, 'moderate', ARRAY[]::text[], true, 35.0),
    ('Tianqi Lithium Australia', 'Port of Hamburg', 'Lithium', 30000, 28, 'low', ARRAY[]::text[], true, 25.0),
    ('Glencore Katanga Mining', 'Port of Rotterdam', 'Cobalt', 20000, 28, 'high', ARRAY[]::text[], true, 60.0),
    ('Bayan Obo China', 'Port of Hamburg', 'Rare Earth Elements', 30000, 35, 'very_high', ARRAY[]::text[], true, 80.0),
    ('Keliber Lithium Finland', 'Port of Rotterdam', 'Lithium', 5000, 2, 'low', ARRAY[]::text[], false, 5.0)
) as route_data(origin_name, dest_name, material_name, volume, transit_time, risk_level, alternative_routes, is_primary, dependency_percentage)
JOIN location_ids o ON o.name = route_data.origin_name
JOIN location_ids d ON d.name = route_data.dest_name  
JOIN materials m ON m.name = route_data.material_name;

-- Insert some sample shipments for real-time tracking
WITH route_ids AS (
  SELECT 
    sr.id as route_id,
    ol.name as origin_name,
    dl.name as dest_name,
    ol.lat as origin_lat,
    ol.lng as origin_lng,
    dl.lat as dest_lat,
    dl.lng as dest_lng,
    sr.material_id
  FROM supply_routes sr
  JOIN locations ol ON sr.origin_id = ol.id
  JOIN locations dl ON sr.destination_id = dl.id
)
INSERT INTO shipments (route_id, material_id, vessel_name, current_lat, current_lng, origin_lat, origin_lng, destination_lat, destination_lng, cargo_volume, departure_time, eta, status, speed_knots)
SELECT 
  r.route_id,
  r.material_id,
  shipment_data.vessel_name,
  shipment_data.current_lat,
  shipment_data.current_lng,
  r.origin_lat,
  r.origin_lng,
  r.dest_lat,
  r.dest_lng,
  shipment_data.cargo_volume,
  shipment_data.departure_time,
  shipment_data.eta,
  shipment_data.status::shipment_status,
  shipment_data.speed_knots
FROM (
  VALUES 
    ('Albemarle Chile', 'MV Lithium Carrier', 15.0, -45.0, 25000, '2024-01-15 08:00:00+00', '2024-02-05 14:00:00+00', 'in_transit', 18.5),
    ('Glencore Katanga Mining', 'MV Cobalt Express', 5.0, 15.0, 15000, '2024-01-20 10:00:00+00', '2024-02-17 16:00:00+00', 'in_transit', 16.2),
    ('Bayan Obo China', 'MV Rare Earth Pioneer', 25.0, 60.0, 20000, '2024-01-25 06:00:00+00', '2024-03-01 12:00:00+00', 'in_transit', 19.1)
) as shipment_data(origin_name, vessel_name, current_lat, current_lng, cargo_volume, departure_time, eta, status, speed_knots)
JOIN route_ids r ON r.origin_name = shipment_data.origin_name;

-- Insert disruption scenarios
INSERT INTO disruption_scenarios (name, type, impact_multipliers, affected_locations, affected_routes, timeline_impact, metal_specific_impacts) VALUES
('Suez Canal Blockage', 'canal_disruption', 
 '{"transit_time": 2.5, "cost": 1.8, "risk": 3.0}',
 ARRAY['Suez Canal'],
 ARRAY['China-EU', 'Middle East-EU'],
 '{"immediate": "21 days delay", "short_term": "Alternative routes", "long_term": "Supply chain resilience"}',
 '{"rare_earths": {"impact": "severe", "alternatives": "limited"}, "lithium": {"impact": "moderate", "alternatives": "available"}}'
),
('Rotterdam Port Closure', 'port_disruption',
 '{"capacity": 0.0, "rerouting": 1.5, "cost": 1.3}',
 ARRAY['Port of Rotterdam'],
 ARRAY['All Rotterdam routes'],
 '{"immediate": "Port closure", "short_term": "Hamburg rerouting", "long_term": "Capacity constraints"}',
 '{"all_materials": {"impact": "high", "alternatives": "Hamburg, Antwerp"}}'
),
('China Export Ban', 'export_restriction',
 '{"availability": 0.0, "price": 4.0, "alternatives": 2.0}',
 ARRAY['China'],
 ARRAY['China-EU routes'],
 '{"immediate": "Supply cut", "short_term": "Alternative sources", "long_term": "Domestic production"}',
 '{"rare_earths": {"impact": "critical", "alternatives": "very_limited"}, "lithium": {"impact": "moderate", "alternatives": "Australia, Chile"}}'
);

-- Add some inventory data
WITH location_material_pairs AS (
  SELECT 
    l.id as location_id,
    m.id as material_id,
    l.name as location_name,
    m.name as material_name
  FROM locations l
  CROSS JOIN materials m
  WHERE l.type IN ('port', 'battery_plant', 'solar_facility', 'wind_facility')
  AND (
    (l.name LIKE '%Tesla%' AND m.name IN ('Lithium', 'Cobalt', 'Nickel')) OR
    (l.name LIKE '%Northvolt%' AND m.name IN ('Lithium', 'Cobalt', 'Nickel')) OR
    (l.name LIKE '%Rotterdam%' AND m.name IN ('Lithium', 'Cobalt', 'Rare Earth Elements')) OR
    (l.name LIKE '%Hamburg%' AND m.name IN ('Lithium', 'Cobalt', 'Rare Earth Elements')) OR
    (l.name LIKE '%Wind%' AND m.name = 'Rare Earth Elements') OR
    (l.name LIKE '%Solar%' AND m.name = 'Polysilicon')
  )
)
INSERT INTO material_inventory (material_id, location_id, current_stock, days_of_supply, minimum_strategic_level)
SELECT 
  material_id,
  location_id,
  CASE 
    WHEN location_name LIKE '%Port%' THEN RANDOM() * 5000 + 1000
    ELSE RANDOM() * 2000 + 500
  END as current_stock,
  CASE 
    WHEN location_name LIKE '%Port%' THEN (RANDOM() * 60 + 30)::integer
    ELSE (RANDOM() * 45 + 15)::integer  
  END as days_of_supply,
  CASE 
    WHEN location_name LIKE '%Port%' THEN RANDOM() * 2000 + 500
    ELSE RANDOM() * 1000 + 200
  END as minimum_strategic_level
FROM location_material_pairs;

COMMIT;