<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            // First drop the foreign key if it exists
            $table->dropForeign(['user_id']);

            // Change user_id to UUID and make it nullable
            $table->uuid('user_id')->nullable()->change();

            // Add customer_email as required field
            $table->string('customer_email')->after('user_id');

            // Remove old email fields if they exist
            $table->dropColumn(['billing_email']);

            // Add back the foreign key
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            // Drop the foreign key
            $table->dropForeign(['user_id']);

            // Revert user_id to bigInt
            $table->unsignedBigInteger('user_id')->change();

            // Add back billing_email
            $table->string('billing_email')->nullable();

            // Remove customer_email
            $table->dropColumn('customer_email');

            // Add back the original foreign key if needed
            $table->foreign('user_id')
                ->references('id')
                ->on('users');
        });
    }
};