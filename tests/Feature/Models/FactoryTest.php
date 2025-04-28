<?php

namespace Tests\Feature\Models;

use App\Models\Template;
use App\Models\TemplateElement;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FactoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_template_with_elements_using_factories()
    {
        $template = Template::factory()->create();
        
        // Add elements
        TemplateElement::factory()->text()->create(['template_id' => $template->id]);
        TemplateElement::factory()->date()->create(['template_id' => $template->id]);
        TemplateElement::factory()->qrCode()->create(['template_id' => $template->id]);

        $this->assertDatabaseCount('templates', 1);
        $this->assertDatabaseCount('template_elements', 3);
        $this->assertCount(3, $template->elements);

        // Verify we have one of each type
        $elementTypes = $template->elements->pluck('element_type')->toArray();
        $this->assertContains(TemplateElement::TYPE_TEXT, $elementTypes);
        $this->assertContains(TemplateElement::TYPE_DATE, $elementTypes);
        $this->assertContains(TemplateElement::TYPE_QR_CODE, $elementTypes);
    }
}
