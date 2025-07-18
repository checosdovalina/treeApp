import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import LoginPage from "@/pages/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AdminOrders from "@/pages/admin/orders";
import AdminCustomers from "@/pages/admin/customers";
import AdminQuotes from "@/pages/admin/quotes";
import AdminReports from "@/pages/admin/reports";
import StoreHome from "@/pages/store/index";
import StoreCatalog from "@/pages/store/catalog";
import ProductDetail from "@/pages/store/product-detail";
import Cart from "@/pages/store/cart";
import CustomerDashboard from "@/pages/customer/dashboard";
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
        <Route path="/" component={Landing} />
        <Route path="/login" component={LoginPage} />
        <Route path="/store" component={StoreHome} />
        <Route path="/store/catalog" component={StoreCatalog} />
        <Route path="/store/product/:id" component={ProductDetail} />
        <Route path="/store/cart" component={Cart} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Authenticated routes based on user role
  return (
    <Switch>
      {/* Admin routes */}
      {user?.role === 'admin' ? (
        <>
          <Route path="/" component={AdminDashboard} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/products" component={AdminProducts} />
          <Route path="/admin/orders" component={AdminOrders} />
          <Route path="/admin/customers" component={AdminCustomers} />
          <Route path="/admin/quotes" component={AdminQuotes} />
          <Route path="/admin/reports" component={AdminReports} />
          
          {/* Admin can also access store routes */}
          <Route path="/store" component={StoreHome} />
          <Route path="/store/catalog" component={StoreCatalog} />
          <Route path="/store/product/:id" component={ProductDetail} />
          <Route path="/store/cart" component={Cart} />
        </>
      ) : (
        <>
          {/* Customer routes */}
          <Route path="/" component={StoreHome} />
          <Route path="/store" component={StoreHome} />
          <Route path="/store/catalog" component={StoreCatalog} />
          <Route path="/store/product/:id" component={ProductDetail} />
          <Route path="/store/cart" component={Cart} />
          
          {/* Customer dashboard and account routes */}
          <Route path="/customer" component={CustomerDashboard} />
          <Route path="/customer/dashboard" component={CustomerDashboard} />
          <Route path="/customer/orders" component={CustomerDashboard} />
          <Route path="/customer/favorites" component={CustomerDashboard} />
          <Route path="/customer/quotes" component={CustomerDashboard} />
          <Route path="/customer/profile" component={CustomerDashboard} />
        </>
      )}
      
      {/* Common routes */}
      <Route path="/login" component={LoginPage} />
      
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
