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
      'Interior Lighting': ['Dome Lights', 'Map Lights', 'Door Lights', 'Dashboard Lights', 'LED Interior Kits'],
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
  'Interior Lighting': '/category-images/headlights.png',
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
    <div className="flex-shrink-0 mr-4">
      {!failed ? (
        <img
          src={src}
          alt={name}
          className="h-20 w-20 sm:h-28 sm:w-28 object-contain rounded shadow-sm"
          onError={() => {
            if (idx < candidates.length - 1) setIdx(idx + 1);
            else setFailed(true);
          }}
        />
      ) : (
        // Neutral placeholder when no image is available (transparent, outlined)
        <div className="h-20 w-20 sm:h-28 sm:w-28 rounded border border-gray-200" />
      )}
    </div>
  );
}

// Mock data for parts (expanded with categories)
const mockParts = [
  { id: 1, partNumber: 'BRK-45892', name: 'Front Brake Pad Set', mainCategory: 'Performance Parts', subCategory: 'Brakes', detailCategory: 'Brake Pads', price: 89.99, stock: 24, fits: ['2018-2023 Honda Accord', '2019-2023 Honda Civic'], brand: 'Brembo' },
  { id: 2, partNumber: 'ENG-78234', name: 'Oil Filter', mainCategory: 'Performance Parts', subCategory: 'Engine Components', detailCategory: 'Engine Gaskets', price: 12.99, stock: 156, fits: ['2015-2023 Toyota Camry', '2016-2023 Toyota Corolla'], brand: 'Bosch' },
  { id: 3, partNumber: 'SUS-92341', name: 'Front Strut Assembly', mainCategory: 'Wheels & Tires', subCategory: 'Suspension', detailCategory: 'Struts', price: 245.50, stock: 8, fits: ['2017-2022 Ford F-150'], brand: 'Monroe' },
  { id: 4, partNumber: 'EXH-45678', name: 'Catalytic Converter', mainCategory: 'Performance Parts', subCategory: 'Exhaust Systems', detailCategory: 'Catalytic Converters', price: 425.00, stock: 12, fits: ['2016-2020 Chevrolet Silverado'], brand: 'Walker' },
  { id: 5, partNumber: 'ELE-23456', name: 'Alternator', mainCategory: 'Electrical & Electronics', subCategory: 'Charging System', detailCategory: 'Alternators', price: 189.99, stock: 18, fits: ['2015-2021 Nissan Altima'], brand: 'Denso' },
  { id: 6, partNumber: 'BRK-88901', name: 'Brake Rotor Set', mainCategory: 'Performance Parts', subCategory: 'Brakes', detailCategory: 'Brake Rotors', price: 125.00, stock: 32, fits: ['2018-2023 Honda Accord'], brand: 'Brembo' },
  { id: 7, partNumber: 'LED-19283', name: 'LED Headlight Bulbs H11', mainCategory: 'Lighting', subCategory: 'Headlights', detailCategory: 'Headlight Bulbs', price: 79.99, stock: 45, fits: ['2015-2023 Honda Civic', '2016-2023 Toyota Corolla'], brand: 'Philips' },
  { id: 8, partNumber: 'INT-55421', name: 'All-Weather Floor Mats', mainCategory: 'Interior Accessories', subCategory: 'Floor Protection', detailCategory: 'All-Weather Mats', price: 89.99, stock: 67, fits: ['2018-2023 Honda Accord'], brand: 'WeatherTech' },
  { id: 9, partNumber: 'EXT-77234', name: 'Rear Window Sunroof Deflector', mainCategory: 'Exterior Accessories', subCategory: 'Roof Accessories', detailCategory: 'Sunroof Deflectors', price: 45.99, stock: 23, fits: ['2017-2023 Toyota Camry'], brand: 'AVS' },
  { id: 10, partNumber: 'WHL-33890', name: '18" Chrome Alloy Wheel', mainCategory: 'Wheels & Tires', subCategory: 'Wheels', detailCategory: 'Chrome Wheels', price: 189.99, stock: 16, fits: ['2018-2023 Ford F-150'], brand: 'American Racing' },
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
const brandToLogo = (brand) => `/brands/${brandLogoFilename(brand)}.svg`;

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

function Header({ cartCount, isLoggedIn, currentUserName, onLoginClick, onLogoutClick, onOpenCart, onOpenOrders, setCurrentPage, onBack, canGoBack }) {
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
              {isLoggedIn && currentUserName === 'Admin' && (
                <button onClick={() => setCurrentPage('admin')} className="text-gray-300 hover:text-yellow-400 font-medium transition">Admin Panel</button>
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
            {isLoggedIn && currentUserName === 'Admin' && (
              <button onClick={() => { setCurrentPage('admin'); setMobileOpen(false); }} className="w-full text-left text-gray-200 py-2">Admin Panel</button>
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
            <h1 className="text-4xl font-bold mb-3">Direct Fit Automotive Solutions</h1>
            <p className="text-yellow-300 text-lg">Supplier-Direct Pricing for Automotive Professionals</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-red-600 text-center">
            <TrendingUp className="h-12 w-12 text-red-600 mx-auto mb-4" />
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
          <>
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

            <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Brands We Carry</h2>
              <p className="text-gray-600 mb-4">We partner with the industry's mo st trusted manufacturers to bring you quality parts you can rely on.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-stretch">
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
          </>
        )}
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
                  className="text-left p-3 bg-gray-50 rounded border border-gray-100 hover:bg-red-50 hover:border-red-200 transition"
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <SubcategoryImage name={subName} />

                    <div className="font-medium text-center sm:text-left">{subName}</div>
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

function ResultsPage({ searchResults, addToCart, calculatePrice, isLoggedIn }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Search Results ({searchResults.length} parts found)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map(part => (
          <div key={part.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-l-4 border-red-600">
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
              <button onClick={() => addToCart(part)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold">
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
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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
              <span className="text-2xl font-bold text-red-600">${cart.reduce((sum, item) => sum + (parseFloat(((1 + item.margin / 100) || 1) * item.price) * item.quantity || 0), 0).toFixed(2)}</span>
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

function AdminPage({ users, setUsers }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Admin Panel - User Management</h2>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Account Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Margin %</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Subscription</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.filter(u => u.type !== 'admin').map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.accountType === 'business' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {user.accountType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={user.margin}
                    onChange={(e) => {
                      const newMargin = parseFloat(e.target.value || 0);
                      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, margin: newMargin } : u));
                    }}
                    className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 bg-white text-gray-900"
                  /> %
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.subscription === 'active' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {user.subscription}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">Edit</button>
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
  /* --- Authentication / users --- */
  const [users, setUsers] = useState([
    { id: 1, email: 'demo@mechanic.com', password: 'demo123', name: 'Demo Mechanic Shop', margin: 15, type: 'user', accountType: 'business', subscription: 'active' },
    { id: 2, email: 'personal@email.com', password: 'demo123', name: 'John Doe', margin: 20, type: 'user', accountType: 'personal', subscription: 'active' },
    { id: 3, email: 'admin@directfit.com', password: 'admin123', name: 'Admin User', margin: 0, type: 'admin', accountType: 'admin', subscription: 'active' }
  ]);
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

  /* --- cart --- */
  const [cart, setCart] = useState([]);
  /* --- orders / order history (kept in-memory only; persistence to user account will be implemented later) --- */
  const [orders, setOrders] = useState([]);

  /* --- login/signup modal --- */
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupData, setSignupData] = useState({ email: '', password: '', name: '', company: '', accountType: 'business' });

  /* --- constants --- */
  const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

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

  // Persist orders to localStorage whenever they change
  // NOTE: persistence to localStorage removed — orders should be stored on the user's account/server
  // when that feature is available. Orders remain in-memory for the current session only.

  /* --- handlers --- */
  const handleLogin = () => {
    const user = users.find(u => u.email === loginEmail && u.password === loginPassword);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setShowAuthModal(false);
      setLoginEmail('');
      setLoginPassword('');
    } else {
      alert('Invalid credentials. Try demo@mechanic.com / demo123 or personal@email.com / demo123');
    }
  };

  const handleSignup = () => {
    const newUser = {
      id: users.length + 1,
      email: signupData.email,
      password: signupData.password,
      name: signupData.accountType === 'business' ? signupData.company : signupData.name,
      margin: signupData.accountType === 'business' ? 15 : 20,
      type: 'user',
      accountType: signupData.accountType,
      subscription: 'active'
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setShowAuthModal(false);
    setSignupData({ email: '', password: '', name: '', company: '', accountType: 'business' });
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
        return <ResultsPage searchResults={searchResults} addToCart={addToCart} calculatePrice={calculatePrice} isLoggedIn={isLoggedIn} />;
      case 'cart':
        return <CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} calculatePrice={calculatePrice} handleCheckout={handleCheckout} />;
      case 'orders':
        return <OrdersPage orders={orders} onReorder={handleReorder} />;
      case 'admin':
        return (isLoggedIn && currentUser && currentUser.type === 'admin') ? <AdminPage users={users} setUsers={setUsers} /> : <HomePage {...{
          searchType, setSearchType, year, setYear, make, setMake, model, setModel, years, makes, models, loadingMakes, loadingModels, partNumber, setPartNumber, handleSearch, isLoggedIn
        }} setCurrentPage={navigateTo} />;
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
            <img src={logo} alt="Direct Fit Automotive Solutions" className="h-16 w-auto" />
          </div>
          <p className="text-gray-400 text-center">© {new Date().getFullYear()} Direct Fit Automotive Solutions. All rights reserved.</p>
          <p className="text-sm text-gray-500 text-center mt-2">Demo Mode - Ready for supplier integration</p>
        </div>
      </footer>
    </div>
  );
}
