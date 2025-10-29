import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DepositButton({ onClick }: { onClick: () => void }) {
	return (
		<Button
			onClick={onClick}
			className="bg-primary hover:bg-primary/90 text-primary-foreground flex h-12 flex-grow items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition md:w-40"
		>
			<Plus className="h-8 w-8" /> Deposit
		</Button>
	);
}
