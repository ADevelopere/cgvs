<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Log;
use App\GraphQL\Contracts\LighthouseModel;

class Template extends Model implements LighthouseModel
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'name',
        'description',
        'background_url',
        'category_id',
        'order',
        'trashed_at',
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
        'trashed_at' => 'datetime',
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
            Log::info('Creating new template', [
                'template_name' => $template->name,
                'template_data' => $template->toArray(),
            ]);
        });

        static::created(function ($template) {
            Log::info('Template created, creating name variable', [
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

                Log::info('Name variable created successfully', [
                    'template_id' => $template->id,
                    'name_variable_id' => $nameVar->id,
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to create name variable', [
                    'template_id' => $template->id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
        });

        static::retrieved(function ($template) {
            Log::info('Template query executed', [
                'template_id' => $template->id,
                'template_data' => $template->toArray()
            ]);
        });
    }

    public function moveToDeletionCategory()
    {
        $deletedCategory = TemplateCategory::getDeletedCategory();
        $this->category_id = $deletedCategory->id;
        $this->order = null;
        $this->trashed_at = now();
        $this->save();
    }

    public function moveToMainCategory()
    {
        $mainCategory = TemplateCategory::getMainCategory();
        $this->category_id = $mainCategory->id;
        // Set order as last in the main category
        $this->order = Template::where('category_id', $mainCategory->id)->max('order') + 1;
        $this->trashed_at = null;
        $this->save();
    }
}
