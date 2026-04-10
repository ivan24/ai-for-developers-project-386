<?php

namespace App\Exceptions;

use RuntimeException;

class SlotConflictException extends RuntimeException
{
    public function __construct(string $message = 'The selected slot is no longer available.')
    {
        parent::__construct($message);
    }
}
