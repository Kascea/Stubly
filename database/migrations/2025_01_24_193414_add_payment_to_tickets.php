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
            if (!Schema::hasColumn('tickets', 'payment_status')) {
                $table->string('payment_status')->default('unpaid');
            }
            if (!Schema::hasColumn('tickets', 'payment_intent_id')) {
                $table->string('payment_intent_id', 191)->nullable()->index();
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
            if (Schema::hasColumn('tickets', 'payment_status')) {
                $columnsToDrop[] = 'payment_status';
            }
            if (Schema::hasColumn('tickets', 'payment_intent_id')) {
                $sm = Schema::getConnection()->getDoctrineSchemaManager();
                $indexes = $sm->listTableIndexes('tickets');
                if (array_key_exists('tickets_payment_intent_id_index', $indexes)) {
                    $table->dropIndex('tickets_payment_intent_id_index');
                }
                $columnsToDrop[] = 'payment_intent_id';
            }
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
