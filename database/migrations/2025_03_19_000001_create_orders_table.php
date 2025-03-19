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
        Schema::create('orders', function (Blueprint $table) {
            $table->string('order_id')->primary();
            $table->uuid('user_id');
            $table->string('status')->default('pending'); // pending, processing, completed, failed, canceled
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->string('payment_intent_id')->nullable();
            $table->string('payment_method_id')->nullable();
            $table->string('billing_email')->nullable();
            $table->string('billing_name')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};