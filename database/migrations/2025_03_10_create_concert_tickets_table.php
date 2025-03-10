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
        Schema::create('concert_tickets', function (Blueprint $table) {
            $table->id();
            $table->string('artist')->nullable();
            $table->string('tour_name')->nullable();
            $table->string('genre')->nullable();
            $table->string('opening_act')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('concert_tickets');
    }
};