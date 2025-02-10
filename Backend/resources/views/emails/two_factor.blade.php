@extends('layouts.app')

@section('content')
    <div class="container">
        <h2>Two-Factor Authentication</h2>
        <form action="{{ route('2fa.verify') }}" method="POST">
            @csrf
            <label for="two_factor_code">Enter the code sent to your email:</label>
            <input type="text" name="two_factor_code" required>
            @error('two_factor_code')
                <p>{{ $message }}</p>
            @enderror
            <button type="submit">Verify</button>
        </form>
    </div>
@endsection
