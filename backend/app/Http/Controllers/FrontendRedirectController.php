<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FrontendRedirectController extends Controller
{
    public function home(): RedirectResponse
    {
        return $this->to('/');
    }

    public function about(): RedirectResponse
    {
        return $this->to('/omilosevcu');
    }

    public function post(string $slug): RedirectResponse
    {
        return $this->to('/clanak/'.$slug);
    }

    public function category(Request $request, string $category): RedirectResponse
    {
        return $this->to('/kategorija/'.$category, $request);
    }

    public function tag(Request $request, string $tag): RedirectResponse
    {
        return $this->to('/kategorija/vijesti', $request, ['tag' => $tag]);
    }

    public function author(): RedirectResponse
    {
        return $this->to('/');
    }

    public function search(Request $request): RedirectResponse
    {
        return $this->to('/', $request);
    }

    public function fkPosavina(): RedirectResponse
    {
        return $this->to('/fk-posavina');
    }

    public function match(string $match): RedirectResponse
    {
        return $this->to('/fk-posavina/utakmica/'.$match);
    }

    public function weather(): RedirectResponse
    {
        return $this->to('/vrijeme');
    }

    public function privacy(): RedirectResponse
    {
        return $this->to('/politika-privatnosti');
    }

    public function cookies(): RedirectResponse
    {
        return $this->to('/politika-kolacica');
    }

    public function terms(): RedirectResponse
    {
        return $this->to('/uslovi-koristenja');
    }

    private function to(string $path, ?Request $request = null, array $query = []): RedirectResponse
    {
        $url = rtrim(config('services.frontend.url'), '/').'/'.ltrim($path, '/');
        $query = array_filter(array_merge($request?->query() ?? [], $query), fn ($value) => $value !== null && $value !== '');

        return redirect()->away($query ? $url.'?'.http_build_query($query) : $url);
    }
}
