<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            // Add new payment fields if they don't exist
            if (!Schema::hasColumn('orders', 'payment_intent')) {
                $table->string('payment_intent')->nullable()->after('total_amount');
            }
            if (!Schema::hasColumn('orders', 'payment_method')) {
                $table->string('payment_method')->nullable()->after('payment_intent');
            }
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['payment_intent', 'payment_method']);
        });
    }
};