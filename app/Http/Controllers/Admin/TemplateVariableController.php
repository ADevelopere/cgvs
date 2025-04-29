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
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(['text', 'date', 'number', 'gender'])],
            'description' => ['nullable', 'string'],
            'preview_value' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $variable = $template->variables()->create($request->all());
        return response()->json($variable, 201);
    }

    public function update(Request $request, Template $template, TemplateVariable $variable)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(['text', 'date', 'number', 'gender'])],
            'description' => ['nullable', 'string'],
            'preview_value' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $variable->update($request->all());
        return response()->json($variable);
    }

    public function destroy(Template $template, TemplateVariable $variable)
    {
        $variable->delete();
        return response()->json(null, 204);
    }
}
