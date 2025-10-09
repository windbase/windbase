import { useBuilder } from '@windbase/engine';
import { ElementProperties } from '@/features/element-inspector';

function SidebarRight() {
	const { selectedElement } = useBuilder();

	// If an element is selected, show properties
	if (selectedElement) {
		return <ElementProperties />;
	}

	return null;
}

export default SidebarRight;
