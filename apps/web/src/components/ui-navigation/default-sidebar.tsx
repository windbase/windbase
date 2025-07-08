import { useBuilder } from '@windbase/engine';
import { templates } from '@windbase/templates';
import { Button } from '@windbase/ui';
import { htmlToBuilderElements } from '@windbase/utils';
import { Search } from 'lucide-react';
import ImportButton from '../core-builder/import-button';

function DefaultSidebar() {
	const { loadTemplate } = useBuilder();

	return (
		<>
			<div className="px-3 py-2 flex items-center gap-1">
				<ImportButton />
				<Button variant="outline">
					<Search />
				</Button>
			</div>

			<div className="p-2">
				<h2 className="text-xs uppercase font-medium">Templates</h2>
				<div className="flex flex-col gap-1 mt-3">
					{templates.map((template) => (
						<button
							key={template.id}
							type="button"
							className="cursor-pointer w-full"
							onClick={() => {
								loadTemplate(htmlToBuilderElements(template.html || ''));
							}}
						>
							<div className="w-full flex items-center justify-center h-20 bg-gray-200 rounded-md">
								<p className="text-xs text-gray-500">{template.name}</p>
							</div>
						</button>
					))}
				</div>
			</div>
		</>
	);
}

export default DefaultSidebar;
