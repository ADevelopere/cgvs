import { describe, expect, it } from 'vitest';
import { mapSingleTemplate, mapTemplates } from '../template-mappers';
import type {
    CreateTemplateMutation,
    DeleteTemplateMutation,
    MoveTemplateToDeletionCategoryMutation,
    RestoreTemplateMutation,
    ReorderTemplatesMutation,
    UpdateTemplateMutation,
    Template,
    TemplateCategory,
    TemplateCategoryType,
} from '@/graphql/generated/types';

describe('template-mappers', () => {
    const mockCategory: TemplateCategory = {
        __typename: 'TemplateCategory',
        id: 'cat1',
        name: 'Category 1',
        description: 'Test Category',
        special_type: 'none' as TemplateCategoryType,
        order: 1,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-01'),
        deleted_at: null,
        templates: [],
        childCategories: [],
        parentCategory: null,
    };

    const mockTemplate: Template = {
        __typename: 'Template',
        id: 'template1',
        name: 'Test Template',
        description: 'Test Description',
        background_url: 'https://example.com/bg.jpg',
        order: 1,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-01'),
        deleted_at: null,
        trashed_at: null,
        category: mockCategory,
    };

    describe('mapSingleTemplate', () => {
        it('should map CreateTemplateMutation correctly', () => {
            const createMutation: CreateTemplateMutation = {
                __typename: 'Mutation',
                createTemplate: {
                    __typename: 'Template',
                    id: 'new1',
                    name: 'New Template',
                    description: 'New Description',
                    background_url: 'https://example.com/new.jpg',
                    order: 1,
                    created_at: '2025-01-01',
                    category: {
                        __typename: 'TemplateCategory',
                        id: mockCategory.id,
                    },
                },
            };

            const result = mapSingleTemplate(createMutation);
            expect(result).toBeTruthy();
            expect(result?.id).toBe('new1');
            expect(result?.name).toBe('New Template');
            expect(result?.description).toBe('New Description');
            expect(result?.background_url).toBe('https://example.com/new.jpg');
        });

        it('should map UpdateTemplateMutation with previous template', () => {
            const updateMutation: UpdateTemplateMutation = {
                __typename: 'Mutation',
                updateTemplate: {
                    __typename: 'Template',
                    id: mockTemplate.id,
                    name: 'Updated Name',
                    description: null,
                    background_url: null,
                    order: null,
                    created_at: '2025-01-01',
                    updated_at: '2025-01-02',
                    trashed_at: null,
                    deleted_at: null,
                    category: {
                        __typename: 'TemplateCategory',
                        id: mockCategory.id,
                    },
                },
            };

            const result = mapSingleTemplate(updateMutation, mockTemplate);
            expect(result).toBeTruthy();
            expect(result?.id).toBe(mockTemplate.id);
            expect(result?.name).toBe('Updated Name');
            expect(result?.description).toBe(mockTemplate.description);
            expect(result?.background_url).toBe(mockTemplate.background_url);
        });

        it('should map DeleteTemplateMutation with previous template', () => {
            const deleteMutation: DeleteTemplateMutation = {
                __typename: 'Mutation',
                deleteTemplate: {
                    __typename: 'Template',
                    id: mockTemplate.id,
                    name: mockTemplate.name,
                    deleted_at: '2025-01-02',
                    category: {
                        __typename: 'TemplateCategory',
                        id: mockCategory.id,
                    },
                },
            };

            const result = mapSingleTemplate(deleteMutation, mockTemplate);
            expect(result).toBeTruthy();
            expect(result?.id).toBe(mockTemplate.id);
            expect(result?.deleted_at).toBeTruthy();
            expect(result?.description).toBe(mockTemplate.description);
        });

        it('should map MoveTemplateToDeletionCategoryMutation with previous template', () => {
            const moveMutation: MoveTemplateToDeletionCategoryMutation = {
                __typename: 'Mutation',
                moveTemplateToDeletionCategory: {
                    __typename: 'Template',
                    id: mockTemplate.id,
                    name: mockTemplate.name,
                    order: 2,
                    trashed_at: '2025-01-02',
                    updated_at: '2025-01-02',
                    category: {
                        __typename: 'TemplateCategory',
                        id: 'deletion-category',
                    },
                },
            };

            const result = mapSingleTemplate(moveMutation, mockTemplate);
            expect(result).toBeTruthy();
            expect(result?.id).toBe(mockTemplate.id);
            expect(result?.trashed_at).toBeTruthy();
            expect(result?.category.id).toBe('deletion-category');
            expect(result?.description).toBe(mockTemplate.description);
        });

        it('should map RestoreTemplateMutation with previous template', () => {
            const restoreMutation: RestoreTemplateMutation = {
                __typename: 'Mutation',
                restoreTemplate: {
                    __typename: 'Template',
                    id: mockTemplate.id,
                    name: mockTemplate.name,
                    description: null,
                    order: mockTemplate.order,
                    created_at: '2025-01-01',
                    deleted_at: null,
                    trashed_at: null,
                    updated_at: '2025-01-02',
                    category: {
                        __typename: 'TemplateCategory',
                        id: mockCategory.id,
                    },
                },
            };

            const result = mapSingleTemplate(restoreMutation, mockTemplate);
            expect(result).toBeTruthy();
            expect(result?.id).toBe(mockTemplate.id);
            expect(result?.deleted_at).toBeNull();
            expect(result?.trashed_at).toBeNull();
            expect(result?.description).toBe(mockTemplate.description);
        });
    });

    describe('mapTemplates', () => {
        it('should map ReorderTemplatesMutation with previous templates', () => {
            const template2: Template = {
                ...mockTemplate,
                id: 'template2',
                name: 'Template 2',
                order: 2,
            };

            const reorderMutation: ReorderTemplatesMutation = {
                __typename: 'Mutation',
                reorderTemplates: [
                    {
                        __typename: 'Template',
                        id: mockTemplate.id,
                        name: mockTemplate.name,
                        order: 2,
                        updated_at: '2025-01-02',
                        category: {
                            __typename: 'TemplateCategory',
                            id: mockCategory.id,
                        },
                    },
                    {
                        __typename: 'Template',
                        id: template2.id,
                        name: template2.name,
                        order: 1,
                        updated_at: '2025-01-02',
                        category: {
                            __typename: 'TemplateCategory',
                            id: mockCategory.id,
                        },
                    },
                ],
            };

            const result = mapTemplates(reorderMutation, [mockTemplate, template2]);
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe(mockTemplate.id);
            expect(result[0].order).toBe(2);
            expect(result[1].id).toBe(template2.id);
            expect(result[1].order).toBe(1);
            // Check that other properties are preserved
            expect(result[0].description).toBe(mockTemplate.description);
            expect(result[0].background_url).toBe(mockTemplate.background_url);
        });

        it('should handle single template mutations in mapTemplates', () => {
            const updateMutation: UpdateTemplateMutation = {
                __typename: 'Mutation',
                updateTemplate: {
                    __typename: 'Template',
                    id: mockTemplate.id,
                    name: 'Updated Name',
                    description: null,
                    background_url: null,
                    order: null,
                    created_at: '2025-01-01',
                    updated_at: '2025-01-02',
                    trashed_at: null,
                    deleted_at: null,
                    category: {
                        __typename: 'TemplateCategory',
                        id: mockCategory.id,
                    },
                },
            };

            const result = mapTemplates(updateMutation, [mockTemplate]);
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(mockTemplate.id);
            expect(result[0].name).toBe('Updated Name');
            expect(result[0].description).toBe(mockTemplate.description);
        });
    });

    describe('edge cases', () => {
        it('should handle null source', () => {
            expect(mapSingleTemplate(null)).toBeNull();
            expect(mapTemplates(null)).toEqual([]);
        });

        it('should handle undefined source', () => {
            expect(mapSingleTemplate(undefined)).toBeNull();
            expect(mapTemplates(undefined)).toEqual([]);
        });

        it('should handle missing previous template', () => {
            const updateMutation: UpdateTemplateMutation = {
                __typename: 'Mutation',
                updateTemplate: {
                    __typename: 'Template',
                    id: mockTemplate.id,
                    name: 'Updated Name',
                    description: null,
                    background_url: null,
                    order: null,
                    created_at: '2025-01-01',
                    updated_at: '2025-01-02',
                    trashed_at: null,
                    deleted_at: null,
                    category: {
                        __typename: 'TemplateCategory',
                        id: mockCategory.id,
                    },
                },
            };

            const result = mapSingleTemplate(updateMutation);
            expect(result).toBeTruthy();
            expect(result?.id).toBe(mockTemplate.id);
            expect(result?.name).toBe('Updated Name');
            expect(result?.description).toBeNull();
        });
    });
});
