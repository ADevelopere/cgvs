<?php

namespace App\Template;

class ReorderTemplateInput
{
    public function __construct(
        public string $id,
        public int $order
    ) {}
}
