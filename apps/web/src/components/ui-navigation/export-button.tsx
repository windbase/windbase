import { useBuilder } from '@windbase/engine';
import { exportArrayToHtml } from '@windbase/exporters';
import { Button } from '@windbase/ui';
import { Download } from 'lucide-react';

function ExportButton() {
	const { elements } = useBuilder();

	const handleExport = () => {
		const baseHtml = exportArrayToHtml(elements);
		const html = `<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<title>Live Preview</title>
						<script src="https://cdn.tailwindcss.com"></script>
						<style>
							body {
								margin: 0;
								padding: 0;
								font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
							}
						</style>
					</head>
					<body>${baseHtml}</body>
					</html>`;

		const blob = new Blob([html], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `export-${Date.now()}.html`;
		a.click();
	};
	return (
		<Button variant="outline" size="icon" onClick={handleExport}>
			<Download />
		</Button>
	);
}

export default ExportButton;
