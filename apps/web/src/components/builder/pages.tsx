import { useBuilder } from '@windbase/engine';
import { Book, Ellipsis, Plus } from 'lucide-react';
import { useInputDialog } from '@/lib/hooks/use-input-dialog';

function Pages() {
	const { pages, getCurrentPage, setCurrentPage, createPage } = useBuilder();

	const currentPage = getCurrentPage();

	const { ask } = useInputDialog();

	return (
		<>
			<div className="flex justify-between items-center sticky top-0 z-10 bg-background px-3 py-3">
				<h1 className="text-xs font-medium uppercase text-muted-foreground flex items-center gap-2">
					<Book size={16} /> Pages
				</h1>
				<Plus
					size={16}
					className="text-muted-foreground hover:text-foreground cursor-pointer"
					onClick={() => {
						ask('New Page', 'Enter the name of the new page').then((name) => {
							if (name) {
								createPage(name);
							}
						});
					}}
				/>
			</div>
			<div className="p-2">
				{Array.from(pages?.values() || []).map((page) => (
					<button
						key={page.id}
						type="button"
						className={`group w-full flex items-center justify-between gap-2 py-1.5 px-3 rounded-sm ${
							currentPage?.id === page.id ? 'bg-muted' : ''
						}`}
						onClick={() => setCurrentPage(page.id)}
					>
						<p className="text-sm">{page.name}</p>
						<Ellipsis size={16} className="hidden group-hover:block" />
					</button>
				))}
			</div>
		</>
	);
}

export default Pages;
