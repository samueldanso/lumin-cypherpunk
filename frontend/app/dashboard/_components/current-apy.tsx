"use client";

export function CurrentAPY() {
	const apy = "7.2";

	return (
		<div className="mb-6 flex w-full flex-col items-start md:mb-0 md:w-auto">
			<span className="mb-1 text-base text-muted-foreground">Current APY</span>
			<span className="text-4xl font-semibold text-primary">{apy}%</span>
		</div>
	);
}
