# Template source

This repository was generated from `monorepo-template-logto`.

## Baseline

The tooling, lint rules, CI, Convex conventions and worktree setup come from a production Convex monorepo and were made generic for the template.

Notes on the baseline:

- Expo SDK 56. It ships React 19.2.3, the same as web, so the workspace has one React runtime and needs no Metro singleton resolver.
- Native has no Lingui yet. Add `@lingui/metro-transformer` when the app grows past the example.
- `migrations:runAll` uses `migrations.runSerially(ctx, releaseQueue)` because `migrations.runner([])` rejects an empty queue.
- CI runs on `ubuntu-latest`.

## Auth

This template signs in through Logto with the `convex-logto` package. See `docs/auth.md`.

## Keeping the two templates in sync

There are two templates: `monorepo-template-better-auth` and `monorepo-template-logto`. **The two templates differ only in auth files; when syncing the baseline, change both.** The auth files are listed in `docs/auth.md`. A baseline change (tooling, CI, domain example, conventions) lands in both templates in the same change; an auth change lands only in its own template.
