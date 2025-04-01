<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            // payment_intent_id should exist from create_orders_table
            // Add payment_method if it doesn't exist
            if (!Schema::hasColumn('orders', 'payment_method')) {
                // This might be the Stripe PaymentMethod ID (pm_...)
                $table->string('payment_method', 191)->nullable()->after('payment_intent_id');
            }
            // Drop the redundant columns added by the original migration if they exist
            if (Schema::hasColumn('orders', 'payment_intent')) {
                $table->dropColumn('payment_intent');
            }
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'payment_method')) {
                $table->dropColumn('payment_method');
            }
            // Add back the redundant payment_intent if needed for rollback consistency
            if (!Schema::hasColumn('orders', 'payment_intent')) {
                $table->string('payment_intent')->nullable();
            }
        });
    }
};