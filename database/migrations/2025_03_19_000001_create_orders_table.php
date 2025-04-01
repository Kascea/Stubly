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
            $table->string('order_id', 20)->primary();
            $table->string('user_id', 36)->nullable();
            $table->string('customer_email')->nullable();
            $table->string('status')->default('pending'); // pending, processing, completed, failed, canceled
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->string('payment_intent_id', 191)->nullable()->index();
            $table->string('payment_method_id')->nullable();
            $table->string('billing_name')->nullable();
            $table->string('pdf_path')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
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