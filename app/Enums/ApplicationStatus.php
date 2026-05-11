<?php

namespace App\Enums;

enum ApplicationStatus: string
{
    case UNDER_REVIEW = 'under_review';
    case INTERVIEWING = 'interviewing';
    case OFFER_EXTENDED = 'offer_extended';
    case REJECTED = 'rejected';
    case WITHDRAWN = 'withdrawn';

    public function label(): string
    {
        return match ($this) {
            self::UNDER_REVIEW => 'Under Review',
            self::INTERVIEWING => 'Interviewing',
            self::OFFER_EXTENDED => 'Offer Extended',
            self::REJECTED => 'Rejected',
            self::WITHDRAWN => 'Withdrawn',
        };
    }
}