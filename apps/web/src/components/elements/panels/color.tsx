import { useBuilder } from '@windbase/engine';
import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@windbase/ui';
import { ChevronsUpDown } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import colors from 'tailwindcss/colors';
import { Combobox } from '../../shared/combobox';

// Types
type Breakpoint = 'ALL' | 'SM' | 'MD' | 'LG' | 'XL' | '2XL';
type ColorProperty = 'bgColor' | 'textColor' | 'borderColor' | 'accentColor';

interface ColorState {
	bgColor: string;
	textColor: string;
	borderColor: string;
	accentColor: string;
	shadow: string;
	textDecoration: string;
}

// Constants
const BREAKPOINTS: Breakpoint[] = ['ALL', 'SM', 'MD', 'LG', 'XL', '2XL'];

const SHADOW_OPTIONS = [
	{ value: 'none', label: 'None' },
	{ value: 'sm', label: 'Small' },
	{ value: 'md', label: 'Medium' },
	{ value: 'lg', label: 'Large' },
	{ value: 'xl', label: 'X-Large' },
	{ value: '2xl', label: '2X-Large' }
];

const TEXT_DECORATION_OPTIONS = [
	{ value: 'none', label: 'None' },
	{ value: 'underline', label: 'Underline' },
	{ value: 'line-through', label: 'Line Through' },
	{ value: 'overline', label: 'Overline' }
];

// Property configuration
const PROPERTY_CONFIG = {
	bgColor: { prefix: 'bg-', label: 'BG Color' },
	textColor: { prefix: 'text-', label: 'Text Color' },
	borderColor: { prefix: 'border-', label: 'Border Color' },
	accentColor: { prefix: 'accent-', label: 'Accent Color' }
} as const;

// Utility functions
const getColorFamilies = (): string[] => {
	const colorFamilies = [
		'slate',
		'gray',
		'zinc',
		'neutral',
		'stone',
		'red',
		'orange',
		'amber',
		'yellow',
		'lime',
		'green',
		'emerald',
		'teal',
		'cyan',
		'sky',
		'blue',
		'indigo',
		'violet',
		'purple',
		'fuchsia',
		'pink',
		'rose'
	];

	return colorFamilies.filter(
		(family) =>
			colors[family as keyof typeof colors] &&
			typeof colors[family as keyof typeof colors] === 'object'
	);
};

const getBreakpointPrefix = (breakpoint: Breakpoint): string =>
	breakpoint === 'ALL' ? '' : `${breakpoint.toLowerCase()}:`;

// Helper function to check if a class is a color class
const isColorClass = (className: string, prefix: string): boolean => {
	if (!className.startsWith(prefix)) return false;

	const colorValue = className.replace(prefix, '');

	// Check for special color values
	const specialColors = ['inherit', 'white', 'black', 'transparent'];
	if (specialColors.includes(colorValue)) {
		return true;
	}

	// Check if this is a valid color value from Tailwind color families
	const colorFamilies = getColorFamilies();
	for (const family of colorFamilies) {
		const colorFamily = colors[family as keyof typeof colors];
		if (colorFamily && typeof colorFamily === 'object') {
			const shades = Object.keys(colorFamily);
			if (colorValue === family || colorValue.startsWith(`${family}-`)) {
				const shade = colorValue.replace(`${family}-`, '');
				if (colorValue === family || shades.includes(shade)) {
					return true;
				}
			}
		}
	}

	return false;
};

const extractColorValue = (
	classes: string[],
	prefix: string,
	breakpoint: Breakpoint
): string => {
	const breakpointPrefix = getBreakpointPrefix(breakpoint);
	const colorFamilies = getColorFamilies();

	// Find all classes that start with the prefix
	const matchingClasses = classes.filter((cls) =>
		cls.startsWith(breakpointPrefix + prefix)
	);

	// Check each matching class to see if it's a valid color
	for (const cls of matchingClasses) {
		const colorValue = cls.replace(breakpointPrefix + prefix, '');

		// Check for special color values
		const specialColors = ['inherit', 'white', 'black', 'transparent'];
		if (specialColors.includes(colorValue)) {
			return colorValue;
		}

		// Check if this is a valid color value by verifying it exists in Tailwind colors
		for (const family of colorFamilies) {
			const colorFamily = colors[family as keyof typeof colors];
			if (colorFamily && typeof colorFamily === 'object') {
				const shades = Object.keys(colorFamily);
				if (colorValue === family || colorValue.startsWith(`${family}-`)) {
					const shade = colorValue.replace(`${family}-`, '');
					if (colorValue === family || shades.includes(shade)) {
						return colorValue;
					}
				}
			}
		}
	}

	return '';
};

