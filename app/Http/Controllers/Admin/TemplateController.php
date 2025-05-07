<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Models\TemplateCategory;
use App\Exceptions\TemplateStorageException;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Http\Middleware\TemplateTabPermissionMiddleware;

class TemplateController extends Controller
{
    public function __construct()
    {
        $this->middleware(TemplateTabPermissionMiddleware::class)->only(['show']);
    }

    /**
     * Display a listing of the templates.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $templates = Template::all();

        // Add background_url to each template
        $templates->transform(function ($template) {
            if ($template->background_url) {
                $template->background_url = Storage::url($template->background_url);
            }
            return $template;
        });

        return response()->json($templates);
    }

    /**
     * Get template configuration including max file size
     *
     * @return JsonResponse
     */
    public function config(): JsonResponse
    {
        $maxSize = config('filesystems.upload_limits.template_background', 2048);
        Log::debug('Template max file size config:', [
            'maxSize' => $maxSize,
            'env_value' => env('MAX_TEMPLATE_BACKGROUND_SIZE'),
            'full_config' => config('filesystems.upload_limits')
        ]);
        return response()->json([
            'maxFileSize' => $maxSize
        ]);
    }

    /**
     * Store a newly created template in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $maxSize = config('filesystems.upload_limits.template_background', 5120);

        // Log the incoming request data
        Log::info('Template creation request:', [
            'files' => $request->allFiles(),
            'input' => $request->all(),
            'headers' => $request->headers->all()
        ]);

        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:3|max:255',
            'description' => 'nullable|string',
            'category_id' => [
                'required',
                'exists:template_categories,id',
                function ($attribute, $value, $fail) {
                    $category = TemplateCategory::find($value);
                    if ($category && $category->isImmutableCategory()) {
                        $fail('Cannot create templates in deleted category.');
                    }
                },
            ],
            'background' => [
                'nullable',
                'file',
                'mimes:jpeg,png,jpg,gif',
                'max:' . $maxSize,
                function (string $_, $value, $fail) {
                    if ($value && !$value->isValid()) {
                        $fail('The background file is invalid or corrupted.');
                    }
                },
            ],
        ], [
            'background.max' => 'The background image must not be larger than ' . number_format($maxSize / 1024, 1) . ' MB.',
            'background.mimes' => 'The background image must be a file of type: jpeg, png, jpg, gif.',
            'category_id.required' => 'A category must be selected for the template.',
            'category_id.exists' => 'The selected category does not exist.',
            'name.min' => 'The template name must be at least 3 characters.',
        ]);

        if ($validator->fails()) {
            Log::info('Template validation failed', [
                'errors' => $validator->errors()->toArray(),
                'input' => $request->all()
            ]);

            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $template = new Template();
            $template->name = $request->name;
            $template->description = $request->description;
            $template->category_id = $request->category_id;

            // Set order only if not in a special category
            $category = TemplateCategory::find($request->category_id);
            if (!$category->isSpecial()) {
                $template->order = Template::where('category_id', $request->category_id)->max('order') + 1;
            }

            if ($request->hasFile('background') && $request->file('background')->isValid()) {
                Log::info('Processing background file for template');
                $path = $request->file('background')->store('template_backgrounds', 'public');
                if (!$path) {
                    throw new TemplateStorageException('Failed to store the background image.');
                }
                $template->background_url = $path;
            }

            Log::info('Saving template', [
                'template_data' => $template->toArray()
            ]);

            $template->save();

            Log::info('Template saved successfully', [
                'template_id' => $template->id
            ]);

            if ($template->background_url) {
                $template->background_url = Storage::url($template->background_url);
            }

            // Check if name variable was created
            $nameVariable = $template->variables()->where('is_key', true)->first();
            Log::info('Checking name variable creation', [
                'template_id' => $template->id,
                'name_variable_exists' => !is_null($nameVariable),
                'name_variable' => $nameVariable ? $nameVariable->toArray() : null
            ]);

            return response()->json($template, 201);
        } catch (Exception $e) {
            Log::error('Failed to create template', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'input' => $request->all()
            ]);

            return response()->json([
                'message' => 'Failed to create template',
                'error_details' => $e->getMessage(),
                'errors' => ['general' => ['An error occurred while creating the template. Please try again.']]
            ], 422);
        }
    }

    /**
     * Update the specified template in storage.
     *
     * @param Request $request
     * @param Template $template
     * @return JsonResponse
     */
    public function update(Request $request, Template $template): JsonResponse
    {
        $maxSize = config('filesystems.upload_limits.template_background', 5120);

        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:3|max:255',
            'description' => 'nullable|string',
            'category_id' => [
                'required',
                'exists:template_categories,id',
                function ($attribute, $value, $fail) {
                    $category = TemplateCategory::find($value);
                    if ($category && $category->isSpecial()) {
                        $fail('Cannot move templates to special categories manually.');
                    }
                },
            ],
            'background' => [
                'nullable',
                'file',
                'mimes:jpeg,png,jpg,gif',
                'max:' . $maxSize,
                function (string $_, $value, $fail) {
                    if ($value && !$value->isValid()) {
                        $fail('The background file is invalid or corrupted.');
                    }
                },
            ],
            'order' => 'nullable|integer|min:0'
        ], [
            'background.max' => 'The background image must not be larger than ' . number_format($maxSize / 1024, 1) . ' MB.',
            'background.mimes' => 'The background image must be a file of type: jpeg, png, jpg, gif.',
            'category_id.required' => 'A category must be selected for the template.',
            'category_id.exists' => 'The selected category does not exist.',
            'name.min' => 'The template name must be at least 3 characters.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $template->name = $request->name;
            $template->description = $request->description;

            // Handle category change
            if ($request->has('category_id') && $request->category_id !== $template->category_id) {
                $newCategory = TemplateCategory::findOrFail($request->category_id);

                // Only allow manual category changes to non-special categories
                if (!$newCategory->isSpecial()) {
                    $template->category_id = $request->category_id;
                    // Set order as last in the new category if not specified
                    if (!$request->has('order')) {
                        $template->order = Template::where('category_id', $request->category_id)
                            ->max('order') + 1;
                    }
                }
            }

            // Handle explicit order change only if not in a special category
            if ($request->has('order')) {
                $currentCategory = TemplateCategory::findOrFail($template->category_id);
                if (!$currentCategory->isSpecial()) {
                    $template->order = $request->order;
                }
            }

            if ($request->hasFile('background') && $request->file('background')->isValid()) {
                // Delete old background if it exists
                if ($template->background_url) {
                    Storage::disk('public')->delete($template->background_url);
                }

                $path = $request->file('background')->store('template_backgrounds', 'public');
                if (!$path) {
                    throw new TemplateStorageException('Failed to store the background image.');
                }
                $template->background_url = $path;
            }

            $template->save();

            if ($template->background_url) {
                $template->background_url = Storage::url($template->background_url);
            }

            return response()->json($template);
        } catch (Exception $e) {
            Log::error('Failed to update template', [
                'error' => $e->getMessage(),
                'template_id' => $template->id,
                'input' => $request->all()
            ]);

            return response()->json([
                'message' => 'Failed to update template',
                'error_details' => $e->getMessage(),
                'errors' => ['general' => ['An error occurred while updating the template. Please try again.']]
            ], 422);
        }
    }

    /**
     * Display the specified template.
     *
     * @param Template $template
     * @return JsonResponse
     */
    public function show(Template $template): JsonResponse
    {
        // Add background_url if the template has a background
        if ($template->background_url) {
            $template->background_url = Storage::url($template->background_url);
        }

        return response()->json($template);
    }

    /**
     * Reorder templates within a category.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function reorder(Request $request): JsonResponse
    {
        Log::info('Template reorder request:', [
            'input' => $request->all()
        ]);

        try {
            $validator = Validator::make($request->all(), [
                'templates' => 'required|array',
                'templates.*.id' => 'required|exists:templates,id',
                'templates.*.order' => 'required|integer|min:0',
                'category_id' => 'required|exists:template_categories,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            foreach ($request->templates as $templateData) {
                Template::where('id', $templateData['id'])
                    ->where('category_id', $request->category_id)
                    ->update(['order' => $templateData['order']]);
            }

            Log::info('Templates reordered successfully');

            return response()->json(['message' => 'Templates reordered successfully']);
        } catch (Exception $e) {
            Log::error('Failed to reorder templates', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to reorder templates',
                'errors' => ['general' => ['An error occurred while reordering templates. Please try again.']]
            ], 500);
        }
    }

    /**
     * This moves the template to the deleted category rather than removing it from the database.
     *
     * @param Template $template
     * @return JsonResponse
     */
    public function destroy(Template $template): JsonResponse
    {
        Log::info('Attempting to soft delete template', [
            'template_id' => $template->id,
            'template_name' => $template->name,
            'current_category' => $template->category_id
        ]);

        try {
            // The move to deleted category is handled by the model's deleting event
            $template->moveToDeletionCategory();

            Log::info('Template soft deleted successfully', [
                'template_id' => $template->id,
                'template_name' => $template->name
            ]);

            return response()->json([
                'message' => 'Template deleted successfully',
                'template' => $template
            ]);
        } catch (Exception $e) {
            Log::error('Failed to delete template', [
                'template_id' => $template->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to delete template',
                'errors' => ['general' => ['An error occurred while deleting the template. Please try again.']]
            ], 500);
        }
    }

    /**
     * Moves the template back to the main category.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function restore(Template $template): JsonResponse
    {
        try {
            $template->moveToMainCategory();

            // The move to uncategorized category is handled by the model's restoring event

            return response()->json([
                'message' => 'Template restored successfully',
                'template' => $template
            ]);
        } catch (Exception $e) {
            Log::error('Failed to restore template', [
                'error' => $e->getMessage(),
                'template_id' => $template->id,
            ]);

            return response()->json([
                'message' => 'Failed to restore template',
                'error_details' => $e->getMessage(),
                'errors' => ['general' => ['An error occurred while restoring the template. Please try again.']]
            ], 500);
        }
    }
}
