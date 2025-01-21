<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up()
  {
    Schema::table('tickets', function (Blueprint $table) {
      // Adding ticket_id as UUID 
      $table->uuid('ticket_id')->after('id')->unique();
    });
  }

  public function down()
  {
    Schema::table('tickets', function (Blueprint $table) {
      $table->dropColumn('ticket_id');
    });
  }
};
