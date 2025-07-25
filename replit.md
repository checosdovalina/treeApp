# Replit.md - TREE Uniformes & Kodiak Industrial E-commerce Platform  

## Overview

This is a full-stack e-commerce application for "TREE Uniformes & Kodiak Industrial," a uniform/clothing business specializing in industrial and corporate uniforms. The system provides both admin management capabilities and a public store interface. It's built with React (frontend), Express.js (backend), and PostgreSQL database using Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.
User language: Spanish (communicate in Spanish)
User role: Administrator seeking to access admin functions
Design inspiration: lacasadelachamarra.com - modern e-commerce layout with hero sections, product grids, and clean navigation
Priority: Mobile responsiveness is essential for customer experience
Authentication: Role-based system with admin vs customer accounts and appropriate redirections

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and production builds
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI with shadcn/ui component library
- **Styling**: Tailwind CSS with custom design tokens for uniform branding
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OIDC integration
- **Session Management**: Express sessions with PostgreSQL storage
- **Build**: ESBuild for server bundling

### Database Architecture
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for type-safe database operations
- **Migrations**: Drizzle-kit for database migrations in `./migrations`

## Key Components

### Authentication System
- **Provider**: Replit Auth with OIDC
- **Role-based Access**: Admin and customer roles
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Protected Routes**: Middleware for admin-only endpoints

### Product Management
- **Categories**: Hierarchical product categorization
- **Inventory**: Size and color variant tracking
- **Images**: Multiple image support per product
- **Status Management**: Active/inactive product states

### Order Management
- **Quote System**: Manual quote creation for B2B customers
- **Order Processing**: Full order lifecycle management
- **Customer Management**: Customer database with purchase history

### Shopping Cart
- **Client-side Storage**: localStorage-based cart persistence
- **Real-time Updates**: React hooks for cart state management
- **Variant Support**: Size and color selection

### Admin Dashboard
- **Product CRUD**: Full product management interface
- **Order Management**: Order processing and tracking
- **Customer Management**: Customer database and history
- **Quote Generation**: PDF export and email capabilities
- **Analytics**: Sales reporting and product performance

## Data Flow

1. **Authentication Flow**:
   - User accesses protected routes → Auth middleware checks session
   - New users redirected to Replit Auth → OIDC flow → User creation/update
   - Session stored in PostgreSQL with TTL

2. **Product Management Flow**:
   - Admin creates/updates products → Validation → Database storage
   - Public catalog queries active products with filtering
   - Inventory tracking per product variant

3. **Order Flow**:
   - Customer adds items to cart → localStorage storage
   - Checkout process → Order creation → Inventory updates
   - Admin order management → Status updates

4. **Quote Flow**:
   - Admin creates manual quotes → PDF generation → Email delivery
   - Quote conversion to orders

## External Dependencies

### Database
- **Provider**: Neon Database (PostgreSQL)
- **Connection**: Connection pooling with @neondatabase/serverless
- **Environment**: DATABASE_URL required for connection

### Authentication
- **Provider**: Replit Auth
- **Configuration**: REPLIT_DOMAINS, ISSUER_URL, REPL_ID required
- **Session**: SESSION_SECRET for session encryption

### UI Libraries
- **Radix UI**: Comprehensive component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **React Hook Form**: Form management
- **Zod**: Schema validation

### Development Tools
- **Vite**: Development server and build tool
- **TypeScript**: Type safety across the stack
- **ESBuild**: Server bundling for production

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution
- **Database**: Drizzle-kit for schema management

### Production
- **Build Process**: 
  - Frontend: Vite build → `dist/public`
  - Backend: ESBuild → `dist/index.js`
- **Startup**: Node.js serving bundled Express app
- **Static Files**: Frontend served from `/dist/public`

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit authentication identifier
- `REPLIT_DOMAINS`: Allowed domains for auth
- `ISSUER_URL`: OIDC issuer URL (defaults to Replit)

### Business Requirements
Based on the requirements document, the system supports:
- Product and inventory management by admin
- Quote creation and PDF export
- Sales reporting and analytics
- Customer management with purchase history
- Public catalog with filtering
- Corporate uniform solutions

The architecture is designed to handle both B2B (quote-based) and B2C (direct purchase) sales models typical for uniform businesses.

### Recent Changes and Improvements (January 2025)

