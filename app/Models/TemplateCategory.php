<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TemplateCategory extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'name',
        'description',
        'parent_category_id',
        'order',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the parent category if this is a subcategory
     */
    public function parentCategory(): BelongsTo
    {
        return $this->belongsTo(TemplateCategory::class, 'parent_category_id');
    }

    /**
     * Get the child categories of this category
     */
    public function childCategories(): HasMany
    {
        return $this->hasMany(TemplateCategory::class, 'parent_category_id')
            ->orderBy('order');
    }

    /**
     * Get all templates in this category
     */
    public function templates(): HasMany
    {
        return $this->hasMany(Template::class, 'category_id')
            ->orderBy('order');
    }
}
