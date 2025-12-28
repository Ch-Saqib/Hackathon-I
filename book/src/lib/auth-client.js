// Physical AI Textbook - Better Auth React Client
import { createAuthClient } from "better-auth/react";

// Create auth client - baseURL is automatically detected from window.location.origin
export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
});

// Export convenience methods
export const { signIn, signUp, signOut, useSession } = authClient;
