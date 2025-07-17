import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AdminOrders from "@/pages/admin/orders";
import AdminCustomers from "@/pages/admin/customers";
import AdminQuotes from "@/pages/admin/quotes";
import AdminReports from "@/pages/admin/reports";
import StoreHome from "@/pages/store/home";
import StoreCatalog from "@/pages/store/catalog";
import ProductDetail from "@/pages/store/product-detail";
import Cart from "@/pages/store/cart";
import { useAuth } from "@/hooks/useAuth";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show landing page for non-authenticated users
  if (isLoading || !isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/store" component={StoreHome} />
        <Route path="/store/catalog" component={StoreCatalog} />
        <Route path="/store/product/:id" component={ProductDetail} />
        <Route path="/store/cart" component={Cart} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Authenticated routes
  return (
    <Switch>
      {/* Admin routes */}
      {user?.role === 'admin' && (
        <>
          <Route path="/" component={AdminDashboard} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/products" component={AdminProducts} />
          <Route path="/admin/orders" component={AdminOrders} />
          <Route path="/admin/customers" component={AdminCustomers} />
          <Route path="/admin/quotes" component={AdminQuotes} />
          <Route path="/admin/reports" component={AdminReports} />
        </>
      )}
      
      {/* Store routes */}
      <Route path="/" component={StoreHome} />
      <Route path="/store" component={StoreHome} />
      <Route path="/store/catalog" component={StoreCatalog} />
      <Route path="/store/product/:id" component={ProductDetail} />
      <Route path="/store/cart" component={Cart} />
      
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
