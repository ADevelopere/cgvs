<?php

namespace App\Exceptions;

use Exception;

class TabAccessDeniedException extends Exception
{
    protected $tab;

    public function __construct($tab, $message = '', $code = 0, ?Exception $previous = null)
    {
        $this->tab = $tab;
        parent::__construct($message ?: "Access denied to tab: {$tab}", $code, $previous);
    }

    public function getTab()
    {
        return $this->tab;
    }
}
