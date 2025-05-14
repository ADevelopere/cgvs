<?php

namespace App\Exceptions;

class UnknownTemplateVariableTypeException extends \RuntimeException
{
    public function __construct(string $message = "Unknown template variable type", int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
