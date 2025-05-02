<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddOrderToTemplateVariablesTable extends Migration
{
    public function up()
    {
        Schema::table('template_variables', function (Blueprint $table) {
            $table->unsignedInteger('order')->after('is_key');
        });

        // Initialize order for existing records
        DB::table('template_variables')
            ->orderBy('created_at')
            ->get()
            ->each(function ($variable, $index) {
                DB::table('template_variables')
                    ->where('id', $variable->id)
                    ->update(['order' => $index + 1]);
            });
    }

    public function down()
    {
        Schema::table('template_variables', function (Blueprint $table) {
            $table->dropColumn('order');
        });
    }
};
