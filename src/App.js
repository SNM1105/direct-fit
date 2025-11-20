// App.js
import React, { useEffect, useState } from 'react';
import {
  Search,
  User,
  ShoppingCart,
  Package,
  TrendingUp,
  Shield,
  Truck,
  X,
  LogOut,
  Plus,
  Minus,
  Trash2,
  Wrench,
  Building2,
  UserCircle,
  Menu
} from 'lucide-react';
import logo from './logo.png';

// Backend API base URL
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Comprehensive category structure for 1.2M+ parts
const categoryStructure = {
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

// Removed emoji subcategory icons per request — UI now uses hardcoded photos or a neutral placeholder.

// Explicit mapping for subcategory -> exact image filename you uploaded.
// Update this mapping when you add new photos to `public/category-images/`.
const explicitSubcategoryImage = {
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

// Subcategory image auto-resolver (tries explicit mapping first; then common candidates).
const subcategoryFilenameBase = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function SubcategoryImage({ name }) {
  // If an explicit mapping exists, use it directly
  const explicit = explicitSubcategoryImage[name];
  const exts = ['png', 'jpg', 'jpeg', 'svg', 'webp'];

  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  // build auto candidates only if no explicit mapping
  const candidates = explicit ? [explicit] : (() => {
    const base = subcategoryFilenameBase(name);
    const basenames = [base, `${base}-photo`, `${base}-image`, base.replace(/-/g, '')];
    const out = [];
    basenames.forEach(b => exts.forEach(ext => out.push(`/category-images/${b}.${ext}`)));
    return out;
  })();

  useEffect(() => {
    setIdx(0);
    setFailed(false);
  }, [name]);

  const src = candidates[idx];

  return (
    <div className="flex-shrink-0 sm:mr-4 mr-0">
      {!failed ? (
        <img
          src={src}
          alt={name}
          className="h-16 w-16 sm:h-20 sm:w-20 md:h-28 md:w-28 object-contain rounded shadow-sm"
          onError={() => {
            if (idx < candidates.length - 1) setIdx(idx + 1);
            else setFailed(true);
          }}
        />
      ) : (
        // Neutral placeholder when no image is available (transparent, outlined)
        <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-28 md:w-28 rounded border border-gray-200" />
      )}
    </div>
  );
}

// Mock data for parts (expanded with categories)
const mockParts = [
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

// Brands we work with
const partnerBrands = [
  'AC Delco', 'Bosch', 'Brembo', 'Denso', 'Dorman', 'Gates',
  'Monroe', 'Moog', 'NGK', 'Timken', 'Wagner', 'Walker',
  'Bilstein', 'KYB', 'Champion', 'Fel-Pro', 'Mahle', 'SKF'
];

// Helper to resolve a brand name to a public logo path. Put SVG/PNG files
// in `public/brands` named like `ac-delco.svg`, `bosch.svg`, etc.
const brandLogoFilename = (brand) => brand.toLowerCase().replace(/[^a-z0-9]+/g, '-');

function BrandLogo({ brand }) {
  // Try common filename variants so files like `Bosch-Logo.png` are found.
  const exts = ['png', 'svg', 'jpg', 'webp']; // prefer PNG first
  const base = brandLogoFilename(brand);
  const basenames = [
    base,
    `${base}-logo`,
    `${base}logo`,
    base.replace(/-/g, ''),
  ];

  const candidates = [];
  basenames.forEach(b => exts.forEach(ext => candidates.push(`/brands/${b}.${ext}`)));

  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setIdx(0);
    setFailed(false);
  }, [brand]);

  useEffect(() => {
    // nothing here, but keep idx/failure responsive
  }, [idx, failed]);

  if (failed) {
    return (
      <div className="h-16 w-full flex items-center justify-center">
        <div className="bg-white p-2 rounded-md shadow-sm w-full h-full flex items-center justify-center">
          <span className="text-sm text-gray-500">{brand}</span>
        </div>
      </div>
    );
  }

  const src = candidates[idx];

  return (
    <div className="h-16 w-full flex items-center justify-center">
      <div className="bg-white p-2 rounded-md shadow-sm w-full h-full flex items-center justify-center">
        <img
          src={src}
          alt={brand}
          className="max-h-full object-contain w-auto"
          onError={() => {
            if (idx < candidates.length - 1) {
              setIdx(idx + 1);
            } else {
              setFailed(true);
            }
          }}
        />
      </div>
    </div>
  );
}

/* ----------------------
   Small isolated components
   ---------------------- */

function PartSearchInput({ partNumber, setPartNumber, onEnter }) {
  return (
    <input
      type="text"
      value={partNumber}
      onChange={(e) => setPartNumber(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onEnter();
        }
      }}
      placeholder="e.g., BRK-45892 or 'brake pad'"
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
    />
  );
}