#### Advanced Product Management System (July 2025)
- **Dynamic Brand Management**: Created comprehensive brand system with ability to add new brands on-the-fly
- **Checkbox-based Size Selection**: Implemented intuitive size selection with visual checkboxes and dynamic size creation
- **Advanced Color Management**: Added color selection with hex codes and visual color swatches
- **Dynamic Category Creation**: Enhanced category system allowing real-time category addition during product creation
- **Professional Image Management**: Implemented multiple image upload with preview and easy removal
- **Database Schema Enhancement**: Added brands, sizes, and colors tables with proper relationships
- **Modern UI Components**: Created advanced product form using cards, scrollable areas, and professional styling
- **Complete CRUD Operations**: Full API implementation for all new entities (brands, sizes, colors)
- **Data Seeding**: Populated database with realistic initial data for brands, sizes, and colors

#### Brand Integration (July 2025)
- **Logo Integration**: Successfully integrated TREE Uniformes & Kodiak Industrial logo throughout the platform
- **Consistent Branding**: Updated all layouts (customer, admin) with new brand identity
- **Mobile Optimization**: Ensured logo displays correctly on mobile devices and responsive layouts
- **Footer Updates**: Updated company information and contact details to reflect new branding
- **Landing Page**: Redesigned landing page with new brand messaging and visual identity

#### SKU Implementation (July 2025)
- **Database Schema Update**: Added SKU (Stock Keeping Unit) column to products table with unique constraint
- **Product Form Enhancement**: Extended advanced product form to include SKU input field with validation
- **SKU Display**: Integrated SKU display in both admin product management and customer catalog
- **Data Migration**: Added unique SKU codes to existing products following standard format
- **Validation Rules**: Implemented SKU format validation (uppercase letters, numbers, hyphens, underscores)

#### Image Upload System (July 2025)
- **Local File Support**: Added ability to upload images directly from device (PNG, JPG, JPEG, WEBP)
- **Dual Input Methods**: Supports both URL-based and file-based image uploads
- **Base64 Conversion**: Converts uploaded files to base64 for storage and display
- **Multi-file Upload**: Allows multiple image selection in a single upload
- **File Validation**: Validates file types and handles upload errors gracefully
- **Preview System**: Real-time preview of uploaded images with remove functionality

### Recent Changes and Improvements (January 2025)

#### Authentication System Enhancements
- **Role-based Login System**: Created comprehensive login page with dual interface (admin vs customer)
- **Smart Redirections**: Admins redirect to admin panel, customers to store interface
- **Session Management**: Improved authentication flows with proper error handling
- **Security**: Added unauthorized error handling at both page and endpoint levels

#### Customer Experience Overhaul
- **Modern Store Interface**: Redesigned customer-facing pages inspired by lacasadelachamarra.com
- **Mobile-First Design**: Fully responsive layout optimized for mobile devices
- **Customer Layout**: New layout component with mobile-optimized navigation and footer
- **Shopping Cart**: Complete cart functionality with localStorage persistence
- **Product Catalog**: Advanced filtering, sorting, and search capabilities
- **Touch-Friendly UI**: Improved touch targets and mobile interactions

#### Mobile Responsiveness
- **Responsive Grid System**: Mobile-first product grids with auto-fit layouts
- **Touch Optimizations**: Improved button sizes and touch targets for mobile
- **Viewport Management**: Proper handling of mobile viewports and safe areas
- **Mobile Navigation**: Collapsible mobile menu with sheet component
- **Performance**: Optimized loading states and animations for mobile

#### UI/UX Improvements
- **Design System**: Enhanced CSS variables and utility classes for uniform branding
- **Loading States**: Skeleton screens and shimmer effects for better UX
- **Error Handling**: Comprehensive error states with user-friendly messages
- **Accessibility**: Improved keyboard navigation and screen reader support
- **Visual Hierarchy**: Better spacing, typography, and visual organization

#### Shopping Experience
- **Product Selection**: Interactive color and size selection with visual feedback
- **Cart Management**: Real-time cart updates with quantity controls
- **WhatsApp Integration**: Direct product inquiry via WhatsApp
- **Product Favorites**: Wishlist functionality (foundation laid)
- **Advanced Search**: Multi-parameter search with category filtering

#### Technical Infrastructure
- **Component Architecture**: Modular components for better maintainability
- **State Management**: Improved cart state with localStorage persistence
- **Route Management**: Comprehensive routing system with role-based access
- **API Integration**: Consistent error handling and loading states
- **Performance**: Optimized bundle sizes and loading patterns

#### Admin Panel Fixes
- **Product Management**: Fixed product form rendering and validation issues
- **Navigation**: Resolved nested link warnings in admin sidebar
- **Dashboard**: Improved admin dashboard with proper data visualization
- **Inventory**: Enhanced inventory management with better UX

The system now provides a complete e-commerce experience with professional admin tools and a modern, mobile-optimized customer interface that matches industry standards.