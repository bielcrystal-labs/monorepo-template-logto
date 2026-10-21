# Auth: Logto via convex-logto (session mode)

Auth uses [convex-logto](https://github.com/Fanzzzd/convex-logto) in **session mode**. The Convex deployment is the OAuth client (a Logto _Traditional web_ application). A Convex component keeps each user's Logto refresh token; clients hold only a short-lived Logto ID token and a rotating session token. Neither client bundle carries any Logto config.

Convex validates the Logto ID token. Its `sub` is the Logto user id, and domain code reads only that subject (`packages/backend/convex/lib/identity.ts`), so tables like `claims` do not depend on the auth library.

## How it is wired

- **Backend.** `convex/convex.config.ts` installs the `convex-logto` component. `convex/auth.config.ts` uses `logtoAuthConfig()`. `convex/auth.ts` re-exports the eleven `logtoSessionApi(components.logto)` functions that both clients call on `api.auth`, plus `logtoSync({})`. `convex/http.ts` registers `POST /logto/webhook` with session revocation (`registerLogtoWebhook(..., { sessions })`).
- **Web.** `apps/web/src/auth/` wraps the app in `ConvexLogtoSessionProvider` from `convex-logto/react-session`. The OIDC callback lands on the existing `/sign-in` route (`callbackPath="/sign-in"`), so there is no separate callback route. The sign-in page shows one button.
- **Native.** `apps/native/auth/` uses `convex-logto/native-session` with `expo-secure-store` and `expo-web-browser`; no Logto SDK on the device. Sign-in returns through `acme://callback` (the `scheme` in `app.json`). A deep-link bridge finishes a sign-in that survived a process kill. Custom schemes need a development build on Android (Expo Go cannot register them).

## Logto setup

1. In Logto, create a **Traditional web** application.
2. Redirect URIs: `http://localhost:<port>/sign-in` for each dev port you use (`worktree:setup` prints yours), your production `https://<web>/sign-in`, and `acme://callback` for native. Post sign-out redirect URIs: the web origins.
3. Rotate the tenant's OIDC signing key to **RSA** (Tenant settings → OIDC configs → Rotate private keys). Convex rejects Logto's default ES384; without this `getUserIdentity()` returns `null`.
4. Set the deployment env (local: from `packages/backend`):

   ```bash
   pnpm exec convex env set LOGTO_ENDPOINT https://auth.example.com
   pnpm exec convex env set LOGTO_APP_ID <traditional-web-app-id>
   pnpm exec convex env set LOGTO_CLIENT_SECRET <traditional-web-app-secret>
   pnpm exec convex env set LOGTO_WEBHOOK_SIGNING_KEY <signing-key>   # optional, for the webhook
   ```

## Deployment env

| Variable                                                | Notes                                                                                                                                                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `LOGTO_ENDPOINT`, `LOGTO_APP_ID`, `LOGTO_CLIENT_SECRET` | Required. `auth.config.ts` fails to load without the first two, so `worktree:setup` writes placeholders (`https://logto.invalid`) on a fresh local backend. Sign-in works once you replace them. |
| `LOGTO_WEBHOOK_SIGNING_KEY`                             | Optional. Enables the webhook. Logto cannot reach a local backend, so it matters only on cloud deployments.                                                                                      |
| `CONVEX_DEBUG`                                          | `true` on local dev only. Unlocks the dev seed. Never set in prod.                                                                                                                               |

Client env: `VITE_CONVEX_URL` (web) and `EXPO_PUBLIC_CONVEX_URL` (native). `worktree:setup` writes them.

## Dev data

Logto owns the accounts, so setup creates no dev user. Sign in once, copy your Logto user id from the web header, then seed example claims for it:

```bash
pnpm -C packages/backend exec convex run init '{"ownerId":"<logto sub>"}'
```

## Tests

`packages/backend/test/harness.ts` signs in with `t.withIdentity({ subject, email })`, mirroring a Logto ID token. convex-logto ships no convex-test registration for its component, so tests that call session functions (for example `assertSubjectHasActiveSession`) need one added first.

## Auth-specific files

These are the only files that differ between `monorepo-template-better-auth` and `monorepo-template-logto` (verified with `diff -rq`):

- Backend: `packages/backend/convex/{auth.ts,auth.config.ts,convex.config.ts,http.ts,init.ts}`, `packages/backend/convex/_generated/api.d.ts`, `packages/backend/test/harness.ts`, `packages/backend/{package.json,.env.example}`
- Web: `apps/web/src/auth/*`, `apps/web/src/locales/{en,zh-Hant}/messages.po`, `apps/web/{package.json,.env.example}`
- Native: `apps/native/auth/*`, `apps/native/package.json`
- Workspace: `scripts/setup-auth.mjs`, `pnpm-workspace.yaml` (catalog), `pnpm-lock.yaml`
- Docs: `docs/auth.md`, `TEMPLATE_SOURCE.md`

Everything else, including `scripts/setup-worktree.mjs`, `apps/native/app.json` and every route, is identical. Code outside `src/auth/` and `auth/` reaches auth only through `useConvexAuth()` and the `@/auth` exports (`AuthProvider`, `SignInPanel`/`SignInScreen`, `useSignOut`, `convexClientOptions`).
