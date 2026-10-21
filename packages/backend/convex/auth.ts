/**
 * Logto, in convex-logto session mode.
 *
 * The Convex deployment is the OAuth client. These eleven functions are the whole
 * server side of sign-in; the web and native providers look them up by name on
 * `api.auth`, so keep the export list complete. Logto config (LOGTO_ENDPOINT,
 * LOGTO_APP_ID, LOGTO_CLIENT_SECRET) lives only in the deployment env; no client
 * carries any of it.
 *
 * Both clients end up with a Logto ID token whose `sub` is the Logto user id.
 * Domain code reads only that subject (`lib/identity.ts`).
 */
import { logtoSessionApi, logtoSync } from 'convex-logto';

import { components } from './_generated/api';

export const {
	signIn,
	callback,
	refresh,
	signOut,
	signOutEverywhere,
	listSessions,
	renameSession,
	revokeSession,
	exchangeToken,
	fetchUserInfo,
	sessionValid,
} = logtoSessionApi(components.logto);

/**
 * Logto → Convex webhook handlers. The template keeps no users table (rows are
 * owned by the token subject), so it maps no events. The webhook still matters:
 * with `sessions` attached in http.ts, deleting or suspending a user in Logto
 * revokes their sessions within seconds. Add handlers here when you add a users
 * mirror, e.g. `'User.Data.Updated': syncRow`.
 */
export const { sync } = logtoSync({});
