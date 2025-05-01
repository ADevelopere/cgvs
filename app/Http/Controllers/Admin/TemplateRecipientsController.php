<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use SimpleXLSX;
use SimpleXLSXGen;

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
        $variables = $template->variables()->get();
        $headers = ['Variable Name', 'Type', 'Description'];
        $rows = [];

        foreach ($variables as $variable) {
            $rows[] = [$variable->name, $variable->type, $variable->description ?? ''];
        }

        $xlsx = SimpleXLSXGen::fromArray([$headers, ...$rows]);
        $filename = Str::slug($template->name) . '_template.xlsx';
        
        return response()->streamDownload(
            function () use ($xlsx) {
                $xlsx->downloadAs('php://output');
            },
            $filename,
            [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
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
                
                switch ($variable->type) {
                    case 'date':
                        if (!empty($value) && !strtotime($value)) {
                            $rowErrors[] = "Invalid date format for {$varName}";
                        }
                        break;
                    case 'email':
                        if (!empty($value) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                            $rowErrors[] = "Invalid email format for {$varName}";
                        }
                        break;
                    case 'gender':
                        if (!empty($value) && !in_array(strtolower($value), ['male', 'female'])) {
                            $rowErrors[] = "Invalid gender value for {$varName}";
                        }
                        break;
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
}
