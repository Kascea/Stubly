<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // First, add the session_id column
        Schema::table('tickets', function (Blueprint $table) {
            $table->string('session_id')->nullable()->after('user_id');
        });

        // For PostgreSQL, we need to use raw SQL to make user_id nullable
        DB::statement('ALTER TABLE tickets ALTER COLUMN user_id DROP NOT NULL');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // For PostgreSQL, set user_id back to NOT NULL
        DB::statement('UPDATE tickets SET user_id = 0 WHERE user_id IS NULL');
        DB::statement('ALTER TABLE tickets ALTER COLUMN user_id SET NOT NULL');

        // Then drop the session_id column
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn('session_id');
        });
    }
};
