import { useBuilder } from '@windbase/engine';
import { exportArrayToHtml } from '@windbase/exporters';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@windbase/ui';
import { BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js';
import { Upload } from 'lucide-react';

function ExportButton() {
	const { pages } = useBuilder();

	const handleExport = async () => {
		const zipFileWriter = new BlobWriter();
		const zipWriter = new ZipWriter(zipFileWriter);

		for (const page of pages?.values() || []) {
			const baseHtml = exportArrayToHtml(page.elements);
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
			const htmlReader = new TextReader(html);
			zipWriter.add(
				`${page.name.toLowerCase().replace(/ /g, '-')}.html`,
				htmlReader
			);
		}

		await zipWriter.close();

		const zipBlob = await zipFileWriter.getData();

		const blob = new Blob([zipBlob], { type: 'application/zip' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `windbase-${Date.now()}.zip`;
		a.click();
	};

	return (
		<Tooltip delayDuration={200}>
			<TooltipTrigger asChild>
				<Button variant="outline" size="icon" onClick={handleExport}>
					<Upload />
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>Export</p>
			</TooltipContent>
		</Tooltip>
	);
}

export default ExportButton;
