<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateDateVariable extends Model
{
    protected $primaryKey = 'variable_id';
    public $incrementing = false;

    protected $fillable = [
        'min_date',
        'max_date',
        'format'
    ];

    protected $casts = [
        'min_date' => 'date',
        'max_date' => 'date'
    ];

    public function variable(): BelongsTo
    {
        return $this->belongsTo(TemplateVariable::class, 'variable_id');
    }
}
