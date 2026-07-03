import { QueryClient } from '@tanstack/react-query';
 
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute - reference data (sets/cards) barely changes
      retry: 2,
      refetchOnWindowFocus: false, // not a web app, no window focus events
    },
  },
});
 