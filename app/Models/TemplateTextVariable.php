<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateTextVariable extends Model
{
    protected $primaryKey = 'variable_id';
    public $incrementing = false;

    protected $fillable = [
        'min_length',
        'max_length',
        'pattern'
    ];

    protected $casts = [
        'min_length' => 'integer',
        'max_length' => 'integer'
    ];

    public function variable(): BelongsTo
    {
        return $this->belongsTo(TemplateVariable::class, 'variable_id');
    }
}
