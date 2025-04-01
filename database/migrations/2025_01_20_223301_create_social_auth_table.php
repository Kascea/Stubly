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
    Schema::create('social_auth', function (Blueprint $table) {
      $table->id();
      $table->string('provider', 191);
      $table->string('provider_id', 191);
      $table->string('user_id', 36);
      $table->timestamps();
      $table->unique(['provider', 'provider_id']);
      $table->index(['user_id', 'provider']);

      $table->foreign('user_id')
        ->references('id')
        ->on('users')
        ->onDelete('cascade');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('social_auth');
  }
};
