import { describe, it, expect } from 'vitest';
import { buildCategoryHierarchy } from '../template-category-mapper';
import type { TemplateCategory, Template } from '@/graphql/generated/types';

describe('buildCategoryHierarchy', () => {
    // Test data
    const mockTemplate: Template = {
        id: '1',
        name: 'Test Template',
        category: null,
        createdAt: '2025-05-07',
        updatedAt: '2025-05-07',
    };

    const createMockCategory = (
        id: string,
        name: string,
        parentId?: string,
        templates: Template[] = []
    ): TemplateCategory => ({
        id,
        name,
        templates,
        childCategories: [],
        parentCategory: parentId ? { id: parentId } as TemplateCategory : null,
        createdAt: '2025-05-07',
        updatedAt: '2025-05-07',
    });

    it('should build hierarchy from flat categories', () => {
        const flatCategories = [
            createMockCategory('1', 'Root'),
            createMockCategory('2', 'Child 1', '1'),
            createMockCategory('3', 'Child 2', '1'),
            createMockCategory('4', 'Grandchild 1', '2', [mockTemplate]),
        ];

        const result = buildCategoryHierarchy(flatCategories);

        // Should have one root category
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('1');
        expect(result[0].name).toBe('Root');

        // Root should have two children
        expect(result[0].childCategories).toHaveLength(2);
        expect(result[0].childCategories[0].name).toBe('Child 1');
        expect(result[0].childCategories[1].name).toBe('Child 2');

        // Child 1 should have one child with a template
        expect(result[0].childCategories[0].childCategories).toHaveLength(1);
        expect(result[0].childCategories[0].childCategories[0].templates).toHaveLength(1);
        expect(result[0].childCategories[0].childCategories[0].templates[0].id).toBe('1');
    });

    it('should handle multiple root categories', () => {
        const flatCategories = [
            createMockCategory('1', 'Root 1'),
            createMockCategory('2', 'Root 2'),
            createMockCategory('3', 'Child of Root 1', '1'),
        ];

        const result = buildCategoryHierarchy(flatCategories);

        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Root 1');
        expect(result[1].name).toBe('Root 2');
        expect(result[0].childCategories).toHaveLength(1);
        expect(result[1].childCategories).toHaveLength(0);
    });

    it('should handle empty input', () => {
        const result = buildCategoryHierarchy([]);
        expect(result).toHaveLength(0);
    });

    it('should handle categories with missing parent references', () => {
        const flatCategories = [
            createMockCategory('1', 'Root'),
            createMockCategory('2', 'Orphan Child', 'non-existent'),
        ];

        const result = buildCategoryHierarchy(flatCategories);

        // Both categories should be treated as root categories
        expect(result).toHaveLength(2);
        expect(result.map(c => c.name)).toContain('Root');
        expect(result.map(c => c.name)).toContain('Orphan Child');
    });

    it('should preserve templates in categories', () => {
        const template1 = { ...mockTemplate, id: '1', name: 'Template 1' };
        const template2 = { ...mockTemplate, id: '2', name: 'Template 2' };

        const flatCategories = [
            createMockCategory('1', 'Root', undefined, [template1]),
            createMockCategory('2', 'Child', '1', [template2]),
        ];

        const result = buildCategoryHierarchy(flatCategories);

        expect(result[0].templates).toHaveLength(1);
        expect(result[0].templates?.[0].name).toBe('Template 1');
        expect(result[0].childCategories[0].templates).toHaveLength(1);
        expect(result[0].childCategories[0].templates?.[0].name).toBe('Template 2');
    });
});
