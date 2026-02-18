# FOODORDERING - College Project Report

## 📋 Project Overview

**FoodOrdering** is a full-stack web application that provides a comprehensive e-commerce platform for ordering food online. It features a complete system for customers to browse menu items, place orders, track deliveries, and for administrators to manage inventory, orders, and customer relationships.

---

## 🎯 Project Type & Purpose

- **Type**: Full-Stack E-Commerce Application
- **Purpose**: Enables users to order food items online with real-time order tracking and admin management capabilities
- **Scope**: Medium-scale project with user authentication, payment processing, inventory management, and real-time notifications

---

## 🏗️ Architecture Overview

### Technology Stack

#### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js (v5.1.0)
- **Database**: MongoDB (Mongoose ODM v8.18.0)
- **Real-time Communication**: Socket.io (v4.8.1)
- **Authentication**: JWT (jsonwebtoken v9.0.2)
- **Security**: Helmet.js (v8.1.0), bcryptjs (v3.0.2)
- **File Upload**: Multer (v2.0.2), Cloudinary (v2.8.0)
- **Email Service**: Nodemailer (v7.0.12)
- **Environment**: dotenv (v17.2.1)
- **Development**: Nodemon (v3.1.10)

#### **Frontend**
- **Framework**: React (v19.1.1)
- **Build Tool**: Vite (v7.1.2)
- **Styling**: Tailwind CSS (v4.1.12)
- **HTTP Client**: Axios (v1.11.0)
- **State Management**: React Context API
- **Routing**: React Router DOM (v7.8.2)
- **UI Components**: Lucide React (v0.542.0)
- **Animations**: Framer Motion (v12.23.12), GSAP (v3.13.0)
- **Charts**: Recharts (v3.2.0)
- **3D Graphics**: Three.js (v0.180.0), React Three Fiber (v9.3.0)
- **Maps**: Leaflet (v1.9.4), React Leaflet (v5.0.0)
- **Notifications**: React Hot Toast (v2.6.0), React Toastify (v11.0.5)
- **Date Handling**: date-fns (v4.1.0)
- **Real-time**: Socket.io Client (v4.8.1)

---

## 📂 Project Structure

### Backend Structure
```
backend/
├── config/                 # Configuration files
│   ├── cloudinary.js       # Cloudinary image upload config
│   └── db.js               # MongoDB connection
├── controllers/            # Business logic
│   ├── adminController.js
│   ├── authController.js
│   ├── contactController.js
│   ├── menuController.js
│   ├── menuItemController.js
│   ├── orderController.js
│   ├── ratingController.js
│   └── userController.js
├── middleware/             # Express middleware
│   ├── auth.js             # JWT verification
│   ├── authAdmin.js        # Admin authorization
│   ├── inventoryMiddleware.js
│   ├── multer.js           # File upload config
│   └── uploadMiddleware.js
├── models/                 # MongoDB schemas
│   ├── Category.js
│   ├── contactForm.js
│   ├── Inventory.js
│   ├── MenuItem.js
│   ├── Order.js
│   ├── Promotion.js
│   ├── Rating.js
│   └── User.js
├── routes/                 # API endpoints
│   ├── admin.js
│   ├── authRoutes.js
│   ├── categories.js
│   ├── categoryRoutes.js
│   ├── contactRouter.js
│   ├── menuItems.js
│   ├── menuRoutes.js
│   ├── orderRoutes.js
│   ├── ratingRoutes.js
│   └── userRoutes.js
├── services/               # Business services
│   ├── emailService.js     # Email sending logic
│   ├── emailTemplates.js
│   └── statsMail.js
├── seed/                   # Database seeding
│   ├── seedAdmin.js
│   ├── seedCategories.js
│   └── seedDatabase.js
├── scripts/                # Utility scripts
│   ├── clearDatabase.js
│   ├── initInventory.js
│   └── seedAdmin.js
├── utils/                  # Utility functions
│   ├── greetings.js
│   ├── mailer.js
│   └── statusMail.js
├── socket.js               # Socket.io configuration
├── index.js                # Server entry point
└── package.json
```

