import type { EditorElement } from '@windbase/core';
import { describe, expect, it } from 'vitest';
import {
	findAllParentIds,
	findElementById,
	removeElementById,
	updateParentReferences
} from './helpers.js';

// Mock EditorElement data for testing
const createMockElement = (
	id: string,
	children: EditorElement[] = []
): EditorElement => ({
	id,
	type: 'layout',
	tag: 'div',
	classes: [],
	content: 'Mock Element',
	attributes: {},
	parent: undefined,
	children
});

describe('Store Helpers', () => {
	describe('findElementById', () => {
		it('should find element by ID at root level', () => {
			const elements = [
				createMockElement('1'),
				createMockElement('2'),
				createMockElement('3')
			];

			const result = findElementById(elements, '2');
			expect(result).toBeTruthy();
			expect(result?.id).toBe('2');
		});

		it('should find element by ID in nested structure', () => {
			const elements = [
				createMockElement('1', [
					createMockElement('1-1'),
					createMockElement('1-2', [
						createMockElement('1-2-1'),
						createMockElement('1-2-2')
					])
				]),
				createMockElement('2')
			];

			const result = findElementById(elements, '1-2-2');
			expect(result).toBeTruthy();
			expect(result?.id).toBe('1-2-2');
		});

		it('should return null when element not found', () => {
			const elements = [createMockElement('1'), createMockElement('2')];

			const result = findElementById(elements, 'nonexistent');
			expect(result).toBeNull();
		});

		it('should return null for empty array', () => {
			const result = findElementById([], 'any');
			expect(result).toBeNull();
		});
	});

	describe('removeElementById', () => {
		it('should remove element by ID at root level', () => {
			const elements = [
				createMockElement('1'),
				createMockElement('2'),
				createMockElement('3')
			];

			const result = removeElementById(elements, '2');
			expect(result).toHaveLength(2);
			expect(result.map((el) => el.id)).toEqual(['1', '3']);
		});

		it('should remove element by ID in nested structure', () => {
			const elements = [
				createMockElement('1', [
					createMockElement('1-1'),
					createMockElement('1-2', [
						createMockElement('1-2-1'),
						createMockElement('1-2-2')
					])
				]),
				createMockElement('2')
			];

			const result = removeElementById(elements, '1-2-1');
			expect(result).toHaveLength(2);

			const element1 = result.find((el) => el.id === '1');
			expect(element1).toBeTruthy();
			expect(element1?.children).toHaveLength(2);

			const element12 = element1?.children.find((el) => el.id === '1-2');
			expect(element12).toBeTruthy();
			expect(element12?.children).toHaveLength(1);
			expect(element12?.children[0].id).toBe('1-2-2');
		});

		it('should return original array when element not found', () => {
			const elements = [createMockElement('1'), createMockElement('2')];

			const result = removeElementById(elements, 'nonexistent');
			expect(result).toHaveLength(2);
			expect(result.map((el) => el.id)).toEqual(['1', '2']);
		});

		it('should handle empty array', () => {
			const result = removeElementById([], 'any');
			expect(result).toEqual([]);
		});
	});

	describe('updateParentReferences', () => {
		it('should update parent references for root level elements', () => {
			const elements = [createMockElement('1'), createMockElement('2')];

			const result = updateParentReferences(elements);
			expect(result).toHaveLength(2);
			expect(result[0].parent).toBeUndefined();
			expect(result[1].parent).toBeUndefined();
		});

		it('should update parent references with provided parent ID', () => {
			const elements = [createMockElement('1'), createMockElement('2')];

			const result = updateParentReferences(elements, 'parent-id');
			expect(result).toHaveLength(2);
			expect(result[0].parent).toBe('parent-id');
			expect(result[1].parent).toBe('parent-id');
		});

		it('should update parent references recursively', () => {
			const elements = [
				createMockElement('1', [
					createMockElement('1-1'),
					createMockElement('1-2', [createMockElement('1-2-1')])
				])
			];

			const result = updateParentReferences(elements);
			expect(result[0].parent).toBeUndefined();
			expect(result[0].children[0].parent).toBe('1');
			expect(result[0].children[1].parent).toBe('1');
			expect(result[0].children[1].children[0].parent).toBe('1-2');
		});

		it('should handle empty array', () => {
			const result = updateParentReferences([]);
			expect(result).toEqual([]);
		});
	});

	describe('findAllParentIds', () => {
		it('should find direct parent', () => {
			const elements = [
				createMockElement('1', [
					createMockElement('1-1'),
					createMockElement('1-2')
				])
			];

			const result = findAllParentIds(elements, '1-1');
			expect(result).toEqual(['1']);
		});

		it('should find nested parent chain', () => {
			const elements = [
				createMockElement('1', [
					createMockElement('1-1', [
						createMockElement('1-1-1', [createMockElement('1-1-1-1')])
					])
				])
			];

			const result = findAllParentIds(elements, '1-1-1-1');
			expect(result).toEqual(['1', '1-1', '1-1-1']);
		});

		it('should return empty array when target not found', () => {
			const elements = [createMockElement('1', [createMockElement('1-1')])];

			const result = findAllParentIds(elements, 'nonexistent');
			expect(result).toEqual([]);
		});

		it('should return empty array for root level element', () => {
			const elements = [createMockElement('1'), createMockElement('2')];

			const result = findAllParentIds(elements, '1');
			expect(result).toEqual([]);
		});

		it('should handle empty array', () => {
			const result = findAllParentIds([], 'any');
			expect(result).toEqual([]);
		});
	});
});
