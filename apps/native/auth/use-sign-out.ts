import { useLogtoAuth } from 'convex-logto/native-session';

/** Returns a function that revokes this session and clears SecureStore. */
export function useSignOut() {
	const { signOut } = useLogtoAuth();
	return signOut;
}
