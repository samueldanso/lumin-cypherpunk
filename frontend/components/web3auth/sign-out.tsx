import { useWeb3AuthDisconnect } from "@web3auth/modal/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignOutProps {
	variant?: "default" | "ghost" | "outline";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
	children?: React.ReactNode;
}

export function SignOut({
	variant = "ghost",
	size = "default",
	className = "",
	children,
}: SignOutProps) {
	const { disconnect } = useWeb3AuthDisconnect();

	const handleSignOut = async () => {
		try {
			await disconnect();
		} catch (_error) {
			// Sign out failed silently
		}
	};

	return (
		<Button onClick={handleSignOut} variant={variant} size={size} className={className}>
			{children || (
				<>
					Sign out
					<LogOut className="h-7 w-7 ml-1" />
				</>
			)}
		</Button>
	);
}

export default SignOut;
