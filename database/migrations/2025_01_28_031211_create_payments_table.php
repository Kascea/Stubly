<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('ticket_id');
            $table->string('stripe_session_id');
            $table->decimal('amount', 10, 2);
            $table->string('payment_status')->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->foreign('ticket_id')
                ->references('ticket_id')
                ->on('tickets')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('payments');
    }
};