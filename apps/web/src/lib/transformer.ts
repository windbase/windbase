/** biome-ignore-all lint/suspicious/noExplicitAny: we don't know the type of the element.className */
'use client';

import type { BuilderElement } from '@/store/builder';
import { domElementToBuilderElement } from './helpers/dom-element-to-builder-element';
import { isBrowser } from './helpers/is-browser';
import { sanitizeHtml } from './helpers/sanitize-html';

// Main transformer function
export const htmlToBuilderElements = (htmlString: string): BuilderElement[] => {
	if (!isBrowser()) {
		console.warn(
			'htmlToBuilderElements can only be used in browser environment'
		);
		return [];
	}

	// Create a temporary container to parse HTML
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlString, 'text/html');

	// Extract elements from body (ignore head, script, style, etc.)
	const bodyElements = doc.body.children;

	// Convert each root element
	const builderElements: BuilderElement[] = [];
	for (const element of bodyElements) {
		builderElements.push(domElementToBuilderElement(element));
	}

	return builderElements;
};

// Alternative function that can handle document fragments
export const htmlFragmentToBuilderElements = (
	htmlString: string
): BuilderElement[] => {
	if (!isBrowser()) {
		console.warn(
			'htmlFragmentToBuilderElements can only be used in browser environment'
		);
		return [];
	}

	// Create a temporary div to parse HTML fragment
	const tempDiv = document.createElement('div');
	tempDiv.innerHTML = htmlString;

	// Convert each root element
	const builderElements: BuilderElement[] = [];
	for (const element of tempDiv.children) {
		builderElements.push(domElementToBuilderElement(element));
	}

	return builderElements;
};

// Helper function to transform a single HTML element
export const singleHtmlElementToBuilderElement = (
	htmlString: string
): BuilderElement | null => {
	if (!isBrowser()) {
		console.warn(
			'singleHtmlElementToBuilderElement can only be used in browser environment'
		);
		return null;
	}

	const elements = htmlFragmentToBuilderElements(htmlString);
	return elements.length > 0 ? elements[0] : null;
};

// Complete transformer with sanitization
export const safeHtmlToBuilderElements = (
	htmlString: string
): BuilderElement[] => {
	if (!isBrowser()) {
		console.warn(
			'safeHtmlToBuilderElements can only be used in browser environment'
		);
		return [];
	}

	const sanitizedHtml = sanitizeHtml(htmlString);
	return htmlToBuilderElements(sanitizedHtml);
};
