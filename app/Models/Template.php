<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Template extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'name',
        'description',
        'background_url',
        'category_id',
        'order',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(TemplateCategory::class);
    }

    public function variables(): HasMany
    {
        return $this->hasMany(TemplateVariable::class);
    }

    public function recipients(): HasMany
    {
        return $this->hasMany(TemplateRecipient::class);
    }

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
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
        return $this->background_url ? storage_path('app/public/' . $this->background_url) : null;
    }

    protected static function booted()
    {
        static::creating(function ($template) {
            \Illuminate\Support\Facades\Log::info('Creating new template', [
                'template_name' => $template->name,
                'template_data' => $template->toArray(),
            ]);
        });

        static::created(function ($template) {
            \Illuminate\Support\Facades\Log::info('Template created, creating name variable', [
                'template_id' => $template->id,
                'template_name' => $template->name,
            ]);

            try {
                // Create the default name variable
                $nameVar = $template->variables()->create([
                    'name' => 'name',
                    'type' => 'text',
                    'description' => 'Recipient identifier name',
                    'is_key' => true,
                    'required' => true,
                    'order' => 1, // Set order to 1 since it's the first variable
                ]);

                \Illuminate\Support\Facades\Log::info('Name variable created successfully', [
                    'template_id' => $template->id,
                    'name_variable_id' => $nameVar->id,
                ]);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Failed to create name variable', [
                    'template_id' => $template->id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
        });
    }
}
