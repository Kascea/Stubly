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
            if (!Schema::hasColumn('tickets', 'ticketable_id')) {
                $table->unsignedBigInteger('ticketable_id')->nullable();
            }
            if (!Schema::hasColumn('tickets', 'ticketable_type')) {
                $table->string('ticketable_type')->nullable();
            }
            if (Schema::hasColumns('tickets', ['ticketable_id', 'ticketable_type'])) {
                $sm = Schema::getConnection()->getDoctrineSchemaManager();
                $indexes = $sm->listTableIndexes('tickets');
                if (!array_key_exists('tickets_ticketable_id_ticketable_type_index', $indexes)) {
                    $table->index(['ticketable_id', 'ticketable_type']);
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $columnsToDrop = [];
            if (Schema::hasColumns('tickets', ['ticketable_id', 'ticketable_type'])) {
                $sm = Schema::getConnection()->getDoctrineSchemaManager();
                $indexes = $sm->listTableIndexes('tickets');
                if (array_key_exists('tickets_ticketable_id_ticketable_type_index', $indexes)) {
                    $table->dropIndex(['ticketable_id', 'ticketable_type']);
                }
                $columnsToDrop = ['ticketable_id', 'ticketable_type'];
            }
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};