### Frontend Structure
```
frontend/
├── public/                 # Static assets
│   └── Project-images/     # Food images
├── src/
│   ├── Components/         # React components
│   │   ├── Auth/           # Authentication & protected routes
│   │   ├── pages/          # Feature pages
│   │   ├── menu/           # Menu display components
│   │   ├── orderForm/      # Order flow components
│   │   ├── contact/        # Contact form
│   │   ├── footer/         # Footer components
│   │   ├── layout/         # Layout wrappers
│   │   ├── profile/        # User profile
│   │   ├── background/     # Background components
│   │   ├── shared/         # Shared components
│   │   ├── hooks/          # Custom hooks
│   │   └── UI/             # Reusable UI components
│   ├── admin/              # Admin dashboard
│   │   ├── AdminDashboard.jsx
│   │   ├── OrderManager.jsx
│   │   ├── components/
│   │   ├── layout/         # Admin layout
│   │   └── pages/          # Admin pages
│   │       ├── analytics/  # Sales & analytics
│   │       ├── customers/  # Customer management
│   │       ├── inventory/  # Inventory tracking
│   │       ├── order/      # Order management
│   │       ├── products/   # Product management
│   │       ├── promotions/ # Promotion management
│   │       └── setting/    # Settings
│   ├── context/            # Global state (Auth, Theme)
│   ├── contexts/           # Context (Cart, Wishlist)
│   ├── services/           # API client services
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # React entry point
│   ├── App.css
│   └── index.css
├── vite.config.js
├── vercel.json             # Vercel deployment config
└── package.json
```

---

## 🗄️ Database Schema (MongoDB Models)

### 1. **User Model**
- Authentication fields: name, email, password (bcrypted)
- Role-based access: user, admin
- Email verification with OTP
- Account status tracking
- Profile information

### 2. **MenuItem Model**
- Food item details: name, category, price, description
- Nutrition info: calories, ingredients
- Preparation time
- Image (stored via Cloudinary)
- Rating system (0-5)
- Popularity flag

### 3. **Order Model**
- Order ID (unique identifier)
- Customer information: name, email, phone, address
- Items array with quantity & pricing
- Order status tracking
- Payment information
- Delivery address & special instructions
- Rate limiting fields

### 4. **Category Model**
- Food categories (e.g., Vegetables, Fruits, Snacks)
- Used for menu organization

### 5. **Inventory Model**
- Stock tracking for menu items
- Reorder levels
- Quantity management

### 6. **Promotion Model**
- Discount codes
- Special offers
- Promotion validity periods

### 7. **Rating Model**
- User ratings for menu items
- Comments/reviews
- Rating scores

### 8. **ContactForm Model**
- Customer inquiries
- Support tickets
- Feedback collection

---

## ✨ Key Features

### **Customer Features**
1. **User Authentication**
   - Sign up / Login with email verification
   - Password encryption with bcryptjs
   - JWT-based session management
   - Profile management

2. **Food Browsing & Selection**
   - Browse menu items by category
   - View detailed item information (price, calories, ingredients, prep time)
   - Search functionality
   - Filter by category

3. **Shopping Cart**
   - Add/remove items from cart
   - Quantity adjustment
   - Cart persistence
   - Real-time cart updates

4. **Wishlist System**
   - Save favorite items
   - Wishlist management
   - Wishlist counter display

5. **Order Management**
   - Place orders with customer details
   - View order status in real-time
   - Order history
   - Order confirmation emails
   - Special delivery instructions

6. **Rating & Reviews**
   - Rate menu items (1-5 stars)
   - Write reviews
   - View item ratings

7. **Contact & Support**
   - Contact form for inquiries
   - Email notifications

8. **User Profile**
   - View/edit profile information
   - Order history
   - Saved addresses
   - Payment methods

### **Admin Features**
1. **Dashboard Analytics**
   - Sales charts and graphs (Recharts)
   - Order statistics
   - Revenue tracking
   - Customer metrics

2. **Order Management**
   - View all orders
   - Update order status
   - Real-time order tracking with Socket.io
   - Filter & search orders

3. **Product Management**
   - Add/edit/delete menu items
   - Image upload (Cloudinary)
   - Inventory tracking
   - Category management
   - Set item popularity

4. **Inventory Management**
   - Track stock levels
   - Set reorder levels
   - Inventory alerts

5. **Customer Management**
   - View customer details
   - Customer order history
   - Customer analytics

6. **Promotion Management**
   - Create discount codes
   - Manage special offers
   - Track promotion effectiveness

7. **Settings**
   - Application configuration
   - Admin preferences

---

## 🔐 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Token-based authentication
- **Authorization Middleware**: Role-based access control (User/Admin)
- **CORS Configuration**: Restricted to allowed origins
- **Helmet.js**: HTTP header security
- **Email Verification**: OTP-based email verification for new accounts
- **Secure Routes**: Protected routes for authenticated users only

---

## 🔄 Real-time Features

- **Socket.io Integration**
  - Real-time order status updates
  - Live order tracking for customers
  - Admin notifications for new orders
  - Order delivery updates

---

## 📧 Email Service

- **Nodemailer Integration**: Automated email notifications
- **Email Templates**: 
  - Order confirmation emails
  - Order status updates
  - Account verification
  - Contact form responses
  
