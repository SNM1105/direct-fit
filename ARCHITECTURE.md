# Payment & Buyer Info Flow

## Current Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│                      http://localhost:3000                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User Checkout Flow:                                            │
│  1. User selects products → Add to cart                         │
│  2. User enters shipping address → Save to profile              │
│  3. User clicks "Checkout"                                      │
│     └─→ Validate address (NEW)                                  │
│     └─→ Show payment form (TO DO)                               │
│     └─→ User enters card details                                │
│     └─→ Send payment to Stripe                                  │
│     └─→ Get confirmation from Stripe                            │
│     └─→ Call backend to save order with payment info            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓ (HTTPS)
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (Express.js)                        │
│                      http://localhost:5000                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  NEW Endpoints:                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ POST /api/payment/create-intent                         │   │
│  │ ─────────────────────────────────────────────────────   │   │
│  │ Receives: { amount, orderId, description }              │   │
│  │ Calls: Stripe API (create payment intent)               │   │
│  │ Returns: { clientSecret, paymentIntentId }              │   │
│  │ Purpose: Initiate payment processing                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↓                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ POST /api/payment/confirm                               │   │
│  │ ─────────────────────────────────────────────────────   │   │
│  │ Receives: { paymentIntentId, orderId, items, ... }      │   │
│  │ Validates: Payment succeeded with Stripe                │   │
│  │ Fetches: User info (name, email) from database          │   │
│  │ Inserts: Order with buyer_name, buyer_email (NEW)       │   │
│  │ Inserts: Payment fields (payment_method, status, etc)   │   │
│  │ Returns: { success, id }                                │   │
│  │ Purpose: Save order and mark payment complete           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  EXISTING Endpoint (Enhanced):                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ POST /api/orders (UPDATED)                              │   │
│  │ ─────────────────────────────────────────────────────   │   │
│  │ Now captures: buyer_name, buyer_email (NEW)             │   │
│  │ Fallback for orders without payment processing          │   │
│  │ Purpose: Save orders without Stripe for internal use    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓ (Query)
┌─────────────────────────────────────────────────────────────────┐
│                     SUPABASE DATABASE                           │
│                 (PostgreSQL + Realtime)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  orders Table (UPDATED with new columns):                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ id                    (auto-increment)                   │  │
│  │ user_id               (from JWT token)                   │  │
│  │ order_id              (ORD-1234567890)                   │  │
│  │ items                 (JSONB array)                      │  │
│  │ total                 (amount)                           │  │
│  │ vehicle               (JSONB)                            │  │
│  │ shipping_address      (JSONB)                            │  │
│  │ ✨ buyer_name        (auto-captured) NEW                │  │
│  │ ✨ buyer_email       (auto-captured) NEW                │  │
│  │ ✨ payment_method    ("stripe", "pending") NEW           │  │
│  │ ✨ payment_status    ("completed", "failed") NEW         │  │
│  │ ✨ stripe_payment_intent_id (Stripe ID) NEW             │  │
│  │ ✨ payment_amount    (amount paid) NEW                   │  │
│  │ ✨ payment_date      (timestamp) NEW                     │  │
│  │ created_at            (timestamp)                        │  │
│  │ Indexes:                                                 │  │
│  │   - idx_orders_user_id                                   │  │
│  │   - idx_orders_buyer_email (NEW)                         │  │
│  │   - idx_orders_payment_status (NEW)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓ (API)
┌─────────────────────────────────────────────────────────────────┐
│                    STRIPE PAYMENT PROCESSOR                     │
│                   (Secure Payment Processing)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Create PaymentIntent                                        │
│     └─→ Returns client_secret for frontend                      │
│                                                                 │
│  2. Process Payment                                             │
│     └─→ Frontend sends card details securely                    │
│     └─→ Stripe processes and returns status                     │
│                                                                 │
│  3. Confirm Payment                                             │
│     └─→ Backend verifies with Stripe API                        │
│     └─→ Only save order if payment succeeded                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: Placing an Order with Payment

```
USER PLACES ORDER:
│
├─→ Step 1: Validate
│   └─ Address complete? ✓
│   └─ Cart has items? ✓
│   └─ Shipping address saved? ✓
│
├─→ Step 2: Create Payment Intent
│   └─ Frontend calls: POST /api/payment/create-intent
│   └─ Backend creates Stripe PaymentIntent
│   └─ Returns: clientSecret, paymentIntentId
│
├─→ Step 3: User Enters Payment
│   └─ Show payment form (Stripe CardElement)
│   └─ User enters card details
│   └─ Frontend sends to Stripe (NOT to your server!)
│   └─ Stripe returns: paymentIntentStatus
│
├─→ Step 4: Confirm Payment
│   └─ Frontend calls: POST /api/payment/confirm
│   └─ Includes: paymentIntentId, orderId, items, total, address
│   └─ Backend verifies payment with Stripe API
│   └─ Stripe responds: payment succeeded ✓
│
├─→ Step 5: Save Order
│   └─ Backend fetches user: name, email
│   └─ Backend inserts into orders table:
│      - buyer_name: "John Doe"
│      - buyer_email: "john@example.com"
│      - payment_method: "stripe"
│      - payment_status: "completed"
│      - stripe_payment_intent_id: "pi_1234..."
│      - payment_amount: 299.99
│      - payment_date: 2025-11-21T14:30:00Z
│
└─→ Step 6: Confirmation
    └─ Order saved ✓
    └─ Payment confirmed ✓
    └─ Email sent to buyer (TODO)
    └─ Display order in /orders page
```

## What You See After Payment

### In Supabase Table Editor:

```
Orders Table:
┌────┬────────────────┬──────────────────────┬─────────┬──────────────────────┐
│ id │ buyer_name     │ buyer_email          │ total   │ payment_status       │
├────┼────────────────┼──────────────────────┼─────────┼──────────────────────┤
│ 42 │ John Doe       │ john@example.com     │ 299.99  │ completed            │
│ 41 │ Jane Smith     │ jane@example.com     │ 149.50  │ completed            │
│ 40 │ Bob Johnson    │ bob@example.com      │ 75.00   │ pending              │
└────┴────────────────┴──────────────────────┴─────────┴──────────────────────┘
```

### Stripe Dashboard:

```
Recent Transactions:
┌─────────────────────────┬──────────────┬────────────┬────────────┐
│ Time                    │ Customer     │ Amount     │ Status     │
├─────────────────────────┼──────────────┼────────────┼────────────┤
│ 2025-11-21 14:30:00 UTC │ john@ex...   │ $299.99    │ Succeeded  │
│ 2025-11-21 14:25:30 UTC │ jane@ex...   │ $149.50    │ Succeeded  │
│ 2025-11-21 14:20:15 UTC │ bob@ex...    │ $75.00     │ Failed     │
└─────────────────────────┴──────────────┴────────────┴────────────┘
```

## Status Summary

✅ **Buyer Information**

- Automatically captured when order is placed
- No frontend changes needed for this
- Visible in database immediately

✅ **Payment Backend**

- Stripe integration complete
- Payment endpoints ready
- Error handling included

⏳ **Database**

- SQL migration created (migrate-add-payment.js)
- Needs to be run in Supabase

⏳ **Frontend Payment UI**

- Needs payment form component
- Needs integration with checkout flow
- Will add Stripe.js CardElement

## Next: Frontend Integration

Ready to add the payment form UI to your checkout? I can:

1. Create a PaymentForm component using Stripe.js
2. Integrate it into your checkout modal
3. Connect it to the backend payment endpoints
4. Test the complete flow with test cards

Let me know! 🚀
