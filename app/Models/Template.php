<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Template extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'name',
        'description',
        'background_path',
        'required_variables',
        'is_active',
    ];

    public function variables(): HasMany
    {
        return $this->hasMany(TemplateVariable::class);
    }

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
        'required_variables' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the elements associated with this template
     */
    public function elements(): HasMany
    {
        return $this->hasMany(TemplateElement::class);
    }

    /**
     * Get the full storage path for the background image
     */
    public function getBackgroundFullPathAttribute(): ?string
    {
        return $this->background_path ? storage_path('app/public/' . $this->background_path) : null;
    }
}
