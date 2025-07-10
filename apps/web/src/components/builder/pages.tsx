import { Book, Ellipsis } from 'lucide-react';

function Pages() {
	return (
		<>
			<h1 className="sticky top-0 z-10 text-xs font-medium px-3 py-3 uppercase text-muted-foreground flex items-center gap-2">
				<Book size={16} /> Pages
			</h1>
			<div className="p-2 space-y-2">
				<div className="flex items-center justify-between gap-2 cursor-pointer py-1.5 px-3 rounded-sm hover:bg-muted">
					<p className="text-sm font-medium">index</p>
					<Ellipsis size={16} />
				</div>
			</div>
		</>
	);
}

export default Pages;
