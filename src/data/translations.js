// Translations for multi-language support
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
    
    // Email Verification
    resendVerification: 'Resend Verification Email',
    verificationEmailSent: 'Verification email sent! Please check your inbox.',
    verificationFailed: 'Failed to send verification email.',
    enterEmailToResend: 'Enter your email to resend verification:',
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
    updating: 'Updating...',
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
    
    // Email Verification
    resendVerification: 'Renvoyer l\'e-mail de vérification',
    verificationEmailSent: 'E-mail de vérification envoyé! Veuillez vérifier votre boîte de réception.',
    verificationFailed: 'Échec de l\'envoi de l\'e-mail de vérification.',
    enterEmailToResend: 'Entrez votre e-mail pour renvoyer la vérification:',
  }
};

export default translations;
