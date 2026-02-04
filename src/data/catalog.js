// Category structure for automotive parts catalog
export const categoryStructure = {
  'Performance Parts': {
    icon: '⚡',
    subcategories: {
      'Engine Components': ['Engine Blocks', 'Pistons & Rings', 'Crankshafts', 'Camshafts', 'Timing Chains/Belts', 'Engine Gaskets', 'Engine Mounts', 'Valve Covers', 'Oil Pans', 'Water Pumps', 'Thermostats', 'Radiator Hoses'],
      'Exhaust Systems': ['Catalytic Converters', 'Mufflers', 'Exhaust Manifolds', 'Headers', 'Exhaust Pipes', 'Resonators', 'Exhaust Tips', 'Exhaust Hangers', 'Flex Pipes', 'Performance Exhaust Kits'],
      'Brakes': ['Brake Pads', 'Brake Rotors', 'Brake Calipers', 'Brake Lines', 'Brake Master Cylinders', 'Brake Boosters', 'Parking Brake Components', 'ABS Components', 'Brake Fluid', 'Performance Brake Kits'],
      'Air Intake & Filters': ['Air Filters', 'Cold Air Intakes', 'Throttle Bodies', 'Mass Air Flow Sensors', 'Intake Manifolds', 'Turbochargers', 'Superchargers', 'Intercoolers', 'Air Intake Hoses'],
      'Fuel System': ['Fuel Pumps', 'Fuel Injectors', 'Fuel Filters', 'Fuel Pressure Regulators', 'Fuel Rails', 'Fuel Lines', 'Gas Caps', 'Fuel Tanks'],
      'Ignition System': ['Spark Plugs', 'Ignition Coils', 'Distributor Caps', 'Ignition Wires', 'Ignition Modules', 'Crankshaft Position Sensors'],
      'Cooling System': ['Radiators', 'Cooling Fans', 'Water Pumps', 'Thermostats', 'Radiator Caps', 'Coolant Hoses', 'Heater Cores', 'Coolant Reservoirs'],
      'Transmission': ['Transmission Filters', 'Transmission Pans', 'Torque Converters', 'Clutch Kits', 'Transmission Mounts', 'Shift Cables', 'CV Axles', 'Driveshafts']
    }
  },
  'Lighting': {
    icon: '💡',
    subcategories: {
      'Headlights': ['Headlight Assemblies', 'Headlight Bulbs', 'HID Kits', 'LED Headlights', 'Headlight Covers', 'Headlight Restoration Kits'],
      'Tail Lights': ['Tail Light Assemblies', 'Tail Light Bulbs', 'LED Tail Lights', 'Tail Light Covers', 'Third Brake Lights'],
      'Interior Lighting': ['Dome Lights', 'Map Lights', 'Door Lights', 'Dashboard Lights', 'Ceiling Lights', 'LED Interior Kits'],
      'Signal & Marker Lights': ['Turn Signal Bulbs', 'Side Marker Lights', 'Corner Lights', 'Parking Light Assemblies'],
      'Fog Lights': ['Fog Light Assemblies', 'Fog Light Bulbs', 'Fog Light Covers', 'Fog Light Switches'],
      'Off-Road Lighting': ['Light Bars', 'Spotlights', 'Rock Lights', 'Underbody Lights'],
      'Lighting Electrical': ['Headlight Switches', 'Dimmer Switches', 'Turn Signal Flashers', 'Ballasts']
    }
  },
  'Interior Accessories': {
    icon: '🪑',
    subcategories: {
      'Seating': ['Seat Covers', 'Racing Seats', 'Seat Cushions', 'Seat Heaters', 'Lumbar Supports', 'Seat Belt Components'],
      'Floor Protection': ['Floor Mats', 'Cargo Liners', 'Trunk Mats', 'All-Weather Mats', 'Carpet Floor Mats'],
      'Steering Wheel': ['Steering Wheel Covers', 'Performance Steering Wheels', 'Steering Wheel Accessories'],
      'Dashboard & Console': ['Dashboard Covers', 'Console Organizers', 'Cup Holders', 'Phone Mounts', 'GPS Mounts'],
    }
  },
  'Exterior Accessories': {
    icon: '🚗',
    subcategories: {
      'Protection': ['Car Covers', 'Paint Protection Film', 'Mud Flaps', 'Bug Shields', 'Hood Protectors'],
      'Aerodynamics': ['Spoilers', 'Body Kits', 'Side Skirts', 'Diffusers', 'Front Lips'],
      'Roof Accessories': ['Roof Racks', 'Cargo Boxes', 'Bike Racks', 'Kayak Racks', 'Sunroof Deflectors'],
      'Windshield & Windows': ['Wiper Blades', 'Window Visors', 'Window Tint', 'Windshield Covers', 'Rear Window Louvers'],
      'Mirrors': ['Side Mirrors', 'Mirror Covers', 'Blind Spot Mirrors', 'Interior Mirrors'],
      'Grilles & Trim': ['Front Grilles', 'Chrome Trim', 'Door Handle Covers', 'Gas Cap Covers', 'Emblems']
    }
  },
  'Wheels & Tires': {
    icon: '⚙️',
    subcategories: {
      'Wheels': ['Alloy Wheels', 'Steel Wheels', 'Chrome Wheels', 'Black Wheels', 'Off-Road Wheels'],
      'Tires': ['All-Season Tires', 'Summer Tires', 'Winter Tires', 'Performance Tires', 'Off-Road Tires', 'Run-Flat Tires'],
      'Suspension': ['Struts', 'Shocks', 'Springs', 'Sway Bars', 'Control Arms', 'Ball Joints', 'Tie Rods', 'Lift Kits']
    }
  },
  'Body Parts': {
    icon: '🔧',
    subcategories: {
      'Panels': ['Fenders', 'Hoods', 'Doors', 'Bumpers', 'Quarter Panels', 'Rocker Panels', 'Trunk Lids', 'Tailgates'],
    }
  },
  'Electrical & Electronics': {
    icon: '🔌',
    subcategories: {
      'Sensors': ['Oxygen Sensors', 'MAP Sensors', 'Throttle Position Sensors', 'Temperature Sensors', 'ABS Sensors'],
      'Wiring': ['Wiring Harnesses', 'Relays', 'Fuses', 'Circuit Breakers', 'Connectors'],
    }
  },
  'Climate Control': {
    icon: '❄️',
    subcategories: {
      'A/C Components': ['A/C Compressors', 'Condensers', 'Evaporators', 'A/C Hoses', 'Expansion Valves', 'Receiver Driers'],
      'Heating': ['Heater Cores', 'Heater Control Valves', 'Blower Motors', 'Blower Resistors'],
    }
  }
};

