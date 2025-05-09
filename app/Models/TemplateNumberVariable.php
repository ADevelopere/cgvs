<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateNumberVariable extends Model
{
    protected $primaryKey = 'variable_id';
    public $incrementing = false;

    protected $fillable = [
        'min_value',
        'max_value',
        'decimal_places'
    ];

    protected $casts = [
        'min_value' => 'decimal:10',
        'max_value' => 'decimal:10',
        'decimal_places' => 'integer'
    ];

    public function variable(): BelongsTo
    {
        return $this->belongsTo(TemplateVariable::class, 'variable_id');
    }
}
