<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Log;

class TemplateRecipient extends Model
{
    protected $fillable = [
        'template_id',
        'is_valid',
        'validation_errors',
    ];

    protected $casts = [
        'is_valid' => 'boolean',
        'validation_errors' => 'array',
    ];

    protected $with = ['variableValues'];

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    public function variableValues()
    {
        return $this->hasMany(RecipientVariableValue::class, 'template_recipient_id');
    }

    public function getData(): array
    {
        return $this->variableValues->mapWithKeys(function ($value) {
            return [$value->variable->name => $value->value];
        })->toArray();
    }

    public function setData(array $data)
    {
        Log::info('Starting setData in TemplateRecipient', [
            'recipient_id' => $this->id,
            'input_data' => $data
        ]);

        $template = $this->template;
        $variables = $template->variables->keyBy('name');
        
        Log::info('Template variables loaded', [
            'variables' => $variables->toArray()
        ]);

        foreach ($data as $name => $value) {
            Log::info('Processing variable', [
                'name' => $name,
                'value' => $value
            ]);

            if (!isset($variables[$name])) {
                Log::warning('Variable not found in template', [
                    'variable_name' => $name
                ]);
                continue;
            }
            
            try {
                $this->variableValues()->updateOrCreate(
                    ['template_variable_id' => $variables[$name]->id],
                    ['value' => $value]
                );

                Log::info('Successfully updated variable value', [
                    'name' => $name,
                    'value' => $value
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to update variable value', [
                    'name' => $name,
                    'value' => $value,
                    'error' => $e->getMessage()
                ]);
                throw $e;
            }
        }

        Log::info('Completed setData', [
            'recipient_id' => $this->id,
            'final_data' => $this->getData()
        ]);
    }
}
