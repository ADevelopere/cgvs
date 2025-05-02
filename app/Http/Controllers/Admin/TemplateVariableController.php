<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Models\TemplateVariable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class TemplateVariableController extends Controller
{
    public function index(Template $template)
    {
        return response()->json($template->variables);
    }

    public function store(Request $request, Template $template)
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(['text', 'date', 'number', 'gender'])],
            'description' => ['nullable', 'string'],
            'preview_value' => ['nullable'],
        ];

        // Add type-specific validation for preview_value
        if ($request->has('preview_value') && $request->filled('preview_value')) {
            switch ($request->type) {
                case 'date':
                    $rules['preview_value'][] = 'date';
                    break;
                case 'number':
                    $rules['preview_value'][] = 'numeric';
                    break;
                case 'gender':
                    $rules['preview_value'][] = Rule::in(['male', 'female']);
                    break;
                case 'text':
                    $rules['preview_value'][] = 'string';
                    break;
            }
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Get next order number for this template
        $nextOrder = TemplateVariable::getNextOrder($template->id);
        
        $data = array_merge($request->all(), ['order' => $nextOrder]);
        $variable = $template->variables()->create($data);
        
        return response()->json($variable, 201);
    }

    public function update(Request $request, Template $template, TemplateVariable $variable)
    {
        // Prevent modifying key variable name
        if ($variable->is_key && $request->input('name') !== $variable->name) {
            return response()->json([
                'message' => 'Cannot modify key variable name',
                'errors' => ['name' => ['The name of a key variable cannot be changed.']]
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(['text', 'date', 'number', 'gender'])],
            'description' => ['nullable', 'string'],
            'preview_value' => ['nullable', 'string'],
            'order' => ['sometimes', 'required', 'integer', 'min:1'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->has('order') && $request->input('order') !== $variable->order) {
            // Check if the requested order already exists
            $existingVariable = $template->variables()
                ->where('order', $request->input('order'))
                ->where('id', '!=', $variable->id)
                ->first();

            if ($existingVariable) {
                return response()->json([
                    'message' => 'Order value must be unique',
                    'errors' => ['order' => ['This order value is already taken by another variable.']]
                ], 422);
            }
        }

        $variable->update($request->all());
        return response()->json($variable);
    }

    public function destroy(Template $template, TemplateVariable $variable)
    {
        if ($variable->is_key) {
            return response()->json([
                'message' => 'Cannot delete key variable',
                'errors' => ['general' => ['The name variable cannot be deleted as it is required for recipient identification.']]
            ], 422);
        }

        $variable->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request, Template $template)
    {
        $validator = Validator::make($request->all(), [
            'variables' => ['required', 'array'],
            'variables.*' => ['required', 'integer', 'exists:template_variables,id'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Get all template variables to ensure they belong to this template
        $variables = $template->variables()->whereIn('id', $request->variables)->get();
        
        if ($variables->count() !== count($request->variables)) {
            return response()->json([
                'message' => 'Some variables do not belong to this template',
                'errors' => ['variables' => ['All variables must belong to the current template']]
            ], 422);
        }

        // Check if key variable's position is being changed to something other than first
        $keyVariable = $variables->firstWhere('is_key', true);
        if ($keyVariable) {
            $newKeyPosition = array_search($keyVariable->id, $request->variables);
            if ($newKeyPosition !== 0) {
                return response()->json([
                    'message' => 'Key variable must be first',
                    'errors' => ['variables' => ['The key variable must remain in the first position']]
                ], 422);
            }
        }

        try {
            // Update order for each variable
            foreach ($request->variables as $index => $variableId) {
                TemplateVariable::where('id', $variableId)
                    ->update(['order' => $index + 1]);
            }

            // Return the reordered variables
            $reorderedVariables = $template->variables()->orderBy('order')->get();
            return response()->json($reorderedVariables);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to reorder variables',
                'errors' => ['general' => [$e->getMessage()]]
            ], 500);
        }
    }
}
