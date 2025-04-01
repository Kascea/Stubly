<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('tickets', function (Blueprint $table) {
            if (!Schema::hasColumn('tickets', 'cart_id')) {
                $table->string('cart_id', 20)->nullable();
                $table->foreign('cart_id')->references('cart_id')->on('carts')->onDelete('set null');
            }
        });
    }

    public function down()
    {
        Schema::table('tickets', function (Blueprint $table) {
            if (Schema::hasColumn('tickets', 'cart_id')) {
                $table->dropForeign(['cart_id']);
                $table->dropColumn('cart_id');
            }
        });
    }
};