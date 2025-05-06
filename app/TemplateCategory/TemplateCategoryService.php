<?php

namespace App\TemplateCategory;

use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class TemplateCategoryService
{
    /**
     * Create a new template category
     *
     * @param array $data Category data containing name, description, and parent_category_id
     * @return TemplateCategory
     * @throws ValidationException|Exception
     */
    public static function createTemplateCategory(array $data): TemplateCategory
    {
        Log::info('Template category creation request:', ['input' => $data]);

        $validator = Validator::make($data, [
            'name' => 'required|string|min:3|max:255',
            'description' => 'nullable|string',
            'parent_category_id' => [
                'nullable',
                'exists:template_categories,id',
                function ($attribute, $value, $fail) {
                    if ($value) {
                        $parentCategory = TemplateCategory::find($value);
                        if ($parentCategory && $parentCategory->isDeletionCategory()) {
                            $fail('Cannot create subcategories under deletion category.');
                        }
                    }
                },
            ],
            'special_type' => [
                'prohibited',
                function ($attribute, $value, $fail) {
                    $fail('Cannot create new special categories.');
                }
            ]
        ]);

        if ($validator->fails()) {
            Log::info('Template category validation failed', [
                'errors' => $validator->errors()->toArray()
            ]);
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        try {
            $templateCategory = new TemplateCategory();
            $templateCategory->name = $data['name'];
            $templateCategory->description = $data['description'] ?? null;
            $templateCategory->parent_category_id = $data['parent_category_id'] ?? null;

            // Set order as last in the current level
            $templateCategory->order = TemplateCategory::where('parent_category_id', $data['parent_category_id'] ?? null)
                ->max('order') + 1;

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
     * @param array $data
     * @return TemplateCategory
     * @throws ValidationException|Exception
     */
    public static function updateTemplateCategory(TemplateCategory $category, array $data): TemplateCategory
    {
        Log::info('Template category update request:', [
            'category_id' => $category->id,
            'input' => $data
        ]);

        if ($category->isImmutableCategory()) {
            throw ValidationException::withMessages([
                'general' => ['This is a system category and cannot be modified.']
            ]);
        }

        if ($category->isMainCategory() && isset($data['parent_category_id'])) {
            throw ValidationException::withMessages([
                'general' => ['The main category cannot be a subcategory.']
            ]);
        }

        $validator = Validator::make($data, [
            'name' => 'sometimes|required|string|min:3|max:255',
            'description' => 'nullable|string',
            'parent_category_id' => [
                'nullable',
                'exists:template_categories,id',
                function ($attribute, $value, $fail) use ($category) {
                    if ($value) {
                        $parentCategory = TemplateCategory::find($value);
                        if ($parentCategory && $parentCategory->isDeletionCategory()) {
                            $fail('Cannot move categories under deletion category.');
                        }

                        if ($value == $category->id) {
                            $fail('A category cannot be its own parent.');
                        }

                        // Prevent circular references
                        $parent = $parentCategory;
                        while ($parent) {
                            if ($parent->id === $category->id) {
                                $fail('Cannot create circular reference in category hierarchy.');
                                break;
                            }
                            $parent = $parent->parentCategory;
                        }
                    }
                },
            ],
            'order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            Log::info('Template category validation failed', [
                'errors' => $validator->errors()->toArray()
            ]);
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        try {
            if (isset($data['name'])) {
                $category->name = $data['name'];
            }
            if (array_key_exists('description', $data)) {
                $category->description = $data['description'];
            }

            // Handle parent category change
            if (isset($data['parent_category_id']) && $data['parent_category_id'] !== $category->parent_category_id) {
                $category->parent_category_id = $data['parent_category_id'];
                // Set order as last in the new parent if not specified
                if (!isset($data['order'])) {
                    $category->order = TemplateCategory::where('parent_category_id', $data['parent_category_id'])
                        ->max('order') + 1;
                }
            }

            // Handle explicit order change
            if (isset($data['order'])) {
                $category->order = $data['order'];
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
     * @return bool
     * @throws ValidationException|Exception
     */
    public static function deleteTemplateCategory(TemplateCategory $category): bool
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
            $categoryId = $category->id;
            $result = $category->delete();

            Log::info('Template category deleted successfully', [
                'category_id' => $categoryId
            ]);

            return $result;

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
     * @return bool
     * @throws ValidationException|Exception
     */
    public static function reorderCategories(array $categories): bool
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
            foreach ($categories as $categoryData) {
                TemplateCategory::where('id', $categoryData['id'])
                    ->update(['order' => $categoryData['order']]);
            }

            Log::info('Template categories reordered successfully');
            return true;

        } catch (Exception $e) {
            Log::error('Failed to reorder template categories', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new Exception('Failed to reorder template categories');
        }
    }
}
