import type React from "react";

interface AmountInputProps {
	amount: string;
	onChange: (value: string) => void;
}

export function AmountInput({ amount, onChange }: AmountInputProps) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
			.replace("$", "")
			.replace(",", ".")
			.replace(/[^0-9.]/g, "");
		if (value.split(".").length > 2) return;
		if (value.split(".")[1]?.length > 2) return;

		onChange(value);
	};

	return (
		<input
			placeholder="$0.00"
			className="mb-1 w-full border-none text-center text-[54px] font-bold outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground"
			value={amount ? `$${amount}` : ""}
			onChange={handleChange}
			style={{ maxWidth: 200 }}
		/>
	);
}
