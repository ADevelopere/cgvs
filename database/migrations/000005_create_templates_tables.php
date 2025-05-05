<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('template_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable(false);
            $table->text('description')->nullable();
            $table->foreignId('parent_category_id')->nullable()
                ->constrained('template_categories')
                ->restrictOnDelete(); // Prevent deletion if has child categories
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        // Add check constraint for minimum name length
        DB::statement('ALTER TABLE template_categories ADD CONSTRAINT template_categories_name_length CHECK (LENGTH(name) >= 3)');

        // Create the special category for deleted templates
        DB::table('template_categories')->insert([
            'id' => 101007,
            'name' => 'Deleted Templates',
            'description' => 'Special category for deleted templates',
            'parent_category_id' => null,
            'order' => 999999,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('background_url')->nullable();
            $table->foreignId('category_id')
                ->constrained('template_categories')
                ->restrictOnDelete(); // Prevent deletion if has templates
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        // Add check constraint for minimum name length
        DB::statement('ALTER TABLE templates ADD CONSTRAINT templates_name_length CHECK (LENGTH(name) >= 3)');

        Schema::create('template_elements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained()->onDelete('cascade');
            $table->string('element_type');
            $table->float('x_coordinate');
            $table->float('y_coordinate');
            $table->json('properties')->nullable();
            $table->integer('font_size')->nullable();
            $table->string('color')->nullable();
            $table->string('alignment')->nullable();
            $table->string('font_family')->nullable();
            $table->string('language_constraint')->nullable();
            $table->string('source_field')->nullable();
            $table->timestamps();
        });

        Schema::create('template_variables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('type');
            $table->text('description')->nullable();
            $table->json('validation_rules')->nullable();
            $table->string('preview_value')->nullable();
            $table->boolean('is_key')->default(false);
            $table->boolean('required')->default(false);
            $table->unsignedInteger('order');
            $table->timestamps();
            
            $table->unique(['template_id', 'name']);
        });

        Schema::create('template_recipients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained()->onDelete('cascade');
            $table->boolean('is_valid')->default(false);
            $table->json('validation_errors')->nullable();
            $table->timestamps();
        });

        Schema::create('recipient_variable_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_recipient_id')->constrained('template_recipients')->onDelete('cascade');
            $table->foreignId('template_variable_id')->constrained('template_variables')->onDelete('cascade');
            $table->text('value')->nullable();
            $table->string('value_indexed')->nullable();
            $table->timestamps();

            $table->unique(['template_recipient_id', 'value_indexed', 'template_variable_id'], 'unique_recipient_key_value');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recipient_variable_values');
        Schema::dropIfExists('template_recipients');
        Schema::dropIfExists('template_variables');
        Schema::dropIfExists('template_elements');
        Schema::dropIfExists('templates');
        Schema::dropIfExists('template_categories');
    }
};
