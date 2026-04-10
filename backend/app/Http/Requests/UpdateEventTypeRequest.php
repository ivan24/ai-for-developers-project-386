<?php

namespace App\Http\Requests;

use Illuminate\Validation\Validator;

class UpdateEventTypeRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'min:1', 'regex:/\S/'],
            'description' => ['sometimes', 'nullable', 'string'],
            'durationMinutes' => ['sometimes', 'integer', 'min:1'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($this->keys() === []) {
                    $validator->errors()->add('body', 'At least one field must be provided.');
                }
            },
        ];
    }
}