---

## 🌐 API Endpoints

### Authentication Routes (`/api/auth`)
- POST `/register` - User registration
- POST `/login` - User login
- POST `/logout` - User logout
- POST `/verify-email` - Email verification

### User Routes (`/api/user`)
- GET `/profile` - Get user profile
- PUT `/profile` - Update profile
- GET `/orders` - Get user's orders

### Menu Routes (`/api/menu-items`)
- GET `/` - Get all menu items
- GET `/:id` - Get menu item details
- POST `/` - Create menu item (admin)
- PUT `/:id` - Update menu item (admin)
- DELETE `/:id` - Delete menu item (admin)

### Category Routes (`/api/categories`)
- GET `/` - Get all categories
- POST `/` - Create category (admin)
- PUT `/:id` - Update category (admin)
- DELETE `/:id` - Delete category (admin)

### Order Routes (`/api/orders`)
- POST `/` - Create order
- GET `/:id` - Get order details
- GET `/user/:userId` - Get user's orders
- PUT `/:id` - Update order status (admin)
- GET `/` - Get all orders (admin)

### Admin Routes (`/api/admin`)
- Dashboard analytics endpoints
- Order management endpoints
- Customer management endpoints

### Rating Routes (`/api/ratings`)
- GET `/` - Get ratings
- POST `/` - Create rating
- PUT `/:id` - Update rating
- DELETE `/:id` - Delete rating

### Contact Routes (`/api/contact`)
- POST `/` - Submit contact form
- GET `/` - Get contact submissions (admin)

---

## 🚀 Deployment

- **Frontend**: Deployed on Vercel (vercel.json configured)
  - URL: `https://foodordering-q4rq.vercel.app`
  - Build command: `vite build`

- **Backend**: Node.js server with MongoDB
  - CORS configured for both local development and production
  - Environment variables: `.env` file
  - File uploads: Cloudinary integration

---

## 🛠️ Development Setup

### Backend Start
```bash
npm start
# Runs with nodemon for auto-reload
# Server runs on http://localhost:5000
```

### Frontend Development
```bash
npm run dev
# Vite development server
# Runs on http://localhost:5173
```

### Frontend Build
```bash
npm run build
# Production build
```

---

## 📊 Database Seeding

Scripts available for:
- `seedAdmin.js` - Create admin user
- `seedCategories.js` - Populate categories
- `seedDatabase.js` - Full database initialization
- `clearDatabase.js` - Clear all data
- `initInventory.js` - Initialize inventory

---

## 🎨 UI/UX Features

- **Dark Mode Support**: Theme context with light/dark modes
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Animations**: GSAP & Framer Motion for smooth transitions
- **3D Elements**: Three.js for interactive 3D components
- **Maps Integration**: Leaflet for delivery location selection
- **Toast Notifications**: React Hot Toast for user feedback
- **Loading States**: Skeleton loaders and spinners
- **Accessibility**: Semantic HTML and ARIA labels

---

## 📝 Development Notes

### Key Technologies Used
- **State Management**: React Context API (Cart, Wishlist, Auth, Theme)
- **HTTP Requests**: Axios with API service layer
- **Form Handling**: Custom hooks and controlled components
- **Validation**: Client-side validation before API calls

### Code Quality
- ESLint configured for code quality
- ESLint plugins for React hooks and React Refresh
- Consistent code formatting

---

## 🎓 Learning Outcomes

This project demonstrates proficiency in:
1. Full-stack web development
2. MERN stack (MongoDB, Express, React, Node.js)
3. Real-time communication with WebSockets (Socket.io)
4. RESTful API design
5. User authentication & authorization
6. Database design with MongoDB
7. Frontend component architecture
8. UI/UX best practices
9. Deployment (Vercel, Node.js servers)
10. Email services integration
11. File upload handling (Cloudinary)
12. E-commerce functionalities

---

## 📈 Future Enhancement Possibilities

1. Payment gateway integration (Stripe, PayPal)
2. Advanced analytics and reporting
3. AI-based food recommendations
4. Loyalty program system
5. Mobile app (React Native)
6. SMS notifications
7. Advanced inventory forecasting
8. Multi-restaurant support
9. Rating & recommendation algorithm
10. Push notifications

---

## ✅ Project Completion Status

- **Backend API**: Complete with authentication, order management, and admin features
- **Frontend UI**: Complete with all major pages and flows
- **Real-time Features**: Socket.io integration for order tracking
- **Database**: MongoDB models for all core features
- **Deployment**: Ready for production (Vercel + Node.js server)

---

**Project Created**: College Project  
**Current Status**: Functional Full-Stack Application  
**Technology Maturity**: Production-Ready
