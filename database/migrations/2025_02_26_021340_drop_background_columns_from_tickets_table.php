<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('tickets', function (Blueprint $table) {
            $columnsToDrop = [];
            if (Schema::hasColumn('tickets', 'background_filename')) {
                $columnsToDrop[] = 'background_filename';
            }
            if (Schema::hasColumn('tickets', 'background_image_path')) {
                $columnsToDrop[] = 'background_image_path';
            }
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }

    // ... existing code ...

    public function down()
    {
        Schema::table('tickets', function (Blueprint $table) {
            if (!Schema::hasColumn('tickets', 'background_filename')) {
                $table->string('background_filename')->nullable();
            }
            if (!Schema::hasColumn('tickets', 'background_image_path')) {
                $table->text('background_image_path')->nullable(); // Use text like before
            }
        });
    }
};
