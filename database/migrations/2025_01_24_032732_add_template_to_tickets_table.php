<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migration to add the template field.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tickets', function (Blueprint $table) {
            // Add the template column with a default value of 'modern'
            // After an existing column to maintain a logical column order
            $table->string('template')
                ->default('modern')
                ->after('background_filename');
        });
    }

    /**
     * Reverse the migration to remove the template field.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tickets', function (Blueprint $table) {
            // Remove the template column if we need to roll back
            $table->dropColumn('template');
        });
    }
};