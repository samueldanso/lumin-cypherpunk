import Image from "next/image";
import Link from "next/link";

export function Logo() {
	return (
		<Link href="/" className="flex items-center space-x-2 md:space-x-3">
			<Image
				src="/logo.svg"
				alt="Lumin Yield Logo"
				width={32}
				height={32}
				className="flex-shrink-0"
			/>
			<span className="text-2xl font-bold text-primary">Lumin Yield</span>
		</Link>
	);
}
