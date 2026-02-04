# Direct Fit Automotive

E-commerce platform for automotive parts with user authentication, shopping cart, and order management.

## Features

- 🔐 User authentication (register/login with JWT)
- ✉️ Email verification for new accounts
- 💳 Stripe payment integration
- 🛒 Shopping cart with real-time pricing
- 🚗 Vehicle-specific part search (year/make/model)
- 📦 Order history and tracking
- 💼 Business and personal account types
- 📱 Mobile and desktop responsive design
- 🗂️ Category browsing with subcategories
- 🔍 Advanced search (vehicle year/make/model, part number)
- ❤️ Wishlist functionality
- 🔧 Garage (save vehicles for quick access)
- 🌐 Multi-language support (English/French)
- 👨‍💼 Admin panel for user management

## Tech Stack

**Frontend:**

- React 19.2.0
- Tailwind CSS 3.4
- Lucide React (icons)
- Stripe.js (payments)

**Backend:**

- Express.js 5.1
- Supabase (PostgreSQL)
- JWT authentication
- bcrypt password hashing
- Nodemailer (email verification)

## Project Structure

```
direct-fit-automotive/
├── public/                    # Static assets
│   ├── brands/               # Brand logos
│   └── category-images/      # Category images
├── scripts/                   # Database migrations & utilities
│   ├── setup-database.js     # Initial database setup
│   ├── migrate-*.js          # Migration scripts
│   └── test-*.js             # Test utilities
├── src/
│   ├── components/           # React components
│   ├── data/                 # Static data
│   │   ├── catalog.js        # Categories & mock parts
│   │   └── translations.js   # i18n translations
│   ├── pages/                # Page components
│   ├── services/             # API service layer
│   │   └── api.js            # Centralized API calls
│   ├── App.js                # Main app component
│   ├── index.js              # Entry point
│   └── index.css             # Tailwind CSS
├── server.js                  # Express backend server
├── email-verification.js      # Email verification utilities
└── package.json
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create account at https://supabase.com
2. Create new project
3. Run the database schema (see scripts/setup-database.js)
4. Copy your Project URL and API key

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
JWT_SECRET=your-random-secret-key-change-this
PORT=5000
NODE_ENV=development

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-public-key-here

# Stripe (optional - for payments)
STRIPE_SECRET_KEY=sk_test_...
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email (optional - for verification)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 4. Run the Application

**Development mode (both frontend and backend):**

```bash
npm run dev
```

This starts:

- Backend API server at http://localhost:5000
- React frontend at http://localhost:3000

**Backend only:**

```bash
npm run server
```

**Frontend only:**

```bash
npm start
```

## Project Structure

```
direct-fit-automotive/
├── public/
│   ├── brands/              # Brand logo images
│   ├── category-images/     # Subcategory images
│   └── index.html
├── src/
│   ├── App.js              # Main application component
│   ├── App.css
│   ├── index.js
│   └── index.css
├── server.js               # Express backend (Supabase)
├── .env                    # Environment variables (DO NOT COMMIT)
├── .env.example            # Environment template
├── package.json
├── SUPABASE_SETUP.md       # Detailed Supabase setup guide
└── DATABASE_GUIDE.md       # API documentation
```

## API Documentation

See [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) for complete API reference.

**Base URL:** `http://localhost:5000/api`

**Endpoints:**

- `POST /auth/register` - Create new account
- `POST /auth/login` - Login
- `POST /auth/verify` - Verify JWT token
- `POST /orders` - Save order (requires auth)
- `GET /orders` - Get user orders (requires auth)

## Account Types

**Business Account:**

- For mechanic shops and dealerships
- 15% margin pricing
- Company name displayed

**Personal Account:**

- For individual customers
- 20% margin pricing
- Personal name displayed

## Development Notes

- Frontend runs on port 3000
- Backend runs on port 5000
- CORS enabled for cross-origin requests
- JWT tokens expire after 7 days
- Passwords hashed with bcrypt (10 salt rounds)

## Deployment

### Frontend (Vercel/Netlify)

1. Build the app:

```bash
npm run build
```

2. Deploy the `build` folder

3. Set environment variable:

```
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Backend (Railway/Render/Heroku)

1. Deploy `server.js` to your hosting platform

2. Set environment variables:

```
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=production
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

## Security

- ✅ Environment variables for sensitive data
- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Row Level Security (RLS) on Supabase
- ✅ `.env` excluded from git
- ✅ CORS configured
- ⚠️ Update JWT_SECRET before production
- ⚠️ Use HTTPS in production

## Support

For issues or questions, see:

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database setup
- [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) - API reference

## License

Private project
