import { Shield, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const newProducts = [
	{
		title: "AI Yield Optimization",
		description: "Automated yield optimization across Solana DeFi",
		icon: <TrendingUp className="h-8 w-8 text-primary" />,
	},
	{
		title: "Smart Rebalancing",
		description: "AI automatically moves funds for best rates",
		icon: <Shield className="h-8 w-8 text-blue-500" />,
	},
];

interface NewProductProps {
	title: string;
	description: string;
	icon: React.ReactNode;
}

const NewProduct = ({ title, description, icon }: NewProductProps) => {
	return (
		<Card className="flex flex-1 justify-between rounded-3xl">
			<CardContent className="flex w-full flex-col gap-4 md:flex-row">
				<div className="flex flex-col gap-4 md:flex-row">
					<div className="flex flex-col justify-center">
						<div className="w-fit">{icon}</div>
					</div>
					<div>
						<div className="text-base font-semibold text-foreground">{title}</div>
						<div className="text-sm text-muted-foreground">{description}</div>
					</div>
				</div>
				<div className="flex flex-col items-end justify-start md:justify-center">
					<div className="bg-muted text-muted-foreground min-w-[92px] rounded-3xl px-2 py-1 text-xs font-medium">
						Active
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export function NewProducts() {
	return (
		<div className="my-2 flex flex-col gap-2 md:flex-row">
			{newProducts.map((product) => (
				<NewProduct key={product.title} {...product} />
			))}
		</div>
	);
}
