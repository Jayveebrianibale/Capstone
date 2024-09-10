@extends('layouts.app')

@section('content')
<form method="POST" action="{{ route('verification.verify') }}">
    @csrf

    <div>
        <label for="verification_code">Verification Code</label>
        <input id="verification_code" type="text" name="verification_code" required autofocus>
        @error('verification_code')
            <span>{{ $message }}</span>
        @enderror
    </div>

    <div>
        <button type="submit">
            Verify Code
        </button>
    </div>
</form>
@endsection
