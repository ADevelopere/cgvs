<?php

namespace App\Exceptions;

class TemplateStorageException extends \RuntimeException
{
    public function __construct(string $message = "Failed to store the template file", int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
