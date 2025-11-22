// App.js
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
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
  Menu,
  Globe,
  Star,
  Car
} from 'lucide-react';
import logo from './logo.png';

// Backend API base URL
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Translations
const translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    admin: 'Admin',
    cart: 'Cart',
    orders: 'Orders',
    login: 'Login',
    logout: 'Logout',
    signup: 'Sign Up',
    
    // Search
    searchPlaceholder: 'Search by part number or name...',
    searchByVehicle: 'Search by Vehicle',
    searchByPart: 'Search by Part Number',
    year: 'Year',
    make: 'Make',
    model: 'Model',
    selectYear: 'Select Year',
    selectMake: 'Select Make',
    selectModel: 'Select Model',
    partNumber: 'Part Number',
    search: 'Search Parts',
    
    // Homepage
    heroTitle: 'Professional Automotive Parts Wholesale',
    heroSubtitle: 'Access over 1.2 million parts at wholesale prices. Built for mechanics, dealerships, and automotive professionals.',
    whyChooseUs: 'Why Choose Direct Fit',
    wholesalePricing: 'Wholesale Pricing',
    wholesaleDesc: 'Access genuine wholesale prices with your professional account',
    vastInventory: 'Vast Inventory',
    vastDesc: 'Over 1.2M parts covering all makes and models',
    fastShipping: 'Fast Shipping',
    fastDesc: 'Quick delivery to keep your business running',
    qualityGuarantee: 'Quality Guarantee',
    qualityDesc: 'All parts meet or exceed OEM specifications',
    professionalMembership: 'Professional Membership Required',
    professionalDesc: 'Our wholesale pricing is exclusively available to verified automotive professionals, repair shops, and dealerships.',
    trustedBrands: 'Trusted Brands We Carry',
    
    // Product
    addToCart: 'Add to Cart',
    inStock: 'in stock',
    onlyLeft: 'Only',
    left: 'left!',
    outOfStock: 'Out of Stock',
    fits: 'Fits',
    description: 'Description',
    vehicleFitment: 'Vehicle Fitment',
    brand: 'Brand',
    priceIncludesMargin: 'Price includes your customer margin',
    backToResults: 'Back to Results',
    
    // Cart
    shoppingCart: 'Shopping Cart',
    cartEmpty: 'Your cart is empty',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    total: 'Total',
    proceedToCheckout: 'Proceed to Checkout',
    
    // Orders
    orderHistory: 'Order History',
    noOrders: 'No orders yet. Your past orders will appear here after checkout.',
    order: 'Order',
    placedBy: 'Placed by',
    vehicle: 'Vehicle',
    items: 'items',
    reorder: 'Reorder',
    
    // Auth
    loginTitle: 'Login',
    createAccount: 'Create Account',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    company: 'Company',
    accountType: 'Account Type',
    business: 'Business',
    personal: 'Personal',
    shopDealership: 'Shop/Dealership',
    individual: 'Individual',
    demoAccounts: 'Demo Accounts:',
    alreadyHaveAccount: 'Already have an account? Login',
    noAccount: "Don't have an account? Sign up",
    
    // Categories
    partsCategories: 'Parts Categories',
    subcategories: 'subcategories',
    shopAll: 'Shop All',
    
    // Results
    searchResults: 'Search Results',
    partsFound: 'parts found',
    
    // Admin
    adminPanel: 'Admin Panel - User Management',
    bulkMarginAdjustment: 'Bulk Margin Adjustment',
    adjustAllMargins: 'Adjust all margins by:',
    applyToAll: 'Apply to All',
    updating: 'Updating...',
    marginsClampedNote: 'Note: Margins will be clamped between 0% and 100%',
    searchByNameOrEmail: 'Search by name or email...',
    user: 'User',
    margin: 'Margin %',
    created: 'Created',
    save: 'Save',
    saving: 'Saving...',
    
    // About
    aboutTitle: 'About Direct Fit Automotive Solutions',
    aboutIntro: 'Direct Fit Automotive Solutions is your premier source for high-quality automotive parts at wholesale prices. We bridge the gap between suppliers and automotive professionals, providing access to an extensive catalog of parts with unbeatable pricing and exceptional service.',
    
    // Features
    supplierDirect: 'Supplier Direct',
    supplierDirectDesc: 'Wholesale pricing with custom margins',
    realTimeStock: 'Real-Time Stock',
    realTimeStockDesc: 'Live inventory updates',
    warranty: 'Warranty',
    warrantyDesc: 'Full manufacturer coverage',
    
    // Brands section
    brandsWeCarry: 'Brands We Carry',
    brandsIntro: 'We partner with the industry\'s most trusted manufacturers to bring you quality parts you can rely on.',
    andMoreBrands: 'And many more industry-leading brands...',
    
    // Misc
    requestAccess: 'Request Access',
    getAccessDesc: 'Get access to supplier-direct pricing, bulk ordering, and dedicated account management.',
    partNumberOrDescription: 'Part Number or Description',
    
    // Contact
    contact: 'Contact',
    contactUs: 'Contact Us',
    contactTitle: 'Get in Touch',
    contactDesc: 'Our team is here to help with your parts needs',
    phone: 'Phone',
    businessHours: 'Business Hours',
    mondayFriday: 'Monday - Friday',
    saturday: 'Saturday',
    sundayClosed: 'Sunday: Closed',
    sendMessage: 'Send Message',
    message: 'Message',
    yourMessage: 'Your message...',
    
    // Garage
    myGarage: 'My Garage',
    garage: 'Garage',
    addVehicle: 'Add Vehicle',
    saveVehicle: 'Save Vehicle',
    removeVehicle: 'Remove Vehicle',
    selectVehicle: 'Select Vehicle',
    noVehicles: 'No vehicles saved. Add a vehicle to get started.',
    vehicleSaved: 'Vehicle saved to garage',
    
    // Filters
    filters: 'Filters',
    priceRange: 'Price Range',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    brandFilter: 'Brand',
    stockFilter: 'Availability',
    allBrands: 'All Brands',
    inStockOnly: 'In Stock Only',
    sortBy: 'Sort By',
    sortPriceLowHigh: 'Price: Low to High',
    sortPriceHighLow: 'Price: High to Low',
    sortNameAZ: 'Name: A-Z',
    sortNameZA: 'Name: Z-A',
    clearFilters: 'Clear Filters',
    applyFilters: 'Apply Filters',
    
    // Wishlist
    wishlist: 'Wishlist',
    addToWishlist: 'Add to Wishlist',
    removeFromWishlist: 'Remove from Wishlist',
    wishlistEmpty: 'Your wishlist is empty',
    moveToCart: 'Move to Cart',
    
    // Recently Viewed
    recentlyViewed: 'Recently Viewed',
    
    // Loading
    loading: 'Loading...',
    pleaseWait: 'Please wait...',
    
    // Errors
    error: 'Error',
    errorOccurred: 'An error occurred',
    tryAgain: 'Try Again',
  },
  fr: {
    // Navigation
    home: 'Accueil',
    about: 'À propos',
    admin: 'Admin',
    cart: 'Panier',
    orders: 'Commandes',
    login: 'Connexion',
    logout: 'Déconnexion',
    signup: "S'inscrire",
    
    // Search
    searchPlaceholder: 'Rechercher par numéro de pièce ou nom...',
    searchByVehicle: 'Rechercher par véhicule',
    searchByPart: 'Rechercher par numéro de pièce',
    year: 'Année',
    make: 'Marque',
    model: 'Modèle',
    selectYear: "Sélectionner l'année",
    selectMake: 'Sélectionner la marque',
    selectModel: 'Sélectionner le modèle',
    partNumber: 'Numéro de pièce',
    search: 'Rechercher des pièces',
    
    // Homepage
    heroTitle: 'Pièces automobiles professionnelles en gros',
    heroSubtitle: 'Accédez à plus de 1,2 million de pièces à prix de gros. Conçu pour les mécaniciens, les concessionnaires et les professionnels de l\'automobile.',
    whyChooseUs: 'Pourquoi choisir Direct Fit',
    wholesalePricing: 'Prix de gros',
    wholesaleDesc: 'Accédez aux prix de gros authentiques avec votre compte professionnel',
    vastInventory: 'Vaste inventaire',
    vastDesc: 'Plus de 1,2 million de pièces couvrant toutes les marques et modèles',
    fastShipping: 'Expédition rapide',
    fastDesc: 'Livraison rapide pour maintenir votre entreprise en marche',
    qualityGuarantee: 'Garantie de qualité',
    qualityDesc: 'Toutes les pièces respectent ou dépassent les spécifications OEM',
    professionalMembership: 'Adhésion professionnelle requise',
    professionalDesc: 'Nos prix de gros sont exclusivement disponibles pour les professionnels de l\'automobile vérifiés, les ateliers de réparation et les concessionnaires.',
    trustedBrands: 'Marques de confiance que nous proposons',
    
    // Product
    addToCart: 'Ajouter au panier',
    inStock: 'en stock',
    onlyLeft: 'Seulement',
    left: 'restant!',
    outOfStock: 'Rupture de stock',
    fits: 'Compatible avec',
    description: 'Description',
    vehicleFitment: 'Compatibilité du véhicule',
    brand: 'Marque',
    priceIncludesMargin: 'Le prix inclut votre marge client',
    backToResults: 'Retour aux résultats',
    
    // Cart
    shoppingCart: 'Panier d\'achat',
    cartEmpty: 'Votre panier est vide',
    orderSummary: 'Résumé de la commande',
    subtotal: 'Sous-total',
    total: 'Total',
    proceedToCheckout: 'Passer à la caisse',
    
    // Orders
    orderHistory: 'Historique des commandes',
    noOrders: 'Aucune commande pour le moment. Vos commandes passées apparaîtront ici après le paiement.',
    order: 'Commande',
    placedBy: 'Passée par',
    vehicle: 'Véhicule',
    items: 'articles',
    reorder: 'Recommander',
    
    // Auth
    loginTitle: 'Connexion',
    createAccount: 'Créer un compte',
    email: 'E-mail',
    password: 'Mot de passe',
    name: 'Nom',
    company: 'Entreprise',
    accountType: 'Type de compte',
    business: 'Entreprise',
    personal: 'Personnel',
    shopDealership: 'Atelier/Concessionnaire',
    individual: 'Individuel',
    demoAccounts: 'Comptes de démonstration:',
    alreadyHaveAccount: 'Vous avez déjà un compte? Connexion',
    noAccount: "Vous n'avez pas de compte? S'inscrire",
    
    // Categories
    partsCategories: 'Catégories de pièces',
    subcategories: 'sous-catégories',
    shopAll: 'Voir tout',
    
    // Results
    searchResults: 'Résultats de recherche',
    partsFound: 'pièces trouvées',
    
    // Admin
    adminPanel: 'Panneau d\'administration - Gestion des utilisateurs',
    bulkMarginAdjustment: 'Ajustement de marge en masse',
    adjustAllMargins: 'Ajuster toutes les marges de:',
    applyToAll: 'Appliquer à tous',
    updating: 'Mise à jour...',
    marginsClampedNote: 'Remarque: Les marges seront limitées entre 0% et 100%',
    searchByNameOrEmail: 'Rechercher par nom ou e-mail...',
    user: 'Utilisateur',
    margin: 'Marge %',
    created: 'Créé',
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    
    // About
    aboutTitle: 'À propos de Direct Fit Automotive Solutions',
    aboutIntro: 'Direct Fit Automotive Solutions est votre source principale de pièces automobiles de haute qualité à prix de gros. Nous comblons le fossé entre les fournisseurs et les professionnels de l\'automobile, en donnant accès à un vaste catalogue de pièces avec des prix imbattables et un service exceptionnel.',
    
    // Features
    supplierDirect: 'Fournisseur direct',
    supplierDirectDesc: 'Prix de gros avec marges personnalisées',
    realTimeStock: 'Stock en temps réel',
    realTimeStockDesc: 'Mises à jour d\'inventaire en direct',
    warranty: 'Garantie',
    warrantyDesc: 'Couverture complète du fabricant',
    
    // Brands section
    brandsWeCarry: 'Marques que nous proposons',
    brandsIntro: 'Nous nous associons avec les fabricants les plus fiables de l\'industrie pour vous offrir des pièces de qualité sur lesquelles vous pouvez compter.',
    andMoreBrands: 'Et bien d\'autres marques de l\'industrie...',
    
    // Misc
    requestAccess: 'Demander l\'accès',
    getAccessDesc: 'Accédez aux prix directs des fournisseurs, aux commandes en gros et à la gestion de compte dédiée.',
    partNumberOrDescription: 'Numéro de pièce ou description',
    
    // Contact
    contact: 'Contact',
    contactUs: 'Contactez-nous',
    contactTitle: 'Contactez-nous',
    contactDesc: 'Notre équipe est là pour vous aider avec vos besoins en pièces',
    phone: 'Téléphone',
    businessHours: 'Heures d\'ouverture',
    mondayFriday: 'Lundi - Vendredi',
    saturday: 'Samedi',
    sundayClosed: 'Dimanche: Fermé',
    sendMessage: 'Envoyer le message',
    message: 'Message',
    yourMessage: 'Votre message...',
    
    // Garage
    myGarage: 'Mon garage',
    garage: 'Garage',
    addVehicle: 'Ajouter un véhicule',
    saveVehicle: 'Enregistrer le véhicule',
    removeVehicle: 'Retirer le véhicule',
    selectVehicle: 'Sélectionner le véhicule',
    noVehicles: 'Aucun véhicule enregistré. Ajoutez un véhicule pour commencer.',
    vehicleSaved: 'Véhicule enregistré dans le garage',
    
    // Filters
    filters: 'Filtres',
    priceRange: 'Fourchette de prix',
    minPrice: 'Prix min',
    maxPrice: 'Prix max',
    brandFilter: 'Marque',
    stockFilter: 'Disponibilité',
    allBrands: 'Toutes les marques',
    inStockOnly: 'En stock uniquement',
    sortBy: 'Trier par',
    sortPriceLowHigh: 'Prix: Bas à élevé',
    sortPriceHighLow: 'Prix: Élevé à bas',
    sortNameAZ: 'Nom: A-Z',
    sortNameZA: 'Nom: Z-A',
    clearFilters: 'Effacer les filtres',
    applyFilters: 'Appliquer les filtres',
    
    // Wishlist
    wishlist: 'Liste de souhaits',
    addToWishlist: 'Ajouter à la liste de souhaits',
    removeFromWishlist: 'Retirer de la liste de souhaits',
    wishlistEmpty: 'Votre liste de souhaits est vide',
    moveToCart: 'Déplacer vers le panier',
    
    // Recently Viewed
    recentlyViewed: 'Récemment consultés',
    
    // Loading
    loading: 'Chargement...',
    pleaseWait: 'Veuillez patienter...',
    
    // Errors
    error: 'Erreur',
    errorOccurred: 'Une erreur s\'est produite',
    tryAgain: 'Réessayer',
  }
};

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

