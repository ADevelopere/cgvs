<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\GraphQL\Contracts\LighthouseModel;
class RecipientVariableValue extends Model  implements LighthouseModel
{
    protected $fillable = [
        'template_recipient_id',
        'template_variable_id',
        'value',
        'value_indexed'
    ];

    protected static function booted()
    {
        static::saving(function ($value) {
            if ($value->isDirty('value')) {
                $value->value_indexed = substr($value->value, 0, 255);
            }
        });
    }

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(TemplateRecipient::class, 'template_recipient_id');
    }

    public function variable(): BelongsTo
    {
        return $this->belongsTo(TemplateVariable::class, 'template_variable_id');
    }
}
