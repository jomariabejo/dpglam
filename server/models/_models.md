# eCommerce Database Models

## 1. CustomerPurchase:
- **userID**: A reference to the `User` collection, identifying the customer making the purchase.
- **totalAmount**: The total amount for this purchase.
- **paymentStatus**: The payment status of the purchase (e.g., `Paid`, `Pending`, `Failed`).
- **shippingAddress**: The address to which the order will be shipped.
- **orderStatus**: The status of the order (e.g., `Processing`, `Shipped`, `Delivered`, `Canceled`).

## 2. PurchaseList:
- **purchaseID**: Reference to the `CustomerPurchase`, indicating which purchase this item belongs to.
- **productID**: Reference to the `Product` model, indicating which product was purchased.
- **quantity**: The number of units of the product purchased.
- **priceAtPurchase**: The price at which the product was purchased.

## 3. Products:
- **name**: Name of the product.
- **description**: A brief description of the product.
- **price**: Price of the product.
- **stockQuantity**: Number of units available for sale.
- **category**: The category the product belongs to (e.g., `Electronics`, `Clothing`).
- **sku**: The Stock Keeping Unit (SKU), which is a unique identifier for the product.
- **image**: A URL or file path pointing to the product image.
- **dateAdded**: The date the product was added to the store.

## 4. Orders:
- **userID**: Reference to the `User` model, identifying the customer who placed the order.
- **totalAmount**: Total amount of the order.
- **shippingAddress**: The shipping address for the order.
- **paymentStatus**: The payment status of the order.
- **orderStatus**: The status of the order (e.g., `Processing`, `Shipped`, `Delivered`, `Canceled`).
- **datePlaced**: The date the order was placed.
- **dateShipped**: The date the order was shipped (if applicable).
