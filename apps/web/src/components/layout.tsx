"use client";

import { Button, Tab, Tabs } from "@heroui/react";
import {
	ChevronDown,
	ExternalLink,
	Globe,
	Monitor,
	Pencil,
	Redo,
	Smartphone,
	Undo,
} from "lucide-react";
import Image from "next/image";

function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-screen overflow-hidden flex flex-col">
			<div className="h-14 border-b grid grid-cols-3 justify-between items-center px-6 gap-4">
				<div className="flex items-center gap-2">
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
				<div className="mx-auto flex items-center gap-2">
					<Tabs aria-label="Options" color="primary" size="sm">
						<Tab key="pc" title={<Monitor size={14} />} />
						<Tab key="phone" title={<Smartphone size={14} />} />
					</Tabs>
				</div>
				<div className="flex items-center gap-1 ml-auto">
					<Button size="sm" isIconOnly>
						<Undo size={14} />
					</Button>
					<Button size="sm" isIconOnly isDisabled>
						<Redo size={14} />
					</Button>
					<Button size="sm">
						<Globe size={14} /> Publish
					</Button>
					<Button size="sm" color="primary">
						<ExternalLink size={14} /> Export
					</Button>
				</div>
			</div>
			<div className="flex-1 flex">
				<div className="w-60 h-full border-r"></div>
				<div className="flex-1">{children}</div>
				<div className="w-72 h-full border-l"></div>
			</div>
		</div>
	);
}

export default AppLayout;
