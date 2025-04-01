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
            // Add the new column if it doesn't exist
            if (!Schema::hasColumn('tickets', 'background_image_path')) {
                // Assuming path is a string, potentially long
                $table->text('background_image_path')->nullable();
            }
        });

        // Copy data only if both columns exist
        if (Schema::hasColumn('tickets', 'background_image') && Schema::hasColumn('tickets', 'background_image_path')) {
            DB::statement('UPDATE tickets SET background_image_path = background_image WHERE background_image IS NOT NULL');
        }


        Schema::table('tickets', function (Blueprint $table) {
            // Then drop the old column if it exists
            if (Schema::hasColumn('tickets', 'background_image')) {
                $table->dropColumn('background_image');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            // Add the old column back if it doesn't exist
            if (!Schema::hasColumn('tickets', 'background_image')) {
                $table->text('background_image')->nullable();
            }
        });

        // Copy data back only if both columns exist
        if (Schema::hasColumn('tickets', 'background_image') && Schema::hasColumn('tickets', 'background_image_path')) {
            DB::statement('UPDATE tickets SET background_image = background_image_path WHERE background_image_path IS NOT NULL');
        }

        Schema::table('tickets', function (Blueprint $table) {
            // Drop the new column if it exists
            if (Schema::hasColumn('tickets', 'background_image_path')) {
                $table->dropColumn('background_image_path');
            }
        });
    }
};
