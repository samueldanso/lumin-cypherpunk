import { X } from "lucide-react";
import React, { type ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
	open: boolean;
	onClose: () => void;
	children: ReactNode;
	showBackButton?: boolean;
	onBack?: () => void;
	className?: string;
	title?: string;
	showCloseButton?: boolean;
}

export function Modal({
	open,
	onClose,
	children,
	showBackButton,
	onBack,
	className,
	title,
	showCloseButton,
}: ModalProps) {
	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [open]);
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-0 flex items-center justify-center bg-black/30 py-2">
			<div
				className={cn(
					"relative mx-4 flex h-fit w-full max-w-md flex-col items-center overflow-y-auto rounded-2xl bg-background/95 backdrop-blur-sm border border-border/50 p-6 shadow-xl md:h-fit md:max-h-[calc(100dvh-32px)]",
					className,
				)}
			>
				<div className="relative flex h-9 w-full items-center justify-between">
					{showBackButton && (
						<button
							onClick={onBack || onClose}
							className="flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/80"
							aria-label="Back"
							type="button"
						>
							<span className="text-2xl">←</span>
						</button>
					)}
					{title && (
						<div className="transform-[translateX(-50%)] absolute left-1/2 w-max text-lg font-semibold text-foreground">
							{title}
						</div>
					)}
					{showCloseButton && (
						<button onClick={onClose} className="absolute right-0">
							<X className="h-5 w-5" />
						</button>
					)}
				</div>
				{children}
			</div>
		</div>
	);
}
