<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Instructor Evaluation PDF</title>
    <style>
        body { font-family: sans-serif; font-size: 13px; }
        h2 { margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #000; padding: 8px; }
        th { background-color: #f2f2f2; }
        .section-title { margin-top: 30px; font-weight: bold; font-size: 16px; }
        .info-section { margin-bottom: 20px; }
        .info-item { margin-bottom: 5px; }
    </style>
</head>
<body>
    <h2>{{ $instructor->name }} - Evaluation Report</h2>

    <div class="info-section">
        <div class="info-item">
            <strong>Year Level:</strong> 
            @if(isset($yearLevel) && is_numeric($yearLevel))
                @php
                    $yearLevel = (int)$yearLevel;
                    $suffix = 'th';
                    switch ($yearLevel) {
                        case 1:
                            $suffix = 'st';
                            break;
                        case 2:
                            $suffix = 'nd';
                            break;
                        case 3:
                            $suffix = 'rd';
                            break;
                    }
                @endphp
                {{ $yearLevel }}{{ $suffix }} Year
            @else
                Not specified
            @endif
        </div>
        <div class="info-item"><strong>Overall Rating:</strong> {{ number_format($instructor->overallRating, 2) }}%</div>
    </div>

    <div class="section-title">Detailed Ratings</div>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Category</th>
                <th>Question</th>
                <th>Rating</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($questions as $index => $question)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $question->category }}</td>
                    <td>{{ $question->question }}</td>
                    <td>
                        {{ isset($ratings['q'.($index + 1)]) ? number_format($ratings['q'.($index + 1)], 2) : '-' }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="section-title">Student Comments</div>
    <p>{{ $comments }}</p>
</body>
</html>