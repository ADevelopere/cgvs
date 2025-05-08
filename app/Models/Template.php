<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Log;
use App\GraphQL\Contracts\LighthouseModel;
use Illuminate\Support\Facades\Storage;

class Template extends Model implements LighthouseModel
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image_url',
        'category_id',
        'pre_deletion_category_id',
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
    public function getImageUrlFullPathAttribute(): ?string
    {
        return $this->image_url ? storage_path('app/public/' . $this->image_url) : null;
    }

    /**
     * Get the URL for the image
     *
     * @param string|null $value
     * @return string|null
     */
    public function getImageUrlAttribute($value)
    {
        // If the value already starts with /storage/, return as is
        if ($value && str_starts_with($value, '/storage/')) {
            return $value;
        }
        return $value ? Storage::url($value) : null;
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
        // Store the current category ID before moving to deletion
        $this->pre_deletion_category_id = $this->category_id;
        $this->category_id = $deletedCategory->id;
        $this->order = null;
        $this->trashed_at = now();
        $this->save();
    }

    public function restoreFromDeletionCategory()
    {
        // Try to restore to the previous category if it exists
        if ($this->pre_deletion_category_id) {
            $previousCategory = TemplateCategory::find($this->pre_deletion_category_id);
            if ($previousCategory) {
                $this->category_id = $previousCategory->id;
                $this->order = Template::where('category_id', $previousCategory->id)->max('order') + 1;
                $this->trashed_at = null;
                $this->pre_deletion_category_id = null;
                $this->save();
                return;
            }
        }

        // If previous category doesn't exist or wasn't stored, restore to main category
        $mainCategory = TemplateCategory::getMainCategory();
        $this->category_id = $mainCategory->id;
        $this->order = Template::where('category_id', $mainCategory->id)->max('order') + 1;
        $this->trashed_at = null;
        $this->pre_deletion_category_id = null;
        $this->save();
    }
}
