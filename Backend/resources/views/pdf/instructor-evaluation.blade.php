email<!DOCTYPE html>
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
            border-bottom: 3px solid #1F3463;
            padding-bottom: 15px;
            margin-bottom: 25px;
            text-align: center;
        }
        .school-header {
            color: #1F3463;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .report-title {
            color: #1F3463;
            font-size: 24px;
            margin: 15px 0 5px 0;
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
            color: #1F3463;
            margin: 5px 0;
        }
        .metric-value.excellent, .metric-value.good, .metric-value.needs-improvement {
            color: #1F3463;
        }
        .section-title {
            font-size: 18px;
            color: #1F3463;
            border-bottom: 2px solid #1F3463;
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
            background: #1F3463;
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
            text-align: center;
            color: #1F3463;
        }
        .rating-cell.excellent {
            color: #1F3463; /* green-500 */
        }
        .rating-cell.good {
            color: #1F3463; /* yellow-500 */
        }
        .rating-cell.needs-improvement {
            color: #1F3463; /* red-500 */
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
        <div class="school-header">
            LA VERDAD CHRISTIAN COLLEGE INC.<br>
            Mac Arthur Highway, Sampaloc Apalit, Pampanga 2016
        </div>
        <div class="report-title">EVALUATION REPORT</div>
        <div class="report-info">
            <strong>Instructor:</strong> {{ $instructor->name }}<br>
            Generated: {{ now()->setTimezone('Asia/Manila')->format('F j, Y') }}
        </div>
    </div>

    <div class="metadata">
        <div class="metric-card">
            <div class="metric-label">Overall Rating</div>
            <div class="metric-value {{ $instructor->overallRating >= 90 ? 'excellent' : ($instructor->overallRating >= 75 ? 'good' : 'needs-improvement') }}">
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
                        $ratingClass = $rating >= 90 ? 'excellent' : ($rating >= 75 ? 'good' : 'needs-improvement');
                    @endphp
                    <td class="rating-cell {{ $ratingClass }}" style="text-align: center;">
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
        This report was generated automatically on {{ now()->setTimezone('Asia/Manila')->format('F j, Y \a\t h:i A') }}. 
        For any inquiries, please contact the administration office.
    </div>
</body>
</html>