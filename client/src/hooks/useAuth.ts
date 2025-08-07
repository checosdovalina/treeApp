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
          cache: 'no-cache'
        });
        
        if (response.status === 401) {
          return null; // Not authenticated, but not an error
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
      } catch (err) {
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