const extractShadowValue = (
	classes: string[],
	breakpoint: Breakpoint
): string => {
	const breakpointPrefix = getBreakpointPrefix(breakpoint);

	for (const cls of classes) {
		if (cls.startsWith(`${breakpointPrefix}shadow-`)) {
			return cls.replace(`${breakpointPrefix}shadow-`, '');
		}
		if (cls === `${breakpointPrefix}shadow`) {
			return 'md';
		}
	}
	return 'none';
};

const extractTextDecorationValue = (
	classes: string[],
	breakpoint: Breakpoint
): string => {
	const breakpointPrefix = getBreakpointPrefix(breakpoint);

	for (const cls of classes) {
		if (cls.startsWith(`${breakpointPrefix}underline`)) return 'underline';
		if (cls.startsWith(`${breakpointPrefix}line-through`))
			return 'line-through';
		if (cls.startsWith(`${breakpointPrefix}overline`)) return 'overline';
		if (cls.startsWith(`${breakpointPrefix}no-underline`)) return 'none';
	}
	return 'none';
};

const createEmptyColorState = (): ColorState => ({
	bgColor: '',
	textColor: '',
	borderColor: '',
	accentColor: '',
	shadow: 'none',
	textDecoration: 'none'
});

const parseElementClasses = (
	classes: string[]
): Record<Breakpoint, ColorState> => {
	const state: Record<Breakpoint, ColorState> = {} as Record<
		Breakpoint,
		ColorState
	>;

	BREAKPOINTS.forEach((breakpoint) => {
		state[breakpoint] = {
			bgColor: extractColorValue(classes, 'bg-', breakpoint),
			textColor: extractColorValue(classes, 'text-', breakpoint),
			borderColor: extractColorValue(classes, 'border-', breakpoint),
			accentColor: extractColorValue(classes, 'accent-', breakpoint),
			shadow: extractShadowValue(classes, breakpoint),
			textDecoration: extractTextDecorationValue(classes, breakpoint)
		};
	});

	return state;
};

// Color swatch component
const ColorSwatch = memo(
	({
		color,
		colorName,
		onClick,
		isSelected
	}: {
		color: string;
		colorName: string;
		onClick: () => void;
		isSelected: boolean;
	}) => (
		<button
			type="button"
			className={`h-4 w-4 rounded-xs border ${isSelected ? 'border-blue-500' : 'border-gray-300'} hover:border-gray-400`}
			style={{ backgroundColor: color }}
			onClick={onClick}
			title={colorName}
		/>
	)
);

ColorSwatch.displayName = 'ColorSwatch';

