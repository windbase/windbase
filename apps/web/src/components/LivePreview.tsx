'use client';

import { useEffect, useRef, useState } from 'react';

function LivePreview() {
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [, setIframeData] = useState<Document | null>(null);

	useEffect(() => {
		if (iframeRef.current) {
			const doc = iframeRef.current.contentDocument;
			if (doc) {
				setIframeData(doc);
			}
		}
	}, []);
	return (
		<iframe
			ref={iframeRef}
			className="h-full w-full"
			title="Live Preview"
			src="/empty"
		/>
	);
}

export default LivePreview;
