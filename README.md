# eCommerce Platform

This project is a full-stack eCommerce platform built with Next.js, React, Redux, and SQLite. It features user authentication, role-based access control, product management, and a shopping cart system.

## Features

- User Authentication (Sign Up, Sign In, Sign Out)
- Role-based Access Control (Admin, Seller, Customer)
- Product Management (Add, Edit, Delete products)
- Shopping Cart Functionality
- Checkout Process
- Responsive Design

### User Roles

1. **Admin**: Can manage all users and products
2. **Seller**: Can add, edit, and delete their own products
3. **Customer**: Can browse products, add to cart, and make purchases

## Environment Setup

1. Clone the repository:
   ```
   git clone https://github.com/nusrafath/nextjs-ecommerce-redux-bounty.git
   cd nextjs-ecommerce-redux-bounty
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory and add the following:
   ```
   NEXTAUTH_SECRET=your_secret_key_here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Setup

This project uses SQLite as the database. The database file (`mydb.sqlite`) will be created automatically when you run the application for the first time.

### Changing User Roles

To change a user's role to admin:

1. Install the SQLite Editor extension in VS Code.
2. Open the `mydb.sqlite` file in VS Code.
3. Navigate to the `users` table.
4. Find the user you want to make an admin.
5. Change the `role` column value to 'ADMIN'.
6. Save the changes.

## Project Structure

- `app/`: Next.js app router pages
- `components/`: React components
- `store/`: Redux store and slices
- `lib/`: Utility functions and database connection
- `types/`: TypeScript type definitions

## Key Components

- `AddProductForm`: Form for sellers to add new products
- `EditProductForm`: Modal form for sellers to edit existing products
- `ProductList`: Displays products with different views for sellers and customers
- `Cart`: Manages the shopping cart functionality
- `CheckoutForm`: Handles the checkout process

## API Routes

- `/api/auth/[...nextauth]`: Handles authentication
- `/api/products`: Manages product CRUD operations
- `/api/users`: Manages user operations (for admin)
- `/api/checkout`: Processes orders and updates stock