// Color popover component
const ColorPopover = memo(
	({
		value,
		onChange,
		label
	}: {
		value: string;
		onChange: (value: string) => void;
		label: string;
	}) => {
		const colorFamilies = getColorFamilies();

		const getDisplayInfo = useCallback(
			(colorValue: string) => {
				if (!colorValue) return { color: '#e5e7eb', label: 'None' };

				// Handle special color values
				const specialColors = {
					inherit: { color: '#94a3b8', label: 'Inherit' },
					white: { color: '#ffffff', label: 'White' },
					black: { color: '#000000', label: 'Black' },
					transparent: { color: 'transparent', label: 'Transparent' }
				};

				if (specialColors[colorValue as keyof typeof specialColors]) {
					return specialColors[colorValue as keyof typeof specialColors];
				}

				// Handle regular color families
				for (const family of colorFamilies) {
					const colorFamily = colors[family as keyof typeof colors];
					if (colorFamily && typeof colorFamily === 'object') {
						const shades = Object.entries(colorFamily);
						for (const [shade, hexValue] of shades) {
							if (
								typeof hexValue === 'string' &&
								`${family}-${shade}` === colorValue
							) {
								return { color: hexValue, label: `${family}-${shade}` };
							}
						}
					}
				}
				return { color: '#e5e7eb', label: colorValue || 'None' };
			},
			[colorFamilies]
		);

		const displayInfo = useMemo(
			() => getDisplayInfo(value),
			[value, getDisplayInfo]
		);

		return (
			<div>
				<div className="block text-[10px] uppercase font-medium mb-2">
					{label}
				</div>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className="justify-start text-xs px-3 h-8 text-ellipsis"
							size="sm"
						>
							<div
								className="h-4 w-4 rounded-full border"
								style={{ backgroundColor: displayInfo.color }}
							/>
							{displayInfo.label}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[120px] h-[200px] overflow-y-auto p-2">
						{/* None option */}
						<div className="space-y-2">
							<span className="text-xs font-medium">None</span>
							<div className="grid grid-cols-4 gap-0.5">
								<ColorSwatch
									color="#e5e7eb"
									colorName="None"
									onClick={() => onChange('')}
									isSelected={!value}
								/>
							</div>
						</div>

						{/* Special color values */}
						<div>
							<span className="text-xs font-medium">Special</span>
							<div className="grid grid-cols-4 gap-1">
								<ColorSwatch
									color="#94a3b8"
									colorName="inherit"
									onClick={() => onChange('inherit')}
									isSelected={value === 'inherit'}
								/>
								<ColorSwatch
									color="#ffffff"
									colorName="white"
									onClick={() => onChange('white')}
									isSelected={value === 'white'}
								/>
								<ColorSwatch
									color="#000000"
									colorName="black"
									onClick={() => onChange('black')}
									isSelected={value === 'black'}
								/>
								<ColorSwatch
									color="transparent"
									colorName="transparent"
									onClick={() => onChange('transparent')}
									isSelected={value === 'transparent'}
								/>
							</div>
						</div>

						{/* Color families */}
						{colorFamilies.map((family) => {
							const colorFamily = colors[family as keyof typeof colors];
							if (!colorFamily || typeof colorFamily !== 'object') return null;

							return (
								<div key={family} className="space-y-2">
									<span className="text-xs font-medium capitalize">
										{family}
									</span>
									<div className="grid grid-cols-4 gap-1">
										{Object.entries(colorFamily).map(([shade, hexValue]) => {
											if (typeof hexValue !== 'string') return null;

											const colorName = `${family}-${shade}`;
											return (
												<ColorSwatch
													key={colorName}
													color={hexValue}
													colorName={colorName}
													onClick={() => onChange(colorName)}
													isSelected={value === colorName}
												/>
											);
										})}
									</div>
								</div>
							);
						})}
					</PopoverContent>
				</Popover>
			</div>
		);
	}
);

ColorPopover.displayName = 'ColorPopover';

