'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';

function DarkModeButton() {
	const { setTheme, theme } = useTheme();

	const handleDarkMode = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	return (
		<Button variant="outline" size="icon" onClick={handleDarkMode}>
			{theme === 'dark' ? <Sun /> : <Moon />}
		</Button>
	);
}

export default DarkModeButton;
