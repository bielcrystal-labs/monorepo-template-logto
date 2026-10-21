// Logto is the OIDC provider (ID token). convex-logto reads LOGTO_ENDPOINT and
// LOGTO_APP_ID from the deployment env: domain = `${LOGTO_ENDPOINT}/oidc`,
// applicationID = LOGTO_APP_ID (the Traditional Web app). Convex discovers the
// JWKS from the issuer.
import { logtoAuthConfig } from 'convex-logto';

export default { providers: [logtoAuthConfig()] };
