'use client';

import { Button } from '@windbase/ui';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';

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
