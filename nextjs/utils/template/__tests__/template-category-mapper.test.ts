import { describe, it, expect } from "vitest";
import {
    mapTemplateCategory,
    mapTemplateCategories,
} from "../template-category-mapper";
import type {
    CreateTemplateCategoryMutation,
    DeleteTemplateCategoryMutation,
    ReorderTemplateCategoriesMutation,
    UpdateTemplateCategoryMutation,
    DeletionTemplateCategoryQuery,
    MainTemplateCategoryQuery,
    TemplateCategoryQuery,
    TemplateCategoriesQuery,
    TemplateCategory,
    Template,
} from "@/graphql/generated/types";

describe("Template Category Mapper", () => {
    // Test data
    const tempCategory: TemplateCategory = {
        id: "1",
        name: "Test Category",
        templates: [],
        childCategories: [],
        parentCategory: null,
        created_at: "2025-05-07",
        updated_at: "2025-05-07",
    };

    const mockTemplate: Template = {
        id: "1",
        name: "Test Template",
        category: tempCategory,
        created_at: "2025-05-07",
        updated_at: "2025-05-07",
    };

    const mockCategory: TemplateCategory = {
        id: "1",
        name: "Test Category",
        templates: [mockTemplate],
        childCategories: [],
        parentCategory: null,
        created_at: "2025-05-07",
        updated_at: "2025-05-07",
    };

    // function to set mockCategory as category of mockTemplate
    const setCategory = (template: Template, category: TemplateCategory) => {
        template.category = category;
    };
    setCategory(mockTemplate, mockCategory);

    describe("mapTemplateCategory", () => {
        it("should handle CreateTemplateCategoryMutation", () => {
            const input: CreateTemplateCategoryMutation = {
                createTemplateCategory: mockCategory,
            };
            const result = mapTemplateCategory(input);
            expect(result).toEqual(mockCategory);
        });

        it("should handle DeleteTemplateCategoryMutation", () => {
            const input: DeleteTemplateCategoryMutation = {
                deleteTemplateCategory: mockCategory,
            };
            const result = mapTemplateCategory(input);
            expect(result).toEqual(mockCategory);
        });

        it("should handle UpdateTemplateCategoryMutation", () => {
            const input: UpdateTemplateCategoryMutation = {
                updateTemplateCategory: mockCategory,
            };
            const result = mapTemplateCategory(input);
            expect(result).toEqual(mockCategory);
        });

        it("should handle DeletionTemplateCategoryQuery", () => {
            const input: DeletionTemplateCategoryQuery = {
                deletionTemplateCategory: mockCategory,
            };
            const result = mapTemplateCategory(input);
            expect(result).toEqual(mockCategory);
        });

        it("should handle MainTemplateCategoryQuery", () => {
            const input: MainTemplateCategoryQuery = {
                mainTemplateCategory: mockCategory,
            };
            const result = mapTemplateCategory(input);
            expect(result).toEqual(mockCategory);
        });

        it("should handle TemplateCategoryQuery", () => {
            const input: TemplateCategoryQuery = {
                templateCategory: mockCategory,
            };
            const result = mapTemplateCategory(input);
            expect(result).toEqual(mockCategory);
        });

        it("should handle null TemplateCategoryQuery", () => {
            const input: TemplateCategoryQuery = {
                templateCategory: null,
            };
            const result = mapTemplateCategory(input);
            expect(result).toBeNull();
        });

        it("should handle TemplateCategoriesQuery", () => {
            const input: TemplateCategoriesQuery = {
                templateCategories: {
                    data: [mockCategory],
                    paginatorInfo: {
                        count: 1,
                        currentPage: 1,
                        firstItem: 1,
                        hasMorePages: false,
                        lastItem: 1,
                        lastPage: 1,
                        perPage: 10,
                        total: 1,
                    },
                },
            };
            const result = mapTemplateCategory(input);
            expect(result).toEqual(mockCategory);
        });

        it("should handle ReorderTemplateCategoriesMutation", () => {
            const input: ReorderTemplateCategoriesMutation = {
                reorderTemplateCategories: [mockCategory],
            };
            const result = mapTemplateCategory(input);
            expect(result).toEqual(mockCategory);
        });

        it("should handle undefined input", () => {
            const result = mapTemplateCategory(undefined);
            expect(result).toBeNull();
        });

        it("should handle null input", () => {
            const result = mapTemplateCategory(null);
            expect(result).toBeNull();
        });
    });

    describe("mapTemplateCategories", () => {
        it("should handle TemplateCategoriesQuery", () => {
            const input: TemplateCategoriesQuery = {
                templateCategories: {
                    data: [mockCategory, { ...mockCategory, id: "2" }],
                    paginatorInfo: {
                        count: 2,
                        currentPage: 1,
                        firstItem: 1,
                        hasMorePages: false,
                        lastItem: 2,
                        lastPage: 1,
                        perPage: 10,
                        total: 2,
                    },
                },
            };
            const result = mapTemplateCategories(input);
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual(mockCategory);
            expect(result[1]).toEqual({ ...mockCategory, id: "2" });
        });

        it("should handle ReorderTemplateCategoriesMutation", () => {
            const input: ReorderTemplateCategoriesMutation = {
                reorderTemplateCategories: [
                    mockCategory,
                    { ...mockCategory, id: "2" },
                ],
            };
            const result = mapTemplateCategories(input);
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual(mockCategory);
            expect(result[1]).toEqual({ ...mockCategory, id: "2" });
        });

        it("should handle single category source", () => {
            const input: CreateTemplateCategoryMutation = {
                createTemplateCategory: mockCategory,
            };
            const result = mapTemplateCategories(input);
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(mockCategory);
        });

        it("should handle undefined input", () => {
            const result = mapTemplateCategories(undefined);
            expect(result).toEqual([]);
        });

        it("should handle null input", () => {
            const result = mapTemplateCategories(null);
            expect(result).toEqual([]);
        });
    });
});
