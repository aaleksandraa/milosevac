<?php

use App\Http\Controllers\PublicPortalController;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('portal:export-content', function () {
    $request = Request::create('/api/content', 'GET', ['limit' => 1000]);
    $response = app(PublicPortalController::class)->apiContent($request);
    $target = base_path('../src/data/portal-content.snapshot.json');

    File::put($target, $response->getContent());
    $this->info('Portal content snapshot exported.');
})->purpose('Export the latest database articles for instant frontend rendering');
