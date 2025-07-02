import AppLayout from "@/components/layout";
import Providers from "@/components/providers";

import "./global.css";

export const metadata = {
	title: "Windbase - Tailwind CSS Interface Builder",
	description:
		"Visualize, Design, and Export Tailwind CSS Interfaces Seamlessly",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<Providers>
					<AppLayout>{children}</AppLayout>
				</Providers>
			</body>
		</html>
	);
}
