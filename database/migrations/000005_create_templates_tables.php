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
            $table->enum('special_type', ['deletion', 'main'])->nullable()->unique();
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
                'description' => 'Special category for deletion templates',
                'parent_category_id' => null,
                'order' => null, // Must be null for deletion
                'special_type' => 'deletion',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);

        // Add the special check constraint AFTER inserting data
        // Use backticks (`) for column names like `order` in MySQL
        DB::statement('ALTER TABLE template_categories ADD CONSTRAINT template_categories_special_check CHECK (
            special_type IS NULL OR
            (special_type = \'deletion\' AND parent_category_id IS NULL AND `order` IS NULL) OR
            (special_type = \'main\' AND parent_category_id IS NULL)
        )');

        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->foreignId('category_id')
                ->constrained('template_categories')
                ->restrictOnDelete(); // Prevent deletion if has templates
            $table->foreignId('pre_deletion_category_id')
                ->nullable()
                ->constrained('template_categories')
                ->nullOnDelete(); // If previous category is deleted, set to null
            $table->unsignedInteger('order')->nullable(); // Allow null for templates in special categories
            $table->timestamps();
            $table->softDeletes();
            $table->timestamp('trashed_at')->nullable();
        });

        DB::statement('ALTER TABLE templates ADD CONSTRAINT templates_name_length CHECK (LENGTH(name) >= 3)');

        // REMOVED the templates_special_category_check constraint that caused permission errors
        // DB::statement('ALTER TABLE templates ADD CONSTRAINT templates_special_category_check CHECK (
        //     (`order` IS NULL AND EXISTS (
        //         SELECT 1 FROM template_categories tc
        //         WHERE tc.id = category_id AND tc.special_type = \'deletion\'
        //     )) OR
        //     (`order` IS NOT NULL AND EXISTS (
        //         SELECT 1 FROM template_categories tc
        //         WHERE tc.id = category_id AND (tc.special_type = \'main\' OR tc.special_type IS NULL)
        //     ))
        // )');

        // Replace template_elements table with base table and specific element type tables
        Schema::create('template_elements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained()->onDelete('cascade');
            $table->string('type'); // Discriminator: 'static_text', 'data_text', 'data_date', 'image', 'qr_code'
            $table->float('x_coordinate');
            $table->float('y_coordinate');
            $table->integer('font_size')->nullable();
            $table->string('color')->nullable();
            $table->string('alignment')->nullable(); // left, center, right
            $table->string('font_family')->nullable();
            $table->string('language_constraint')->nullable(); // e.g., 'ar', 'en'
            $table->timestamps();
        });

        // Static text elements (like titles, labels)
        Schema::create('template_static_text_elements', function (Blueprint $table) {
            $table->foreignId('element_id')->primary()->constrained('template_elements')->onDelete('cascade');
            $table->text('content'); // The actual text content
            $table->timestamps();
        });

        // Dynamic text elements (from student, variable, or certificate)
        Schema::create('template_data_text_elements', function (Blueprint $table) {
            $table->foreignId('element_id')->primary()->constrained('template_elements')->onDelete('cascade');
            $table->enum('source_type', ['student', 'variable', 'certificate']);
            $table->string('source_field'); // Field name from the source table
            $table->timestamps();
        });

        // Dynamic date elements (from student, variable, or certificate)
        Schema::create('template_data_date_elements', function (Blueprint $table) {
            $table->foreignId('element_id')->primary()->constrained('template_elements')->onDelete('cascade');
            $table->enum('source_type', ['student', 'variable', 'certificate']);
            $table->string('source_field'); // Field name from the source table
            $table->string('date_format')->nullable(); // e.g., 'Y-m-d', 'd/m/Y'
            $table->timestamps();
        });

        // Image elements
        Schema::create('template_image_elements', function (Blueprint $table) {
            $table->foreignId('element_id')->primary()->constrained('template_elements')->onDelete('cascade');
            $table->string('image_url');
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->timestamps();
        });

        // QR Code elements
        Schema::create('template_qr_code_elements', function (Blueprint $table) {
            $table->foreignId('element_id')->primary()->constrained('template_elements')->onDelete('cascade');
            $table->integer('size')->nullable(); // Size in pixels
            $table->timestamps();
        });

        Schema::create('template_variables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained()->onDelete('cascade');
            $table->string('name'); // Unique identifier within the template
            $table->string('type'); // Discriminator: 'text', 'date', 'number', 'select'
            $table->text('description')->nullable();
            $table->string('preview_value')->nullable(); // Default value for preview
            $table->boolean('required')->default(false);
            $table->unsignedInteger('order'); // Display order
            $table->timestamps();

            $table->unique(['template_id', 'name']); // Variable names must be unique per template
        });

        // Text variable specific properties
        Schema::create('template_text_variables', function (Blueprint $table) {
            $table->foreignId('variable_id')->primary()->constrained('template_variables')->onDelete('cascade');
            $table->unsignedInteger('min_length')->nullable();
            $table->unsignedInteger('max_length')->nullable();
            $table->string('pattern')->nullable(); // Regex pattern for validation
            $table->timestamps();
        });

        // Number variable specific properties
        Schema::create('template_number_variables', function (Blueprint $table) {
            $table->foreignId('variable_id')->primary()->constrained('template_variables')->onDelete('cascade');
            $table->decimal('min_value', 65, 10)->nullable();
            $table->decimal('max_value', 65, 10)->nullable();
            $table->unsignedInteger('decimal_places')->nullable();
            $table->timestamps();
        });

        // Date variable specific properties
        Schema::create('template_date_variables', function (Blueprint $table) {
            $table->foreignId('variable_id')->primary()->constrained('template_variables')->onDelete('cascade');
            $table->date('min_date')->nullable();
            $table->date('max_date')->nullable();
            $table->string('format')->nullable(); // e.g., 'Y-m-d', 'd/m/Y'
            $table->timestamps();
        });

        // Select/Choice variable specific properties
        Schema::create('template_select_variables', function (Blueprint $table) {
            $table->foreignId('variable_id')->primary()->constrained('template_variables')->onDelete('cascade');
            $table->json('options'); // Array of possible values
            $table->boolean('multiple')->default(false); // Whether multiple selections are allowed
            $table->timestamps();
        });

        Schema::create('template_recipient_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')
                ->constrained()
                ->onDelete('cascade')
                ->name('trg_template_fk');
            $table->string('name'); // Name of the group
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('template_recipient_group_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_recipient_group_id')
                ->constrained('template_recipient_groups')
                ->onDelete('cascade')
                ->name('trgi_group_fk');
            $table->foreignId('student_id')
                ->constrained('students')
                ->onDelete('cascade')
                ->name('trgi_student_fk');
            $table->timestamps();

            // Ensure a student can't be in multiple groups for the same template
            $table->unique(['student_id', 'template_recipient_group_id'], 'trgi_student_group_unique');
        });

        Schema::create('recipient_group_item_variable_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_recipient_group_item_id')
                ->constrained('template_recipient_group_items')
                ->onDelete('cascade')
                ->name('rgiv_group_item_fk');
            $table->foreignId('template_variable_id')
                ->constrained('template_variables')
                ->onDelete('cascade')
                ->name('rgiv_variable_fk');
            $table->text('value')->nullable();
            $table->string('value_indexed')->nullable();
            $table->timestamps();

            // Index for efficient lookup of recipients based on key variable values
            $table->unique(
                ['template_recipient_group_item_id', 'template_variable_id'],
                'rgiv_group_item_variable_unique'
            );
            $table->index('value_indexed', 'rgiv_value_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recipient_group_item_variable_values');
        Schema::dropIfExists('template_recipient_group_items');
        Schema::dropIfExists('template_recipient_groups');
        Schema::dropIfExists('template_select_variables');
        Schema::dropIfExists('template_date_variables');
        Schema::dropIfExists('template_number_variables');
        Schema::dropIfExists('template_text_variables');
        Schema::dropIfExists('template_variables');
        Schema::dropIfExists('template_qr_code_elements');
        Schema::dropIfExists('template_image_elements');
        Schema::dropIfExists('template_data_date_elements');
        Schema::dropIfExists('template_data_text_elements');
        Schema::dropIfExists('template_static_text_elements');
        Schema::dropIfExists('template_elements');
        Schema::dropIfExists('templates');
        Schema::dropIfExists('template_categories');
    }
};
