<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateSelectVariable extends Model
{
    protected $primaryKey = 'variable_id';
    public $incrementing = false;

    protected $fillable = [
        'options',
        'multiple'
    ];

    protected $casts = [
        'options' => 'array',
        'multiple' => 'boolean'
    ];

    public function variable(): BelongsTo
    {
        return $this->belongsTo(TemplateVariable::class, 'variable_id');
    }
}
