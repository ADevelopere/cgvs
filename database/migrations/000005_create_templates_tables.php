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
            $table->unsignedInteger('order')->nullable();
            $table->enum('special_type', ['deleted', 'main'])->nullable()->unique();
            $table->timestamps();
            $table->softDeletes();
        });

        // Add name length constraint first
        DB::statement('ALTER TABLE template_categories ADD CONSTRAINT template_categories_name_length CHECK (LENGTH(name) >= 3)');

        // Create the special categories BEFORE adding the special check constraint
        DB::table('template_categories')->insert([
            [
                'name' => 'النماذج الرئيسية',
                'description' => 'Main templates category',
                'parent_category_id' => null, // Must be null for main
                'order' => 0, // Can have order
                'special_type' => 'main',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'النماذج المحذوفة',
                'description' => 'Special category for deleted templates',
                'parent_category_id' => null,
                'order' => null, // Must be null for deleted
                'special_type' => 'deleted',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);

        // Add the special check constraint AFTER inserting data
        // Use backticks (`) for column names like `order` in MySQL
        DB::statement('ALTER TABLE template_categories ADD CONSTRAINT template_categories_special_check CHECK (
            special_type IS NULL OR
            (special_type = \'deleted\' AND parent_category_id IS NULL AND `order` IS NULL) OR
            (special_type = \'main\' AND parent_category_id IS NULL)
        )');

        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('background_url')->nullable();
            $table->foreignId('category_id')
                ->constrained('template_categories')
                ->restrictOnDelete(); // Prevent deletion if has templates
            $table->unsignedInteger('order')->nullable(); // Allow null for templates in special categories
            $table->timestamps();
            $table->softDeletes();
        });

        DB::statement('ALTER TABLE templates ADD CONSTRAINT templates_name_length CHECK (LENGTH(name) >= 3)');

        // REMOVED the templates_special_category_check constraint that caused permission errors
        // DB::statement('ALTER TABLE templates ADD CONSTRAINT templates_special_category_check CHECK (
        //     (`order` IS NULL AND EXISTS (
        //         SELECT 1 FROM template_categories tc
        //         WHERE tc.id = category_id AND tc.special_type = \'deleted\'
        //     )) OR
        //     (`order` IS NOT NULL AND EXISTS (
        //         SELECT 1 FROM template_categories tc
        //         WHERE tc.id = category_id AND (tc.special_type = \'main\' OR tc.special_type IS NULL)
        //     ))
        // )');

        // Restore the column definitions here:
        Schema::create('template_elements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained()->onDelete('cascade');
            $table->string('element_type'); // e.g., 'text', 'image', 'variable'
            $table->float('x_coordinate');
            $table->float('y_coordinate');
            $table->json('properties')->nullable(); // width, height, content for text, etc.
            $table->integer('font_size')->nullable();
            $table->string('color')->nullable();
            $table->string('alignment')->nullable(); // left, center, right
            $table->string('font_family')->nullable();
            $table->string('language_constraint')->nullable(); // e.g., 'ar', 'en'
            $table->string('source_field')->nullable(); // For variable elements, links to TemplateVariable name
            $table->timestamps();
        });

        Schema::create('template_variables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained()->onDelete('cascade');
            $table->string('name'); // Unique identifier within the template
            $table->string('type'); // e.g., 'text', 'date', 'number', 'gender'
            $table->text('description')->nullable();
            $table->json('validation_rules')->nullable(); // Laravel validation rules
            $table->string('preview_value')->nullable(); // Default value for preview
            $table->boolean('is_key')->default(false); // Part of the unique key for recipients
            $table->boolean('required')->default(false);
            $table->unsignedInteger('order'); // Display order
            $table->timestamps();

            $table->unique(['template_id', 'name']); // Variable names must be unique per template
        });

        Schema::create('template_recipients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained()->onDelete('cascade');
            $table->boolean('is_valid')->default(false); // Flag indicating if all required variables are present and valid
            $table->json('validation_errors')->nullable(); // Stores validation errors if is_valid is false
            $table->timestamps();
        });

        Schema::create('recipient_variable_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_recipient_id')->constrained('template_recipients')->onDelete('cascade');
            $table->foreignId('template_variable_id')->constrained('template_variables')->onDelete('cascade');
            $table->text('value')->nullable(); // Actual value provided for the variable
            $table->string('value_indexed')->nullable(); // Indexed value for faster searching, especially for key variables
            $table->timestamps();

            // Index for efficient lookup of recipients based on key variable values
            $table->unique(['template_recipient_id', 'value_indexed', 'template_variable_id'], 'unique_recipient_key_value');
            // Consider adding an index on value_indexed if searching across recipients by value is common
            // $table->index('value_indexed');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recipient_variable_values');
        Schema::dropIfExists('template_recipients');
        Schema::dropIfExists('template_variables');
        Schema::dropIfExists('template_elements');
        Schema::dropIfExists('templates');
        Schema::dropIfExists('template_categories'); // Drop in reverse order
    }
};
