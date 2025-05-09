<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TemplateRecipientGroup extends Model
{
    protected $fillable = [
        'template_id',
        'name',
        'description',
        'is_valid',
        'validation_errors',
    ];

    protected $casts = [
        'is_valid' => 'boolean',
        'validation_errors' => 'array',
    ];

    /**
     * Get the template that owns this recipient group
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    /**
     * Get all items (students) in this group
     */
    public function items(): HasMany
    {
        return $this->hasMany(TemplateRecipientGroupItem::class);
    }

    /**
     * Get all students in this group
     */
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'template_recipient_group_items')
            ->withTimestamps();
    }

    /**
     * Get all certificates issued for this group
     */
    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }
}
