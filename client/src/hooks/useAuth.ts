import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  // Use the existing endpoint that works fine
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: false,
    refetchOnReconnect: false,
    // Handle 401 errors gracefully without triggering error states
    queryFn: async () => {
      try {
        const response = await fetch('/api/auth/user', { 
          credentials: 'include',
          cache: 'no-cache',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 401) {
          return null; // Not authenticated, but not an error
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        // Check if response content type is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.warn('Expected JSON response but got:', contentType);
          return null;
        }
        
        const text = await response.text();
        if (!text || text.trim() === '') {
          return null;
        }
        
        try {
          return JSON.parse(text);
        } catch (parseError) {
          console.error('Failed to parse JSON response:', parseError, 'Response text:', text);
          return null;
        }
      } catch (err) {
        console.error('Auth fetch error:', err);
        return null; // Gracefully handle all errors as "not authenticated"
      }
    }
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
