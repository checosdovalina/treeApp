# Replit.md - Uniformes Laguna E-commerce Platform

## Overview

This is a full-stack e-commerce application for "Uniformes Laguna," a uniform/clothing business. The system provides both admin management capabilities and a public store interface. It's built with React (frontend), Express.js (backend), and PostgreSQL database using Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

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