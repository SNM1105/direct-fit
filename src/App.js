import logo from './logo.png';
import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingCart, Package, TrendingUp, Shield, Truck, X, LogOut, Plus, Minus, Trash2, Wrench, Building2, UserCircle, Info } from 'lucide-react';

// Mock data for parts
const mockParts = [
  { id: 1, partNumber: 'BRK-45892', name: 'Front Brake Pad Set', category: 'Brakes', price: 89.99, stock: 24, fits: ['2018-2023 Honda Accord', '2019-2023 Honda Civic'] },
  { id: 2, partNumber: 'ENG-78234', name: 'Oil Filter', category: 'Engine', price: 12.99, stock: 156, fits: ['2015-2023 Toyota Camry', '2016-2023 Toyota Corolla'] },
  { id: 3, partNumber: 'SUS-92341', name: 'Front Strut Assembly', category: 'Suspension', price: 245.50, stock: 8, fits: ['2017-2022 Ford F-150'] },
  { id: 4, partNumber: 'EXH-45678', name: 'Catalytic Converter', category: 'Exhaust', price: 425.00, stock: 12, fits: ['2016-2020 Chevrolet Silverado'] },
  { id: 5, partNumber: 'ELE-23456', name: 'Alternator', category: 'Electrical', price: 189.99, stock: 18, fits: ['2015-2021 Nissan Altima'] },
  { id: 6, partNumber: 'BRK-88901', name: 'Brake Rotor Set', category: 'Brakes', price: 125.00, stock: 32, fits: ['2018-2023 Honda Accord'] },
];

// Brands we work with
const partnerBrands = [
  'AC Delco', 'Bosch', 'Brembo', 'Denso', 'Dorman', 'Gates', 
  'Monroe', 'Moog', 'NGK', 'Timken', 'Wagner', 'Walker',
  'Bilstein', 'KYB', 'Champion', 'Fel-Pro', 'Mahle', 'SKF'
];

