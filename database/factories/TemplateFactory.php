<?php

namespace Database\Factories;

use App\Models\Template;
use Illuminate\Database\Eloquent\Factories\Factory;

class TemplateFactory extends Factory
{
    protected $model = Template::class;

    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'background_path' => fake()->optional()->filePath(),
            'required_variables' => [
                'recipient_name',
                'issue_date',
                'country_code',
            ],
            'is_active' => fake()->boolean(80), // 80% chance of being active
        ];
    }

    /**
     * Indicate that the template is active
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the template is inactive
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Define a template with a background image
     */
    public function withBackground(): static
    {
        return $this->state(fn (array $attributes) => [
            'background_path' => 'template_backgrounds/test.png',
        ]);
    }
}
