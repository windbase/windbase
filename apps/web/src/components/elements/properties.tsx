import { useBuilder } from '@windbase/engine';
import { Separator } from '@windbase/ui';
import { memo } from 'react';
import AdvancedPanel from './panels/advanced';
import BasicPanel from './panels/basic';
import ColorPanel from './panels/color';

const ElementProperties = memo(() => {
	const { selectedElement } = useBuilder();

	if (!selectedElement) {
		return (
			<div className="py-2 px-4">
				<div className="text-sm text-muted-foreground h-20 flex items-center justify-center w-full">
					No element selected
				</div>
			</div>
		);
	}

	return (
		<div className="py-2">
			<BasicPanel />
			<Separator className="my-2" />
			<ColorPanel />
			<Separator className="my-2" />
			<AdvancedPanel />
			<Separator className="my-2" />
		</div>
	);
});

ElementProperties.displayName = 'ElementProperties';

export default ElementProperties;
