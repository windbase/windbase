/** biome-ignore-all lint/suspicious/noExplicitAny: allow any */
import { describe, expect, it } from 'vitest';
import { useBuilder } from '../index.js';
import type { BuilderStore } from '../types.js';
import { setupTest } from './setup.js';

setupTest();

describe('Type Safety', () => {
  it('should maintain correct TypeScript types', () => {
    const store = useBuilder.getState();

    // Test that the store conforms to BuilderStore interface
    expect(store).toBeDefined();
    expect(typeof store.selectElement).toBe('function');
    expect(typeof store.addElement).toBe('function');
    expect(typeof store.loadTemplate).toBe('function');
    expect(typeof store.createPage).toBe('function');
    expect(typeof store.saveToHistory).toBe('function');
    expect(typeof store.saveToHistoryImmediate).toBe('function');
  });

  it('should handle nullable values correctly', () => {
    const store = useBuilder.getState();

    expect(store.selectedElement).toBeNull();
    expect(store.hoveredElement).toBeNull();
    expect(store.currentPageId).toBeNull();
  });

  it('should have correct types for primitive values', () => {
    const store = useBuilder.getState();

    expect(typeof store.historyIndex).toBe('number');
    expect(typeof store.canUndo).toBe('boolean');
    expect(typeof store.canRedo).toBe('boolean');
    expect(typeof store.sidebarView).toBe('string');
    expect(typeof store.responsiveMode).toBe('string');
  });

  it('should have correct types for arrays', () => {
    const store = useBuilder.getState();

    expect(Array.isArray(store.history)).toBe(true);
    expect(store.history).toHaveLength(0);
  });

  it('should have correct types for Map objects', () => {
    const store = useBuilder.getState();

    expect(store.pages).toBeInstanceOf(Map);
    expect(typeof store.pages?.get).toBe('function');
    expect(typeof store.pages?.set).toBe('function');
    expect(typeof store.pages?.has).toBe('function');
  });

  it('should have correct types for enum-like values', () => {
    const store = useBuilder.getState();

    // Test that enum-like values are properly typed
    expect(['pages', 'layers'].includes(store.sidebarView)).toBe(true);
    expect(['desktop', 'mobile'].includes(store.responsiveMode)).toBe(true);
  });

  it('should maintain type safety with state updates', () => {
    // These should be valid updates
    useBuilder.setState({
      historyIndex: 1,
      canUndo: true,
      sidebarView: 'layers',
      responsiveMode: 'mobile'
    });

    const updatedStore = useBuilder.getState();
    expect(updatedStore.historyIndex).toBe(1);
    expect(updatedStore.canUndo).toBe(true);
    expect(updatedStore.sidebarView).toBe('layers');
    expect(updatedStore.responsiveMode).toBe('mobile');
  });

  it('should handle EditorElement type correctly', () => {
    // Test that selectedElement can be properly typed
    const testElement = {
      id: 'test-element',
      type: 'layout',
      tag: 'div',
      classes: ['test-class'],
      content: 'Test content',
      children: []
    };

    useBuilder.setState({ selectedElement: testElement });

    const updatedStore = useBuilder.getState();
    expect(updatedStore.selectedElement?.id).toBe('test-element');
    expect(updatedStore.selectedElement?.type).toBe('layout');
    expect(updatedStore.selectedElement?.tag).toBe('div');
    expect(Array.isArray(updatedStore.selectedElement?.classes)).toBe(true);
    expect(updatedStore.selectedElement?.classes).toContain('test-class');
    expect(Array.isArray(updatedStore.selectedElement?.children)).toBe(true);
  });

  it('should handle function types correctly', () => {
    const store = useBuilder.getState();

    // Test that all functions are properly typed
    const functionProperties = [
      'saveToHistory', 'saveToHistoryImmediate', 'undo', 'redo',
      'selectElement', 'hoverElement', 'setSidebarView', 'getParentIds',
      'getCurrentPageElements', 'addElement', 'updateElement', 'deleteElement',
      'moveElement', 'moveElementToTop', 'moveElementInParent', 'updateClasses', 'setResponsiveMode',
      'loadTemplate', 'loadFromCore', 'exportToCore', 'exportHtml',
      'createPage', 'deletePage', 'updatePage', 'setCurrentPage',
      'getCurrentPage', 'getPageById', 'getAllPages', 'duplicatePage',
      'initializePages', 'debugPages'
    ];

    functionProperties.forEach(prop => {
      expect(typeof store[prop as keyof BuilderStore]).toBe('function');
    });
  });

  it('should handle complex nested types correctly', () => {
    // Test with a complex nested element structure
    const complexElement = {
      id: 'parent',
      type: 'layout',
      tag: 'div',
      classes: ['parent-class'],
      content: 'Parent content',
      children: [
        {
          id: 'child1',
          type: 'content',
          tag: 'p',
          classes: ['child-class'],
          content: 'Child 1 content',
          children: []
        },
        {
          id: 'child2',
          type: 'content',
          tag: 'span',
          classes: ['child-class'],
          content: 'Child 2 content',
          children: []
        }
      ]
    };

    useBuilder.setState({ selectedElement: complexElement });

    const updatedStore = useBuilder.getState();
    expect(updatedStore.selectedElement?.children).toHaveLength(2);
    expect(updatedStore.selectedElement?.children[0]?.id).toBe('child1');
    expect(updatedStore.selectedElement?.children[1]?.id).toBe('child2');
  });

  it('should handle Map type operations correctly', () => {
    // Test Map type operations
    const testPage = {
      id: 'test-page',
      name: 'Test Page',
      elements: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const newPages = new Map([['test-page', testPage]]);
    useBuilder.setState({ pages: newPages });

    const updatedStore = useBuilder.getState();
    expect(updatedStore.pages?.has('test-page')).toBe(true);
    expect(updatedStore.pages?.get('test-page')?.name).toBe('Test Page');
    expect(updatedStore.pages?.size).toBe(1);
  });

  it('should handle optional properties correctly', () => {
    // Test element with optional properties
    const elementWithOptionals = {
      id: 'optional-element',
      type: 'layout',
      tag: 'div',
      classes: ['test'],
      content: 'Test content',
      children: [],
      isContentEditable: true,
      parent: 'parent-id',
      attributes: { 'data-test': 'value' }
    };

    useBuilder.setState({ selectedElement: elementWithOptionals });

    const updatedStore = useBuilder.getState();
    expect(updatedStore.selectedElement?.isContentEditable).toBe(true);
    expect(updatedStore.selectedElement?.parent).toBe('parent-id');
    expect(updatedStore.selectedElement?.attributes?.['data-test']).toBe('value');
  });

  it('should handle partial updates with correct types', () => {
    // Test that partial updates maintain type safety
    useBuilder.setState({
      selectedElement: {
        id: 'test',
        type: 'layout',
        tag: 'div',
        classes: [],
        content: '',
        children: []
      }
    });

    // Should be able to update with partial properties
    useBuilder.setState({
      responsiveMode: 'mobile'
    });

    const updatedStore = useBuilder.getState();
    expect(updatedStore.selectedElement?.id).toBe('test');
    expect(updatedStore.responsiveMode).toBe('mobile');
  });
}); 