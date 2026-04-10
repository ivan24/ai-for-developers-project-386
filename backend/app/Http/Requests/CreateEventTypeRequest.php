<?php

namespace App\Http\Requests;

class CreateEventTypeRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:1', 'regex:/\S/'],
            'description' => ['nullable', 'string'],
            'durationMinutes' => ['required', 'integer', 'min:1'],
        ];
    }
}
