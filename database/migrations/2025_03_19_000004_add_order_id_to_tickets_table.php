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
            if (!Schema::hasColumn('tickets', 'order_id')) {
                $table->string('order_id', 20)->nullable()->after('user_id');
                $table->foreign('order_id')->references('order_id')->on('orders')->onDelete('set null');
            }
            if (!Schema::hasColumn('tickets', 'price')) {
                $table->decimal('price', 10, 2)->default(0)->after('template_id');
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
            if (Schema::hasColumn('tickets', 'order_id')) {
                $table->dropForeign(['order_id']);
                $columnsToDrop[] = 'order_id';
            }
            if (Schema::hasColumn('tickets', 'price')) {
                $columnsToDrop[] = 'price';
            }
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};