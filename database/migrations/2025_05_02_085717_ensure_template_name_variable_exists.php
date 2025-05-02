<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add is_key column to template_variables
        Schema::table('template_variables', function (Blueprint $table) {
            $table->boolean('is_key')->default(false);
        });

        // For each existing template, ensure it has a name variable
        $templates = DB::table('templates')->get();
        foreach ($templates as $template) {
            // Check if template has a name variable
            $nameVar = DB::table('template_variables')
                ->where('template_id', $template->id)
                ->where('name', 'name')
                ->first();

            if (!$nameVar) {
                // Create name variable
                DB::table('template_variables')->insert([
                    'template_id' => $template->id,
                    'name' => 'name',
                    'type' => 'text',
                    'description' => 'Recipient identifier name',
                    'is_key' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                // Update existing name variable
                DB::table('template_variables')
                    ->where('id', $nameVar->id)
                    ->update([
                        'is_key' => true,
                        'updated_at' => now(),
                    ]);
            }
        }

        // Modify value column to varchar for indexing
        Schema::table('recipient_variable_values', function (Blueprint $table) {
            // First, create a new varchar column
            $table->string('value_indexed', 255)->nullable()->after('value');
        });

        // Copy existing values
        DB::table('recipient_variable_values')
            ->whereNotNull('value')
            ->update(['value_indexed' => DB::raw('LEFT(value, 255)')]);

        // Add the unique index on the new column
        Schema::table('recipient_variable_values', function (Blueprint $table) {
            $table->unique(['template_recipient_id', 'value_indexed', 'template_variable_id'], 'unique_recipient_key_value');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recipient_variable_values', function (Blueprint $table) {
            $table->dropUnique('unique_recipient_key_value');
            $table->dropColumn('value_indexed');
        });

        Schema::table('template_variables', function (Blueprint $table) {
            $table->dropColumn('is_key');
        });
    }
};
