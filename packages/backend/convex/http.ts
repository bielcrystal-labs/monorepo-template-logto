import { registerLogtoWebhook } from 'convex-logto';
import { httpRouter } from 'convex/server';

import { components, internal } from './_generated/api';

const http = httpRouter();

// POST /logto/webhook. Verifies `logto-signature-sha-256` with
// LOGTO_WEBHOOK_SIGNING_KEY, deduplicates retries, revokes sessions on
// User.Deleted / suspension, then dispatches to `auth.sync`.
registerLogtoWebhook(http, internal.auth.sync, { sessions: components.logto });

export default http;
