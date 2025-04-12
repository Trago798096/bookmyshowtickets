import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Helper function to get the base URL for API requests
const getBaseUrl = () => {
  // In production (Vercel), API calls will be to the same domain
  // In development (localhost), specify the port
  if (typeof window !== 'undefined') {
    // For browser environments
    return window.location.origin;
  }
  return 'http://localhost:5000'; // Default for SSR context
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Ensure the URL is absolute for cross-origin requests
  const fullUrl = url.startsWith('http') ? url : `${getBaseUrl()}${url}`;
  
  const res = await fetch(fullUrl, {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      // Add CORS headers for cross-origin requests
      "Accept": "application/json"
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    mode: "cors"
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Ensure the URL is absolute for cross-origin requests
    const url = queryKey[0] as string;
    const fullUrl = url.startsWith('http') ? url : `${getBaseUrl()}${url}`;
    
    const res = await fetch(fullUrl, {
      credentials: "include",
      headers: {
        "Accept": "application/json"
      },
      mode: "cors"
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute instead of Infinity for better refresh
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});
