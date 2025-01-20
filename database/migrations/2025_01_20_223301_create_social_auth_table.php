<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up()
  {
    Schema::create('social_auth', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->string('provider');
      $table->string('provider_id');
      $table->timestamps();
      $table->unique(['provider', 'provider_id']);
      $table->index(['user_id', 'provider']);
    });
  }

  public function down()
  {
    Schema::dropIfExists('social_auth');
  }
};
