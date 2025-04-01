<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::table('tickets', function (Blueprint $table) {
      // Add the column if it doesn't exist - handles potential re-runs
      if (!Schema::hasColumn('tickets', 'background_filename')) {
        $table->string('background_filename')->nullable()->after('seat'); // Assume it was after seat based on structure
      }
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('tickets', function (Blueprint $table) {
      // Only drop if it exists
      if (Schema::hasColumn('tickets', 'background_filename')) {
        $table->dropColumn('background_filename');
      }
    });
  }
};
