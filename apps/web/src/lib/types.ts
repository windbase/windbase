/**
 * API Types for Windbase API
 * These types match the structure expected from the API endpoints
 */

export type ComponentType = 'template' | 'block';

// Updated API response structure for individual components
export interface ComponentMetadata {
	id: string;
	name: string;
	categories: string[];
	author: string;
}

export interface ApiBlock extends ComponentMetadata {
	componentType: 'block';
}

export interface ApiTemplateResponse extends ComponentMetadata {
	componentType: 'template';
}

// New paginated API response structure
export interface PaginatedApiResponse<T> {
	items: T[];
	page: number;
	hasNextPage: boolean;
}

export interface ApiBlocksResponse extends PaginatedApiResponse<ApiBlock> {}
export interface ApiTemplatesResponse extends PaginatedApiResponse<ApiTemplateResponse> {}

export interface ApiCollection {
	templates?: ApiTemplateResponse[];
	blocks?: ApiBlock[];
}

export interface ApiError {
	message: string;
	code?: number;
}

// Configuration for GitHub Pages API
export interface ApiConfig {
	baseUrl: string;
	username: string;
}
