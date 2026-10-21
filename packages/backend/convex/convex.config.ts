import migrations from '@convex-dev/migrations/convex.config.js';
import logto from 'convex-logto/convex.config';
import { defineApp } from 'convex/server';

// Logto session mode: the component keeps each user's Logto refresh token and
// rotates a short-lived session token with the client. Clients only ever hold
// the Logto ID token Convex validates. See convex/auth.ts.
const app = defineApp();
app.use(migrations);
app.use(logto);

export default app;
