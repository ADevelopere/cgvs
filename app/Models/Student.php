<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Student extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone_number',
        'date_of_birth',
        'gender',
        'nationality',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    /**
     * Get all certificates issued to this student
     */
    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    /**
     * Get all recipient groups this student belongs to
     */
    public function recipientGroups(): BelongsToMany
    {
        return $this->belongsToMany(TemplateRecipientGroup::class, 'template_recipient_group_items')
            ->withTimestamps();
    }
}
