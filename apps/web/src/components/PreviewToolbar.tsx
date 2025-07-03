function PreviewToolbar() {
	return (
		<div className="flex h-8 items-center px-2 border-b bg-neutral-50 rounded-t-xl">
			<div className="flex items-center gap-1.5">
				<div className="h-3 w-3 rounded-full bg-red-500" />
				<div className="h-3 w-3 rounded-full bg-yellow-500" />
				<div className="h-3 w-3 rounded-full bg-green-500" />
			</div>
			<div className="w-4" />
		</div>
	);
}

export default PreviewToolbar;
