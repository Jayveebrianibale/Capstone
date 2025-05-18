<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Instructor Evaluation Result</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 30px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    <tr>
                        <td align="center" style="background-color: #1F3463; padding: 20px;">
                            <h1 style="color: #ffffff; margin: 0;">Evaluation Summary</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <p style="font-size: 16px; color: #333;">Hello <strong>{{ $instructor->name }}</strong>,</p>

                            <p style="font-size: 16px; color: #333;">
                                Your evaluation results have been successfully compiled.
                            </p>

                            <p style="font-size: 16px; color: #333;">
                                <strong>Overall Rating:</strong>
                                <span style="color: #1F3463; font-weight: bold;">
                                    {{ number_format($instructor->overallRating, 2) }}%
                                </span>
                            </p>

                            <p style="font-size: 16px; color: #333;">
                                You can view or download your evaluation result by clicking the button below:
                            </p>

                            <p style="text-align: center; margin: 30px 0;">
                                <a href="{{ $pdfUrl }}" target="_blank"
                                   style="background-color: #1F3463; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                    📄 View Evaluation PDF
                                </a>
                            </p>

                            <p style="font-size: 16px; color: #333; text-align: center;">
                                or
                            </p>

                            <p style="text-align: center; margin: 20px 0;">
                                <a href="{{ route('login') }}" 
                                   style="background-color: #1F3463; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                    🔐 Login with Google to View
                                </a>
                            </p>

                            <p style="font-size: 16px; color: #333;">
                                If you have any questions, feel free to reach out.
                            </p>

                            <p style="font-size: 16px; color: #333;">Thank you,<br><strong>Evaluation System Team</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="background-color: #f0f0f0; padding: 15px; font-size: 12px; color: #888;">
                            &copy; {{ date('Y') }} Evaluation System. All rights reserved.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
