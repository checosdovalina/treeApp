import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  // Use the existing endpoint that works fine
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
