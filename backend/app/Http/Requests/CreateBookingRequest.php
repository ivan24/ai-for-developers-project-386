<?php

namespace App\Http\Requests;

class CreateBookingRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'eventTypeId' => ['required', 'string', 'min:1', 'regex:/\S/'],
            'startAt' => ['required', 'date'],
            'guestName' => ['required', 'string', 'min:1', 'regex:/\S/'],
            'guestEmail' => ['required', 'email:rfc'],
        ];
    }
}
