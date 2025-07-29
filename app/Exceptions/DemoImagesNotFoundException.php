<?php

namespace App\Exceptions;

class DemoImagesNotFoundException extends \Exception
{
    public function __construct()
    {
        parent::__construct('No demo images found in storage/app/public/img/. Images should start with "demo"');
    }
}
