/**
 * API Types for Windbase API
 * These types match the structure expected from the API endpoints
 */

export type ComponentType = 'template' | 'block';

export interface ApiTemplate {
	id: string;
	name: string;
	description?: string;
	category: string;
	componentType: ComponentType;
	tags: string[];
	author?: string;
	version?: string;
	createdAt?: string;
	updatedAt?: string;
	html?: string;
	preview?: string;
	featured?: boolean;
	popular?: boolean;
	deprecated?: boolean;
}

export interface ApiBlock extends ApiTemplate {
	componentType: 'block';
}

export interface ApiTemplateResponse extends ApiTemplate {
	componentType: 'template';
}

export interface ApiCollection {
	templates?: ApiTemplateResponse[];
	blocks?: ApiBlock[];
}

export interface ApiError {
	message: string;
	code?: number;
} 