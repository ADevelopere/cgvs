<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TemplateCategory;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class TemplateCategoryController extends Controller
{
    /**
     * Display a listing of the categories.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $categories = TemplateCategory::with(['parentCategory', 'childCategories', 'templates'])
            ->orderBy('order')
            ->get();

        return response()->json($categories);
    }

    /**
     * Store a newly created category in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        Log::info('Template category creation request:', [
            'input' => $request->all(),
        ]);

        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|min:3|max:255',
                'description' => 'nullable|string',
                'parent_category_id' => [
                    'nullable',
                    'exists:template_categories,id',
                    function ($attribute, $value, $fail) {
                        // Prevent creating subcategories under deletion category
                        if ($value) {
                            $parentCategory = TemplateCategory::find($value);
                            if ($parentCategory && $parentCategory->isDeletionCategory()) {
                                $fail('Cannot create subcategories under deletion category.');
                            }
                        }
                    },
                ],
                'special_type' => [
                    'prohibited', // New categories can't have special types
                    function ($attribute, $value, $fail) {
                        $fail('Cannot create new special categories.');
                    }
                ]
            ], [
                'name.required' => 'The category name is required.',
                'name.min' => 'The category name must be at least 3 characters.',
                'parent_category_id.exists' => 'The selected parent category does not exist.',
                'special_type.prohibited' => 'Cannot create new special categories.',
            ]);

            if ($validator->fails()) {
                Log::info('Template category validation failed', [
                    'errors' => $validator->errors()->toArray()
                ]);

                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $templateCategory = new TemplateCategory();
            $templateCategory->name = $request->name;
            $templateCategory->description = $request->description;
            $templateCategory->parent_category_id = $request->parent_category_id;
            
            // Set order as last in the current level
            $templateCategory->order = TemplateCategory::where('parent_category_id', $request->parent_category_id)
                ->max('order') + 1;

            $templateCategory->save();

            Log::info('Template category created successfully', [
                'category_id' => $templateCategory->id
            ]);

            return response()->json($templateCategory, 201);

        } catch (Exception $e) {
            Log::error('Failed to create template category', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to create template category',
                'errors' => ['general' => ['An error occurred while creating the category. Please try again.']]
            ], 500);
        }
    }

    /**
     * Display the specified category.
     *
     * @param TemplateCategory $templateCategory
     * @return JsonResponse
     */
    public function show(TemplateCategory $templateCategory): JsonResponse
    {
        return response()->json($templateCategory->load(['parentCategory', 'childCategories', 'templates']));
    }

    /**
     * Update the specified category in storage.
     *
     * @param Request $request
     * @param TemplateCategory $templateCategory
     * @return JsonResponse
     */
    public function update(Request $request, TemplateCategory $templateCategory): JsonResponse
    {
        Log::info('Template category update request:', [
            'category_id' => $templateCategory->id,
            'input' => $request->all()
        ]);

        try {
            // Prevent modifications to deleted category
            if ($templateCategory->isImmutableCategory()) {
                throw new ValidationException(Validator::make([], []), 
                    response()->json([
                        'message' => 'The deleted templates category cannot be modified.',
                        'errors' => ['general' => ['This is a system category and cannot be modified.']]
                    ], 422)
                );
            }
            
            // For main category, only prevent having a parent
            if ($templateCategory->isMainCategory() && $request->has('parent_category_id')) {
                throw new ValidationException(Validator::make([], []), 
                    response()->json([
                        'message' => 'Main category cannot have a parent category.',
                        'errors' => ['general' => ['The main category cannot be a subcategory.']]
                    ], 422)
                );
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|min:3|max:255',
                'description' => 'nullable|string',
                'parent_category_id' => [
                    'nullable',
                    'exists:template_categories,id',
                    function ($attribute, $value, $fail) use ($templateCategory) {
                        if ($value) {
                            // Prevent moving under special categories
                            $parentCategory = TemplateCategory::find($value);
                            if ($parentCategory && $parentCategory->isSpecial()) {
                                $fail('Cannot move categories under special categories.');
                            }
                            
                            if ($value == $templateCategory->id) {
                                $fail('A category cannot be its own parent.');
                            }
                            
                            // Prevent circular references
                            $parent = $parentCategory;
                            while ($parent) {
                                if ($parent->id === $templateCategory->id) {
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

                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $templateCategory->name = $request->name;
            $templateCategory->description = $request->description;
            
            // Handle parent category change
            if ($request->has('parent_category_id') && $request->parent_category_id !== $templateCategory->parent_category_id) {
                $templateCategory->parent_category_id = $request->parent_category_id;
                // Set order as last in the new parent if not specified
                if (!$request->has('order')) {
                    $templateCategory->order = TemplateCategory::where('parent_category_id', $request->parent_category_id)
                        ->max('order') + 1;
                }
            }

            // Handle explicit order change
            if ($request->has('order')) {
                $templateCategory->order = $request->order;
            }

            $templateCategory->save();

            Log::info('Template category updated successfully', [
                'category_id' => $templateCategory->id
            ]);

            return response()->json($templateCategory->load(['parentCategory', 'childCategories', 'templates']));

        } catch (ValidationException $e) {
            throw $e;
        } catch (Exception $e) {
            Log::error('Failed to update template category', [
                'error' => $e->getMessage(),
                'category_id' => $templateCategory->id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to update template category',
                'errors' => ['general' => ['An error occurred while updating the category. Please try again.']]
            ], 500);
        }
    }

    /**
     * Remove the specified category from storage.
     *
     * @param TemplateCategory $templateCategory
     * @return JsonResponse
     */
    public function destroy(TemplateCategory $templateCategory): JsonResponse
    {
        // Log with the actual category ID
        Log::info('Template category delete request:', [
            'category_id' => $templateCategory->id ?? null
        ]);

        try {
            // Prevent deletion of special categories
            if ($templateCategory->isSpecial()) {
                return response()->json([
                    'message' => 'Special categories cannot be deleted.',
                    'errors' => ['general' => ['This is a system category and cannot be deleted.']]
                ], 422);
            }

            // Check for child categories
            if ($templateCategory->childCategories()->count() > 0) {
                return response()->json([
                    'message' => 'Cannot delete category with child categories',
                    'errors' => ['general' => ['Please delete or move all child categories first.']]
                ], 422);
            }

            // Check for templates
            if ($templateCategory->templates()->count() > 0) {
                return response()->json([
                    'message' => 'Cannot delete category with templates',
                    'errors' => ['general' => ['Please delete or move all templates in this category first.']]
                ], 422);
            }

            $categoryId = $templateCategory->id; // Store ID before deletion
            $templateCategory->delete();

            Log::info('Template category deleted successfully', [
                'category_id' => $categoryId
            ]);

            return response()->json(null, 204);

        } catch (Exception $e) {
            Log::error('Failed to delete template category', [
                'error' => $e->getMessage(),
                'category_id' => $templateCategory->id ?? null,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to delete template category',
                'errors' => ['general' => ['An error occurred while deleting the category. Please try again.']]
            ], 500);
        }
    }

    /**
     * Reorder categories.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function reorder(Request $request): JsonResponse
    {
        Log::info('Template category reorder request:', [
            'input' => $request->all()
        ]);

        try {
            $validator = Validator::make($request->all(), [
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
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            foreach ($request->categories as $categoryData) {
                TemplateCategory::where('id', $categoryData['id'])
                    ->update(['order' => $categoryData['order']]);
            }

            Log::info('Template categories reordered successfully');

            return response()->json(['message' => 'Categories reordered successfully']);

        } catch (Exception $e) {
            Log::error('Failed to reorder template categories', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to reorder categories',
                'errors' => ['general' => ['An error occurred while reordering categories. Please try again.']]
            ], 500);
        }
    }
}
