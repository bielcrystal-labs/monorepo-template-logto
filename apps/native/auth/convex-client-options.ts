import type { ConvexReactClientOptions } from 'convex/react';

/**
 * Convex otherwise refetches a fresh token the instant it confirms the cached one,
 * which in session mode costs a Logto refresh and a session-token rotation.
 */
export const convexClientOptions: ConvexReactClientOptions = { initialAuthTokenReuse: true };
