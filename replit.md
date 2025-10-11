# Replit.md - TREE Uniformes & Kodiak Industrial E-commerce Platform

## Overview
This is a full-stack e-commerce application for "TREE Uniformes & Kodiak Industrial," a uniform/clothing business specializing in industrial and corporate uniforms. The system provides both admin management capabilities and a public store interface. It supports B2B (quote-based) and B2C (direct purchase) sales models. Key capabilities include product and inventory management, quote creation with PDF export, sales reporting, customer management with purchase history, and a public catalog with advanced filtering. The project aims to provide a modern, mobile-optimized e-commerce experience matching industry standards.

## User Preferences
Preferred communication style: Simple, everyday language.
User language: Spanish (communicate in Spanish)
User role: Administrator with full access to admin panel (checodovalina@gmail.com)
Design inspiration: lacasadelachamarra.com - modern e-commerce layout with hero sections, product grids, and clean navigation
Priority: Mobile responsiveness is essential for customer experience
Authentication: Role-based system with admin vs customer accounts and appropriate redirections
Admin Access: FULLY FUNCTIONAL - Authentication system working seamlessly without page refresh requirements
Customer Access: FULLY FUNCTIONAL - Customer registration and login system working correctly with proper password hashing
Navigation Updates: Store is now the default home page for all users, improved breadcrumb navigation and context actions between admin/store
Registration System: Added admin registration capability with secure admin code validation, customer registration with bcrypt password hashing
Login Credentials: admin/admin123 or registered admin emails work perfectly, customer accounts (e.g., checodovalina2@gmail.com) working correctly

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter
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
- **Key Tables**: Users, sessions, products (with SKU, brand, size, color, garment type tracking), categories, brands, sizes, colors, garment_types, orders, order_items, quotes, inventory, **product_color_images** (color-specific product images).

### Key Features & Technical Implementations
- **Authentication System**: FULLY OPERATIONAL - Dual authentication (Replit Auth + local auth), role-based access with seamless routing, PostgreSQL-backed sessions, optimized login flow with proper cache invalidation and timing. Customer authentication fully functional with bcrypt password hashing and proper session management.
- **Product Management**: Hierarchical categorization, inventory tracking (size/color variants), multiple image support (URL/file upload with base64 conversion), active/inactive states, dynamic brand/size/color/category creation. Gender-specific size configurations based on garment type. SKU implementation with validation. **COMPLETED**: Color-specific product images system fully functional - customers can preview garments in selected colors with proper image switching. **RESOLVED**: Size system now includes 3XL and 4XL sizes in all components - cache issues fixed in both product creation and editing forms.
- **Order Management**: Manual quote creation (B2B) with PDF export and email, full order lifecycle management, customer database with purchase history. **NEW**: Automated email notifications using Resend API - customers and admins receive confirmation emails when orders are placed or quotes are requested.
- **Shopping Cart**: Client-side localStorage persistence, real-time updates, variant support.
- **Admin Dashboard**: Comprehensive CRUD for products, order processing, customer management, quote generation, sales analytics. Product color image configuration interface available. **COMPLETED**: TypeScript errors resolved, dashboard fully functional with stats, top products, and recent orders sections. **NEW**: Configurable industry sections with object storage image upload capability. **COMPLETED**: Contact messages management system - admins can view, filter, and mark messages as read from the dashboard navigation.
- **UI/UX**: Consistent branding across customer and admin interfaces, mobile-optimized navigation, advanced filtering/sorting, WhatsApp integration for product inquiry. Expandable navigation menus with hover-based submenus for catalog and brand filtering. **UPDATED**: Industry sections converted to rotating carousel format. Main hero section modified to show "test" instead of "UNIFORMES". **COMPLETED**: Brand showcase carousel with minimal design (logo, name, "Ver productos" only), dark gradient background for better contrast. **UPDATED**: SKU badges removed from product cards in catalog for cleaner appearance.
- **Object Storage Integration**: Full object storage implementation with @google-cloud/storage, @uppy file uploads, ACL policies, and secure image management for industry section configuration.
- **Deployment Ready**: Application successfully built for production with optimized bundles and static assets generated.

## External Dependencies

### Database
- **Provider**: Neon Database (PostgreSQL)
- **Connection**: @neondatabase/serverless for connection pooling

### Authentication
- **Provider**: Replit Auth
- **Configuration**: Requires `REPLIT_DOMAINS`, `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`.

### Email Notifications
- **Provider**: Resend (resend.com)
- **Configuration**: Requires `RESEND_API_KEY` environment variable (configured with full access)
- **Implementation**: `server/email.service.ts` - Service with HTML email templates and notification functions
- **Current Status**: PARTIALLY OPERATIONAL - Emails send successfully to admin (angelitosfoto@gmail.com) only
- **Domain Status**: treeuniforme.com registered in Resend but NOT YET VERIFIED (waiting for DNS propagation, 1-48 hours)
- **Current Limitation**: Using onboarding@resend.dev (test email) - can only send to angelitosfoto@gmail.com
- **Features**: 
  - Order confirmation emails with full order details, shipping information, and itemized list
  - Order notifications to admin for new orders
  - Quote confirmation emails with quote details and validity period
  - Quote notifications to admin for new quote requests
  - Professional HTML templates with brand colors (#1F4287) and styling
  - Non-blocking email sending (doesn't fail order/quote creation if email fails)
- **Next Steps**: 
  1. Wait for treeuniforme.com DNS verification (check resend.com/domains periodically)
  2. Once verified, change FROM_EMAIL in server/email.service.ts to 'pedidos@treeuniforme.com'
  3. Then emails will be sent to all customers (not just admin)

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