<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // First, make sure we have the data from the old structure
        $recipients = DB::table('template_recipients')->get();
        $recipientData = [];
        foreach ($recipients as $recipient) {
            $recipientData[$recipient->id] = json_decode($recipient->data, true);
        }

        // Create a new table to store recipient variable values
        Schema::create('recipient_variable_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_recipient_id')->constrained('template_recipients')->onDelete('cascade');
            $table->foreignId('template_variable_id')->constrained('template_variables')->onDelete('cascade');
            $table->text('value')->nullable();
            $table->timestamps();

            // Add a unique constraint to prevent duplicate variable values for a recipient
            $table->unique(['template_recipient_id', 'template_variable_id'], 'unique_recipient_variable');
        });

        // Migrate the existing data
        foreach ($recipientData as $recipientId => $data) {
            if (!$data) continue;

            $recipient = DB::table('template_recipients')->find($recipientId);
            if (!$recipient) continue;

            $variables = DB::table('template_variables')
                ->where('template_id', $recipient->template_id)
                ->get();

            foreach ($variables as $variable) {
                if (!isset($data[$variable->name])) continue;

                DB::table('recipient_variable_values')->insert([
                    'template_recipient_id' => $recipientId,
                    'template_variable_id' => $variable->id,
                    'value' => $data[$variable->name],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Remove the data column from template_recipients
        Schema::table('template_recipients', function (Blueprint $table) {
            $table->dropColumn('data');
        });
    }

    public function down()
    {
        // Add back the data column first
        Schema::table('template_recipients', function (Blueprint $table) {
            $table->json('data')->nullable();
        });

        // Now migrate the data back to the json format
        $recipients = DB::table('template_recipients')->get();
        foreach ($recipients as $recipient) {
            $values = DB::table('recipient_variable_values')
                ->where('template_recipient_id', $recipient->id)
                ->join('template_variables', 'template_variables.id', '=', 'recipient_variable_values.template_variable_id')
                ->select('template_variables.name', 'recipient_variable_values.value')
                ->get();

            $data = [];
            foreach ($values as $value) {
                $data[$value->name] = $value->value;
            }

            // Update the recipient with the old data format
            DB::table('template_recipients')
                ->where('id', $recipient->id)
                ->update(['data' => json_encode($data)]);
        }

        Schema::dropIfExists('recipient_variable_values');
    }
};
