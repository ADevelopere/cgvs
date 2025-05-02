<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        $template = $this->template;
        $variables = $template->variables->keyBy('name');
        
        foreach ($data as $name => $value) {
            if (!isset($variables[$name])) continue;
            
            $this->variableValues()->updateOrCreate(
                ['template_variable_id' => $variables[$name]->id],
                ['value' => $value]
            );
        }
    }
}
