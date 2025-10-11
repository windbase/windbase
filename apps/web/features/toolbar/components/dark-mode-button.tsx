'use client';

import { useTheme } from 'next-themes';
import { Button } from '@windbase/ui';
import { Moon, Sun } from 'lucide-react';

function DarkModeButton() {
	 const { setTheme, theme } = useTheme();

	const handleDarkMode = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	return (
		<Button variant="outline" size="icon" onClick={handleDarkMode}>
			<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}

export default DarkModeButton;
