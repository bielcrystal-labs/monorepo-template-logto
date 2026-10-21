import type { ConvexReactClientOptions } from 'convex/react';

/**
 * Convex otherwise refetches a fresh token the instant it confirms the cached one.
 * In session mode that costs a Logto refresh grant and a session-token rotation on
 * every page load.
 */
export const convexClientOptions: ConvexReactClientOptions = { initialAuthTokenReuse: true };
