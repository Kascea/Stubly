<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('tickets', function (Blueprint $table) {
      $table->uuid('ticket_id')->primary();
      $table->uuid('user_id');
      $table->string('event_name');
      $table->string('event_location');
      $table->dateTime('event_datetime');
      $table->string('section')->nullable();
      $table->string('row')->nullable();
      $table->string('seat')->nullable();
      $table->text('background_image')->nullable();
      $table->string('generated_ticket_path');
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