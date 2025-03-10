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
            $table->unsignedBigInteger('ticketable_id')->nullable();
            $table->string('ticketable_type')->nullable();
            $table->index(['ticketable_id', 'ticketable_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropIndex(['ticketable_id', 'ticketable_type']);
            $table->dropColumn(['ticketable_id', 'ticketable_type']);
        });
    }
};