@php
/**
 * @var $exception ArranJacques\Taniquetil\Exception
 */
@endphp

@component('mail::message')
# \{{ $exception->getAttribute('type') }}

@if ($exception->getAttribute('message'))
{{ $exception->getAttribute('message') }}
@endif

## Occurred
{{ $exception->getAttribute('dateTime') }}

## Location
...{{ str_replace(base_path(), '', $exception->getAttribute('file')) }} (Line {{ $exception->getAttribute('line') }})

@if ($exception->getId())
@component('mail::button', ['url' => route('taniquetil::exceptions.view', [$exception->getId()])])
    View Exception
@endcomponent
@else
## Please note
This is a notification only. The exception was not logged in Taniquetil.
@endif

@endcomponent
