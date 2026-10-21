import type { ConvexReactClient } from 'convex/react';
import type { ReactNode } from 'react';

import { api } from '@acme/backend/convex/_generated/api';
import { ConvexLogtoSessionProvider, useLogtoAuth } from 'convex-logto/native-session';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import { Platform } from 'react-native';

type AuthProviderProps = {
	client: ConvexReactClient;
	children: ReactNode;
};

/** `scheme` from app.json. Register `<scheme>://callback` on the Logto app. */
const scheme = String(Constants.expoConfig?.scheme ?? 'acme');

/**
 * If the OS reclaims the app while Logto has the browser, the sign-in promise dies
 * with the process and the redirect arrives as a cold-start deep link. Handing
 * every link to `completeSignIn` finishes the exchange; it ignores unrelated links.
 */
function DeepLinkBridge() {
	const { completeSignIn } = useLogtoAuth();
	useEffect(() => {
		void Linking.getInitialURL().then((url) => {
			if (url) void completeSignIn(url);
		});
		const subscription = Linking.addEventListener('url', ({ url }) => {
			void completeSignIn(url);
		});
		return () => subscription.remove();
	}, [completeSignIn]);
	return null;
}

/**
 * convex-logto native session mode: no Logto SDK on the device; the session token
 * and short-lived ID token live in SecureStore. `useConvexAuth()` works below this.
 */
export function AuthProvider({ client, children }: AuthProviderProps) {
	return (
		<ConvexLogtoSessionProvider
			client={client}
			sessionApi={api.auth}
			redirectUri={`${scheme}://callback`}
			clientDescriptor={{ platform: 'native', os: Platform.OS }}
			onAuthError={(error) => console.error('[auth]', error)}
		>
			<DeepLinkBridge />
			{children}
		</ConvexLogtoSessionProvider>
	);
}
