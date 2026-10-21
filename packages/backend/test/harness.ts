/**
 * `convexTest` with this backend's components pre-registered, plus a sign-in.
 *
 * Outside `convex/` on purpose: the deployment analyzer parses every file under it,
 * and the component test entrypoints imported below use `import.meta`, which it
 * rejects.
 */

import type { TestConvex } from 'convex-test';

import { register as registerMigrations } from '@convex-dev/migrations/test';
import { convexTest as convexTestRaw } from 'convex-test';

import type backendSchema from '../convex/schema';

// auth.config.ts reads the Logto env when convex-test loads it.
process.env.LOGTO_ENDPOINT ??= 'https://auth.example.com';
process.env.LOGTO_APP_ID ??= 'test-app';

/**
 * Not generic on purpose: naming the one schema this harness is ever given keeps
 * `ctx.db.insert` strictly typed in tests (a generic harness hands tests the loose
 * data model, where any field is accepted).
 */
export const convexTest = (
	schema: typeof backendSchema,
	modules: Record<string, () => Promise<unknown>>,
): TestConvex<typeof backendSchema> => {
	// SAFETY: convexTest's declared return uses a `boolean` strictness flag; this
	// harness is only ever handed the backend's own strict schema.
	const t = convexTestRaw(schema, modules) as unknown as TestConvex<typeof backendSchema>;
	// SAFETY: the registration helper is typed against a generic schema.
	const target = t as unknown as Parameters<typeof registerMigrations>[0];
	registerMigrations(target);
	// convex-logto ships no convex-test registration. Functions under test that call
	// the session component (e.g. `assertSubjectHasActiveSession`) need one.
	return t;
};

/**
 * Return a client acting as a Logto user. The identity mirrors a Logto ID token:
 * `subject` is the Logto user id.
 */
export async function signIn(t: TestConvex<typeof backendSchema>, email: string) {
	const userId = `logto-${email}`;
	return {
		as: t.withIdentity({ subject: userId, email }),
		userId,
	};
}
