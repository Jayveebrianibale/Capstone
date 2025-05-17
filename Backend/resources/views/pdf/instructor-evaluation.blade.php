<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Instructor Evaluation Report</title>
    <style>
        body { 
            font-family: 'Helvetica', Arial, sans-serif; 
            font-size: 14px;
            line-height: 1.6;
            padding: 30px 40px;
        }
        .header {
            border-bottom: 3px solid #2c3e50;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        .header h1 {
            color: #2c3e50;
            font-size: 24px;
            margin: 0 0 5px 0;
            text-align: center;
            padding-bottom: 10px;
        }
        .metadata {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 25px;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
        }
        .metric-card {
            background: #ffffff;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            padding: 15px;
            text-align: center;
        }
        .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #3498db;
            margin: 5px 0;
        }
        .section-title {
            font-size: 18px;
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 8px;
            margin: 25px 0 15px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            background: white;
        }
        th {
            background: #2c3e50;
            color: white;
            padding: 12px;
            text-align: left;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #dee2e6;
        }
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        .rating-cell {
            font-weight: bold;
            color: #27ae60;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #dee2e6;
            color: #7f8c8d;
            font-size: 12px;
            text-align: center;
        }

        /* Hide the year level metric card visually */
        .metric-card.year-level {
            display: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Instructor Evaluation Report</h1>
        <div class="report-info">
            <strong>Instructor:</strong> {{ $instructor->name }}<br>
            Generated: {{ date('F j, Y') }}<br>
            Institution: La Verdad Cristian College<br>
        </div>
    </div>

    <div class="metadata">
        <div class="metric-card">
            <div class="metric-label">Overall Rating</div>
            <div class="metric-value">
                @if(isset($instructor->overallRating))
                    {{ number_format($instructor->overallRating, 1) }}%
                @else
                    N/A
                @endif
            </div>
        </div>
        
        @php
            function ordinal($number) {
                $ends = ['th','st','nd','rd','th','th','th','th','th','th'];
                if (($number % 100) >= 11 && ($number % 100) <= 13)
                    return $number . 'th';
                else
                    return $number . $ends[$number % 10];
            }
        @endphp

        <div class="metric-card year-level">
            <div class="metric-label">Year Level Handle</div>
            <div class="metric-value">
                @if(isset($yearLevel) && is_numeric($yearLevel))
                    {{ ordinal($yearLevel) }} Year
                @else
                    N/A
                @endif
            </div>
        </div>
    </div>

    <div class="section-title">Evaluation Details</div>
    <table>
        <thead>
            <tr>
                <th style="width: 5%">#</th>
                <th style="width: 20%">Category</th>
                <th style="width: 55%">Question</th>
                <th style="width: 20%; text-align: center;">Rating</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($questions as $index => $question)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $question->category }}</td>
                    <td>{{ $question->question }}</td>
                    @php
                        $ratingKey = 'q' . ($index + 1);
                        $rating = $ratings[$ratingKey] ?? null;
                    @endphp
                    <td class="rating-cell" style="text-align: center;">
                        @if($rating !== null)
                            {{ number_format($rating, 1) }}
                        @else
                            -
                        @endif
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        This report was generated automatically on {{ date('F j, Y \a\t H:i') }}. 
        For any inquiries, please contact the administration office.
    </div>
</body>
</html>
