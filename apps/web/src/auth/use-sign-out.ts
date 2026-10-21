import { useLogtoAuth } from 'convex-logto/react-session';

/** Returns a function that revokes this session and signs out of Logto. */
export function useSignOut() {
	const { signOut } = useLogtoAuth();
	return signOut;
}
