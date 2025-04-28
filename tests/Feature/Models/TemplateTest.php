<?php

namespace Tests\Feature\Models;

use App\Models\Template;
use App\Models\TemplateElement;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TemplateTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_template()
    {
        $template = Template::create([
            'name' => 'Test Template',
            'description' => 'A test template',
            'background_path' => 'templates/test.png',
            'required_variables' => ['name', 'date'],
            'is_active' => true,
        ]);

        $this->assertDatabaseHas('templates', [
            'name' => 'Test Template',
            'description' => 'A test template',
        ]);

        $this->assertEquals(['name', 'date'], $template->required_variables);
        $this->assertTrue($template->is_active);
    }

    public function test_template_has_elements_relationship()
    {
        $template = Template::create([
            'name' => 'Test Template',
            'description' => 'A test template',
        ]);

        $element = TemplateElement::create([
            'template_id' => $template->id,
            'element_type' => TemplateElement::TYPE_TEXT,
            'x_coordinate' => 100,
            'y_coordinate' => 200,
            'properties' => ['text' => 'Test'],
        ]);

        $this->assertTrue($template->elements->contains($element));
        $this->assertEquals(1, $template->elements->count());
    }

    public function test_get_background_full_path()
    {
        $template = Template::create([
            'name' => 'Test Template',
            'background_path' => 'templates/test.png',
        ]);

        $this->assertEquals(
            storage_path('app/public/templates/test.png'),
            $template->background_full_path
        );

        $template->background_path = null;
        $this->assertNull($template->background_full_path);
    }

    public function test_template_soft_delete()
    {
        $template = Template::create([
            'name' => 'Test Template',
        ]);

        $template->delete();

        $this->assertSoftDeleted($template);
        $this->assertEquals(0, Template::count());
        $this->assertEquals(1, Template::withTrashed()->count());
    }
}
