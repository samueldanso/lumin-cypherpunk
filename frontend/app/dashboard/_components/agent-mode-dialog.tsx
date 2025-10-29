"use client";

import { Coins, Settings, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

interface AgentModeDialogProps {
	children: React.ReactNode;
}

export function AgentModeDialog({ children }: AgentModeDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-md rounded-3xl">
				<DialogHeader className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
						<Zap className="h-6 w-6 text-primary" />
					</div>
					<DialogTitle className="text-xl">What's Agent Mode?</DialogTitle>
					<DialogDescription className="text-base">
						Agent mode makes your money work harder while you sleep.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<DialogDescription className="text-sm font-medium">
						Upon deposit, Your AI agents will automatically:
					</DialogDescription>

					<div className="space-y-3">
						<div className="flex items-start gap-3">
							<div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20">
								<Target className="h-3 w-3 text-blue-500" />
							</div>
							<span className="text-sm">Find the best yields across 15+ platforms</span>
						</div>

						<div className="flex items-start gap-3">
							<div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20">
								<Settings className="h-3 w-3 text-green-500" />
							</div>
							<span className="text-sm">Allocate your funds when better rates appear</span>
						</div>

						<div className="flex items-start gap-3">
							<div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20">
								<Coins className="h-3 w-3 text-purple-500" />
							</div>
							<span className="text-sm">Compound your earnings continuously</span>
						</div>

						<div className="flex items-start gap-3">
							<div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20">
								<Zap className="h-3 w-3 text-orange-500" />
							</div>
							<span className="text-sm">Funds are available for withdrawal, anytime!</span>
						</div>
					</div>
				</div>

				<div className="flex justify-center pt-4">
					<DialogTrigger asChild>
						<Button className="w-full rounded-full">Got it</Button>
					</DialogTrigger>
				</div>
			</DialogContent>
		</Dialog>
	);
}
