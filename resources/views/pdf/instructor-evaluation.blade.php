<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Instructor Evaluation</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 8px; }
        th { background: #f2f2f2; }
    </style>
</head>
<body>
    <h2>Instructor Evaluation</h2>
    <p>Instructor: {{ $instructor->name ?? 'N/A' }}</p>
    <p>Course: {{ $course->title ?? 'N/A' }}</p>
    <table>
        <thead>
            <tr>
                <th>Criteria</th>
                <th>Rating</th>
                <th>Comments</th>
            </tr>
        </thead>
        <tbody>
            @foreach($evaluations as $evaluation)
            <tr>
                <td>{{ $evaluation->criteria }}</td>
                <td>{{ $evaluation->rating }}</td>
                <td>{{ $evaluation->comments }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>