// Explicit mapping for subcategory -> exact image filename
export const explicitSubcategoryImage = {
  'Engine Components': '/category-images/engine-components.png',
  'Exhaust Systems': '/category-images/exhaust-systems.png',
  'Brakes': '/category-images/brakes.png',
  'Air Intake & Filters': '/category-images/air-intake.png',
  'Fuel System': '/category-images/fuel-system.png',
  'Ignition System': '/category-images/ignition-system.png',
  'Cooling System': '/category-images/cooling-system.png',
  'Transmission': '/category-images/transmission.png',
  'Headlights': '/category-images/headlights.png',
  'Tail Lights': '/category-images/tail-lights.png',
  'Interior Lighting': '/category-images/ceiling-light.png',
  'Signal & Marker Lights': '/category-images/signal-marker-lights.png',
  'Fog Lights': '/category-images/fog-lights.png',
  'Off-Road Lighting': '/category-images/off-road-lighting.png',
  'Seating': '/category-images/seating.png',
  'Floor Protection': '/category-images/floor-protection.png',
  'Steering Wheel': '/category-images/steering-wheel.png',
  'Dashboard & Console': '/category-images/dashboard-console.png',
  'Panels': '/category-images/panels.png',
  'Roof Accessories': '/category-images/roof-accessories.png',
  'Windshield & Windows': '/category-images/windshield-windows.png',
  'Mirrors': '/category-images/mirrors.png',
  'Grilles & Trim': '/category-images/grilles.png',
  'Protection': '/category-images/car-cover.png',
  'Aerodynamics': '/category-images/aerodynamics.png',
  'Wheels': '/category-images/wheels.png',
  'Tires': '/category-images/tires.png',
  'Suspension': '/category-images/suspension.png',
  'Sensors': '/category-images/sensors.png',
  'A/C Components': '/category-images/ac-components.png',
  'Heating': '/category-images/heating.png',
  'Oil Filter': '/category-images/oil-filter.png'
};

