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
            $table->dropColumn(['background_filename', 'background_image_path']);
        });
    }

    // ... existing code ...

    public function down()
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->string('background_filename')->nullable();
            $table->string('background_image_path')->nullable();
        });
    }
};
