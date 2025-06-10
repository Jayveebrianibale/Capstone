<!DOCTYPE html>
<html>
<head>
    <title>Verification Code</title>
</head>
<body>
    <h1>Your Verification Code</h1>
    <p>Your verification code is: <strong>{{ $code }}</strong></p>
    <p>This code was sent on {{ now()->setTimezone('Asia/Manila')->format('F j, Y \a\t h:i A') }}.</p>
    <p>Please use this code to verify your account.</p>
</body>
</html>
