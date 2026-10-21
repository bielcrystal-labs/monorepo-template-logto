import { useLogtoAuth } from 'convex-logto/native-session';
import { Pressable, StyleSheet, Text, View } from 'react-native';

/** Opens Logto in the system browser; the deep link back finishes sign-in in place. */
export function SignInScreen() {
	const { signIn } = useLogtoAuth();

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Sign in</Text>
			<Text style={styles.muted}>Use your company account.</Text>
			<Pressable style={styles.button} onPress={() => void signIn().catch(() => {})}>
				<Text style={styles.buttonText}>Sign in with Logto</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
	title: { fontSize: 24, fontWeight: '600' },
	muted: { color: '#737373' },
	button: { backgroundColor: '#171717', borderRadius: 8, padding: 14, alignItems: 'center' },
	buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
