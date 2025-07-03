'use client';

import {
	ChevronDown,
	Code,
	Download,
	Eye,
	Monitor,
	Pencil,
	Redo,
	Save,
	Smartphone,
	Undo,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-screen overflow-hidden flex flex-col">
			<div className="h-16 border-b grid grid-cols-8 justify-between items-center px-6 gap-4">
				<div className="flex items-center gap-2 col-span-3">
					<Image
						src="/windbase-circle.svg"
						alt="Windbase"
						width={100}
						height={100}
						className="h-8 w-8 rounded-md"
					/>
					<ChevronDown size={16} />
					<div className="w-4" />
					<span>Untitled project</span>
					<Pencil size={14} />
				</div>
				<div className="mx-auto flex items-center col-span-2">
					<Tabs aria-label="Options" defaultValue="pc">
						<TabsList>
							<TabsTrigger value="pc">
								<Monitor size={20} />
							</TabsTrigger>
							<TabsTrigger value="phone">
								<Smartphone size={20} />
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
				<div className="flex items-center gap-1.5 ml-auto col-span-3">
					<Button variant="outline" size="icon">
						<Undo />
					</Button>
					<Button disabled variant="outline" size="icon">
						<Redo />
					</Button>
					<Button variant="outline">
						<Code /> Code
					</Button>
					<Button variant="outline">
						<Eye /> Preview
					</Button>
					<Button variant="outline">
						<Download /> Export
					</Button>
					<Button>
						<Save /> Save
					</Button>
				</div>
			</div>
			<div className="flex-1 flex">
				<div className="w-72 h-full border-r"></div>
				<div className="flex-1">{children}</div>
				<div className="w-72 h-full border-l"></div>
			</div>
		</div>
	);
}

export default AppLayout;
