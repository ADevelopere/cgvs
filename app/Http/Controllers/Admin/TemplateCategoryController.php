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
                        if ($value == 101007) { // Special category for deleted templates
                            $fail('Cannot create a subcategory under the deleted templates category.');
                        }
                    },
                ],
            ], [
                'name.required' => 'The category name is required.',
                'name.min' => 'The category name must be at least 3 characters.',
                'parent_category_id.exists' => 'The selected parent category does not exist.',
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

            $category = new TemplateCategory();
            $category->name = $request->name;
            $category->description = $request->description;
            $category->parent_category_id = $request->parent_category_id;
            
            // Set order as last in the current level
            $category->order = TemplateCategory::where('parent_category_id', $request->parent_category_id)
                ->max('order') + 1;

            $category->save();

            Log::info('Template category created successfully', [
                'category_id' => $category->id
            ]);

            return response()->json($category, 201);

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
     * @param TemplateCategory $category
     * @return JsonResponse
     */
    public function show(TemplateCategory $category): JsonResponse
    {
        return response()->json($category->load(['parentCategory', 'childCategories', 'templates']));
    }

    /**
     * Update the specified category in storage.
     *
     * @param Request $request
     * @param TemplateCategory $category
     * @return JsonResponse
     */
    public function update(Request $request, TemplateCategory $category): JsonResponse
    {
        Log::info('Template category update request:', [
            'category_id' => $category->id,
            'input' => $request->all()
        ]);

        try {
            // Prevent modifications to the special deleted templates category
            if ($category->id === 101007) {
                throw new ValidationException(Validator::make([], []), 
                    response()->json([
                        'message' => 'The deleted templates category cannot be modified.',
                        'errors' => ['general' => ['This is a system category and cannot be modified.']]
                    ], 422)
                );
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|min:3|max:255',
                'description' => 'nullable|string',
                'parent_category_id' => [
                    'nullable',
                    'exists:template_categories,id',
                    function ($attribute, $value, $fail) use ($category) {
                        if ($value == 101007) {
                            $fail('Cannot move category under the deleted templates category.');
                        }
                        if ($value == $category->id) {
                            $fail('A category cannot be its own parent.');
                        }
                        // Prevent circular references
                        if ($value) {
                            $parent = TemplateCategory::find($value);
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

                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $category->name = $request->name;
            $category->description = $request->description;
            
            // Handle parent category change
            if ($request->has('parent_category_id') && $request->parent_category_id !== $category->parent_category_id) {
                $category->parent_category_id = $request->parent_category_id;
                // Set order as last in the new parent if not specified
                if (!$request->has('order')) {
                    $category->order = TemplateCategory::where('parent_category_id', $request->parent_category_id)
                        ->max('order') + 1;
                }
            }

            // Handle explicit order change
            if ($request->has('order')) {
                $category->order = $request->order;
            }

            $category->save();

            Log::info('Template category updated successfully', [
                'category_id' => $category->id
            ]);

            return response()->json($category->load(['parentCategory', 'childCategories', 'templates']));

        } catch (ValidationException $e) {
            throw $e;
        } catch (Exception $e) {
            Log::error('Failed to update template category', [
                'error' => $e->getMessage(),
                'category_id' => $category->id,
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
     * @param TemplateCategory $category
     * @return JsonResponse
     */
    public function destroy(TemplateCategory $category): JsonResponse
    {
        Log::info('Template category delete request:', [
            'category_id' => $category->id
        ]);

        try {
            // Prevent deletion of the special deleted templates category
            if ($category->id === 101007) {
                return response()->json([
                    'message' => 'The deleted templates category cannot be deleted.',
                    'errors' => ['general' => ['This is a system category and cannot be deleted.']]
                ], 422);
            }

            // Check for child categories
            if ($category->childCategories()->count() > 0) {
                return response()->json([
                    'message' => 'Cannot delete category with child categories',
                    'errors' => ['general' => ['Please delete or move all child categories first.']]
                ], 422);
            }

            // Check for templates
            if ($category->templates()->count() > 0) {
                return response()->json([
                    'message' => 'Cannot delete category with templates',
                    'errors' => ['general' => ['Please delete or move all templates in this category first.']]
                ], 422);
            }

            $category->delete();

            Log::info('Template category deleted successfully', [
                'category_id' => $category->id
            ]);

            return response()->json(null, 204);

        } catch (Exception $e) {
            Log::error('Failed to delete template category', [
                'error' => $e->getMessage(),
                'category_id' => $category->id,
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
                'categories.*.id' => 'required|exists:template_categories,id',
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
