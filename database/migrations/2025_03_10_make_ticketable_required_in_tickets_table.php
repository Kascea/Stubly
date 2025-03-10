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
            // Drop the nullable constraint
            $table->unsignedBigInteger('ticketable_id')->nullable(false)->change();
            $table->string('ticketable_type')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->unsignedBigInteger('ticketable_id')->nullable()->change();
            $table->string('ticketable_type')->nullable()->change();
        });
    }
};