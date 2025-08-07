# OrderTracker
A real-time food delivery tracking system built with Next.js (frontend) and Node.js, Express, Socket.IO (backend).

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation & Setup](#installation--setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [User Roles](#user-roles)
- [Key Features](#key-features)
- [Detailed Implementation](#detailed-implementation)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [API Endpoints](#api-endpoints)
- [Real-time Features](#real-time-features)
- [Development](#development)
- [License](#license)

## Project Overview
OrderTracker is a comprehensive food delivery platform that connects customers, vendors, and delivery partners in real-time. The system provides live order tracking with GPS navigation, role-based dashboards, and seamless communication between all parties involved in the delivery process.

**Note**: This README describes the intended features and architecture of the OrderTracker system. Not all features listed may be fully implemented in the current version. The project serves as a demonstration of modern web development practices and real-time delivery tracking concepts.

## Features
- **Real-time order tracking** with live GPS updates
- **Multi-role system** (Customer, Vendor, Delivery Partner)
- **Interactive map integration** with route optimization
- **Live location sharing** via Socket.IO
- **Order management** with status updates
- **User authentication** with JWT
- **Responsive UI** with dark/light theme support
- **Real-time notifications** and status updates
- **Delivery partner availability** management
- **Vendor inventory** and order processing

**Implementation Status**: The features listed above represent the planned functionality. Some features may be partially implemented or in development. The current implementation focuses on demonstrating core concepts of real-time delivery tracking and role-based user interfaces.

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **React Leaflet** - Interactive maps
- **Socket.IO Client** - Real-time communication
- **Lucide React** - Modern icon library
- **Radix UI** - Headless UI components
- **next-themes** - Theme management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type safety for backend
- **MongoDB** with **Mongoose** - Database and ODM
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Authentication and authorization
- **bcrypt** - Password hashing
- **UUID** - Unique identifier generation

## Folder Structure
```
assignment/
│
├── frontend/                    # Next.js frontend application
│   ├── app/                    # Next.js App Router pages
│   │   ├── customer/           # Customer dashboard
│   │   ├── vendor/             # Vendor dashboard
│   │   ├── deliverypartner/    # Delivery partner dashboard
│   │   ├── ordertracking/      # Real-time order tracking
│   │   ├── login/              # Authentication
│   │   └── signup/             # User registration
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # Base UI components
│   │   └── mapcomponents/      # Map-related components
│   ├── context/                # React Context providers
│   ├── socket/                 # Socket.IO client services
│   ├── types/                  # TypeScript type definitions
│   └── utility/                # Helper functions
│
├── backend/                    # Node.js backend application
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── models/             # MongoDB models
│   │   ├── routes/             # API route definitions
│   │   ├── interfaces/         # TypeScript interfaces
│   │   ├── middlewares/        # Custom middleware
│   │   ├── services/           # Business logic services
│   │   ├── socket/             # Socket.IO server logic
│   │   └── config/             # Configuration files
│   └── dist/                   # Compiled JavaScript
│
└── README.md                   # Project documentation
```

## Installation & Setup

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend root with the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

1. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`.

## User Roles

### 1. Customer
- **Browse vendors** and available items
- **Place orders** with delivery address
- **Track orders** in real-time with live GPS
- **View order history** and receipts
- **Manage profile** and delivery preferences

### 2. Vendor
- **Manage inventory** and add new items
- **Process incoming orders**
- **Assign orders** to delivery partners
- **Track order fulfillment**
- **View sales analytics**

### 3. Delivery Partner
- **View assigned deliveries**
- **Accept/reject orders**
- **Navigate with GPS** to pickup and delivery locations
- **Update delivery status** in real-time
- **Track earnings** and performance metrics
- **Manage availability** status

## Key Features

### Real-time Order Tracking
- Live GPS tracking of delivery partners
- Route optimization using OpenRouteService API
- Real-time status updates via Socket.IO
- Interactive map with pickup and delivery markers

### Order Management Flow
1. **Order Creation**: Customer selects items and places order
2. **Vendor Processing**: Vendor confirms and assigns to delivery partner
3. **Pickup**: Delivery partner collects the order
4. **In Transit**: Live tracking with GPS updates
5. **Delivered**: Order completion with customer confirmation

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Secure password hashing with bcrypt
- Protected routes and API endpoints

## Detailed Implementation

### Backend

#### 1. Server Architecture (`backend/src/app.ts`)
- Express.js server with TypeScript
- CORS configuration for frontend communication
- Socket.IO integration for real-time features
- MongoDB connection with Mongoose ODM

#### 2. Database Models
- **User Model**: Handles customers, vendors, and delivery partners
- **Order Model**: Manages order lifecycle and status
- **Item Model**: Vendor inventory management

#### 3. Socket.IO Events (`backend/src/socket/`)
- `join-room`: Users join order-specific rooms
- `send-location`: Delivery partners broadcast location updates
- `location-update`: Real-time location sharing with customers
- Room-based communication for order-specific updates

#### 4. API Controllers
- **Order Controller**: Order creation, status updates, retrieval
- **User Controller**: Authentication, profile management
- **Vendor Controller**: Item management, order assignment
- **Delivery Partner Controller**: Order acceptance, completion, availability

### Frontend

#### 1. App Structure
- **Next.js App Router** for file-based routing
- **TypeScript** for type safety
- **Responsive design** with Tailwind CSS

#### 2. Key Components
- **OrderTracking**: Real-time GPS tracking with interactive maps
- **Map Components**: Leaflet integration with route visualization
- **User Context**: Global state management for authentication
- **Socket Client**: Real-time communication with backend

#### 3. Role-based Dashboards
- **Customer Dashboard**: Order placement and tracking
- **Vendor Dashboard**: Inventory and order management
- **Delivery Dashboard**: Delivery management and navigation

#### 4. Real-time Features
- Live location updates via Socket.IO
- Order status notifications
- Real-time route visualization
- GPS navigation for delivery partners

## API Endpoints

### Authentication
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `GET /api/v1/users/logout` - User logout

### Orders
- `GET /api/v1/orders` - Get all orders
- `POST /api/v1/orders/create` - Create new order
- `POST /api/v1/orders/update-status` - Update order status

### Vendors
- `POST /api/v1/vendors/createitem` - Add new item
- `POST /api/v1/vendors/assignorder/:orderId` - Assign order to delivery partner

### Delivery Partners
- `GET /api/v1/delivery-partners/allassignedorders` - Get assigned orders
- `POST /api/v1/delivery-partners/acceptorder/:orderId` - Accept order
- `POST /api/v1/delivery-partners/updateavailability` - Update availability status

### Maps
- `GET /api/v1/map/getaddresscoordinate/:address` - Geocode address to coordinates

## Real-time Features

### Location Tracking
The system implements sophisticated real-time location tracking:

1. **GPS Monitoring**: Delivery partners' locations are continuously tracked
2. **Socket Rooms**: Each order has a dedicated Socket.IO room
3. **Live Updates**: Customers receive real-time location updates
4. **Route Optimization**: Integration with OpenRouteService for optimal routing

### Order Status Flow
```
pending → assigned → picked_up → in_transit → delivered
```

Each status change is broadcasted in real-time to all relevant parties.

## Development

### Key Files
- **Frontend entry**: `frontend/app/layout.tsx`
- **Backend entry**: `backend/src/app.ts`
- **Socket server**: `backend/src/socket/socketConnect.ts`
- **Order tracking**: `frontend/components/orderTracking.tsx`
- **Map integration**: `frontend/components/mapcomponents/Map.tsx`

### Development Features
- **Hot reload** for both frontend and backend
- **TypeScript compilation** with watch mode
- **Environment-based configuration**
- **CORS handling** for cross-origin requests

### External Services
- **OpenRouteService**: Route calculation and navigation
- **MongoDB Atlas**: Cloud database hosting
- **Vercel/Render**: Deployment platforms

## Inspiration
OrderTracker was inspired by modern food delivery platforms like:
- **DoorDash**: For order management and tracking features
- **Uber Eats**: For real-time delivery tracking
- **Grubhub**: For vendor management systems

The project builds upon these concepts with enhanced real-time capabilities and role-based dashboards.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**OrderTracker** - Bringing real-time delivery tracking to the modern food delivery experience.