// Mock parts data
export const mockParts = [
  { 
    id: 1, 
    partNumber: 'BRK-45892', 
    name: 'Front Brake Pad Set', 
    mainCategory: 'Performance Parts', 
    subCategory: 'Brakes', 
    detailCategory: 'Brake Pads', 
    price: 89.99, 
    stock: 24, 
    fits: ['2018-2023 Honda Accord', '2019-2023 Honda Civic', '2020-2023 Honda CR-V'], 
    brand: 'Brembo',
    images: ['/product-images/brake-pads-1.jpg', '/product-images/brake-pads-2.jpg', '/product-images/brake-pads-3.jpg'],
    description: 'Premium ceramic brake pads designed for superior stopping power and reduced brake dust. Features low-noise formula and extended pad life. Perfect for daily driving and spirited performance.'
  },
  { 
    id: 2, 
    partNumber: 'ENG-78234', 
    name: 'Oil Filter', 
    mainCategory: 'Performance Parts', 
    subCategory: 'Engine Components', 
    detailCategory: 'Engine Gaskets', 
    price: 12.99, 
    stock: 156, 
    fits: ['2015-2023 Toyota Camry', '2016-2023 Toyota Corolla', '2017-2023 Toyota RAV4'], 
    brand: 'Bosch',
    images: ['/product-images/oil-filter-1.jpg'],
    description: 'High-efficiency oil filter with premium filtration media. Captures 99% of harmful contaminants while maintaining optimal oil flow. Recommended replacement interval: 5,000 miles.'
  },
  { 
    id: 3, 
    partNumber: 'SUS-92341', 
    name: 'Front Strut Assembly', 
    mainCategory: 'Wheels & Tires', 
    subCategory: 'Suspension', 
    detailCategory: 'Struts', 
    price: 245.50, 
    stock: 8, 
    fits: ['2017-2022 Ford F-150', '2018-2022 Ford F-150 4WD'], 
    brand: 'Monroe',
    images: ['/product-images/strut-1.jpg', '/product-images/strut-2.jpg'],
    description: 'Complete strut assembly with premium gas-charged shock absorber. Includes coil spring, mount, and bearing plate for easy installation. Restores original ride quality and handling.'
  },
  { 
    id: 4, 
    partNumber: 'EXH-45678', 
    name: 'Catalytic Converter', 
    mainCategory: 'Performance Parts', 
    subCategory: 'Exhaust Systems', 
    detailCategory: 'Catalytic Converters', 
    price: 425.00, 
    stock: 12, 
    fits: ['2016-2020 Chevrolet Silverado', '2016-2020 GMC Sierra'], 
    brand: 'Walker',
    images: ['/product-images/catalytic-converter-1.jpg'],
    description: 'EPA-compliant direct-fit catalytic converter. Features OE-style design for easy installation and meets all federal emissions standards. Includes necessary gaskets and hardware.'
  },
  { 
    id: 5, 
    partNumber: 'ELE-23456', 
    name: 'Alternator', 
    mainCategory: 'Electrical & Electronics', 
    subCategory: 'Charging System', 
    detailCategory: 'Alternators', 
    price: 189.99, 
    stock: 18, 
    fits: ['2015-2021 Nissan Altima', '2016-2021 Nissan Maxima'], 
    brand: 'Denso',
    images: ['/product-images/alternator-1.jpg', '/product-images/alternator-2.jpg'],
    description: 'Remanufactured alternator with 100% new bearings, brushes, and regulators. Tested to OE specifications. 140-amp output ensures reliable charging for all electrical systems.'
  },
  { 
    id: 6, 
    partNumber: 'BRK-88901', 
    name: 'Brake Rotor Set', 
    mainCategory: 'Performance Parts', 
    subCategory: 'Brakes', 
    detailCategory: 'Brake Rotors', 
    price: 125.00, 
    stock: 32, 
    fits: ['2018-2023 Honda Accord', '2019-2023 Honda Insight'], 
    brand: 'Brembo',
    images: ['/product-images/brake-rotor-1.jpg', '/product-images/brake-rotor-2.jpg'],
    description: 'High-carbon content brake rotors for maximum heat dissipation. Precision-balanced and machine-finished for smooth, vibration-free braking. Sold as a pair (2 rotors).'
  },
  { 
    id: 7, 
    partNumber: 'LED-19283', 
    name: 'LED Headlight Bulbs H11', 
    mainCategory: 'Lighting', 
    subCategory: 'Headlights', 
    detailCategory: 'Headlight Bulbs', 
    price: 79.99, 
    stock: 45, 
    fits: ['2015-2023 Honda Civic', '2016-2023 Toyota Corolla', '2017-2023 Mazda 3'], 
    brand: 'Philips',
    images: ['/product-images/led-bulb-1.jpg', '/product-images/led-bulb-2.jpg', '/product-images/led-bulb-3.jpg'],
    description: '6000K bright white LED headlight bulbs with 250% more visibility. Plug-and-play installation, no modifications required. Built-in cooling fan ensures long bulb life. Sold as a pair.'
  },
  { 
    id: 8, 
    partNumber: 'INT-55421', 
    name: 'All-Weather Floor Mats', 
    mainCategory: 'Interior Accessories', 
    subCategory: 'Floor Protection', 
    detailCategory: 'All-Weather Mats', 
    price: 89.99, 
    stock: 67, 
    fits: ['2018-2023 Honda Accord'], 
    brand: 'WeatherTech',
    images: ['/product-images/floor-mats-1.jpg', '/product-images/floor-mats-2.jpg'],
    description: 'Laser-measured custom-fit floor liners with raised edges to contain spills and debris. Made from odorless, eco-friendly thermoplastic. Easy to clean and install. Set of 4.'
  },
  { 
    id: 9, 
    partNumber: 'EXT-77234', 
    name: 'Rear Window Sunroof Deflector', 
    mainCategory: 'Exterior Accessories', 
    subCategory: 'Roof Accessories', 
    detailCategory: 'Sunroof Deflectors', 
    price: 45.99, 
    stock: 23, 
    fits: ['2017-2023 Toyota Camry', '2018-2023 Toyota Avalon'], 
    brand: 'AVS',
    images: ['/product-images/deflector-1.jpg'],
    description: 'Aerodynamic sunroof deflector reduces wind noise and allows fresh air circulation even in light rain. Easy no-drill installation with 3M adhesive. Dark smoke tint complements any exterior.'
  },
  { 
    id: 10, 
    partNumber: 'WHL-33890', 
    name: '18" Chrome Alloy Wheel', 
    mainCategory: 'Wheels & Tires', 
    subCategory: 'Wheels', 
    detailCategory: 'Chrome Wheels', 
    price: 189.99, 
    stock: 16, 
    fits: ['2018-2023 Ford F-150', '2019-2023 Ford Ranger'], 
    brand: 'American Racing',
    images: ['/product-images/wheel-1.jpg', '/product-images/wheel-2.jpg'],
    description: '18x8.5 chrome alloy wheel with 6x135mm bolt pattern. Load-rated for trucks and SUVs. Triple chrome-plated finish resists corrosion. Price is per wheel.'
  },
];

// Partner brands
export const partnerBrands = [
  'AC Delco', 'Bosch', 'Brembo', 'Denso', 'Dorman', 'Gates',
  'Monroe', 'Moog', 'NGK', 'Timken', 'Wagner', 'Walker',
  'Bilstein', 'KYB', 'Champion', 'Fel-Pro', 'Mahle', 'SKF'
];
