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
            $table->dropColumn([
                'template',
                'price',
                'payment_status',
                'payment_intent_id'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->string('template')->default('modern')->nullable();
            $table->decimal('price', 10, 2)->default(0)->nullable();
            $table->string('payment_status')->default('unpaid')->nullable();
            $table->string('payment_intent_id', 191)->nullable();
        });
    }
};
