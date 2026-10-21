import { Button } from '@acme/web-ui';
import { Trans } from '@lingui/react/macro';
import { useLogtoAuth } from 'convex-logto/react-session';
import { LogIn } from 'lucide-react';

/** One button: redirects to Logto, which returns to /sign-in to finish. */
export function SignInPanel() {
	const { signIn } = useLogtoAuth();

	return (
		<div className="space-y-4">
			<p className="text-muted-foreground text-center text-sm">
				<Trans>使用統一身份登入。</Trans>
			</p>
			<Button className="w-full" onClick={() => void signIn().catch(() => {})}>
				<LogIn />
				<Trans>登入</Trans>
			</Button>
		</div>
	);
}
