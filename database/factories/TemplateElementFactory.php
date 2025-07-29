<?php

namespace Database\Factories;

use App\Models\Template;
use App\Models\TemplateElement;
use Illuminate\Database\Eloquent\Factories\Factory;

class TemplateElementFactory extends Factory
{
    protected $model = TemplateElement::class;

    public function definition(): array
    {
        return [
            'template_id' => Template::factory(),
            'element_type' => fake()->randomElement(TemplateElement::getAvailableTypes()),
            'x_coordinate' => fake()->randomFloat(2, 0, 800),
            'y_coordinate' => fake()->randomFloat(2, 0, 600),
            'properties' => null,
            'font_size' => fake()->optional()->numberBetween(8, 48),
            'color' => fake()->optional()->hexColor(),
            'alignment' => fake()->optional()->randomElement(['left', 'center', 'right']),
            'font_family' => fake()->optional()->randomElement(['Arial', 'Times New Roman', 'Helvetica', 'Calibri']),
            'language_constraint' => fake()->optional()->randomElement(['ar', 'en']),
            'source_field' => fake()->optional()->word(),
        ];
    }

    /**
     * Configure the model factory for a text element
     */
    public function text(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'element_type' => TemplateElement::TYPE_TEXT,
                'properties' => [
                    'text' => fake()->sentence(),
                ],
                'font_size' => 14,
                'color' => '#000000',
                'alignment' => 'left',
                'font_family' => 'Arial',
                'source_field' => 'recipient_name',
            ];
        });
    }

    /**
     * Configure the model factory for a date element
     */
    public function date(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'element_type' => TemplateElement::TYPE_DATE,
                'properties' => [
                    'format' => 'DD MMMM YYYY',
                    'calendar' => 'gregorian',
                ],
                'font_size' => 12,
                'color' => '#000000',
                'alignment' => 'center',
                'font_family' => 'Arial',
                'source_field' => 'issue_date',
            ];
        });
    }

    /**
     * Configure the model factory for a QR code element
     */
    public function qrCode(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'element_type' => TemplateElement::TYPE_QR_CODE,
                'properties' => [
                    'size' => 100,
                ],
            ];
        });
    }

    /**
     * Configure the model factory for a gender-specific text element
     */
    public function genderText(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'element_type' => TemplateElement::TYPE_GENDER_TEXT,
                'properties' => [
                    'male_text' => 'he',
                    'female_text' => 'she',
                ],
                'font_size' => 14,
                'color' => '#000000',
                'alignment' => 'left',
                'font_family' => 'Arial',
                'source_field' => 'gender',
            ];
        });
    }
}