function Header({ cartCount, isLoggedIn, currentUserName, currentUser, onLoginClick, onLogoutClick, onOpenCart, onOpenOrders, setCurrentPage, onBack, canGoBack }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-gray-900 border-b-4 border-red-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            {canGoBack && (
              <button onClick={onBack} className="text-gray-300 hover:text-yellow-400 px-2 py-1 rounded-md">
                ← Back
              </button>
            )}
            <button onClick={() => { setCurrentPage('home'); setMobileOpen(false); }} className="flex items-center space-x-3 group">
              <img src={logo} alt="Direct Fit Automotive Solutions" className="h-10 w-auto" />
            </button>

            <nav className="hidden md:flex space-x-6">
              <button onClick={() => setCurrentPage('home')} className="text-gray-300 hover:text-yellow-400 font-medium transition">Home</button>
              <button onClick={() => setCurrentPage('about')} className="text-gray-300 hover:text-yellow-400 font-medium transition">About</button>
              {isLoggedIn && currentUser?.isAdmin && (
                <button onClick={() => setCurrentPage('admin')} className="text-gray-300 hover:text-yellow-400 font-medium transition">Admin</button>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-300 p-2 rounded-md hover:bg-gray-800">
              <Menu className="h-6 w-6" />
            </button>

            <button onClick={onOpenCart} className="relative text-gray-300 hover:text-yellow-400 transition">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            {isLoggedIn && (
              <button onClick={onOpenOrders} className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md hidden sm:inline-flex">
                <Package className="h-5 w-5" />
              </button>
            )}
            {isLoggedIn ? (
              <div className="hidden sm:flex items-center space-x-3">
                <span className="text-sm text-gray-300">Hi, <span className="text-yellow-400 font-semibold">{currentUserName}</span></span>
                <button onClick={onLogoutClick} className="text-red-500 hover:text-red-400 transition">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button onClick={onLoginClick} className="hidden sm:inline-flex bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition items-center font-semibold">
                <User className="h-5 w-5 mr-2" />
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 py-3 space-y-2">
            <button onClick={() => { setCurrentPage('home'); setMobileOpen(false); }} className="w-full text-left text-gray-200 py-2">Home</button>
            <button onClick={() => { setCurrentPage('about'); setMobileOpen(false); }} className="w-full text-left text-gray-200 py-2">About</button>
            {isLoggedIn && currentUser?.isAdmin && (
              <button onClick={() => { setCurrentPage('admin'); setMobileOpen(false); }} className="w-full text-left text-gray-200 py-2">Admin</button>
            )}
            {isLoggedIn ? (
              <div className="pt-2 border-t border-gray-700">
                <button onClick={onOpenOrders} className="w-full text-left text-gray-200 py-2">Orders</button>
                <button onClick={onLogoutClick} className="w-full text-left text-gray-200 py-2">Logout</button>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-700">
                <button onClick={() => { onLoginClick(); setMobileOpen(false); }} className="w-full text-left text-gray-200 py-2">Login</button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

/* ----------------------
   Page Components (moved outside)
   ---------------------- */

function HomePage(props) {
  const {
    searchType,
    setSearchType,
    year,
    setYear,
    make,
    setMake,
    model,
    setModel,
    years,
    makes,
    models,
    loadingMakes,
    loadingModels,
    partNumber,
    setPartNumber,
    handleSearch,
    setCurrentPage,
    isLoggedIn
  } = props;

  return (
    <div>
      <div className="bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">Direct Fit Automotive Solutions</h1>
            <p className="text-yellow-300 text-base sm:text-lg md:text-xl">Supplier-Direct Pricing for Automotive Professionals</p>
          </div>

          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
              <button
                onClick={() => setSearchType('vehicle')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${searchType === 'vehicle' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Search by Vehicle
              </button>
              <button
                onClick={() => setSearchType('part')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${searchType === 'part' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Search by Part Number
              </button>
            </div>

            {searchType === 'vehicle' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="">Select Year</option>
                      {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                    <select
                      value={make}
                      onChange={(e) => { setMake(e.target.value); setModel(''); }}
                      disabled={loadingMakes}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="">{loadingMakes ? 'Loading...' : 'Select Make'}</option>
                      {makes.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      disabled={!make || loadingModels}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="">{loadingModels ? 'Loading...' : !make ? 'Select make first' : 'Select Model'}</option>
                      {models.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                <button onClick={handleSearch} className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center">
                  <Search className="h-5 w-5 mr-2" />
                  Find Parts
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Part Number or Description</label>
                  <PartSearchInput partNumber={partNumber} setPartNumber={setPartNumber} onEnter={handleSearch} />
                </div>
                <button onClick={handleSearch} className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center">
                  <Search className="h-5 w-5 mr-2" />
                  Search Parts
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-red-600 text-center">
            <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 text-red-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Supplier Direct</h3>
            <p className="text-sm text-gray-600">Wholesale pricing with custom margins</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-yellow-500 text-center">
            <Package className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Real-Time Stock</h3>
            <p className="text-sm text-gray-600">Live inventory updates</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-gray-800 text-center">
            <Truck className="h-12 w-12 text-gray-800 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Fast Shipping</h3>
            <p className="text-sm text-gray-600">FedEx & UPS delivery</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-red-600 text-center">
            <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Warranty</h3>
            <p className="text-sm text-gray-600">Full manufacturer coverage</p>
          </div>
        </div>

        {!isLoggedIn && (
          <div className="bg-gradient-to-r from-gray-900 to-red-900 rounded-lg p-8 text-center text-white shadow-xl">
            <Wrench className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Professional Membership Required</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Get access to supplier-direct pricing, bulk ordering, and dedicated account management.
            </p>
            <button className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition" onClick={() => setCurrentPage('home')}>
              Request Access
            </button>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Brands We Carry</h2>
          <p className="text-gray-600 mb-4">We partner with the industry's most trusted manufacturers to bring you quality parts you can rely on.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 items-stretch">
            {partnerBrands.map((brand, idx) => (
              <div key={idx} className="flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200 p-4 hover:border-red-600 transition">
                <div className="h-12 w-full flex items-center justify-center">
                  <BrandLogo brand={brand} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-6 text-center">And many more industry-leading brands...</p>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Direct Fit Automotive Solutions</h1>
        <div className="prose max-w-none text-gray-700 space-y-4">
          <p className="text-lg">
            Direct Fit Automotive Solutions is your premier source for high-quality automotive parts at wholesale prices.
            We bridge the gap between suppliers and automotive professionals, providing access to an extensive catalog of
            parts with unbeatable pricing and exceptional service.
          </p>
          <p>
            Founded with the mission to simplify parts sourcing for mechanics, body shops, and dealerships, we leverage
            our strong supplier relationships to offer you direct access to inventory without the middleman markup. Our
            platform combines cutting-edge technology with personalized service to deliver the parts you need, when you need them.
          </p>
          <p>
            Whether you're running a busy repair shop, managing a dealership, or working on your own projects,
            Direct Fit Automotive Solutions provides the tools and resources to keep your operations running smoothly.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Brands</h2>
        <p className="text-gray-600">Brand listings are now shown on the Home page under the "Professional Membership Required" section.</p>
      </div>
    </div>
  );
}

function CategoriesPage({ categories, onSelectCategory, year, setYear, make, setMake, model, setModel, years, makes, models, loadingMakes, loadingModels }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Vehicle selector so users can switch cars while on categories page */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <VehicleSelectorWrapper
          year={year}
          setYear={setYear}
          make={make}
          setMake={setMake}
          model={model}
          setModel={setModel}
          years={years}
          makes={makes}
          models={models}
          loadingMakes={loadingMakes}
          loadingModels={loadingModels}
        />
      </div>
      <h2 className="text-3xl font-bold mb-6">Parts Categories</h2>
      <div className="space-y-8">
        {Object.entries(categories).map(([catName, catData]) => (
          <section key={catName} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{catData.icon || '📦'}</div>
                <div>
                  <h3 className="text-xl font-semibold">{catName}</h3>
                  <p className="text-sm text-gray-600">{Object.keys(catData.subcategories).length} subcategories</p>
                </div>
              </div>
              <div>
                <button onClick={() => onSelectCategory(catName)} className="text-red-600 hover:text-red-800 text-sm font-medium">Shop All →</button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
              {Object.entries(catData.subcategories).map(([subName]) => (
                <button
                  key={subName}
                  onClick={() => onSelectCategory(catName, subName)}
                  className="text-left p-3 bg-gray-50 rounded border border-gray-100 hover:bg-red-50 hover:border-red-200 transition h-full overflow-hidden min-h-[6rem] sm:min-h-[7rem] md:min-h-[9rem]"
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-center justify-start space-y-2 sm:space-y-0 sm:space-x-4 h-full">
                    <SubcategoryImage name={subName} />

                    <div className="font-medium text-center sm:text-left break-words">{subName}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function VehicleSelectorWrapper({ year, setYear, make, setMake, model, setModel, years, makes, models, loadingMakes, loadingModels }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
        >
          <option value="">Select Year</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
        <select
          value={make}
          onChange={(e) => { setMake(e.target.value); setModel(''); }}
          disabled={loadingMakes}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
        >
          <option value="">{loadingMakes ? 'Loading...' : 'Select Make'}</option>
          {makes.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={!make || loadingModels}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
        >
          <option value="">{loadingModels ? 'Loading...' : !make ? 'Select make first' : 'Select Model'}</option>
          {models.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
    </div>
  );
}

function ProductDetailPage({ product, addToCart, calculatePrice, isLoggedIn, onBack }) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Product not found</p>
      </div>
    );
  }

  const images = product.images || ['/product-images/placeholder.jpg'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={onBack} className="mb-6 text-red-600 hover:text-red-700 font-medium flex items-center">
        <span className="mr-2">←</span> Back to Results
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images Section */}
          <div>
            <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => { e.target.src = '/product-images/placeholder.jpg'; }}
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`border-2 rounded-lg overflow-hidden aspect-square bg-gray-50 hover:border-red-600 transition ${
                      selectedImage === idx ? 'border-red-600' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => { e.target.src = '/product-images/placeholder.jpg'; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 font-mono mb-1">{product.partNumber}</p>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-sm text-gray-600">Brand: <span className="font-semibold">{product.brand}</span></p>
            </div>

            <div className="mb-6">
              <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.stock > 10 ? `${product.stock} in stock` : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of stock'}
              </span>
            </div>

            <div className="mb-6 pb-6 border-b">
              <p className="text-4xl font-bold text-red-600">${calculatePrice(product.price)}</p>
              <p className="text-sm text-gray-500 mt-1">Price includes your customer margin</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description || 'No description available.'}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Vehicle Fitment</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-1">
                  {product.fits.map((fit, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-red-600 mr-2">✓</span>
                      <span className="text-gray-700">{fit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button 
              onClick={() => addToCart(product)} 
              disabled={product.stock === 0}
              className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsPage({ searchResults, addToCart, calculatePrice, isLoggedIn, onViewProduct }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Search Results ({searchResults.length} parts found)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {searchResults.map(part => (
          <div 
            key={part.id} 
            onClick={() => onViewProduct(part)}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-l-4 border-red-600 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-500 font-mono">{part.partNumber}</p>
                <h3 className="font-semibold text-lg">{part.name}</h3>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${part.stock > 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                {part.stock} in stock
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">Fits: {part.fits[0]}</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-red-600">${calculatePrice(part.price)}</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); addToCart(part); }} 
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CartPage({ cart, updateQuantity, removeFromCart, calculatePrice, handleCheckout }) {
  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (parseFloat(calculatePrice(item.price)) * item.quantity), 0).toFixed(2);
  };

  return (
    <div className="max-w-4xl md:max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      {cart.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      ) : (
        <div>
          <div className="bg-white rounded-lg shadow-lg divide-y">
              {cart.map(item => (
              <div key={item.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="flex-1 w-full md:w-auto mb-4 md:mb-0">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500 font-mono">{item.partNumber}</p>
                  <p className="text-red-600 font-semibold mt-1">${calculatePrice(item.price)}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-gray-200 rounded">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-gray-200 rounded">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="font-bold w-24 text-right">${(calculatePrice(item.price) * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-red-600">${getCartTotal()}</span>
            </div>
            <button onClick={handleCheckout} className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersPage({ orders, onReorder }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Order History</h2>
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No orders yet. Your past orders will appear here after checkout.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Order #{order.id}</p>
                  <p className="font-semibold text-lg">{new Date(order.date).toLocaleString()}</p>
                  {order.user && <p className="text-sm text-gray-600">Placed by: {order.user.name}</p>}
                  {order.vehicle && (order.vehicle.year || order.vehicle.make || order.vehicle.model) && (
                    <p className="text-sm text-gray-600">Vehicle: {`${order.vehicle.year || ''} ${order.vehicle.make || ''} ${order.vehicle.model || ''}`}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-red-600">${order.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{order.items.length} items</p>
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.map(it => (
                    <div key={it.id} className="p-3 bg-gray-50 rounded">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{it.name}</p>
                          <p className="text-xs text-gray-500">{it.partNumber} • {it.brand}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{it.quantity} × ${it.unitPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex space-x-3">
                  <button onClick={() => onReorder(order.items)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">Reorder</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [editingMargins, setEditingMargins] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [bulkAdjustment, setBulkAdjustment] = useState('');
  const [bulkUpdating, setBulkUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
        // Initialize editing margins
        const margins = {};
        data.users.forEach(u => margins[u.id] = u.margin);
        setEditingMargins(margins);
      } else {
        alert('Failed to load users: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users: ' + error.message);
    }
    setLoading(false);
  };

  const updateMargin = async (userId) => {
    const newMargin = editingMargins[userId];
    if (newMargin === undefined || newMargin < 0 || newMargin > 100) {
      alert('Please enter a valid margin between 0 and 100');
      return;
    }
    
    setUpdating(userId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/users/${userId}/margin`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ margin: parseFloat(newMargin) })
      });
      const data = await response.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, margin: parseFloat(newMargin) } : u));
        alert('Margin updated successfully!');
      } else {
        alert('Failed to update margin: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating margin:', error);
      alert('Error updating margin: ' + error.message);
    }
    setUpdating(null);
  };

  const applyBulkAdjustment = async () => {
    const adjustment = parseFloat(bulkAdjustment);
    if (isNaN(adjustment)) {
      alert('Please enter a valid number for bulk adjustment');
      return;
    }

    if (!window.confirm(`This will adjust all user margins by ${adjustment > 0 ? '+' : ''}${adjustment}%. Continue?`)) {
      return;
    }

    setBulkUpdating(true);
    const token = localStorage.getItem('token');
    let successCount = 0;
    let errorCount = 0;

    for (const user of users) {
      const newMargin = Math.max(0, Math.min(100, user.margin + adjustment));
      
      try {
        const response = await fetch(`${API_BASE}/admin/users/${user.id}/margin`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ margin: newMargin })
        });
        
        const data = await response.json();
        if (data.success) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error('Error updating user:', user.email, error);
        errorCount++;
      }
    }

    setBulkUpdating(false);
    setBulkAdjustment('');
    
    if (errorCount === 0) {
      alert(`Successfully updated ${successCount} user margins!`);
    } else {
      alert(`Updated ${successCount} users. ${errorCount} failed.`);
    }
    
    // Refresh the user list
    fetchUsers();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Loading users...</p>
      </div>
    );
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">g-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Admin Panel - User Management</h2>
      
      {/* Bulk Margin Adjustment */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Bulk Margin Adjustment</h3>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">Adjust all margins by:</span>
          <input
            type="number"
            value={bulkAdjustment}
            onChange={(e) => setBulkAdjustment(e.target.value)}
            placeholder="e.g., -1 or +2"
            disabled={bulkUpdating}
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white text-gray-900 disabled:bg-gray-100"
            step="0.5"
          />
          <span className="text-sm text-gray-600">%</span>
          <button
            onClick={applyBulkAdjustment}
            disabled={bulkUpdating || !bulkAdjustment}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
          >
            {bulkUpdating ? 'Updating...' : 'Apply to All'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Note: Margins will be clamped between 0% and 100%</p>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
        />
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Account Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Margin %</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.account_type === 'business' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {user.account_type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={editingMargins[user.id] !== undefined ? editingMargins[user.id] : user.margin}
                      onChange={(e) => setEditingMargins(prev => ({ ...prev, [user.id]: e.target.value }))}
                      disabled={updating === user.id}
                      className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 bg-white text-gray-900 disabled:bg-gray-100"
                      step="0.5"
                      min="0"
                      max="100"
                    />
                    <span>%</span>
                    <button
                      onClick={() => updateMargin(user.id)}
                      disabled={updating === user.id}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400 transition"
                    >
                      {updating === user.id ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}




/* ----------------------
   Main App
   ---------------------- */

export default function DirectFitAutomotive() {
  /* --- Authentication --- */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  /* --- App nav / pages --- */
  const [currentPage, setCurrentPage] = useState('home');
  const [pageHistory, setPageHistory] = useState([]);

  const navigateTo = (page) => {
    setPageHistory(prev => [...prev, currentPage]);
    setCurrentPage(page);
  };

  const goBack = () => {
    // If we're on the categories page, Back should always go Home
    if (currentPage === 'categories') {
      setPageHistory([]);
      setCurrentPage('home');
      return;
    }

    // Otherwise pop the last page from history (if any)
    setPageHistory(prev => {
      if (prev.length === 0) {
        setCurrentPage('home');
        return [];
      }
      const newPrev = [...prev];
      const last = newPrev.pop();
      setCurrentPage(last);
      return newPrev;
    });
  };

  /* --- Makes/Models and form state --- */
  const [searchType, setSearchType] = useState('vehicle');
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  const [partNumber, setPartNumber] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  /* --- cart --- */
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  /* --- login/signup modal --- */
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupData, setSignupData] = useState({ email: '', password: '', name: '', company: '', accountType: 'business' });

  /* --- constants --- */
  const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

  /* --- Effects: restore session on mount --- */
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE}/auth/verify`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
          setCurrentUser(data.user);
          setIsLoggedIn(true);
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Session restore error:', error);
        localStorage.removeItem('token');
      }
    };

    restoreSession();
  }, []);

  /* --- Effects: fetch makes & models --- */
  useEffect(() => {
    const fetchMakes = async () => {
      setLoadingMakes(true);
      try {
        const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json');
        const data = await response.json();
        const makesList = data.Results.map(item => item.MakeName).sort();
        setMakes(makesList);
      } catch (error) {
        console.error('Error fetching makes:', error);
        setMakes(['Honda', 'Toyota', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen']);
      }
      setLoadingMakes(false);
    };
    fetchMakes();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      if (!make) {
        setModels([]);
        return;
      }
      setLoadingModels(true);
      try {
        const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${make}?format=json`);
        const data = await response.json();
        const modelsList = data.Results.map(item => item.Model_Name).sort();
        setModels(modelsList);
      } catch (error) {
        console.error('Error fetching models:', error);
        setModels(['Model data unavailable']);
      }
      setLoadingModels(false);
    };
    fetchModels();
  }, [make]);

  /* --- handlers --- */
  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        setShowAuthModal(false);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      alert('Login error: ' + error.message);
    }
  };

  const handleSignup = async () => {
    if (!signupData.email || !signupData.password) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
          name: signupData.name,
          company: signupData.company,
          accountType: signupData.accountType
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        setShowAuthModal(false);
        setSignupData({ email: '', password: '', name: '', company: '', accountType: 'business' });
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch (error) {
      alert('Signup error: ' + error.message);
    }
  };

  const handleSearch = () => {
    const hasVehicle = Boolean(year || make || model);
    const partTerm = (partNumber || '').trim();
    const hasPartTerm = partTerm.length > 0;

    if (!hasVehicle && !hasPartTerm) {
      alert('Please select a vehicle or enter a part number / name to search');
      return;
    }

    if (searchType === 'vehicle') {
      // Show categories (not individual parts) for vehicle searches
      navigateTo('categories');
      return;
    }

    if (searchType === 'part') {
      const term = partTerm.toLowerCase();
      let results = mockParts.filter(part =>
        part.partNumber.toLowerCase().includes(term) ||
        part.name.toLowerCase().includes(term)
      );

      // If a vehicle is selected, limit part results to parts that fit that vehicle
      if (hasVehicle) {
        const vehicleFilters = [];
        if (year) vehicleFilters.push(year.toString());
        if (make) vehicleFilters.push(make.toString());
        if (model) vehicleFilters.push(model.toString());

        results = results.filter(part =>
          part.fits && part.fits.some(fit =>
            vehicleFilters.every(v => fit.toLowerCase().includes(v.toLowerCase()))
          )
        );
      }

      setSearchResults(results);
      navigateTo('results');
      return;
    }
  };

  const addToCart = (part) => {
    if (!isLoggedIn) {
      alert('Please login to add items to cart');
      setShowAuthModal(true);
      setAuthMode('login');
      return;
    }
    const existing = cart.find(item => item.id === part.id);
    if (existing) {
      setCart(prev => prev.map(item => item.id === part.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart(prev => [...prev, { ...part, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const viewProduct = (product) => {
    setSelectedProduct(product);
    navigateTo('productDetail');
  };

  const backToResults = () => {
    setSelectedProduct(null);
    goBack();
  };

  const calculatePrice = (basePrice) => {
    if (!currentUser) return basePrice.toFixed(2);
    return (basePrice * (1 + currentUser.margin / 100)).toFixed(2);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (parseFloat(calculatePrice(item.price)) * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    // Build order object and persist to order history (localStorage)
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      user: currentUser ? { id: currentUser.id, name: currentUser.name } : null,
      vehicle: { year, make, model },
      items: cart.map(item => ({ id: item.id, partNumber: item.partNumber, name: item.name, quantity: item.quantity, unitPrice: parseFloat(calculatePrice(item.price)), brand: item.brand })),
      total: parseFloat(getCartTotal())
    };

    setOrders(prev => [newOrder, ...prev]);
    alert(`Order placed! Total: $${newOrder.total.toFixed(2)}\n\nOrder saved to your Order History.`);
    setCart([]);
    navigateTo('orders');
  };

  const handleReorder = (items) => {
    // Add each item from a past order back into the cart (merge quantities)
    setCart(prev => {
      const next = [...prev];
      items.forEach(it => {
        const idx = next.findIndex(n => n.id === it.id);
        if (idx >= 0) {
          next[idx] = { ...next[idx], quantity: next[idx].quantity + (it.quantity || 1) };
        } else {
          next.push({ id: it.id, partNumber: it.partNumber, name: it.name, price: it.unitPrice || 0, quantity: it.quantity || 1, brand: it.brand });
        }
      });
      return next;
    });
    navigateTo('cart');
  };

  // Show results filtered by category/subcategory
  const showResultsForCategory = (mainCategory, subCategory = null) => {
    let results = mockParts;
    if (mainCategory) {
      results = results.filter(p => p.mainCategory === mainCategory);
    }
    if (subCategory) {
      results = results.filter(p => p.subCategory === subCategory);
    }

    // If a vehicle is selected (year/make/model), further filter to parts that fit that vehicle
    const vehicleFilters = [];
    if (year) vehicleFilters.push(year.toString());
    if (make) vehicleFilters.push(make.toString());
    if (model) vehicleFilters.push(model.toString());

    if (vehicleFilters.length > 0) {
      results = results.filter(part =>
        part.fits && part.fits.some(fit =>
          vehicleFilters.every(v => fit.toLowerCase().includes(v.toLowerCase()))
        )
      );
    }

    setSearchResults(results);
    navigateTo('results');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCart([]);
  };

  /* --- Derived values --- */
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const currentUserName = currentUser ? (currentUser.name.split(' ')[0] || currentUser.name) : '';

  /* --- render page switch --- */
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            searchType={searchType}
            setSearchType={setSearchType}
            year={year}
            setYear={setYear}
            make={make}
            setMake={setMake}
            model={model}
            setModel={setModel}
            years={years}
            makes={makes}
            models={models}
            loadingMakes={loadingMakes}
            loadingModels={loadingModels}
            partNumber={partNumber}
            setPartNumber={setPartNumber}
            handleSearch={handleSearch}
            setCurrentPage={navigateTo}
            isLoggedIn={isLoggedIn}
          />
        );
      case 'about':
        return <AboutPage />;
      case 'categories':
        return <CategoriesPage
          categories={categoryStructure}
          onSelectCategory={showResultsForCategory}
          year={year}
          setYear={setYear}
          make={make}
          setMake={setMake}
          model={model}
          setModel={setModel}
          years={years}
          makes={makes}
          models={models}
          loadingMakes={loadingMakes}
          loadingModels={loadingModels}
        />;
      case 'results':
        return <ResultsPage searchResults={searchResults} addToCart={addToCart} calculatePrice={calculatePrice} isLoggedIn={isLoggedIn} onViewProduct={viewProduct} />;
      case 'productDetail':
        return <ProductDetailPage product={selectedProduct} addToCart={addToCart} calculatePrice={calculatePrice} isLoggedIn={isLoggedIn} onBack={backToResults} />;
      case 'cart':
        return <CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} calculatePrice={calculatePrice} handleCheckout={handleCheckout} />;
      case 'orders':
        return <OrdersPage orders={orders} onReorder={handleReorder} />;
      case 'admin':
        if (!isLoggedIn || !currentUser?.isAdmin) {
          return (
            <div className="max-w-4xl mx-auto px-4 py-8">
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
                <p className="text-gray-600">You need admin privileges to access this page.</p>
              </div>
            </div>
          );
        }
        return <AdminPage />;
      default:
        return <HomePage {...{
          searchType, setSearchType, year, setYear, make, setMake, model, setModel, years, makes, models, loadingMakes, loadingModels, partNumber, setPartNumber, handleSearch, isLoggedIn
        }} setCurrentPage={navigateTo} />;
    }
  };

  const canGoBack = currentPage !== 'home' && (currentPage === 'categories' || pageHistory.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartCount={cartCount}
        isLoggedIn={isLoggedIn}
        currentUserName={currentUserName}
        currentUser={currentUser}
        onLoginClick={() => { setShowAuthModal(true); setAuthMode('login'); }}
        onLogoutClick={handleLogout}
        onOpenCart={() => navigateTo('cart')}
        onOpenOrders={() => navigateTo('orders')}
        setCurrentPage={navigateTo}
        onBack={goBack}
        canGoBack={canGoBack}
      />

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{authMode === 'login' ? 'Login' : 'Create Account'}</h2>
              <button onClick={() => setShowAuthModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {authMode === 'login' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
                <button onClick={handleLogin} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition">Login</button>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700 font-semibold mb-1">Demo Accounts:</p>
                  <p className="text-xs text-gray-600">Business: demo@mechanic.com / demo123</p>
                  <p className="text-xs text-gray-600">Personal: personal@email.com / demo123</p>
                  <p className="text-xs text-gray-600">Admin: admin@directfit.com / admin123</p>
                </div>
                <button onClick={() => setAuthMode('signup')} className="w-full text-red-600 hover:text-red-700 text-sm font-medium">Don't have an account? Sign up</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSignupData({ ...signupData, accountType: 'business' })}
                      className={`p-4 rounded-lg border-2 transition ${signupData.accountType === 'business' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <Building2 className={`h-8 w-8 mx-auto mb-2 ${signupData.accountType === 'business' ? 'text-red-600' : 'text-gray-400'}`} />
                      <p className="font-semibold text-sm text-gray-900">Business</p>
                      <p className="text-xs text-gray-500">Shop/Dealership</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupData({ ...signupData, accountType: 'personal' })}
                      className={`p-4 rounded-lg border-2 transition ${signupData.accountType === 'personal' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <UserCircle className={`h-8 w-8 mx-auto mb-2 ${signupData.accountType === 'personal' ? 'text-red-600' : 'text-gray-400'}`} />
                      <p className="font-semibold text-sm text-gray-900">Personal</p>
                      <p className="text-xs text-gray-500">Individual</p>
                    </button>
                  </div>
                </div>

                {signupData.accountType === 'business' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                    <input
                      type="text"
                      value={signupData.company}
                      onChange={(e) => setSignupData({ ...signupData, company: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                      placeholder="Your Business Name"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                      placeholder="John Doe"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
                <button onClick={handleSignup} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition">Create Account</button>
                <button onClick={() => setAuthMode('login')} className="w-full text-red-600 hover:text-red-700 text-sm font-medium">Already have an account? Login</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      {renderPage()}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12 border-t-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center mb-4">
            <img src={logo} alt="Direct Fit Automotive Solutions" className="h-12 md:h-16 w-auto" />
          </div>
          <p className="text-gray-400 text-center">© {new Date().getFullYear()} Direct Fit Automotive Solutions. All rights reserved.</p>
          <p className="text-sm text-gray-500 text-center mt-2">Demo Mode - Ready for supplier integration</p>
        </div>
      </footer>
    </div>
  );
}
