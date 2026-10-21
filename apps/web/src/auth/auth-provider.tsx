import type { ConvexReactClient } from 'convex/react';
import type { ReactNode } from 'react';

import { api } from '@acme/backend/convex/_generated/api';
import { useLingui } from '@lingui/react/macro';
import { ConvexLogtoSessionProvider } from 'convex-logto/react-session';
import { useState } from 'react';

type AuthProviderProps = {
	client: ConvexReactClient;
	children: ReactNode;
};

/**
 * Logto session mode. The Logto redirect URI is `<origin>/sign-in`: the provider
 * finishes the OIDC exchange on the sign-in route, so no extra callback route is
 * needed. Register `http://localhost:<port>/sign-in` on the Logto Traditional Web
 * app (worktree:setup prints the exact URLs). `useConvexAuth()` works below this.
 */
export function AuthProvider({ client, children }: AuthProviderProps) {
	const { t } = useLingui();
	const [error, setError] = useState<string | null>(null);

	return (
		<ConvexLogtoSessionProvider
			client={client}
			sessionApi={api.auth}
			callbackPath="/sign-in"
			afterSignIn="/claims"
			// Hard navigation keeps this provider independent of the router instance.
			navigate={(to) => window.location.replace(to)}
			clientDescriptor={{ platform: 'web' }}
			// signIn / signOut reject instead of storing the error; without this a failed
			// sign-in is a silent unhandled rejection. The raw error goes to the console.
			onAuthError={() => setError(t`登入沒有完成，請再試一次。`)}
		>
			{error && (
				<p role="alert" className="bg-destructive px-4 py-2 text-center text-sm text-white">
					{error}
				</p>
			)}
			{children}
		</ConvexLogtoSessionProvider>
	);
}
