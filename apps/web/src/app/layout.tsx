import { ThemeProvider } from '@/components/ThemeProvider';

import './global.css';

export const metadata = {
	title: 'Windbase - Tailwind CSS Interface Builder',
	description:
		'Visualize, Design, and Export Tailwind CSS Interfaces Seamlessly',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
