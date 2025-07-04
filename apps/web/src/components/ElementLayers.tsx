'use client';

import { ChevronDown } from 'lucide-react';
import { useBuilder } from '@/store/builder';

function ElementLayers() {
	const { elements } = useBuilder();

	return (
		<div>
			<div className="p-2">
				<h1 className="text-sm font-medium">Layers</h1>
			</div>
			<div className="p-2">
				{elements.map((element) => (
					<div key={element.id} className="flex items-center gap-2">
						<ChevronDown size={14} /> {element.tag}
					</div>
				))}
			</div>
		</div>
	);
}

export default ElementLayers;
