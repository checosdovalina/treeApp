import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  // Try local authentication first, then fallback to existing auth
  const { data: localUser, isLoading: isLoadingLocal } = useQuery({
    queryKey: ["/api/auth/current"],
    queryFn: () => apiRequest("/api/auth/current"),
    retry: false,
  });

  const { data: replitUser, isLoading: isLoadingReplit } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: !localUser, // Only try Replit auth if local auth fails
  });

  const user = localUser || replitUser;
  const isLoading = isLoadingLocal || (isLoadingReplit && !localUser);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
