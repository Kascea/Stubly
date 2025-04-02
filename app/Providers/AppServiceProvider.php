<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AppServiceProvider extends ServiceProvider
{
  public const HOME = '/canvas';
  /**
   * Register any application services.
   */
  public function register(): void
  {
    //
  }

  /**
   * Bootstrap any application services.
   */
  public function boot(): void
  {
    Vite::prefetch(concurrency: 3);
    if ($this->app->environment('production')) {
      URL::forceScheme('https');

      // Force secure cookies in production
      config(['session.secure' => true]);
      config(['session.same_site' => 'strict']);
    }
  }
}
