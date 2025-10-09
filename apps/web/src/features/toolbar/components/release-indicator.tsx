import { Button, HoverCard, HoverCardContent, HoverCardTrigger } from '@windbase/ui';
import { PartyPopper } from 'lucide-react';
import { useEffect, useState } from "react";

type Release = {
	tag_name: string;
	released_at: string;
	html_url: string;
}

type LocalRelease = Release & {
	updated_at: string;
}


function getLocalRelease() {
	const localVersion = localStorage.getItem('__windbase_version');
	if (!localVersion) return null;

	try {
		const json = JSON.parse(localVersion) as LocalRelease;
		const lastUpdatedAt = new Date(json.updated_at);
		const now = new Date();
		const diff = now.getTime() - lastUpdatedAt.getTime();
		// If the last updated at is more than 2 hours ago, we need to check for a new release
		if (diff > 1000 * 60 * 60 * 2) {
			return null;
		}
		return json;
	} catch {
		return null;
	}
}

async function getRemoteRelease() {
	const response = await fetch(API);
	const json = await response.json();
	return {
		tag_name: json.tag_name,
		released_at: json.created_at,
		html_url: json.html_url,
	} as Release;
}


const API = "https://api.github.com/repos/windbase/windbase/releases/latest";

function NewReleaseIndicator() {
	const [release, setRelease] = useState<Release | null>(null);

	useEffect(() => {
		const localRelease = getLocalRelease();
		if (!localRelease) {
			getRemoteRelease().then((remoteRelease) => {
				localStorage.setItem('__windbase_version', JSON.stringify({
					...remoteRelease,
					updated_at: new Date().toISOString(),
				}));
				setRelease(remoteRelease);
			});
		}
	}, []);

	if (!release) return null;

	return (
		<HoverCard openDelay={200}>
			<HoverCardTrigger>
				<div className='w-2 h-2 rounded-full bg-yellow-500 animate-pulse duration-1000' />
			</HoverCardTrigger>
			<HoverCardContent  >
				<div className='flex flex-col gap-2'>
					<h3 className='text-sm font-medium flex items-center gap-2'>
						{release.tag_name} is available! <PartyPopper size={16} />
					</h3>
					<p className='text-sm text-muted-foreground'>
						Check out the release notes for the latest updates.
					</p>
				</div>

				<div className='flex flex-col gap-2 mt-4'>
					<Button variant='outline' size='sm' onClick={() => {
						setRelease(null);
						window.open(release.html_url, '_blank');
					}}>
						View Release Notes
					</Button>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}

export default NewReleaseIndicator;