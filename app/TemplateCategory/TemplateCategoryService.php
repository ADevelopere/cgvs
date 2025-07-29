<?php

namespace App\TemplateCategory;

use App\Models\TemplateCategory;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class TemplateCategoryService
{
    /**
     * Create a new template category
     *
     * @param CreateTemplateCategoryInput $input Category data containing name, description, and parentCategoryId
     * @return ?TemplateCategory
     * @throws ValidationException|Exception
     */
    public static function createTemplateCategory(CreateTemplateCategoryInput $input): ?TemplateCategory
    {
        Log::info('Template category creation request:', ['input' => [
            'name' => $input->name,
            'description' => $input->description,
            'parentCategoryId' => $input->parentCategoryId,
            'order' => $input->order,
        ]]);

        // Validate name
        if (!$input->name || strlen($input->name) < 3 || strlen($input->name) > 255) {
            throw ValidationException::withMessages([
                'name' => ['The category name must be between 3 and 255 characters.']
            ]);
        }

        if ($input->parentCategoryId) {
            // Check if parent category exists
            if (!TemplateCategory::find($input->parentCategoryId)) {
                throw ValidationException::withMessages([
                    'parent_category_id' => ['The selected parent category does not exist.']
                ]);
            }

            // Validate not deletion category
            [$valid, $message] = TemplateCategoryValidator::validateNotDeletionCategory($input->parentCategoryId);
            if (!$valid) {
                throw ValidationException::withMessages([
                    'parent_category_id' => [$message]
                ]);
            }
        }

        try {
            $templateCategory = new TemplateCategory();
            $templateCategory->name = $input->name;
            $templateCategory->description = $input->description;
            $templateCategory->parent_category_id = $input->parentCategoryId;

            // Set order as last in the current level
            if ($input->order === null) {
                $templateCategory->order = TemplateCategory::where('parent_category_id', $input->parentCategoryId)
                    ->max('order') + 1;
            } else {
                $templateCategory->order = $input->order;
            }

            $templateCategory->save();

            Log::info('Template category created successfully', [
                'category_id' => $templateCategory->id
            ]);

            return $templateCategory->load(['parentCategory', 'childCategories', 'templates']);

        } catch (Exception $e) {
            Log::error('Failed to create template category', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new Exception('Failed to create template category');
        }
    }

    /**
     * Update an existing template category
     *
     * @param TemplateCategory $category
     * @param UpdateTemplateCategoryInput $input
     * @return ?TemplateCategory
     * @throws ValidationException|Exception
     */
    public static function updateTemplateCategory(TemplateCategory $category, UpdateTemplateCategoryInput $input): ?TemplateCategory
    {
        Log::info('Template category update request:', [
            'category_id' => $category->id,
            'input' => [
                'name' => $input->name,
                'description' => $input->description,
                'parentCategoryId' => $input->parentCategoryId,
                'order' => $input->order,
            ]
        ]);

        if ($category->isImmutableCategory()) {
            throw ValidationException::withMessages([
                'general' => ['This is a system category and cannot be modified.']
            ]);
        }

        if ($category->isMainCategory() && $input->parentCategoryId !== null) {
            throw ValidationException::withMessages([
                'general' => ['The main category cannot be a subcategory.']
            ]);
        }

        // Validate name if provided
        if ($input->name !== null) {
            if (strlen($input->name) < 3 || strlen($input->name) > 255) {
                throw ValidationException::withMessages([
                    'name' => ['The category name must be between 3 and 255 characters.']
                ]);
            }
        }
        
        // Validate order if provided
        if ($input->order !== null && $input->order < 0) {
            throw ValidationException::withMessages([
                'order' => ['The order must be at least 0.']
            ]);
        }

        if ($input->parentCategoryId !== null) {
            // Check if parent category exists
            if (!TemplateCategory::find($input->parentCategoryId)) {
                throw ValidationException::withMessages([
                    'parent_category_id' => ['The selected parent category does not exist.']
                ]);
            }

            // Validate not deletion category
            [$valid, $message] = TemplateCategoryValidator::validateNotDeletionCategory($input->parentCategoryId);
            if (!$valid) {
                throw ValidationException::withMessages([
                    'parent_category_id' => [$message]
                ]);
            }

            // Validate no self parent
            [$valid, $message] = TemplateCategoryValidator::validateNoSelfParent($input->parentCategoryId, $category->id);
            if (!$valid) {
                throw ValidationException::withMessages([
                    'parent_category_id' => [$message]
                ]);
            }

            // Validate no circular reference
            [$valid, $message] = TemplateCategoryValidator::validateNoCircularReference($input->parentCategoryId, $category->id);
            if (!$valid) {
                throw ValidationException::withMessages([
                    'parent_category_id' => [$message]
                ]);
            }
        }

        try {
            if ($input->name !== null) {
                $category->name = $input->name;
            }
            if ($input->description !== null) {
                $category->description = $input->description;
            }

            // Handle parent category change
            if ($input->parentCategoryId !== null && $input->parentCategoryId !== $category->parent_category_id) {
                $category->parent_category_id = $input->parentCategoryId;
                // Set order as last in the new parent if not specified
                if ($input->order === null) {
                    $category->order = TemplateCategory::where('parent_category_id', $input->parentCategoryId)
                        ->max('order') + 1;
                }
            }

            // Handle explicit order change
            if ($input->order !== null) {
                $category->order = $input->order;
            }

            $category->save();

            Log::info('Template category updated successfully', [
                'category_id' => $category->id
            ]);

            return $category->load(['parentCategory', 'childCategories', 'templates']);

        } catch (Exception $e) {
            Log::error('Failed to update template category', [
                'error' => $e->getMessage(),
                'category_id' => $category->id,
                'trace' => $e->getTraceAsString()
            ]);
            throw new Exception('Failed to update template category');
        }
    }

    /**
     * Delete a template category
     *
     * @param TemplateCategory $category
     * @return TemplateCategory
     * @throws ValidationException|Exception
     */
    public static function deleteTemplateCategory(TemplateCategory $category): TemplateCategory
    {
        Log::info('Template category delete request:', [
            'category_id' => $category->id
        ]);

        if ($category->isSpecial()) {
            throw ValidationException::withMessages([
                'general' => ['This is a system category and cannot be deleted.']
            ]);
        }

        if ($category->childCategories()->count() > 0) {
            throw ValidationException::withMessages([
                'general' => ['Please delete or move all child categories first.']
            ]);
        }

        if ($category->templates()->count() > 0) {
            throw ValidationException::withMessages([
                'general' => ['Please delete or move all templates in this category first.']
            ]);
        }

        try {
            $deletedCategory = $category->load(['parentCategory', 'childCategories', 'templates']);
            $category->delete();

            Log::info('Template category deleted successfully', [
                'category_id' => $category->id
            ]);

            return $deletedCategory;

        } catch (Exception $e) {
            Log::error('Failed to delete template category', [
                'error' => $e->getMessage(),
                'category_id' => $category->id,
                'trace' => $e->getTraceAsString()
            ]);
            throw new Exception('Failed to delete template category');
        }
    }

    /**
     * Reorder template categories
     *
     * @param array $categories Array of categories with their new orders [['id' => 1, 'order' => 1], ...]
     * @return TemplateCategory[]
     * @throws ValidationException|Exception
     */
    public static function reorderCategories(array $categories): array
    {
        Log::info('Template category reorder request:', [
            'input' => $categories
        ]);

        $validator = Validator::make(['categories' => $categories], [
            'categories' => 'required|array',
            'categories.*.id' => [
                'required',
                'exists:template_categories,id',
                function ($attribute, $value, $fail) {
                    $templateCategory = TemplateCategory::find($value);
                    if ($templateCategory && $templateCategory->isSpecial()) {
                        $fail('Special categories cannot be reordered.');
                    }
                }
            ],
            'categories.*.order' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        try {
            $categoryIds = array_column($categories, 'id');
            
            foreach ($categories as $categoryData) {
                TemplateCategory::where('id', $categoryData['id'])
                    ->update(['order' => $categoryData['order']]);
            }

            Log::info('Template categories reordered successfully');
            
            return TemplateCategory::whereIn('id', $categoryIds)
                ->orderBy('order')
                ->get()
                ->load(['parentCategory', 'childCategories', 'templates'])
                ->all();

        } catch (Exception $e) {
            Log::error('Failed to reorder template categories', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new Exception('Failed to reorder template categories');
        }
    }

    /**
     * Get a flattened list of all template categories ordered by their hierarchy
     *
     * @return TemplateCategory[]
     */
    public static function getFlatCategories(): array
    {
        Log::info('Retrieving flattened list of template categories');

        try {
            return TemplateCategory::with(['parentCategory'])
                ->orderBy('parent_category_id', 'asc')
                ->orderBy('order', 'asc')
                ->get()
                ->map(function ($category) {
                    // Set childCategories to null
                    $category->setRelation('childCategories', null);
                    return $category;
                })
                ->all();

        } catch (Exception $e) {
            Log::error('Failed to retrieve flattened template categories', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new Exception('Failed to retrieve flattened template categories');
        }
    }
}