const ColorPanel = memo(() => {
	const { selectedElement, updateClasses } = useBuilder();
	const [selectedBreakpoint, setSelectedBreakpoint] =
		useState<Breakpoint>('ALL');
	const [colorState, setColorState] = useState<Record<Breakpoint, ColorState>>(
		() =>
			Object.fromEntries(
				BREAKPOINTS.map((bp) => [bp, createEmptyColorState()])
			) as Record<Breakpoint, ColorState>
	);

	// Sync state with selected element
	useEffect(() => {
		if (!selectedElement) {
			setColorState(
				Object.fromEntries(
					BREAKPOINTS.map((bp) => [bp, createEmptyColorState()])
				) as Record<Breakpoint, ColorState>
			);
			return;
		}

		const elementClasses = selectedElement.classes || [];
		const parsedState = parseElementClasses(elementClasses);
		setColorState(parsedState);
	}, [selectedElement]);

	// Update element classes using the store's updateClasses method
	const updateElementClasses = useCallback(
		(updatedClasses: string[]) => {
			if (!selectedElement) return;
			updateClasses(selectedElement.id, updatedClasses);
		},
		[selectedElement, updateClasses]
	);

	// Handle class changes
	const handleClassChange = useCallback(
		(prefix: string, newValue: string, breakpoint: Breakpoint) => {
			if (!selectedElement) return;

			const currentClasses = selectedElement.classes || [];
			const breakpointPrefix = getBreakpointPrefix(breakpoint);

			// Remove existing classes with this prefix for this breakpoint
			const filteredClasses = currentClasses.filter((cls) => {
				if (breakpoint === 'ALL') {
					return !cls.startsWith(prefix) || cls.includes(':');
				}
				return !cls.startsWith(breakpointPrefix + prefix);
			});

			// Add new class if value provided
			if (newValue) {
				filteredClasses.push(breakpointPrefix + newValue);
			}

			updateElementClasses(filteredClasses);
		},
		[selectedElement, updateElementClasses]
	);

	// Handle color property changes (only removes color-related classes)
	const handleColorChange = useCallback(
		(property: ColorProperty, value: string) => {
			if (!selectedElement) return;

			const config = PROPERTY_CONFIG[property];
			const currentClasses = selectedElement.classes || [];
			const breakpointPrefix = getBreakpointPrefix(selectedBreakpoint);

			// Remove only color-related classes with this prefix for this breakpoint
			const filteredClasses = currentClasses.filter((cls) => {
				if (selectedBreakpoint === 'ALL') {
					// For ALL breakpoint, remove color classes that don't have breakpoint prefix
					if (!cls.includes(':') && isColorClass(cls, config.prefix)) {
						return false;
					}
				} else {
					// For specific breakpoints, remove color classes that match breakpoint and prefix
					if (
						cls.startsWith(breakpointPrefix) &&
						isColorClass(cls.replace(breakpointPrefix, ''), config.prefix)
					) {
						return false;
					}
				}
				return true;
			});

			// Add new class if value provided
			if (value) {
				filteredClasses.push(breakpointPrefix + config.prefix + value);
			}

			updateElementClasses(filteredClasses);

			// Update local state
			setColorState((prev) => ({
				...prev,
				[selectedBreakpoint]: {
					...prev[selectedBreakpoint],
					[property]: value
				}
			}));
		},
		[selectedBreakpoint, selectedElement, updateElementClasses]
	);

	// Handle shadow changes
	const handleShadowChange = useCallback(
		(value: string) => {
			let newClass = '';
			if (value !== 'none') {
				newClass = value === 'md' ? 'shadow' : `shadow-${value}`;
			}

			handleClassChange('shadow', newClass, selectedBreakpoint);

			setColorState((prev) => ({
				...prev,
				[selectedBreakpoint]: {
					...prev[selectedBreakpoint],
					shadow: value
				}
			}));
		},
		[selectedBreakpoint, handleClassChange]
	);

	// Handle text decoration changes
	const handleTextDecorationChange = useCallback(
		(value: string) => {
			// Remove all text decoration classes for this breakpoint
			const breakpointPrefix = getBreakpointPrefix(selectedBreakpoint);
			const currentClasses = selectedElement?.classes || [];

			const filteredClasses = currentClasses.filter((cls) => {
				const prefixes = [
					'underline',
					'line-through',
					'overline',
					'no-underline'
				];
				return !prefixes.some((prefix) => cls === breakpointPrefix + prefix);
			});

			// Add new class based on value
			if (value !== 'none') {
				filteredClasses.push(breakpointPrefix + value);
			} else {
				filteredClasses.push(`${breakpointPrefix}no-underline`);
			}

			updateElementClasses(filteredClasses);

			setColorState((prev) => ({
				...prev,
				[selectedBreakpoint]: {
					...prev[selectedBreakpoint],
					textDecoration: value
				}
			}));
		},
		[selectedBreakpoint, selectedElement, updateElementClasses]
	);

	if (!selectedElement) return null;

	const currentState = colorState[selectedBreakpoint];

	return (
		<Collapsible defaultOpen>
			<div className="flex items-center justify-between gap-4 px-2">
				<h4 className="text-sm uppercase font-medium">Colors</h4>
				<CollapsibleTrigger asChild>
					<Button variant="ghost" size="icon" className="size-8">
						<ChevronsUpDown />
						<span className="sr-only">Toggle</span>
					</Button>
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent className="px-2 mt-2">
				{/* Breakpoint selector */}
				<div className="flex items-center gap-1 mb-4 p-1 bg-muted rounded-lg overflow-auto">
					{BREAKPOINTS.map((breakpoint) => (
						<Button
							key={breakpoint}
							variant={selectedBreakpoint === breakpoint ? 'default' : 'ghost'}
							size="sm"
							className="text-xs px-3 py-1 h-auto min-w-0 flex-shrink-0"
							onClick={() => setSelectedBreakpoint(breakpoint)}
						>
							{breakpoint}
						</Button>
					))}
				</div>

				<div className="flex flex-wrap gap-3">
					{/* Color Properties */}
					{Object.entries(PROPERTY_CONFIG).map(([property, config]) => (
						<ColorPopover
							key={property}
							value={currentState[property as ColorProperty]}
							onChange={(value) =>
								handleColorChange(property as ColorProperty, value)
							}
							label={config.label}
						/>
					))}

					{/* Shadow */}
					<div>
						<div className="block text-[10px] uppercase font-medium mb-2">
							Shadow
						</div>
						<Combobox
							value={currentState.shadow}
							onChange={handleShadowChange}
							items={SHADOW_OPTIONS}
							placeholder="Select shadow"
						/>
					</div>

					{/* Text Decoration */}
					<div>
						<div className="block text-[10px] uppercase font-medium mb-2">
							Text Decoration
						</div>
						<Combobox
							value={currentState.textDecoration}
							onChange={handleTextDecorationChange}
							items={TEXT_DECORATION_OPTIONS}
							placeholder="Select decoration"
						/>
					</div>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
});

ColorPanel.displayName = 'ColorPanel';

export default ColorPanel;
