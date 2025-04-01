<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('tickets', function (Blueprint $table) {
      $table->string('ticket_id', 20)->primary();
      $table->string('user_id', 36)->nullable();
      $table->string('event_name');
      $table->string('event_location');
      $table->dateTime('event_datetime');
      $table->string('section')->nullable();
      $table->string('row')->nullable();
      $table->string('seat')->nullable();
      $table->string('generated_ticket_path')->nullable();
      $table->timestamps();

      $table->foreign('user_id')
        ->references('id')
        ->on('users')
        ->onDelete('cascade');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('tickets');
  }
};