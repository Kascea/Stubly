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
        // First, check for foreign keys pointing to this column
        $fkList = [];

        // Find foreign keys in cart_items table
        if (Schema::hasTable('cart_items') && Schema::hasColumn('cart_items', 'ticket_id')) {
            try {
                DB::statement('ALTER TABLE cart_items DROP FOREIGN KEY cart_items_ticket_id_foreign');
                $fkList[] = 'cart_items';
            } catch (\Exception $e) {
                // Key might not exist or have a different name
            }
        }

        // Find foreign keys in payments table
        if (Schema::hasTable('payments') && Schema::hasColumn('payments', 'ticket_id')) {
            try {
                DB::statement('ALTER TABLE payments DROP FOREIGN KEY payments_ticket_id_foreign');
                $fkList[] = 'payments';
            } catch (\Exception $e) {
                // Key might not exist or have a different name
            }
        }

        // Now modify the column
        Schema::table('tickets', function (Blueprint $table) {
            // Modify column using DB statement to avoid doctrine/dbal requirement
            DB::statement('ALTER TABLE tickets MODIFY ticket_id VARCHAR(36)');
        });

        // Restore foreign keys
        if (in_array('cart_items', $fkList)) {
            Schema::table('cart_items', function (Blueprint $table) {
                $table->foreign('ticket_id')
                    ->references('ticket_id')
                    ->on('tickets')
                    ->onDelete('cascade');
            });
        }

        if (in_array('payments', $fkList)) {
            Schema::table('payments', function (Blueprint $table) {
                $table->foreign('ticket_id')
                    ->references('ticket_id')
                    ->on('tickets')
                    ->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // WARNING: This might cause data loss if any ticket_id is longer than 20 chars!
        // Only for rollback if absolutely necessary

        // First, check for foreign keys pointing to this column (same as up)
        $fkList = [];

        if (Schema::hasTable('cart_items') && Schema::hasColumn('cart_items', 'ticket_id')) {
            try {
                DB::statement('ALTER TABLE cart_items DROP FOREIGN KEY cart_items_ticket_id_foreign');
                $fkList[] = 'cart_items';
            } catch (\Exception $e) {
                // Key might not exist or have a different name
            }
        }

        if (Schema::hasTable('payments') && Schema::hasColumn('payments', 'ticket_id')) {
            try {
                DB::statement('ALTER TABLE payments DROP FOREIGN KEY payments_ticket_id_foreign');
                $fkList[] = 'payments';
            } catch (\Exception $e) {
                // Key might not exist or have a different name
            }
        }

        Schema::table('tickets', function (Blueprint $table) {
            // Modify column back to original size
            DB::statement('ALTER TABLE tickets MODIFY ticket_id VARCHAR(20)');
        });

        // Restore foreign keys
        if (in_array('cart_items', $fkList)) {
            Schema::table('cart_items', function (Blueprint $table) {
                $table->foreign('ticket_id')
                    ->references('ticket_id')
                    ->on('tickets')
                    ->onDelete('cascade');
            });
        }

        if (in_array('payments', $fkList)) {
            Schema::table('payments', function (Blueprint $table) {
                $table->foreign('ticket_id')
                    ->references('ticket_id')
                    ->on('tickets')
                    ->onDelete('cascade');
            });
        }
    }
};