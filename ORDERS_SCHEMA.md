# Updated Orders Table Schema

## Current Orders Table Structure

After running the migration from `migrate-add-payment.js`, your orders table will have:

```
orders table:
├── id (BIGINT, PRIMARY KEY, auto-increment)
├── user_id (UUID, FOREIGN KEY → users.id)
├── order_id (VARCHAR 255) - Your custom order number (e.g., ORD-1734867890)
├── items (JSONB) - Array of ordered products with quantities
├── total (DECIMAL) - Total order amount
├── vehicle (JSONB) - Vehicle info selected by user
├── shipping_address (JSONB) - Full address with street, city, state, postal, country
├── buyer_name (VARCHAR 255) ✨ NEW
├── buyer_email (VARCHAR 255) ✨ NEW
├── payment_method (VARCHAR 50) ✨ NEW - Values: 'stripe', 'pending', etc.
├── payment_status (VARCHAR 50) ✨ NEW - Values: 'pending', 'completed', 'failed', 'refunded'
├── stripe_payment_intent_id (VARCHAR 255) ✨ NEW - Stripe transaction ID for tracking
├── payment_amount (DECIMAL 10,2) ✨ NEW - Amount actually paid
├── payment_date (TIMESTAMP) ✨ NEW - When payment processed
├── created_at (TIMESTAMP, auto-set) - When order was created
└── Indexes created:
    ├── idx_orders_user_id - Fast lookup by user
    ├── idx_orders_buyer_email ✨ NEW - Find all orders by buyer email
    └── idx_orders_payment_status ✨ NEW - Filter by payment status
```

## Example Order Record

```json
{
  "id": 42,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "order_id": "ORD-1734867890123",
  "items": [
    {
      "id": 5,
      "name": "Engine Oil 5W-30",
      "quantity": 2,
      "price": 24.99,
      "total": 49.98
    },
    {
      "id": 12,
      "name": "Air Filter",
      "quantity": 1,
      "price": 15.99,
      "total": 15.99
    }
  ],
  "total": 299.99,
  "vehicle": {
    "year": "2019",
    "make": "Toyota",
    "model": "Camry",
    "full": "2019 Toyota Camry"
  },
  "shipping_address": {
    "streetAddress": "123 Main St",
    "city": "New York",
    "state_province": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "buyer_name": "John Doe",
  "buyer_email": "john@example.com",
  "payment_method": "stripe",
  "payment_status": "completed",
  "stripe_payment_intent_id": "pi_1Nv8hKI2ZMu6L6zC4hX0V6zK",
  "payment_amount": 299.99,
  "payment_date": "2025-11-21T14:30:00Z",
  "created_at": "2025-11-21T14:30:00Z"
}
```

## SQL Query Examples

### Find all orders by a specific buyer email

```sql
SELECT * FROM orders
WHERE buyer_email = 'john@example.com'
ORDER BY created_at DESC;
```

### Find all completed payments

```sql
SELECT buyer_name, buyer_email, total, payment_date
FROM orders
WHERE payment_status = 'completed'
ORDER BY payment_date DESC;
```

### Get all pending orders (not paid yet)

```sql
SELECT * FROM orders
WHERE payment_status = 'pending'
ORDER BY created_at DESC;
```

### Find order by Stripe transaction ID

```sql
SELECT * FROM orders
WHERE stripe_payment_intent_id = 'pi_1Nv8hKI2ZMu6L6zC4hX0V6zK';
```

### Revenue report (all completed payments)

```sql
SELECT
  payment_date::DATE as date,
  COUNT(*) as order_count,
  SUM(payment_amount) as total_revenue,
  AVG(payment_amount) as avg_order_value
FROM orders
WHERE payment_status = 'completed'
GROUP BY payment_date::DATE
ORDER BY date DESC;
```

### Find buyers with multiple orders

```sql
SELECT
  buyer_email,
  buyer_name,
  COUNT(*) as order_count,
  SUM(total) as lifetime_value
FROM orders
GROUP BY buyer_email, buyer_name
HAVING COUNT(*) > 1
ORDER BY lifetime_value DESC;
```

## View the Data in Supabase

After running the migration:

1. Go to https://app.supabase.com
2. Select your project
3. Click **Table Editor** in left sidebar
4. Click **orders** table
5. You'll see all the new columns with sample data

The buyer_name and buyer_email will be automatically populated whenever an order is placed!
