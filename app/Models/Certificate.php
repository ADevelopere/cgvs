<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Certificate extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'template_id',
        'student_id',
        'template_recipient_group_id',
        'release_date',
        'verification_code',
    ];

    protected $casts = [
        'release_date' => 'date',
    ];

    /**
     * Get the template associated with this certificate
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    /**
     * Get the student who owns this certificate
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get the recipient group associated with this certificate
     */
    public function recipientGroup(): BelongsTo
    {
        return $this->belongsTo(TemplateRecipientGroup::class, 'template_recipient_group_id');
    }
}
