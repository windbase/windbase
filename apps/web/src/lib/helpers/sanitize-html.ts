// Utility function to clean up HTML before parsing (remove scripts, styles, etc.)
export const sanitizeHtml = (htmlString: string): string => {
	// Remove script tags
	htmlString = htmlString.replace(
		/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
		''
	);

	// Remove style tags
	htmlString = htmlString.replace(
		/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
		''
	);

	// Remove link tags (stylesheets)
	htmlString = htmlString.replace(/<link\b[^>]*>/gi, '');

	// Remove meta tags
	htmlString = htmlString.replace(/<meta\b[^>]*>/gi, '');

	// Remove title tags
	htmlString = htmlString.replace(
		/<title\b[^<]*(?:(?!<\/title>)<[^<]*)*<\/title>/gi,
		''
	);

	return htmlString;
};
