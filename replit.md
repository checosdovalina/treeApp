# Replit.md - TREE Uniformes & Kodiak Industrial E-commerce Platform

## Overview
This is a complete functional e-commerce platform for "TREE Uniformes & Kodiak Industrial," a uniform/clothing business specializing in industrial and corporate uniforms. The system provides both admin management capabilities and a fully functional store interface where customers can create accounts, browse products, add items to cart, and manage orders. It supports B2B (quote-based) and B2C (direct purchase) sales models. Key capabilities include product and inventory management, shopping cart functionality, order processing, customer account management, quote creation with PDF export, sales reporting, and a public catalog with advanced filtering. The project provides a modern, mobile-optimized e-commerce experience matching industry standards.

## User Preferences
Preferred communication style: Simple, everyday language.
User language: Spanish (communicate in Spanish)
User role: Administrator with full access to admin panel (checodovalina@gmail.com)
Design preference: Simple, minimalist design - user dislikes complex layouts, prefers clean and simple interfaces
Priority: Mobile responsiveness is essential for customer experience
Product schema: Keep all product functionality and database schema intact
Authentication: Role-based system with admin vs customer accounts and appropriate redirections
Admin Access: Confirmed working - user has admin role and can access /admin dashboard

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter - **UPDATED**: Store (`/store`) is now the main landing page with integrated login/register module and smart role-based redirection
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI with shadcn/ui
- **Styling**: Tailwind CSS with custom design tokens for uniform branding. Incorporates brand colors (azul profundo #1F4287, amarillo dorado #FFCC00), Poppins and Roboto fonts, and professional styling elements throughout.
- **Forms**: React Hook Form with Zod validation
- **Design Decisions**: Mobile-first design, responsive grid system, enhanced header (80px height, golden border), redesigned mobile menu, updated footer, gradient button styles, skeleton screens, shimmer effects, and comprehensive error handling.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OIDC integration, role-based access for admin and customer roles
- **Session Management**: Express sessions with PostgreSQL storage
- **Build**: ESBuild for server bundling

### Database Architecture
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Drizzle-kit for database migrations in `./migrations`
- **Key Tables**: Users, sessions, products (with SKU, brand, size, color, garment type tracking), categories, brands, sizes, colors, garment_types, orders, order_items, quotes, inventory, **product_color_images** (color-specific product images), **customer_discounts**, **role_discounts**.
- **UPDATED**: Role system with enum: admin, premium (15% discount), regular (8% discount), basic (no discount). Discount system with percentage-based calculations and role-specific benefits.

### Key Features & Technical Implementations
- **Authentication System**: Dual authentication (Replit Auth + Local Auth), role-based access, smart redirection (admin→/admin, customers→/store), integrated login module on store homepage. **COMPLETED**: Store as main landing page with seamless authentication flow. Error handling and session management fully functional with robust logging.
- **Product Management**: Hierarchical categorization, inventory tracking (size/color variants), multiple image support (URL/file upload with base64 conversion), active/inactive states, dynamic brand/size/color/category creation. Gender-specific size configurations based on garment type. SKU implementation with validation. **COMPLETED**: Color-specific product images system fully functional - customers can preview garments in selected colors with proper image switching. **RESOLVED**: Size system now includes 3XL and 4XL sizes in all components - cache issues fixed in both product creation and editing forms.
- **Order Management**: Manual quote creation (B2B) with PDF export and email, full order lifecycle management, customer database with purchase history.
- **Shopping Cart System**: **NEW FEATURE**: Complete shopping cart functionality with database persistence, real-time updates, variant support (size/color selection), quantity management, add/remove items, cart drawer with product images, total calculations, and secure checkout process. Cart data persists across sessions for authenticated users.
- **E-commerce Functionality**: **FULLY IMPLEMENTED**: Customers can browse products, add items to cart with size/color variants, view cart summary, manage quantities, and proceed through checkout. Shopping cart drawer shows real-time item count, product details, pricing, and total calculations. Add-to-cart buttons integrated throughout product listings.
- **Customer Account Management**: **NEW**: Complete customer account system with order history, profile management, purchase tracking, and account dashboard. Users can view past orders, order status, and manage personal information.
- **Admin Dashboard**: Comprehensive CRUD for products, order processing, customer management, quote generation, sales analytics. Product color image configuration interface available. **COMPLETED**: TypeScript errors resolved, dashboard fully functional with stats, top products, and recent orders sections. **NEW**: Configurable industry sections with object storage image upload capability.
- **UI/UX**: Consistent branding across customer and admin interfaces, mobile-optimized navigation, advanced filtering/sorting, WhatsApp integration for product inquiry. Expandable navigation menus with hover-based submenus for catalog and brand filtering. **UPDATED**: Industry sections converted to rotating carousel format. Main hero section modified to show "test" instead of "UNIFORMES". **COMPLETED**: Brand showcase carousel with minimal design (logo, name, "Ver productos" only), dark gradient background for better contrast. **UPDATED**: SKU badges removed from product cards in catalog for cleaner appearance.
- **Customer Discount System**: **NEW**: Role-based discount system implemented with visual price displays, discount badges, and customer benefits page. Premium customers receive 15% discount, regular customers 8% discount, basic customers no discount. Price display components show original price, discounted price, and savings.
- **Object Storage Integration**: Full object storage implementation with @google-cloud/storage, @uppy file uploads, ACL policies, and secure image management for industry section configuration.
- **Deployment Ready**: Application successfully built for production with optimized bundles and static assets generated.

## External Dependencies

### Database
- **Provider**: Neon Database (PostgreSQL)
- **Connection**: @neondatabase/serverless for connection pooling

### Authentication
- **Provider**: Replit Auth
- **Configuration**: Requires `REPLIT_DOMAINS`, `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`.

### UI Libraries
- **Radix UI**: Component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **React Hook Form**: Form management
- **Zod**: Schema validation

### Development Tools
- **Vite**: Frontend development server and build tool
- **TypeScript**: Type safety
- **ESBuild**: Backend bundling