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

        $recipients->getCollection()->transform(function ($recipient) {
            return [
                'id' => $recipient->id,
                'template_id' => $recipient->template_id,
                'is_valid' => $recipient->is_valid,
                'validation_errors' => $recipient->validation_errors,
                'data' => $recipient->getData(),
            ];
        });

        return response()->json([
            'recipients' => $recipients,
        ]);
    }

    public function update(Request $request, Template $template, $id)
    {
        $recipient = $template->recipients()->findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'data' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $recipient->setData($request->input('data'));

        return response()->json([
            'id' => $recipient->id,
            'template_id' => $recipient->template_id,
            'is_valid' => $recipient->is_valid,
            'validation_errors' => $recipient->validation_errors,
            'data' => $recipient->getData(),
        ]);
    }

    public function import(Request $request, Template $template)
    {
        Log::info('Starting import process', [
            'template_id' => $template->id,
            'file_present' => $request->hasFile('file'),
            'validated_flag' => $request->boolean('validated'),
            'content_type' => $request->file('file')?->getMimeType(),
            'request_content_type' => $request->header('Content-Type'),
            'all_headers' => $request->headers->all(),
            'all_files' => $request->allFiles(),
            'all_inputs' => $request->all()
        ]);

        try {
            $input = $request->all();
            if (isset($input['validated'])) {
                $input['validated'] = filter_var($input['validated'], FILTER_VALIDATE_BOOLEAN);
            }

            $validator = Validator::make($input, [
                'file' => 'required|file|mimes:xlsx,xls|max:10240',
                'validated' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => [
                        [
                            'row' => 0,
                            'errors' => $validator->errors()->all()
                        ]
                    ]
                ], 422);
            }

            $file = $request->file('file');
            $path = $file->storeAs('temp', $file->getClientOriginalName());
            $xlsx = SimpleXLSX::parse(Storage::path($path));
            
            $data = $xlsx->rows();
            if (empty($data)) {
                throw new \Exception('The file is empty');
            }

            $headers = array_shift($data);
            $imported = 0;
            $errors = [];
            $total_rows = count($data);
            
            if (!$request->boolean('validated')) {
                $variablesByName = $template->variables->keyBy('name');
                
                $missingHeaders = [];
                foreach ($variablesByName as $varName => $variable) {
                    if (!in_array($varName, $headers)) {
                        $missingHeaders[] = $varName;
                    }
                }

                if (!empty($missingHeaders)) {
                    Storage::delete($path);
                    return response()->json([
                        'errors' => [
                            [
                                'row' => 1,
                                'errors' => ['Missing required headers: ' . implode(', ', $missingHeaders)]
                            ]
                        ],
                        'message' => 'Invalid file format',
                        'total_rows' => $total_rows,
                        'valid_rows' => 0
                    ], 422);
                }

                foreach ($data as $index => $row) {
                    if (count($row) !== count($headers)) {
                        $errors[] = [
                            'row' => $index + 2,
                            'errors' => ['Row has incorrect number of columns']
                        ];
                        continue;
                    }

                    $rowData = array_combine($headers, $row);
                    $rowErrors = [];
                    
                    foreach ($variablesByName as $varName => $variable) {
                        $value = $rowData[$varName] ?? null;
                        if ($variable->required && empty($value)) {
                            $rowErrors[] = "Missing required value for {$varName}";
                            continue;
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

                    if (!empty($rowErrors)) {
                        $errors[] = [
                            'row' => $index + 2,
                            'errors' => $rowErrors,
                        ];
                    }
                }

                if (!empty($errors)) {
                    Storage::delete($path);
                    return response()->json([
                        'errors' => $errors,
                        'message' => 'Validation failed',
                        'total_rows' => $total_rows,
                        'valid_rows' => $total_rows - count($errors)
                    ], 422);
                }
            }

            foreach ($data as $row) {
                $rowData = array_combine($headers, $row);
                
                $recipient = $template->recipients()->create([
                    'is_valid' => true,
                ]);

                if ($recipient) {
                    $recipient->setData($rowData);
                    $imported++;
                }
            }

            Storage::delete($path);

            return response()->json([
                'imported' => $imported,
                'total_rows' => $total_rows,
                'message' => "Successfully imported {$imported} recipients",
            ]);

        } catch (\Exception $e) {
            Log::error('Import process failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            if (isset($path)) {
                Storage::delete($path);
            }
            
            return response()->json([
                'message' => 'Failed to process file: ' . $e->getMessage(),
                'errors' => [
                    [
                        'row' => 0,
                        'errors' => [$e->getMessage()]
                    ]
                ]
            ], 500);
        }
    }

    public function destroy(Template $template, $id)
    {
        $recipient = $template->recipients()->findOrFail($id);
        $recipient->delete();

        return response()->json([
            'message' => 'Recipient deleted successfully',
        ]);
    }

    public function downloadTemplate(Template $template)
    {
        try {
            Log::info('Template download requested', [
                'template_id' => $template->id,
                'variables' => $template->variables
            ]);

            $variables = $template->variables;
            
            if ($variables->isEmpty()) {
                return response()->json([
                    'message' => 'No variables defined for this template'
                ], 400);
            }

            // Create headers row
            $headers = $variables->pluck('name')->toArray();
            
            // Create descriptions row
            $descriptions = $variables->map(function($v) {
                $desc = $v->description ?? "Enter {$v->type} value";
                if ($v->is_key) {
                    $desc .= " (Required - Must be unique)";
                }
                return $desc;
            })->toArray();

            // Create sample data row
            $sampleData = $variables->map(function($v) {
                if ($v->is_key) {
                    return 'Unique Identifier';
                }
                switch($v->type) {
                    case 'number':
                        return '0';
                    case 'date':
                        return date('Y-m-d');
                    default:
                        return 'Sample';
                }
            })->toArray();

            // Create Excel data array with all rows
            $data = [$headers, $descriptions, $sampleData];
            
            // Generate Excel file
            $xlsx = SimpleXLSXGen::fromArray($data);
            
            // Create a temporary file
            $tempFile = tempnam(sys_get_temp_dir(), 'template_');
            $xlsx->saveAs($tempFile);
            
            return response()->download(
                $tempFile,
                "template_{$template->id}_recipients_server.xlsx",
                [
                    'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition' => 'attachment; filename="template_' . $template->id . '_recipients.xlsx"'
                ]
            )->deleteFileAfterSend(true);

        } catch (\Exception $e) {
            Log::error('Template download failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Failed to generate template: ' . $e->getMessage()
            ], 500);
        }
    }
}
