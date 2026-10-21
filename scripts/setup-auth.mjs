/**
 * Auth-specific part of `pnpm worktree:setup` (Logto, convex-logto session mode).
 *
 * This file and the other auth files differ between the better-auth and logto
 * templates; scripts/setup-worktree.mjs is identical in both.
 *
 * Logto itself is not provisioned here. A local deployment gets placeholder
 * config so `auth.config.ts` can load; sign-in works once you set real values:
 *
 *   pnpm -C packages/backend exec convex env set LOGTO_ENDPOINT https://auth.example.com
 *   pnpm -C packages/backend exec convex env set LOGTO_APP_ID <traditional-web-app-id>
 *   pnpm -C packages/backend exec convex env set LOGTO_CLIENT_SECRET <secret>
 */

const PLACEHOLDER_ENDPOINT = 'https://logto.invalid';

/** `auth.config.ts` throws without these, so the first push needs them. */
export const PROVISION_ENV = {
	LOGTO_ENDPOINT: PLACEHOLDER_ENDPOINT,
	LOGTO_APP_ID: 'replace-with-logto-app-id',
	LOGTO_CLIENT_SECRET: 'replace-with-logto-app-secret',
};

let redirectUris = [];
let placeholder = false;

/**
 * @param {object} options
 * @param {(args: string[], opts?: object) => import('node:child_process').SpawnSyncReturns<string>} options.convex
 * @param {(...args: unknown[]) => void} options.log
 * @param {(message: string) => never} options.fail
 * @param {string[]} options.devOrigins This worktree's origin first, then the rest of the range.
 */
export function configureAuthEnv({ convex, log, fail, devOrigins }) {
	// Existing values (real or placeholder) are kept; only missing keys are written.
	for (const [key, value] of Object.entries(PROVISION_ENV)) {
		const current = convex(['env', 'get', key]);
		if (current.status === 0 && current.stdout.trim()) {
			if (key === 'LOGTO_ENDPOINT' && current.stdout.trim() === PLACEHOLDER_ENDPOINT) {
				placeholder = true;
			}
			continue;
		}
		if (convex(['env', 'set', key, value]).status !== 0) fail(`failed to set ${key}`);
		if (key === 'LOGTO_ENDPOINT') placeholder = true;
	}
	log(placeholder ? '! Logto config is a placeholder (see below)' : '✓ Logto config present, kept');
	redirectUris = [`${devOrigins[0]}/sign-in`, 'acme://callback'];
}

/** Printed when setup finishes. */
export function describeLogin(devPort) {
	const lines = [
		`  Web: http://localhost:${devPort}/sign-in (this worktree's fixed port)`,
		'  Logto app (type: Traditional web) needs these Redirect URIs:',
		...redirectUris.map((uri) => `    ${uri}`),
		`  and Post sign-out redirect URI http://localhost:${devPort}`,
	];
	if (placeholder) {
		lines.push(
			'',
			'  Sign-in is not configured yet. Set the real Logto app (see docs/auth.md):',
			'    pnpm -C packages/backend exec convex env set LOGTO_ENDPOINT https://auth.example.com',
			'    pnpm -C packages/backend exec convex env set LOGTO_APP_ID <app-id>',
			'    pnpm -C packages/backend exec convex env set LOGTO_CLIENT_SECRET <secret>',
		);
	}
	return lines.join('\n');
}
