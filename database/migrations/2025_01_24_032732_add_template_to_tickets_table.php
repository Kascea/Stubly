<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migration to add the template field.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tickets', function (Blueprint $table) {
            if (!Schema::hasColumn('tickets', 'template')) {
                $table->string('template')
                    ->default('modern')
                    ->after('seat'); // Adjusted position based on likely structure
            }
        });
    }

    /**
     * Reverse the migration to remove the template field.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tickets', function (Blueprint $table) {
            if (Schema::hasColumn('tickets', 'template')) {
                $table->dropColumn('template');
            }
        });
    }
};