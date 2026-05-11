<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyProfile extends Model
{
    protected $fillable = [
        'user_id',
        'company_name',
        'company_logo',
        'company_description',
        'website',
        'industry',
        'company_size',
        'location',
        'founded_year',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
