# Replit.md - TREE Uniformes & Kodiak Industrial E-commerce Platform

## Overview
This is a full-stack e-commerce application for "TREE Uniformes & Kodiak Industrial," a uniform/clothing business specializing in industrial and corporate uniforms. The system provides both admin management capabilities and a public store interface. It supports B2B (quote-based) and B2C (direct purchase) sales models. Key capabilities include product and inventory management, quote creation with PDF export, sales reporting, customer management with purchase history, and a public catalog with advanced filtering. The project aims to provide a modern, mobile-optimized e-commerce experience matching industry standards.

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
- **Authentication System**: Replit Auth, role-based access, protected routes, PostgreSQL-backed sessions.
- **Product Management**: Hierarchical categorization, inventory tracking (size/color variants), multiple image support (URL/file upload with base64 conversion), active/inactive states, dynamic brand/size/color/category creation. Gender-specific size configurations based on garment type. SKU implementation with validation. **COMPLETED**: Color-specific product images system fully functional - customers can preview garments in selected colors with proper image switching. Complete product catalog with 26+ diverse items across all categories.
- **Order Management**: Manual quote creation (B2B) with PDF export and email, full order lifecycle management, customer database with purchase history.
- **Shopping Cart**: Client-side localStorage persistence, real-time updates, variant support.
- **Admin Dashboard**: Comprehensive CRUD for products, order processing, customer management, quote generation, sales analytics. Product color image configuration interface available.
- **Promotional System**: **COMPLETED**: Hero-style banner system with responsive design, image management, rotation controls, and admin configuration interface. Banners adapt from 80px mobile to 600px desktop with proportional text scaling.
- **UI/UX**: Consistent branding across customer and admin interfaces, mobile-optimized navigation, advanced filtering/sorting, WhatsApp integration for product inquiry. Expandable navigation menus with hover-based submenus for catalog and brand filtering.

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