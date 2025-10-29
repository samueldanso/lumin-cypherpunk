import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WithdrawButton({ onClick }: { onClick: () => void }) {
	return (
		<Button
			onClick={onClick}
			className="bg-secondary hover:bg-secondary/80 text-secondary-foreground flex h-12 flex-grow items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition md:w-40"
		>
			<ArrowUpRight className="h-6 w-6" /> Withdraw
		</Button>
	);
}
