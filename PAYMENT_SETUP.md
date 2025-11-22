# Payment Integration Setup Guide

## Overview

Your Direct Fit Automotive platform now has payment processing integrated with Stripe. Here's what was added:

### Backend Changes

1. **Stripe Integration**: Added Stripe SDK to `server.js`
2. **Payment Endpoints**:
   - `POST /api/payment/create-intent` - Creates a Stripe PaymentIntent
   - `POST /api/payment/confirm` - Confirms payment and saves order
3. **Order Enhancements**: Orders now capture buyer name and email automatically
4. **Database Schema**: New columns for payment tracking (see migrate-add-payment.js)

### New Database Columns

Run the SQL from `migrate-add-payment.js` in Supabase:

```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS buyer_name VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS buyer_email VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10, 2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP;
```

## Setup Steps

### 1. Get Stripe API Keys

1. Go to https://dashboard.stripe.com
2. Create a free account (or login)
3. Go to **Developers** → **API Keys**
4. Copy your **Secret Key** (starts with `sk_`)
5. NOTE: Use test keys first (starts with `sk_test_`)

### 2. Add Keys to .env

Add to your `.env` file:

```
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```

### 3. Install Frontend Stripe Library

Run in your terminal:

```bash
npm install @stripe/react-stripe-js @stripe/js
```

### 4. Update Frontend (App.js)

Here's what you need to add:

```javascript
// At the top with other imports
import { loadStripe } from "@stripe/js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialize Stripe (add in main App component)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Add this state for payment
const [paymentProcessing, setPaymentProcessing] = useState(false);
const [paymentError, setPaymentError] = useState(null);
```

### 5. Update Checkout Flow

In your `handleCheckout` function, call the payment flow:

```javascript
const handleCheckout = async () => {
  // Validate address
  if (
    !userAddress.streetAddress ||
    !userAddress.city ||
    !userAddress.postalCode ||
    !userAddress.country
  ) {
    alert("Please complete your shipping address");
    navigateTo("profile");
    return;
  }

  setPaymentProcessing(true);

  try {
    // Generate order ID
    const orderId = `ORD-${Date.now()}`;
    const total = cartItems.reduce((sum, item) => sum + item.total, 0);

    // Create payment intent
    const intentResponse = await fetch(
      "http://localhost:5000/api/payment/create-intent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: total,
          orderId: orderId,
          description: `Order for ${userAddress.streetAddress}`,
        }),
      }
    );

    const intentData = await intentResponse.json();
    if (!intentData.clientSecret)
      throw new Error("Failed to create payment intent");

    // Open payment modal (you'll need to add this)
    // For now, you can show a payment form or redirect to Stripe

    // After successful payment, confirm:
    const confirmResponse = await fetch(
      "http://localhost:5000/api/payment/confirm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentIntentId: intentData.paymentIntentId,
          orderId: orderId,
          items: cartItems,
          total: total,
          vehicle: selectedVehicle,
          shippingAddress: userAddress,
        }),
      }
    );

    const orderData = await confirmResponse.json();
    if (orderData.success) {
      alert("Order placed successfully!");
      setCartItems([]);
      loadUserData();
      navigateTo("orders");
    }
  } catch (error) {
    console.error("Checkout error:", error);
    setPaymentError(error.message);
    alert("Checkout failed: " + error.message);
  } finally {
    setPaymentProcessing(false);
  }
};
```

## Testing

### Stripe Test Cards

Use these cards in test mode:

**Successful Payment:**

- Card: `4242 4242 4242 4242`
- Exp: `12/25`
- CVC: `123`

**Declined Payment:**

- Card: `4000 0000 0000 0002`
- Exp: `12/25`
- CVC: `123`

### In Your Orders Table

After a successful payment, you'll see:

- `buyer_name`: User's name
- `buyer_email`: User's email
- `payment_status`: "completed"
- `payment_method`: "stripe"
- `stripe_payment_intent_id`: Stripe ID
- `payment_amount`: Amount paid
- `payment_date`: When payment was processed

## Current Status

✅ Backend Stripe integration complete
✅ Database schema ready (need to run SQL migration)
✅ Payment endpoints ready
⏳ Frontend UI needs to be added (payment form modal)
⏳ Test the complete flow

## Next Steps

1. Run the SQL migration in Supabase
2. Add STRIPE_SECRET_KEY to .env
3. Add REACT_APP_STRIPE_PUBLISHABLE_KEY to .env
4. Install Stripe React libraries: `npm install @stripe/react-stripe-js @stripe/js`
5. Update App.js with payment form component (you can use Stripe's hosted payment form for simplicity)
6. Test with Stripe test cards

## Stripe Test Dashboard

View all test transactions at: https://dashboard.stripe.com/test/payments
