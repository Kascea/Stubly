<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            // First add the new column
            $table->string('background_image_path')->nullable();
        });

        // Copy data from old column to new
        DB::statement('UPDATE tickets SET background_image_path = background_image');

        Schema::table('tickets', function (Blueprint $table) {
            // Then drop the old column
            $table->dropColumn('background_image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            // Reverse the process
            $table->string('background_image')->nullable();
        });

        DB::statement('UPDATE tickets SET background_image = background_image_path');

        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn('background_image_path');
        });
    }
};
