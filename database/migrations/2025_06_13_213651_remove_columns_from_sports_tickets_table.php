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
        Schema::table('sports_tickets', function (Blueprint $table) {
            $table->dropColumn([
                'sport_type',
                'home_team_logo',
                'away_team_logo',
                'league',
                'season'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sports_tickets', function (Blueprint $table) {
            $table->string('sport_type')->nullable();
            $table->string('home_team_logo')->nullable();
            $table->string('away_team_logo')->nullable();
            $table->string('league')->nullable();
            $table->string('season')->nullable();
        });
    }
};
