<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script>
        window.__INITIAL_LANGUAGE__ = "{{ app()->getLocale() }}";
        document.documentElement.lang = "{{ app()->getLocale() }}";
        document.body.dir = "{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}";
    </script>

    <title>{{ config('app.name', 'CGVS') }}</title>

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/ts/app.jsx'])
</head>

<body>
    <div id="app"></div>
</body>

</html>