<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Shuchkin\SimpleXLSX;
use Shuchkin\SimpleXLSXGen;

class TemplateRecipientsController extends Controller
{
    public function index(Template $template)
    {
        $recipients = $template->recipients()
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'recipients' => $recipients,
        ]);
    }

    public function downloadTemplate(Template $template)
    {
        Log::info('Starting template download process', [
            'template_id' => $template->id,
            'request' => request()->all(),
            'headers' => request()->headers->all(),
            'url' => request()->url(),
            'path' => request()->path(),
            'method' => request()->method()
        ]);
        
        // Log the template data
        Log::debug('Template data', [
            'template_name' => $template->name,
            'template_id' => $template->id,
            'has_variables_relation' => $template->relationLoaded('variables'),
        ]);

        // Eager load variables to ensure we have all of them
        $variables = $template->load('variables')->variables;
        
        // Log variables collection
        Log::debug('Variables after eager loading', [
            'count' => $variables->count(),
            'variables' => $variables->toArray()
        ]);
        
        if ($variables->isEmpty()) {
            Log::warning('No variables found for template', ['template_id' => $template->id]);
            return response()->json(['error' => 'No variables defined for this template'], 400);
        }

        // Create headers row with variable descriptions and types
        $headers = [];
        $descriptions = [];
        $sampleRow = [];

        foreach ($variables as $variable) {
            Log::debug('Processing variable', [
                'name' => $variable->name,
                'type' => $variable->type,
                'description' => $variable->description,
                'preview_value' => $variable->preview_value
            ]);

            $headers[] = $variable->name;
            $descriptions[] = $variable->description ?: "Enter {$variable->type} value";
            
            // Add sample data based on preview value or type
            if ($variable->preview_value !== null) {
                $sampleRow[] = $variable->preview_value;
                Log::debug('Using preview value', ['value' => $variable->preview_value]);
                continue;
            }

            // Use default values if no preview value is set
            switch ($variable->type) {
                case 'number':
                    $sampleRow[] = '0';
                    break;
                case 'date':
                    $sampleRow[] = now()->format('Y-m-d');
                    break;
                case 'gender':
                    $sampleRow[] = 'male';
                    break;
                case 'text':
                default:
                    $sampleRow[] = 'Sample ' . $variable->name;
                    break;
            }
        }
        
        // Log the final arrays before Excel creation
        Log::debug('Final Excel data', [
            'headers' => $headers,
            'descriptions' => $descriptions,
            'sample_row' => $sampleRow
        ]);

        // Create the Excel file with headers, descriptions, and sample data
        $xlsx = SimpleXLSXGen::fromArray([
            $headers,          // First row: Variable names
            $descriptions,     // Second row: Descriptions and type info
            $sampleRow        // Third row: Sample/preview values
        ]);
        
        $filename = Str::slug($template->name) . '_template.xlsx';
        Log::info('Excel file created', ['filename' => $filename]);
        
        // Set headers for force download
        return response()->streamDownload(
            function () use ($xlsx) {
                $xlsx->downloadAs('php://output');
            },
            $filename,
            [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ]
        );
    }

    public function validateExcel(Request $request, Template $template)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls|max:10240',
            'use_client_validation' => 'boolean',
        ]);

        if ($request->use_client_validation) {
            return response()->json([
                'message' => 'Client-side validation requested',
                'variables' => $template->variables,
            ]);
        }

        $file = $request->file('file');
        $path = $file->storeAs('temp', $file->getClientOriginalName());
        $xlsx = SimpleXLSX::parse(Storage::path($path));
        
        $data = $xlsx->rows();
        $headers = array_shift($data);
        $variablesByName = $template->variables->keyBy('name');
        
        $validatedRows = [];
        $errors = [];

        foreach ($data as $index => $row) {
            $rowData = array_combine($headers, $row);
            $rowErrors = [];
            
            foreach ($variablesByName as $varName => $variable) {
                $value = $rowData[$varName] ?? null;
                if ($variable->required && empty($value)) {
                    $rowErrors[] = "Missing required value for {$varName}";
                }
                
                if (!empty($value)) {
                    switch ($variable->type) {
                        case 'date':
                            if (!strtotime($value)) {
                                $rowErrors[] = "Invalid date format for {$varName}";
                            }
                            break;
                        case 'number':
                            if (!is_numeric($value)) {
                                $rowErrors[] = "Invalid number format for {$varName}";
                            }
                            break;
                        case 'gender':
                            if (!in_array(strtolower($value), ['male', 'female'])) {
                                $rowErrors[] = "Invalid gender value for {$varName}";
                            }
                            break;
                    }
                }
            }

            if (empty($rowErrors)) {
                $validatedRows[] = $rowData;
            } else {
                $errors[] = [
                    'row' => $index + 2,
                    'errors' => $rowErrors,
                ];
            }
        }

        Storage::delete($path);

        return response()->json([
            'valid_rows' => count($validatedRows),
            'total_rows' => count($data),
            'errors' => $errors,
        ]);
    }

    public function import(Request $request, Template $template)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls|max:10240',
        ]);

        $file = $request->file('file');
        $path = $file->storeAs('temp', $file->getClientOriginalName());
        $xlsx = SimpleXLSX::parse(Storage::path($path));
        
        $data = $xlsx->rows();
        $headers = array_shift($data);
        
        $imported = 0;
        $errors = 0;

        foreach ($data as $row) {
            $rowData = array_combine($headers, $row);
            
            $recipient = $template->recipients()->create([
                'data' => $rowData,
                'is_valid' => true, // We'll validate later in a queue job
            ]);

            if ($recipient) {
                $imported++;
            } else {
                $errors++;
            }
        }

        Storage::delete($path);

        return response()->json([
            'imported' => $imported,
            'errors' => $errors,
            'message' => "Successfully imported {$imported} recipients",
        ]);
    }

    public function destroy(Template $template, $id)
    {
        $recipient = $template->recipients()->findOrFail($id);
        $recipient->delete();

        return response()->json([
            'message' => 'Recipient deleted successfully',
        ]);
    }

    public function preview(Template $template, $id)
    {
        $recipient = $template->recipients()->findOrFail($id);
        return response()->json($recipient->data);
    }
}
