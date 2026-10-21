/**
 * Dev seed — idempotent.
 *
 * Logto owns the user accounts, so there is no dev user to create here. Sign in
 * once, copy your Logto user id (the `sub` shown in the web header), then seed
 * example claims for it:
 *
 *   pnpm -C packages/backend exec convex run init '{"ownerId":"<logto sub>"}'
 *
 * Convex pattern (https://stack.convex.dev/seeding-data-for-preview-deployments):
 *   - Default export named `init`, so `convex run init` and `convex dev --run init` find it
 *   - Internal: the CLI can run it, clients cannot
 *   - Idempotent: safe to call on every `pnpm dev`
 *   - A no-op unless CONVEX_DEBUG=true, which only `worktree:setup` sets on a local backend
 */
import { v } from 'convex/values';

import { internal } from './_generated/api';
import { internalAction } from './_generated/server';

type SeedResult = { status: 'seeded' | 'skipped'; ownerId: string | null };

export default internalAction({
	args: { ownerId: v.optional(v.string()) },
	returns: v.object({
		status: v.union(v.literal('seeded'), v.literal('skipped')),
		ownerId: v.union(v.string(), v.null()),
	}),
	handler: async (ctx, args): Promise<SeedResult> => {
		if (process.env.CONVEX_DEBUG !== 'true' || args.ownerId === undefined) {
			return { status: 'skipped', ownerId: null };
		}
		await ctx.runMutation(internal.claims.seedForOwner, { ownerId: args.ownerId });
		return { status: 'seeded', ownerId: args.ownerId };
	},
});
