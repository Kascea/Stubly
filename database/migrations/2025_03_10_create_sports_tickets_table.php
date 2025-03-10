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
        Schema::create('sports_tickets', function (Blueprint $table) {
            $table->id();
            $table->string('sport_type')->nullable();
            $table->string('team_home')->nullable();
            $table->string('team_away')->nullable();
            $table->string('league')->nullable();
            $table->string('season')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sports_tickets');
    }
};