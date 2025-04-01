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
        // Ensure doctrine/dbal is installed or use raw SQL
        // Using change() method first
        if (Schema::hasColumns('tickets', ['ticketable_id', 'ticketable_type'])) {
            // Set default values before making non-nullable if necessary
            // DB::table('tickets')->whereNull('ticketable_id')->update(['ticketable_id' => 0]); // Example default
            // DB::table('tickets')->whereNull('ticketable_type')->update(['ticketable_type' => 'App\Models\DefaultType']); // Example default

            Schema::table('tickets', function (Blueprint $table) {
                $table->unsignedBigInteger('ticketable_id')->nullable(false)->change();
                $table->string('ticketable_type')->nullable(false)->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumns('tickets', ['ticketable_id', 'ticketable_type'])) {
            Schema::table('tickets', function (Blueprint $table) {
                $table->unsignedBigInteger('ticketable_id')->nullable()->change();
                $table->string('ticketable_type')->nullable()->change();
            });
        }
    }
};