export default function DirectFitAutomotive() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([
    { id: 1, email: 'demo@mechanic.com', password: 'demo123', name: 'Demo Mechanic Shop', margin: 15, type: 'user', accountType: 'business', subscription: 'active' },
    { id: 2, email: 'personal@email.com', password: 'demo123', name: 'John Doe', margin: 20, type: 'user', accountType: 'personal', subscription: 'active' },
    { id: 3, email: 'admin@directfit.com', password: 'admin123', name: 'Admin User', margin: 0, type: 'admin', accountType: 'admin', subscription: 'active' }
  ]);
  
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
  const [cart, setCart] = useState([]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupData, setSignupData] = useState({ email: '', password: '', name: '', company: '', accountType: 'business' });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const years = Array.from({length: 30}, (_, i) => (new Date().getFullYear() - i).toString());

  // Fetch car makes from API
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
        // Fallback to manual list
        setMakes(['Honda', 'Toyota', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen']);
      }
      setLoadingMakes(false);
    };
    fetchMakes();
  }, []);

  // Fetch models when make changes
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
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setShowAuthModal(false);
    setSignupData({ email: '', password: '', name: '', company: '', accountType: 'business' });
  };

  const handleSearch = () => {
    if (searchType === 'vehicle' && year && make) {
      const results = mockParts.filter(part => 
        part.fits.some(fit => fit.includes(make))
      );
      setSearchResults(results);
      setCurrentPage('results');
    } else if (searchType === 'part' && partNumber) {
      const results = mockParts.filter(part => 
        part.partNumber.toLowerCase().includes(partNumber.toLowerCase()) ||
        part.name.toLowerCase().includes(partNumber.toLowerCase())
      );
      setSearchResults(results);
      setCurrentPage('results');
    }
  };

  const addToCart = (part) => {
    if (!isLoggedIn) {
      alert('Please login to add items to cart');
      setShowAuthModal(true);
      return;
    }
    const existing = cart.find(item => item.id === part.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === part.id ? {...item, quantity: item.quantity + 1} : item
      ));
    } else {
      setCart([...cart, {...part, quantity: 1}]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? {...item, quantity: newQty} : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculatePrice = (basePrice) => {
    if (!currentUser) return basePrice;
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
    alert(`Order placed! Total: $${getCartTotal()}\n\nIn production, this would process payment via PayPal and send order to supplier.`);
    setCart([]);
    setCurrentPage('home');
  };

  // Pages
  const HomePage = () => (
    <div>
      <div className="bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">Direct Fit Automotive Solutions</h1>
            <p className="text-yellow-300 text-lg">Supplier-Direct Pricing for Automotive Professionals</p>
          </div>

          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setSearchType('vehicle')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                  searchType === 'vehicle' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Search by Vehicle
              </button>
              <button
                onClick={() => setSearchType('part')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                  searchType === 'part' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
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
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
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
                      {makes.map(m => <option key={m} value={m}>{m}</option>)}
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
                      {models.map(m => <option key={m} value={m}>{m}</option>)}
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
                  <input
                    type="text"
                    value={partNumber}
                    onChange={(e) => setPartNumber(e.target.value)}
                    placeholder="e.g., BRK-45892 or 'brake pad'"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                  />
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
          <div className="bg-gradient-to-r from-gray-900 to-red-900 rounded-lg p-8 text-center text-white shadow-xl">
            <Wrench className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Professional Membership Required</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Get access to supplier-direct pricing, bulk ordering, and dedicated account management. 
              Perfect for mechanics, body shops, dealerships, and auto enthusiasts.
            </p>
            <button 
              onClick={() => { setShowAuthModal(true); setAuthMode('signup'); }}
              className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
            >
              Request Access
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const AboutPage = () => (
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
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Brands We Carry</h2>
        <p className="text-gray-600 mb-8">
          We partner with the industry's most trusted manufacturers to bring you quality parts you can rely on.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {partnerBrands.map((brand, idx) => (
            <div 
              key={idx} 
              className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-center hover:border-red-600 hover:bg-red-50 transition"
            >
              <p className="font-semibold text-gray-800">{brand}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-6 text-center">And many more industry-leading brands...</p>
      </div>
    </div>
  );

  const ResultsPage = () => (
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
                {isLoggedIn && currentUser.margin > 0 && (
                  <p className="text-xs text-gray-500">Base: ${part.price.toFixed(2)} + {currentUser.margin}%</p>
                )}
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

  const CartPage = () => (
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
              <div key={item.id} className="p-6 flex items-center justify-between">
                <div className="flex-1">
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
            <button onClick={handleCheckout} className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const AdminPage = () => (
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
                      const newMargin = parseFloat(e.target.value);
                      setUsers(users.map(u => u.id === user.id ? {...u, margin: newMargin} : u));
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 border-b-4 border-red-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <button onClick={() => setCurrentPage('home')} className="flex items-center space-x-3 group">
                {/* Logo placeholder - replace with actual logo */}
                <div className="bg-white rounded-lg p-2 w-14 h-14 flex items-center justify-center">
                  <div className="text-red-600 font-bold text-xs text-center">
                    LOGO<br/>HERE
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-lg leading-tight">Direct Fit</div>
                  <div className="text-yellow-400 text-xs font-semibold">Automotive Solutions</div>
                </div>
              </button>
              <nav className="hidden md:flex space-x-6">
                <button onClick={() => setCurrentPage('home')} className="text-gray-300 hover:text-yellow-400 font-medium transition">
                  Home
                </button>
                <button onClick={() => setCurrentPage('about')} className="text-gray-300 hover:text-yellow-400 font-medium transition">
                  About
                </button>
                {isLoggedIn && currentUser.type === 'admin' && (
                  <button onClick={() => setCurrentPage('admin')} className="text-gray-300 hover:text-yellow-400 font-medium transition">
                    Admin Panel
                  </button>
                )}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setCurrentPage('cart')} className="relative text-gray-300 hover:text-yellow-400 transition">
                <ShoppingCart className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-300">Hi, <span className="text-yellow-400 font-semibold">{currentUser.name.split(' ')[0]}</span></span>
                  <button onClick={() => { setIsLoggedIn(false); setCurrentUser(null); setCart([]); }} className="text-red-500 hover:text-red-400 transition">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button onClick={() => { setShowAuthModal(true); setAuthMode('login'); }} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center font-semibold">
                  <User className="h-5 w-5 mr-2" />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

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
                <button onClick={handleLogin} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition">
                  Login
                </button>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700 font-semibold mb-1">Demo Accounts:</p>
                  <p className="text-xs text-gray-600">Business: demo@mechanic.com / demo123</p>
                  <p className="text-xs text-gray-600">Personal: personal@email.com / demo123</p>
                  <p className="text-xs text-gray-600">Admin: admin@directfit.com / admin123</p>
                </div>
                <button onClick={() => setAuthMode('signup')} className="w-full text-red-600 hover:text-red-700 text-sm font-medium">
                  Don't have an account? Sign up
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSignupData({...signupData, accountType: 'business'})}
                      className={`p-4 rounded-lg border-2 transition ${
                        signupData.accountType === 'business' 
                          ? 'border-red-600 bg-red-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Building2 className={`h-8 w-8 mx-auto mb-2 ${signupData.accountType === 'business' ? 'text-red-600' : 'text-gray-400'}`} />
                      <p className="font-semibold text-sm text-gray-900">Business</p>
                      <p className="text-xs text-gray-500">Shop/Dealership</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupData({...signupData, accountType: 'personal'})}
                      className={`p-4 rounded-lg border-2 transition ${
                        signupData.accountType === 'personal' 
                          ? 'border-red-600 bg-red-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
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
                      onChange={(e) => setSignupData({...signupData, company: e.target.value})}
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
                      onChange={(e) => setSignupData({...signupData, name: e.target.value})}
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
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input 
                    type="password" 
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
                <button onClick={handleSignup} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition">
                  Create Account
                </button>
                <button onClick={() => setAuthMode('login')} className="w-full text-red-600 hover:text-red-700 text-sm font-medium">
                  Already have an account? Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'results' && <ResultsPage />}
      {currentPage === 'cart' && <CartPage />}
      {currentPage === 'admin' && isLoggedIn && currentUser.type === 'admin' && <AdminPage />}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12 border-t-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white rounded-lg p-2 w-12 h-12 flex items-center justify-center">
              <div className="text-red-600 font-bold text-xs text-center">
                LOGO
              </div>
            </div>
            <div className="ml-3">
              <div className="text-white font-bold text-lg">Direct Fit Automotive Solutions</div>
              <div className="text-yellow-400 text-sm">Professional Auto Parts Supply</div>
            </div>
          </div>
          <p className="text-gray-400 text-center">© 2025 Direct Fit Automotive Solutions. All rights reserved.</p>
          <p className="text-sm text-gray-500 text-center mt-2">Demo Mode - Ready for supplier integration</p>
        </div>
      </footer>
    </div>
  );
}