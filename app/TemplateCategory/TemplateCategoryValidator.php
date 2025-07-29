<?php

namespace App\TemplateCategory;

use App\Models\TemplateCategory;


class TemplateCategoryValidator
{
    /**
     * Check if category is not deletion category
     * 
     * @param mixed $categoryId Parent category ID to check
     * @return array{bool, string|null} [isValid, error message]
     */
    public static function validateNotDeletionCategory($categoryId): array
    {
        if (!$categoryId) {
            return [true, null];
        }

        $parent = TemplateCategory::find($categoryId);
        if ($parent && $parent->isDeletionCategory()) {
            return [false, "Deletion category can't: (updated, have parent, have child categories or templates)."];
        }

        return [true, null];
    }

    /**
     * Prevent self-parent relationship
     * 
     * @param mixed $parentCategoryId Parent category ID to check
     * @param mixed $categoryId Current category ID
     * @return array{bool, string|null} [isValid, error message]
     */
    public static function validateNoSelfParent($parentCategoryId, $categoryId): array
    {
        if ($parentCategoryId && $categoryId && $parentCategoryId == $categoryId) {
            return [false, 'A category cannot be its own parent.'];
        }

        return [true, null];
    }

    /**
     * Prevent circular references in category hierarchy
     * 
     * @param mixed $parentCategoryId Parent category ID to check
     * @param mixed $categoryId Current category ID
     * @return array{bool, string|null} [isValid, error message]
     */
    public static function validateNoCircularReference($parentCategoryId, $categoryId): array
    {
        if (!$parentCategoryId || !$categoryId) {
            return [true, null];
        }

        $parent = TemplateCategory::find($parentCategoryId);
        while ($parent) {
            if ($parent->id === $categoryId) {
                return [false, 'Cannot create circular reference in category hierarchy.'];
            }
            $parent = $parent->parentCategory;
        }

        return [true, null];
    }
}
