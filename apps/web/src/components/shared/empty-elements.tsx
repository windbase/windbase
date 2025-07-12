import { Blocks, Layers, MousePointer, Plus } from 'lucide-react';

export default function EmptyElements() {
	return (
		<div className="flex flex-col items-center justify-center h-full p-8 text-center bg-background">
			<div className="relative mb-8">
				{/* Floating icons animation */}
				<div className="relative">
					<div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4">
						<Layers className="w-10 h-10 text-gray-400" />
					</div>
					<div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
						<Plus className="w-4 h-4 text-white" />
					</div>
					<div className="absolute -bottom-1 -left-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
						<MousePointer className="w-3 h-3 text-white" />
					</div>
				</div>
			</div>

			<div className="space-y-3 max-w-md">
				<h2 className="text-2xl font-semibold">Your canvas is empty</h2>
				<p className="text-muted-foreground leading-relaxed">
					Start building by adding elements using the + button in the toolbar or
					use templates to get started.
				</p>
			</div>

			<div className="mt-8 flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
				<div className="flex items-center gap-2">
					<div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
						<Blocks className="w-3 h-3 text-blue-600" />
					</div>
					<span>Insert blocks</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
						<Layers className="w-3 h-3 text-green-600" />
					</div>
					<span>Browse templates</span>
				</div>
			</div>
		</div>
	);
}
