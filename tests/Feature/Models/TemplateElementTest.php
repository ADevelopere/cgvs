<?php

namespace Tests\Feature\Models;

use App\Models\Template;
use App\Models\TemplateElement;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TemplateElementTest extends TestCase
{
    use RefreshDatabase;

    private Template $template;

    protected function setUp(): void
    {
        parent::setUp();
        $this->template = Template::create([
            'name' => 'Test Template'
        ]);
    }

    public function test_can_create_template_element()
    {
        $element = TemplateElement::create([
            'template_id' => $this->template->id,
            'element_type' => TemplateElement::TYPE_TEXT,
            'x_coordinate' => 100,
            'y_coordinate' => 200,
            'properties' => ['text' => 'Test'],
            'font_size' => 12,
            'color' => '#000000',
            'alignment' => 'left',
            'font_family' => 'Arial',
            'source_field' => 'recipient.name',
        ]);

        $this->assertDatabaseHas('template_elements', [
            'template_id' => $this->template->id,
            'element_type' => TemplateElement::TYPE_TEXT,
            'x_coordinate' => 100,
            'y_coordinate' => 200,
            'font_size' => 12,
            'color' => '#000000',
            'alignment' => 'left',
            'font_family' => 'Arial',
            'source_field' => 'recipient.name',
        ]);

        $this->assertEquals(['text' => 'Test'], $element->properties);
    }

    public function test_template_element_belongs_to_template()
    {
        $element = TemplateElement::create([
            'template_id' => $this->template->id,
            'element_type' => TemplateElement::TYPE_TEXT,
            'x_coordinate' => 100,
            'y_coordinate' => 200,
        ]);

        $this->assertEquals($this->template->id, $element->template->id);
    }

    public function test_available_element_types()
    {
        $types = TemplateElement::getAvailableTypes();

        $this->assertEquals([
            TemplateElement::TYPE_TEXT,
            TemplateElement::TYPE_DATE,
            TemplateElement::TYPE_GENDER_TEXT,
            TemplateElement::TYPE_CONDITIONAL_TEXT,
            TemplateElement::TYPE_IMAGE,
            TemplateElement::TYPE_QR_CODE,
        ], $types);
    }

    public function test_casting_coordinates_to_float()
    {
        $element = TemplateElement::create([
            'template_id' => $this->template->id,
            'element_type' => TemplateElement::TYPE_TEXT,
            'x_coordinate' => '100.5',
            'y_coordinate' => '200.5',
        ]);

        $this->assertIsFloat($element->x_coordinate);
        $this->assertIsFloat($element->y_coordinate);
        $this->assertEquals(100.5, $element->x_coordinate);
        $this->assertEquals(200.5, $element->y_coordinate);
    }
}