function PartSearchInput({ partNumber, setPartNumber, onEnter, mockParts, selectedVehicle }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (value) => {
    setPartNumber(value);
    
    if (value.trim().length >= 2) {
      // Generate suggestions from product names and part numbers
      let filtered = mockParts
        .filter(part => 
          part.name.toLowerCase().includes(value.toLowerCase()) ||
          part.partNumber.toLowerCase().includes(value.toLowerCase())
        );
      
      // If a vehicle is selected, only show parts that fit that vehicle
      if (selectedVehicle) {
        const vehicleFilters = [];
        if (selectedVehicle.year) vehicleFilters.push(selectedVehicle.year.toString());
        if (selectedVehicle.make) vehicleFilters.push(selectedVehicle.make.toString());
        if (selectedVehicle.model) vehicleFilters.push(selectedVehicle.model.toString());
        
        filtered = filtered.filter(part =>
          part.fits && part.fits.some(fit =>
            vehicleFilters.every(v => fit.toLowerCase().includes(v.toLowerCase()))
          )
        );
      }
      
      filtered = filtered.slice(0, 5); // Limit to 5 suggestions
      
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (part) => {
    setPartNumber(part.name);
    setShowSuggestions(false);
    onEnter(); // Trigger search immediately
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={partNumber}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            setShowSuggestions(false);
            onEnter();
          } else if (e.key === 'Escape') {
            setShowSuggestions(false);
          }
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        onFocus={() => {
          if (partNumber.trim().length >= 2 && suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder="e.g., BRK-45892 or 'brake pad'"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
      />
      
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((part) => (
            <button
              key={part.id}
              onClick={() => handleSelectSuggestion(part)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition"
            >
              <div className="font-semibold text-gray-900">{part.name}</div>
              <div className="text-sm text-gray-500">{part.partNumber} • {part.brand}</div>
              <div className="text-xs text-green-600 mt-1">
                {part.stock > 0 ? `${part.stock} in stock` : 'Out of stock'}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Breadcrumbs({ path, setCurrentPage, t }) {
  if (!path || path.length === 0) return null;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center space-x-2 text-sm">
          <button onClick={() => setCurrentPage('home')} className="text-gray-500 hover:text-red-600 transition">
            {t.home}
          </button>
          {path.map((crumb, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <span className="text-gray-400">/</span>
              {crumb.link ? (
                <button onClick={() => setCurrentPage(crumb.link)} className="text-gray-500 hover:text-red-600 transition">
                  {crumb.label}
                </button>
              ) : (
                <span className="text-gray-900 font-medium">{crumb.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Header({ cartCount, isLoggedIn, currentUserName, currentUser, onLoginClick, onLogoutClick, onOpenCart, onOpenOrders, setCurrentPage, onBack, canGoBack, language, onLanguageChange, t, onOpenGarage, onOpenWishlist, wishlistCount, onOpenProfile }) {
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
              <button onClick={() => setCurrentPage('home')} className="text-gray-300 hover:text-yellow-400 font-medium transition">{t.home}</button>
              <button onClick={() => setCurrentPage('about')} className="text-gray-300 hover:text-yellow-400 font-medium transition">{t.about}</button>
              <button onClick={() => setCurrentPage('contact')} className="text-gray-300 hover:text-yellow-400 font-medium transition">{t.contact}</button>
              {isLoggedIn && currentUser?.isAdmin && (
                <button onClick={() => setCurrentPage('admin')} className="text-gray-300 hover:text-yellow-400 font-medium transition">{t.admin}</button>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <button 
              onClick={onLanguageChange} 
              className="text-gray-300 hover:text-yellow-400 transition flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-800"
              title={language === 'en' ? 'Switch to French' : 'Passer à l\'anglais'}
            >
              <Globe className="h-5 w-5" />
              <span className="text-sm font-medium uppercase">{language === 'en' ? 'FR' : 'EN'}</span>
            </button>

            {isLoggedIn && (
              <>
                <button onClick={onOpenGarage} className="hidden md:block text-gray-300 hover:text-yellow-400 transition p-2" title={t.myGarage}>
                  <Car className="h-5 w-5" />
                </button>
                <button onClick={onOpenWishlist} className="hidden md:block relative text-gray-300 hover:text-yellow-400 transition p-2" title={t.wishlist}>
                  <Star className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              </>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-300 p-2 rounded-md hover:bg-gray-800">
              <Menu className="h-6 w-6" />
            </button>

            <button onClick={onOpenCart} className="relative text-gray-300 hover:text-yellow-400 transition p-2">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            {isLoggedIn && (
              <button onClick={onOpenOrders} className="text-gray-300 hover:text-yellow-400 transition p-2 hidden sm:inline-flex">
                <Package className="h-5 w-5" />
              </button>
            )}
            {isLoggedIn ? (
              <div className="hidden sm:flex items-center space-x-3">
                <span className="text-sm text-gray-300">Hi, <span className="text-yellow-400 font-semibold">{currentUserName}</span></span>
                <button onClick={onOpenProfile} className="text-gray-300 hover:text-yellow-400 transition p-2" title={t.profile || 'Profile'}>
                  <User className="h-5 w-5" />
                </button>
                <button onClick={onLogoutClick} className="text-red-500 hover:text-red-400 transition">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button onClick={onLoginClick} className="hidden sm:inline-flex bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition items-center font-semibold">
                <User className="h-5 w-5 mr-2" />
                {t.login}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 py-3 space-y-2">
            <button onClick={() => { setCurrentPage('home'); setMobileOpen(false); }} className="w-full text-left text-gray-200 py-2">{t.home}</button>
            <button onClick={() => { setCurrentPage('about'); setMobileOpen(false); }} className="w-full text-left text-gray-200 py-2">{t.about}</button>
            <button onClick={() => { setCurrentPage('contact'); setMobileOpen(false); }} className="w-full text-left text-gray-200 py-2">{t.contact}</button>
            {isLoggedIn && currentUser?.isAdmin && (
              <button onClick={() => { setCurrentPage('admin'); setMobileOpen(false); }} className="w-full text-left text-gray-200 py-2">{t.admin}</button>
            )}
            {isLoggedIn ? (
              <div className="pt-2 border-t border-gray-700">
                <button onClick={() => { onOpenGarage(); setMobileOpen(false); }} className="w-full text-left text-gray-200 py-2">{t.myGarage}</button>
                <button onClick={() => { onOpenWishlist(); setMobileOpen(false); }} className="w-full text-left text-gray-200 py-2">{t.wishlist}</button>
                <button onClick={() => { onOpenProfile(); setMobileOpen(false); }} className="w-full text-left text-gray-200 py-2">{t.profile || 'Profile'}</button>
                <button onClick={onOpenOrders} className="w-full text-left text-gray-200 py-2">{t.orders}</button>
                <button onClick={onLogoutClick} className="w-full text-left text-gray-200 py-2">{t.logout}</button>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-700">
                <button onClick={() => { onLoginClick(); setMobileOpen(false); }} className="w-full text-left text-gray-200 py-2">{t.login}</button>
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
    isLoggedIn,
    t,
    mockParts,
    selectedVehicle,
    setSelectedVehicle,
    language
  } = props;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">{t.heroTitle}</h1>
            <p className="text-yellow-300 text-base sm:text-lg md:text-xl">{t.heroSubtitle}</p>
          </div>

          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
              <button
                onClick={() => setSearchType('vehicle')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${searchType === 'vehicle' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {t.searchByVehicle}
              </button>
              <button
                onClick={() => setSearchType('part')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${searchType === 'part' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {t.searchByPart}
              </button>
            </div>

            {searchType === 'vehicle' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.year}</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="">{t.selectYear}</option>
                      {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.make}</label>
                    <select
                      value={make}
                      onChange={(e) => { setMake(e.target.value); setModel(''); }}
                      disabled={loadingMakes}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="">{loadingMakes ? 'Loading...' : t.selectMake}</option>
                      {makes.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.model}</label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      disabled={!make || loadingModels}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="">{loadingModels ? 'Loading...' : !make ? t.selectMake + ' first' : t.selectModel}</option>
                      {models.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                {(year || make || model) && (
                  <button 
                    onClick={() => { setYear(''); setMake(''); setModel(''); }}
                    className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition flex items-center justify-center"
                    title={language === 'en' ? 'Clear vehicle selection' : 'Effacer la sélection du véhicule'}
                  >
                    <X className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Clear Vehicle' : 'Effacer le véhicule'}
                  </button>
                )}

                <button onClick={handleSearch} className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center">
                  <Search className="h-5 w-5 mr-2" />
                  {t.search}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedVehicle && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Car className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {language === 'en' ? 'Searching for: ' : 'Recherche pour: '}
                        <span className="text-blue-600">{selectedVehicle.full}</span>
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedVehicle(null)}
                      className="text-gray-500 hover:text-gray-700"
                      title={language === 'en' ? 'Clear vehicle filter' : 'Effacer le filtre de véhicule'}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.partNumberOrDescription}</label>
                  <PartSearchInput partNumber={partNumber} setPartNumber={setPartNumber} onEnter={handleSearch} mockParts={mockParts} selectedVehicle={selectedVehicle} />
                </div>
                {selectedVehicle && (
                  <button 
                    onClick={() => setSelectedVehicle(null)}
                    className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition flex items-center justify-center"
                    title={language === 'en' ? 'Clear vehicle selection' : 'Effacer la sélection du véhicule'}
                  >
                    <X className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Clear Vehicle' : 'Effacer le véhicule'}
                  </button>
                )}
                <button onClick={handleSearch} className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center">
                  <Search className="h-5 w-5 mr-2" />
                  {t.search}
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
            <h3 className="font-semibold mb-2">{t.supplierDirect}</h3>
            <p className="text-sm text-gray-600">{t.supplierDirectDesc}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-yellow-500 text-center">
            <Package className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">{t.realTimeStock}</h3>
            <p className="text-sm text-gray-600">{t.realTimeStockDesc}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-gray-800 text-center">
            <Truck className="h-12 w-12 text-gray-800 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">{t.fastShipping}</h3>
            <p className="text-sm text-gray-600">{t.fastDesc}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-red-600 text-center">
            <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">{t.warranty}</h3>
            <p className="text-sm text-gray-600">{t.warrantyDesc}</p>
          </div>
        </div>

        {!isLoggedIn && (
          <div className="bg-gradient-to-r from-gray-900 to-red-900 rounded-lg p-8 text-center text-white shadow-xl">
            <Wrench className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">{t.professionalMembership}</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {t.getAccessDesc}
            </p>
            <button className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition" onClick={() => setCurrentPage('home')}>
              {t.requestAccess}
            </button>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.brandsWeCarry}</h2>
          <p className="text-gray-600 mb-4">{t.brandsIntro}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 items-stretch">
            {partnerBrands.map((brand, idx) => (
              <div key={idx} className="flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200 p-4 hover:border-red-600 transition">
                <div className="h-12 w-full flex items-center justify-center">
                  <BrandLogo brand={brand} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-6 text-center">{t.andMoreBrands}</p>
        </div>
      </div>
    </div>
  );
}

function AboutPage({ t }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{t.aboutTitle}</h1>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p className="text-lg">
              {t.aboutIntro}
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

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-red-600">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-8 w-8 text-red-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">{t.wholesalePricing}</h3>
            </div>
            <p className="text-gray-600">{t.wholesaleDesc}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-yellow-500">
            <div className="flex items-center mb-4">
              <Package className="h-8 w-8 text-yellow-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">{t.vastInventory}</h3>
            </div>
            <p className="text-gray-600">{t.vastDesc}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-gray-800">
            <div className="flex items-center mb-4">
              <Truck className="h-8 w-8 text-gray-800 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">{t.fastShipping}</h3>
            </div>
            <p className="text-gray-600">{t.fastDesc}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-red-600">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-red-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">{t.qualityGuarantee}</h3>
            </div>
            <p className="text-gray-600">{t.qualityDesc}</p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-r from-gray-900 to-red-900 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">{t.whyChooseUs}</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">1.2M+</div>
              <p className="text-gray-300">Parts Available</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
              <p className="text-gray-300">Online Ordering</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">100%</div>
              <p className="text-gray-300">Quality Guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactPage({ t, language }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Wire this to backend email service (SendGrid, AWS SES, etc.)
    // For now, just logs to console
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{t.contactUs}</h1>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.contactTitle}</h3>
                <p className="text-gray-600">{t.getAccessDesc}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t.phone}</h4>
                <p className="text-gray-700 text-lg">1-XXX-XXX-XXXX</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                <p className="text-gray-700">support@directfitauto.com</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t.businessHours}</h4>
                <p className="text-gray-700">{t.mondayFriday}: 8:00 AM - 6:00 PM EST</p>
                <p className="text-gray-700">{t.saturday}: 9:00 AM - 3:00 PM EST</p>
                <p className="text-gray-700">{t.sundayClosed}</p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.sendMessage}</h3>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg">
                  ✓ {language === 'en' ? 'Message sent successfully!' : 'Message envoyé avec succès!'}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.name}</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.message}</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      placeholder={t.yourMessage}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    {t.sendMessage}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoriesPage({ categories, onSelectCategory, year, setYear, make, setMake, model, setModel, years, makes, models, loadingMakes, loadingModels, t }) {
  return (
    <div className="bg-gray-50 min-h-screen">
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
          t={t}
        />
      </div>
      <h2 className="text-3xl font-bold mb-6">{t.partsCategories}</h2>
      <div className="space-y-8">
        {Object.entries(categories).map(([catName, catData]) => (
          <section key={catName} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{catData.icon || '📦'}</div>
                <div>
                  <h3 className="text-xl font-semibold">{catName}</h3>
                  <p className="text-sm text-gray-600">{Object.keys(catData.subcategories).length} {t.subcategories}</p>
                </div>
              </div>
              <div>
                <button onClick={() => onSelectCategory(catName)} className="text-red-600 hover:text-red-800 text-sm font-medium">{t.shopAll} →</button>
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
    </div>
  );
}

function VehicleSelectorWrapper({ year, setYear, make, setMake, model, setModel, years, makes, models, loadingMakes, loadingModels, t }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t.year}</label>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
        >
          <option value="">{t.selectYear}</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t.make}</label>
        <select
          value={make}
          onChange={(e) => { setMake(e.target.value); setModel(''); }}
          disabled={loadingMakes}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
        >
          <option value="">{loadingMakes ? 'Loading...' : t.selectMake}</option>
          {makes.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t.model}</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={!make || loadingModels}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
        >
          <option value="">{loadingModels ? 'Loading...' : !make ? t.selectMake + ' first' : t.selectModel}</option>
          {models.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
    </div>
  );
}

function ProductDetailPage({ product, addToCart, addToWishlist, calculatePrice, isLoggedIn, onBack, t }) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Product not found</p>
      </div>
      </div>
    );
  }

  const images = product.images || ['/product-images/placeholder.jpg'];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={onBack} className="mb-6 text-red-600 hover:text-red-700 font-medium flex items-center">
        <span className="mr-2">←</span> {t.backToResults}
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
              <p className="text-sm text-gray-600">{t.brand}: <span className="font-semibold">{product.brand}</span></p>
            </div>

            <div className="mb-6">
              <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.stock > 10 ? `${product.stock} ${t.inStock}` : product.stock > 0 ? `${t.onlyLeft} ${product.stock} ${t.left}!` : t.outOfStock}
              </span>
            </div>

            <div className="mb-6 pb-6 border-b">
              <p className="text-4xl font-bold text-red-600">${calculatePrice(product.price)}</p>
              <p className="text-sm text-gray-500 mt-1">{t.priceIncludesMargin}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{t.description}</h2>
              <p className="text-gray-700 leading-relaxed">{product.description || 'No description available.'}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{t.vehicleFitment}</h2>
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
              className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed mb-3"
            >
              {product.stock === 0 ? t.outOfStock : t.addToCart}
            </button>

            {isLoggedIn && addToWishlist && (
              <button 
                onClick={() => addToWishlist(product)} 
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-semibold flex items-center justify-center space-x-2"
              >
                <Star className="h-5 w-5" />
                <span>{t.addToWishlist}</span>
              </button>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function ResultsPage({ searchResults, addToCart, calculatePrice, isLoggedIn, onViewProduct, t }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">{t.searchResults} ({searchResults.length} {t.partsFound})</h2>
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
                {part.stock} {t.inStock}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{t.fits}: {part.fits[0]}</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-red-600">${calculatePrice(part.price)}</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); addToCart(part); }} 
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                {t.addToCart}
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

function CartPage({ cart, updateQuantity, removeFromCart, calculatePrice, handleCheckout, t }) {
  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (parseFloat(calculatePrice(item.price)) * item.quantity), 0).toFixed(2);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl md:max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">{t.shoppingCart}</h2>
      {cart.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{t.cartEmpty}</p>
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
              <span className="text-lg font-semibold">{t.total}:</span>
              <span className="text-2xl font-bold text-red-600">${getCartTotal()}</span>
            </div>
            <button onClick={handleCheckout} className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">{t.proceedToCheckout}</button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

function OrdersPage({ orders, onReorder, t }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">{t.orderHistory}</h2>
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{t.noOrders}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{t.order} #{order.id}</p>
                  <p className="font-semibold text-lg">{new Date(order.date).toLocaleString()}</p>
                  {order.user && (
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      <p><span className="font-medium">Name:</span> {order.user.name}</p>
                      {order.user.email && <p><span className="font-medium">Email:</span> {order.user.email}</p>}
                    </div>
                  )}
                  {order.vehicle && (order.vehicle.year || order.vehicle.make || order.vehicle.model) && (
                    <p className="text-sm text-gray-600 mt-2">{t.vehicle}: {`${order.vehicle.year || ''} ${order.vehicle.make || ''} ${order.vehicle.model || ''}`}</p>
                  )}
                  {order.shipping_address && (
                    <div className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                      <p className="font-medium">Shipping Address:</p>
                      {order.shipping_address.streetAddress && <p>{order.shipping_address.streetAddress}</p>}
                      {order.shipping_address.city && <p>{order.shipping_address.city}, {order.shipping_address.stateProvince} {order.shipping_address.postalCode}</p>}
                      {order.shipping_address.country && <p>{order.shipping_address.country}</p>}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-red-600">${order.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{order.items.length} {t.items}</p>
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
                  <button onClick={() => onReorder(order.items)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">{t.reorder}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

function GarageModal({ isOpen, onClose, savedVehicles, setSavedVehicles, year, setYear, make, setMake, model, setModel, years, makes, models, loadingMakes, loadingModels, t, language, onSelectVehicle, onAddVehicle, onRemoveVehicle }) {
  if (!isOpen) return null;

  const handleAddVehicle = async () => {
    if (!year || !make || !model) {
      alert(language === 'en' ? 'Please select year, make, and model' : 'Veuillez sélectionner l\'année, la marque et le modèle');
      return;
    }

    const vehicleString = `${year} ${make} ${model}`;
    if (savedVehicles.some(v => v.full === vehicleString)) {
      alert(language === 'en' ? 'Vehicle already in garage' : 'Véhicule déjà dans le garage');
      return;
    }

    const newVehicle = { year, make, model, full: vehicleString };
    await onAddVehicle(newVehicle);
    
    // Reset form
    setYear('');
    setMake('');
    setModel('');
  };

  const handleRemoveVehicle = async (vehicle) => {
    await onRemoveVehicle(vehicle);
  };

  const handleSelectVehicle = (vehicle) => {
    setYear(vehicle.year);
    setMake(vehicle.make);
    setModel(vehicle.model);
    onSelectVehicle && onSelectVehicle(vehicle);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{t.myGarage}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Add Vehicle Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.addVehicle}</h3>
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
              t={t}
            />
            <button
              onClick={handleAddVehicle}
              className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              {t.saveVehicle}
            </button>
          </div>

          {/* Saved Vehicles List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.garage} ({savedVehicles.length})</h3>
            {savedVehicles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Car className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>{t.noVehicles}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedVehicles.map((vehicle, index) => (
                  <div key={vehicle.id || index} className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-4 hover:border-red-500 transition">
                    <div className="flex items-center space-x-3">
                      <Car className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-gray-900">{vehicle.full}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSelectVehicle(vehicle)}
                        className="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm font-medium"
                      >
                        {t.selectVehicle}
                      </button>
                      <button
                        onClick={() => handleRemoveVehicle(vehicle)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function WishlistPage({ wishlist, addToCart, removeFromWishlist, setCurrentPage, t }) {
  const moveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t.wishlist}</h1>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Star className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg">{t.wishlistEmpty}</p>
            <button
              onClick={() => setCurrentPage('categories')}
              className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              {t.shopAll}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <img
                    src={product.images?.[0] || '/product-placeholder.jpg'}
                    alt={product.name}
                    className="max-h-full object-contain"
                    onError={(e) => { e.target.src = '/product-placeholder.jpg'; }}
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{product.partNumber}</p>
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  
                  {product.stock > 0 ? (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-2">
                      {t.inStock}
                    </span>
                  ) : (
                    <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mb-2">
                      {t.outOfStock}
                    </span>
                  )}

                  <p className="text-xl font-bold text-red-600 mb-3">${product.price?.toFixed(2)}</p>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => moveToCart(product)}
                      disabled={product.stock === 0}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                    >
                      {t.moveToCart}
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfilePage({ currentUser, userAddress, setUserAddress, onSave, t, language }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleAddressChange = (field, value) => {
    setUserAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      setSaveMessage(language === 'en' ? 'Profile saved successfully!' : 'Profil enregistré avec succès!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage(language === 'en' ? 'Error saving profile' : 'Erreur lors de l\'enregistrement');
    }
    setIsSaving(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{language === 'en' ? 'My Profile' : 'Mon profil'}</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {/* User Info */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{language === 'en' ? 'Account Information' : 'Informations du compte'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{language === 'en' ? 'Name' : 'Nom'}</label>
                <input
                  type="text"
                  value={currentUser?.name || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{language === 'en' ? 'Email' : 'Email'}</label>
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{language === 'en' ? 'Shipping Address' : 'Adresse de livraison'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{language === 'en' ? 'Street Address' : 'Adresse'}</label>
                <input
                  type="text"
                  value={userAddress.streetAddress}
                  onChange={(e) => handleAddressChange('streetAddress', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder={language === 'en' ? '123 Main St' : '123 rue Principale'}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{language === 'en' ? 'City' : 'Ville'}</label>
                  <input
                    type="text"
                    value={userAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{language === 'en' ? 'State/Province' : 'État/Province'}</label>
                  <input
                    type="text"
                    value={userAddress.stateProvince}
                    onChange={(e) => handleAddressChange('stateProvince', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{language === 'en' ? 'Postal Code' : 'Code postal'}</label>
                  <input
                    type="text"
                    value={userAddress.postalCode}
                    onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{language === 'en' ? 'Country' : 'Pays'}</label>
                  <input
                    type="text"
                    value={userAddress.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t pt-6">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400"
            >
              {isSaving ? (language === 'en' ? 'Saving...' : 'Enregistrement...') : (language === 'en' ? 'Save Profile' : 'Enregistrer le profil')}
            </button>
            {saveMessage && (
              <p className={`mt-2 text-center font-medium ${saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {saveMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminPage({ t }) {
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
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">{t.adminPanel}</h2>
      
      {/* Bulk Margin Adjustment */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">{t.bulkMarginAdjustment}</h3>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">{t.adjustAllMargins}:</span>
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
            {bulkUpdating ? t.updating : t.applyToAll}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">{t.marginsClampedNote}</p>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchByNameOrEmail}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
        />
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">{t.user}</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">{t.accountType}</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">{t.margin} %</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">{t.created}</th>
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
                      {updating === user.id ? t.saving : t.save}
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
   Payment Form Component
   ---------------------- */

function PaymentForm({ amount, onSuccess, onCancel, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentMethodError) {
        setError(paymentMethodError.message);
        setProcessing(false);
        return;
      }

      // Call success callback with payment method
      await onSuccess(paymentMethod);
      
    } catch (err) {
      setError(err.message);
      onError(err);
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="bg-white p-3 border border-gray-300 rounded">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Total:</strong> ${amount.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Test cards: 4242 4242 4242 4242 (Success) | 4000 0000 0000 0002 (Decline)
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
        >
          {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
}

/* ----------------------
   Main App
   ---------------------- */

export default function DirectFitAutomotive() {
  /* --- Authentication --- */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  /* --- User Address --- */
  const [userAddress, setUserAddress] = useState({
    streetAddress: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: ''
  });

  /* --- Language --- */
  const [language, setLanguage] = useState('en');
  const t = translations[language];

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
  
  /* --- Wishlist --- */
  const [wishlist, setWishlist] = useState([]);
  
  /* --- Recently Viewed --- */
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  
  /* --- Vehicle Garage --- */
  const [savedVehicles, setSavedVehicles] = useState([]);
  const [showGarageModal, setShowGarageModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  /* --- Filters & Sort --- */
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [brandFilter, setBrandFilter] = useState('');
  const [stockFilter, setStockFilter] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  
  /* --- Loading States --- */
  const [isSearching, setIsSearching] = useState(false);
  const [orders, setOrders] = useState([]);

  /* --- login/signup modal --- */
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupData, setSignupData] = useState({ email: '', password: '', name: '', company: '', accountType: 'business' });

  /* --- payment modal --- */
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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
          
          // Load cart, wishlist, and garage from backend
          await loadUserData(token);
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

  // Helper function to load user data from backend
  const loadUserData = async (token) => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Load user profile (including address)
      const profileResponse = await fetch(`${API_BASE}/auth/profile`, { headers });
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.success && profileData.user) {
          setUserAddress({
            streetAddress: profileData.user.street_address || '',
            city: profileData.user.city || '',
            stateProvince: profileData.user.state_province || '',
            postalCode: profileData.user.postal_code || '',
            country: profileData.user.country || ''
          });
        }
      }

      // Load cart
      const cartResponse = await fetch(`${API_BASE}/cart`, { headers });
      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        if (cartData.success) {
          // Convert database format to frontend format
          const formattedCart = cartData.cart.map(item => ({
            id: item.part_id,
            partNumber: item.part_number,
            name: item.name,
            price: parseFloat(item.price),
            quantity: item.quantity,
            stock: item.stock,
            brand: item.brand,
            mainCategory: item.main_category,
            subCategory: item.sub_category,
            detailCategory: item.detail_category,
            fits: item.fits,
            images: item.images,
            description: item.description,
            dbId: item.id // Keep track of database ID for updates
          }));
          setCart(formattedCart);
        }
      }

      // Load wishlist
      const wishlistResponse = await fetch(`${API_BASE}/wishlist`, { headers });
      if (wishlistResponse.ok) {
        const wishlistData = await wishlistResponse.json();
        if (wishlistData.success) {
          const formattedWishlist = wishlistData.wishlist.map(item => ({
            id: item.part_id,
            partNumber: item.part_number,
            name: item.name,
            price: parseFloat(item.price),
            stock: item.stock,
            brand: item.brand,
            mainCategory: item.main_category,
            subCategory: item.sub_category,
            detailCategory: item.detail_category,
            fits: item.fits,
            images: item.images,
            description: item.description
          }));
          setWishlist(formattedWishlist);
        }
      }

      // Load garage vehicles
      const garageResponse = await fetch(`${API_BASE}/garage`, { headers });
      if (garageResponse.ok) {
        const garageData = await garageResponse.json();
        if (garageData.success) {
          // Map database fields to frontend format
          const vehicles = garageData.vehicles.map(v => ({
            ...v,
            full: v.full || `${v.year} ${v.make} ${v.model}`
          }));
          setSavedVehicles(vehicles);
        }
      }

      // Load orders
      const ordersResponse = await fetch(`${API_BASE}/orders`, { headers });
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        if (ordersData.success) {
          // Format orders from database
          const formattedOrders = ordersData.orders.map(order => ({
            id: order.order_id || order.id,
            date: order.created_at,
            user: order.user || currentUser,
            vehicle: order.vehicle || {},
            items: order.items || [],
            total: order.total || 0
          }));
          setOrders(formattedOrders);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

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
    const hasVehicle = Boolean(selectedVehicle || year || make || model);
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
        // Use selectedVehicle if available, otherwise use manual inputs
        const currentYear = selectedVehicle?.year || year;
        const currentMake = selectedVehicle?.make || make;
        const currentModel = selectedVehicle?.model || model;
        
        if (currentYear) vehicleFilters.push(currentYear.toString());
        if (currentMake) vehicleFilters.push(currentMake.toString());
        if (currentModel) vehicleFilters.push(currentModel.toString());

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

  const addToCart = async (part) => {
    if (!isLoggedIn) {
      alert('Please login to add items to cart');
      setShowAuthModal(true);
      setAuthMode('login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(part)
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Reload cart from backend
        await loadUserData(token);
      } else {
        alert(data.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const updateQuantity = async (id, delta) => {
    try {
      const token = localStorage.getItem('token');
      const item = cart.find(i => i.id === id);
      if (!item) return;

      // Safety check - if dbId is not set, reload cart first
      if (!item.dbId) {
        console.warn('Item missing dbId, reloading cart...');
        await loadUserData(token);
        // Try again with reloaded data
        const reloadedItem = cart.find(i => i.id === id);
        if (!reloadedItem || !reloadedItem.dbId) {
          alert('Failed to update cart - item data missing');
          return;
        }
      }

      const newQuantity = item.quantity + delta;
      
      if (newQuantity <= 0) {
        await removeFromCart(id);
        return;
      }

      const response = await fetch(`${API_BASE}/cart/${item.dbId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update local state optimistically
        setCart(prev => prev.map(i => 
          i.id === id ? { ...i, quantity: newQuantity } : i
        ));
      } else {
        alert(data.error || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const removeFromCart = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const item = cart.find(i => i.id === id);
      if (!item) return;

      // Safety check - if dbId is not set, reload cart first
      if (!item.dbId) {
        console.warn('Item missing dbId, reloading cart...');
        await loadUserData(token);
        // Try again with reloaded data
        const reloadedItem = cart.find(i => i.id === id);
        if (!reloadedItem || !reloadedItem.dbId) {
          alert('Failed to remove from cart - item data missing');
          return;
        }
      }

      const response = await fetch(`${API_BASE}/cart/${item.dbId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update local state optimistically
        setCart(prev => prev.filter(i => i.id !== id));
      } else {
        alert(data.error || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Failed to remove item');
    }
  };

  const addToWishlist = async (product) => {
    if (!isLoggedIn) {
      alert('Please login to add items to wishlist');
      setShowAuthModal(true);
      setAuthMode('login');
      return;
    }

    if (wishlist.some(item => item.id === product.id)) {
      alert(language === 'en' ? 'Already in wishlist' : 'Déjà dans la liste de souhaits');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/wishlist`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update local state optimistically
        setWishlist(prev => [...prev, product]);
      } else {
        alert(data.error || 'Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update local state optimistically
        setWishlist(prev => prev.filter(item => item.id !== productId));
      } else {
        alert(data.error || 'Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove from wishlist');
    }
  };

  const handleAddVehicle = async (vehicle) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/garage`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vehicle)
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Ensure the vehicle has a full description
        const vehicleWithFull = {
          ...data.vehicle,
          full: data.vehicle.full || `${data.vehicle.year} ${data.vehicle.make} ${data.vehicle.model}`
        };
        // Update local state optimistically
        setSavedVehicles(prev => [...prev, vehicleWithFull]);
      } else {
        alert(data.error || 'Failed to add vehicle');
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Failed to add vehicle');
    }
  };

  const handleRemoveVehicle = async (vehicle) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/garage/${vehicle.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update local state optimistically
        setSavedVehicles(prev => prev.filter(v => v.id !== vehicle.id));
      } else {
        alert(data.error || 'Failed to remove vehicle');
      }
    } catch (error) {
      console.error('Error removing vehicle:', error);
      alert('Failed to remove vehicle');
    }
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
    // Ensure basePrice is a valid number
    const price = parseFloat(basePrice);
    if (isNaN(price) || price === undefined || price === null) {
      return '0.00';
    }
    if (!currentUser) return price.toFixed(2);
    const adjustedPrice = price * (1 + (currentUser.margin || 0) / 100);
    return adjustedPrice.toFixed(2);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (parseFloat(calculatePrice(item.price)) * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Validate address if logged in
    if (currentUser && (!userAddress.streetAddress || !userAddress.city || !userAddress.postalCode || !userAddress.country)) {
      alert('Please complete your shipping address in your profile before checkout');
      navigateTo('profile');
      return;
    }

    // Show payment modal
    setShowPaymentModal(true);
    setPaymentError(null);
    setPaymentSuccess(false);
  };

  const handlePaymentSuccess = async (paymentMethod) => {
    setPaymentProcessing(true);
    
    try {
      const token = localStorage.getItem('token');
      const total = parseFloat(getCartTotal());
      const orderId = `ORD-${Date.now()}`;
      
      // Create payment intent
      const intentResponse = await fetch(`${API_BASE}/payment/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: total,
          orderId: orderId,
          description: `Order for ${cart.length} items`
        })
      });

      const intentData = await intentResponse.json();
      
      if (!intentResponse.ok || !intentData.clientSecret) {
        throw new Error(intentData.error || 'Failed to create payment intent');
      }

      // Confirm payment with Stripe
      const stripe = await stripePromise;
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        {
          payment_method: paymentMethod.id
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment not completed');
      }

      // Save order with payment confirmation
      const orderResponse = await fetch(`${API_BASE}/payment/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          orderId: orderId,
          items: cart.map(item => ({
            id: item.id,
            partNumber: item.partNumber,
            name: item.name,
            quantity: item.quantity,
            unitPrice: parseFloat(calculatePrice(item.price)),
            brand: item.brand
          })),
          total: total,
          vehicle: { year, make, model },
          shippingAddress: userAddress
        })
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to save order');
      }

      // Success!
      setPaymentSuccess(true);
      setPaymentProcessing(false);
      
      // Clear cart
      await fetch(`${API_BASE}/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setCart([]);
      
      // Show success message
      setTimeout(() => {
        setShowPaymentModal(false);
        alert(`Payment successful! Order ${orderId} has been placed.\n\nTotal: $${total.toFixed(2)}`);
        loadUserData(); // Reload orders
        navigateTo('orders');
      }, 1500);
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(error.message);
      setPaymentProcessing(false);
    }
  };

  // Keep old checkout for backward compatibility (orders without payment)
  const handleCheckoutOld = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Validate address if logged in
    if (currentUser && (!userAddress.streetAddress || !userAddress.city || !userAddress.postalCode || !userAddress.country)) {
      alert('Please complete your shipping address in your profile before checkout');
      navigateTo('profile');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Build order object
      const orderId = Date.now();
      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        user: currentUser ? { id: currentUser.id, name: currentUser.name, email: currentUser.email } : null,
        vehicle: { year, make, model },
        items: cart.map(item => ({ id: item.id, partNumber: item.partNumber, name: item.name, quantity: item.quantity, unitPrice: parseFloat(calculatePrice(item.price)), brand: item.brand })),
        total: parseFloat(getCartTotal())
      };

      // Save order to database
      const saveOrderResponse = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: newOrder.id,
          items: newOrder.items,
          total: newOrder.total,
          vehicle: newOrder.vehicle,
          shippingAddress: userAddress
        })
      });

      const saveOrderData = await saveOrderResponse.json();
      
      if (!saveOrderResponse.ok || !saveOrderData.success) {
        alert(saveOrderData.error || 'Failed to save order');
        return;
      }

      // Add to local order history
      setOrders(prev => [newOrder, ...prev]);
      alert(`Order placed! Total: $${newOrder.total.toFixed(2)}\n\nOrder saved to your Order History.`);
      
      // Clear cart in database
      try {
        await fetch(`${API_BASE}/cart`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
      
      setCart([]);
      navigateTo('orders');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed: ' + error.message);
    }
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

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          streetAddress: userAddress.streetAddress,
          city: userAddress.city,
          stateProvince: userAddress.stateProvince,
          postalCode: userAddress.postalCode,
          country: userAddress.country
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Profile save error:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCart([]);
    setWishlist([]);
    setSavedVehicles([]);
    setSelectedVehicle(null);
  };

  /* --- Derived values --- */
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const currentUserName = currentUser ? (currentUser.name.split(' ')[0] || currentUser.name) : '';

  // Breadcrumb paths for different pages
  const getBreadcrumbs = () => {
    switch (currentPage) {
      case 'about':
        return [{ label: t.about }];
      case 'contact':
        return [{ label: t.contact }];
      case 'categories':
        return [{ label: t.partsCategories }];
      case 'results':
        return [
          { label: t.partsCategories, link: 'categories' },
          { label: t.searchResults }
        ];
      case 'productDetail':
        return [
          { label: t.partsCategories, link: 'categories' },
          { label: t.searchResults, link: 'results' },
          { label: selectedProduct?.name || t.productDetails }
        ];
      case 'cart':
        return [{ label: t.shoppingCart }];
      case 'orders':
        return [{ label: t.orderHistory }];
      case 'wishlist':
        return [{ label: t.wishlist }];
      case 'admin':
        return [{ label: t.adminPanel }];
      default:
        return [];
    }
  };

  const breadcrumbs = getBreadcrumbs();

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
            t={t}
            mockParts={mockParts}
            selectedVehicle={selectedVehicle}
            setSelectedVehicle={setSelectedVehicle}
            language={language}
          />
        );
      case 'about':
        return <AboutPage t={t} />;
      case 'contact':
        return <ContactPage t={t} language={language} />;
      case 'wishlist':
        return <WishlistPage wishlist={wishlist} addToCart={addToCart} removeFromWishlist={removeFromWishlist} setCurrentPage={navigateTo} t={t} />;
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
          t={t}
        />;
      case 'results':
        return <ResultsPage searchResults={searchResults} addToCart={addToCart} calculatePrice={calculatePrice} isLoggedIn={isLoggedIn} onViewProduct={viewProduct} t={t} />;
      case 'productDetail':
        return <ProductDetailPage product={selectedProduct} addToCart={addToCart} addToWishlist={addToWishlist} calculatePrice={calculatePrice} isLoggedIn={isLoggedIn} onBack={backToResults} t={t} />;
      case 'cart':
        return <CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} calculatePrice={calculatePrice} handleCheckout={handleCheckout} t={t} />;
      case 'orders':
        return <OrdersPage orders={orders} onReorder={handleReorder} t={t} />;
      case 'profile':
        return isLoggedIn ? (
          <ProfilePage 
            currentUser={currentUser} 
            userAddress={userAddress} 
            setUserAddress={setUserAddress}
            onSave={handleSaveProfile}
            t={t}
            language={language}
          />
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
              <p className="text-gray-600">Please login to view your profile.</p>
            </div>
          </div>
        );
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
        return <AdminPage t={t} />;
      default:
        return <HomePage {...{
          searchType, setSearchType, year, setYear, make, setMake, model, setModel, years, makes, models, loadingMakes, loadingModels, partNumber, setPartNumber, handleSearch, isLoggedIn
        }} setCurrentPage={navigateTo} t={t} />;
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
        onOpenProfile={() => navigateTo('profile')}
        setCurrentPage={navigateTo}
        onBack={goBack}
        canGoBack={canGoBack}
        language={language}
        onLanguageChange={() => setLanguage(prev => prev === 'en' ? 'fr' : 'en')}
        t={t}
        onOpenGarage={() => setShowGarageModal(true)}
        onOpenWishlist={() => navigateTo('wishlist')}
        wishlistCount={wishlist.length}
      />

      <GarageModal
        isOpen={showGarageModal}
        onClose={() => setShowGarageModal(false)}
        savedVehicles={savedVehicles}
        setSavedVehicles={setSavedVehicles}
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
        t={t}
        language={language}
        onSelectVehicle={(vehicle) => {
          setSelectedVehicle(vehicle);
        }}
        onAddVehicle={handleAddVehicle}
        onRemoveVehicle={handleRemoveVehicle}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs path={breadcrumbs} setCurrentPage={navigateTo} t={t} />

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{authMode === 'login' ? t.loginTitle : t.createAccount}</h2>
              <button onClick={() => setShowAuthModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {authMode === 'login' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.email}</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.password}</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
                <button onClick={handleLogin} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition">{t.login}</button>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700 font-semibold mb-1">{t.demoAccounts}:</p>
                  <p className="text-xs text-gray-600">{t.business}: demo@mechanic.com / demo123</p>
                  <p className="text-xs text-gray-600">{t.personal}: personal@email.com / demo123</p>
                  <p className="text-xs text-gray-600">Admin: admin@directfit.com / admin123</p>
                </div>
                <button onClick={() => setAuthMode('signup')} className="w-full text-red-600 hover:text-red-700 text-sm font-medium">{t.noAccount}</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">{t.accountType}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSignupData({ ...signupData, accountType: 'business' })}
                      className={`p-4 rounded-lg border-2 transition ${signupData.accountType === 'business' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <Building2 className={`h-8 w-8 mx-auto mb-2 ${signupData.accountType === 'business' ? 'text-red-600' : 'text-gray-400'}`} />
                      <p className="font-semibold text-sm text-gray-900">{t.business}</p>
                      <p className="text-xs text-gray-500">{t.shopDealership}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupData({ ...signupData, accountType: 'personal' })}
                      className={`p-4 rounded-lg border-2 transition ${signupData.accountType === 'personal' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <UserCircle className={`h-8 w-8 mx-auto mb-2 ${signupData.accountType === 'personal' ? 'text-red-600' : 'text-gray-400'}`} />
                      <p className="font-semibold text-sm text-gray-900">{t.personal}</p>
                      <p className="text-xs text-gray-500">{t.individual}</p>
                    </button>
                  </div>
                </div>

                {signupData.accountType === 'business' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.company}</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.name}</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.email}</label>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.password}</label>
                  <input
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
                <button onClick={handleSignup} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition">{t.createAccount}</button>
                <button onClick={() => setAuthMode('login')} className="w-full text-red-600 hover:text-red-700 text-sm font-medium">{t.alreadyHaveAccount}</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
              <button 
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentError(null);
                  setPaymentSuccess(false);
                }}
                disabled={paymentProcessing}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {paymentSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-gray-600">Your order has been placed.</p>
              </div>
            ) : (
              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={parseFloat(getCartTotal())}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setShowPaymentModal(false)}
                  onError={(error) => setPaymentError(error.message)}
                />
              </Elements>
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
