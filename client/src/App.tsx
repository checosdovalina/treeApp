import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import LoginPage from "@/pages/auth/login";
import AdminDashboard from "@/pages/admin/dashboard-simple";
import CustomerRegisterPage from "@/pages/auth/customer-register";
import AdminRegisterPage from "@/pages/auth/admin-register";
import AdminProducts from "@/pages/admin/products";
import AdminOrders from "@/pages/admin/orders";
import AdminCustomers from "@/pages/admin/customers";
import AdminQuotes from "@/pages/admin/quotes";
import AdminSales from "@/pages/admin/sales";
import AdminReports from "@/pages/admin/reports";
import AdminPromotions from "@/pages/admin/promotions";
import AdminIndustrySections from "@/pages/admin/industry-sections";
import StoreHome from "@/pages/store/index";
import StoreCatalog from "@/pages/store/catalog";
import StoreBrands from "@/pages/store/brands";
import ProductDetail from "@/pages/store/product-detail";
import Cart from "@/pages/store/cart";
import Checkout from "@/pages/store/checkout";
import CustomerDashboard from "@/pages/customer/dashboard";
import CustomerRegister from "@/pages/auth/customer-register";
import AdminRegister from "@/pages/auth/admin-register";
import QuoteRequest from "@/pages/store/quote-request";
import { useAuth } from "@/hooks/useAuth";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uniform-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Show routes for non-authenticated users
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={StoreHome} />
        <Route path="/landing" component={Landing} />
        <Route path="/login" component={LoginPage} />
        <Route path="/auth/login" component={LoginPage} />
        <Route path="/auth/register" component={CustomerRegisterPage} />
        <Route path="/auth/customer-register" component={CustomerRegisterPage} />
        <Route path="/auth/admin-register" component={AdminRegisterPage} />
        <Route path="/store" component={StoreHome} />
        <Route path="/store/catalog" component={StoreCatalog} />
        <Route path="/store/polos" component={StoreCatalog} />
        <Route path="/store/playeras" component={StoreCatalog} />
        <Route path="/store/brands" component={StoreBrands} />
        <Route path="/store/product/:id" component={ProductDetail} />
        <Route path="/store/cart" component={Cart} />
        <Route path="/store/checkout" component={Checkout} />
        <Route path="/store/quote-request" component={QuoteRequest} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Authenticated routes - unified approach
  return (
    <Switch>
      {/* Home route */}
      <Route path="/" component={StoreHome} />
      
      {/* Admin routes - only show if user is admin */}
      {(user as any)?.role === 'admin' && (
        <>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/sales" component={AdminSales} />
          <Route path="/admin/products" component={AdminProducts} />
          <Route path="/admin/orders" component={AdminOrders} />
          <Route path="/admin/customers" component={AdminCustomers} />
          <Route path="/admin/quotes" component={AdminQuotes} />
          <Route path="/admin/reports" component={AdminReports} />
          <Route path="/admin/promotions" component={AdminPromotions} />
          <Route path="/admin/industry-sections" component={AdminIndustrySections} />
        </>
      )}
      
      {/* Customer routes - only show if user is customer */}
      {(user as any)?.role === 'customer' && (
        <>
          <Route path="/customer" component={CustomerDashboard} />
          <Route path="/customer/dashboard" component={CustomerDashboard} />
          <Route path="/customer/orders" component={CustomerDashboard} />
          <Route path="/customer/favorites" component={CustomerDashboard} />
          <Route path="/customer/quotes" component={CustomerDashboard} />
          <Route path="/customer/profile" component={CustomerDashboard} />
        </>
      )}
      
      {/* Store routes - available to all authenticated users */}
      <Route path="/store" component={StoreHome} />
      <Route path="/store/catalog" component={StoreCatalog} />
      <Route path="/store/polos" component={StoreCatalog} />
      <Route path="/store/playeras" component={StoreCatalog} />
      <Route path="/store/brands" component={StoreBrands} />
      <Route path="/store/product/:id" component={ProductDetail} />
      <Route path="/store/cart" component={Cart} />
      <Route path="/store/checkout" component={Checkout} />
      <Route path="/store/quote-request" component={QuoteRequest} />
      
      {/* Auth routes - available to all users */}
      <Route path="/login" component={LoginPage} />
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/customer-register" component={CustomerRegisterPage} />
      <Route path="/auth/admin-register" component={AdminRegisterPage} />
      
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
