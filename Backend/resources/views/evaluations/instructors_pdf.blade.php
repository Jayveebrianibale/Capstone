<!DOCTYPE html>
<html>
<head>
    <title>Instructor Evaluation Results</title>
    <style>
        @page {
            margin: 20px;
            size: A4 landscape;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 10px;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            margin-bottom: 15px;
        }
        .header h2 {
            margin: 0;
            padding: 0;
            font-size: 16px;
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 0 auto;
            page-break-inside: auto;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
            word-wrap: break-word;
        }
        th {
            background-color: #1F3463;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .percentage {
            font-weight: bold;
            color: #2e7d32;
        }
        .text-left {
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Instructor Evaluation Results</h2>
        <small>Generated on: {{ now()->setTimezone('Asia/Manila')->format('F j, Y \a\t h:i A') }}</small>
    </div>
    
    @if(count($data) > 0)
        <table>
            <thead>
                <tr>
                    <th width="5%">ID</th>
                    <th width="15%">Name</th>
                    <th width="20%">Email</th>
                    @for ($i = 1; $i <= 9; $i++)
                        <th width="4%">Q{{ $i }}</th>
                    @endfor
                    {{-- <th width="20%">Comments</th> --}}
                    <th width="8%">Percentage</th>
                    <th width="8%">Count</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($data as $instructor)
                    <tr>
                        <td>{{ $instructor['ID'] }}</td>
                        <td class="text-left">{{ $instructor['Name'] }}</td>
                        <td>{{ $instructor['Email'] }}</td>
                        @for ($i = 1; $i <= 9; $i++)
                            <td>{{ $instructor['Qn'.$i] ?? '-' }}</td>
                        @endfor
                        {{-- <td class="text-left small-text">{{ $instructor['Comments'] }}</td> --}}
                        <td class="percentage">{{ $instructor['Percentage'] }}%</td>
                        <td>{{ $instructor['Evaluation Count'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div class="no-data">
            <p>No instructor evaluation data found</p>
        </div>
    @endif
</body>
</html>
