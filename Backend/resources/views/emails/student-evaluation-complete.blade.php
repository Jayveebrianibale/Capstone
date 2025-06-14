<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Evaluation Completion Confirmation</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style type="text/css">
        /* Client-specific styles */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        
        /* Reset styles */
        body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
        
        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
        
        /* Main styles */
        body {
            font-family: 'Inter', Arial, sans-serif;
            background-color: #f4f4f4;
            color: #000000;
            line-height: 1.6;
        }
        
        .button {
            background-color: #1F3463;
            color: #ffffff !important;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            display: inline-block;
            margin: 10px 0;
            font-family: 'Inter', Arial, sans-serif;
        }
        
        .divider {
            border-top: 1px solid #e0e0e0;
            margin: 20px 0;
        }

        .no-reply {
            color: #666666;
            font-size: 12px;
            font-style: italic;
            margin-top: 20px;
            text-align: center;
            font-family: 'Inter', Arial, sans-serif;
        }

        h1 {
            font-family: 'Inter', Arial, sans-serif;
            font-weight: 700;
        }

        p {
            font-family: 'Inter', Arial, sans-serif;
        }

        strong {
            font-family: 'Inter', Arial, sans-serif;
            font-weight: 600;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; color: #000000;">
    <!-- Preheader text (hidden in client but visible in inbox preview) -->
    <div style="display: none; max-height: 0px; overflow: hidden;">
        You have successfully completed your instructor evaluations for {{ $schoolYear }} - {{ $semester }}.
    </div>
    
    <!-- Email container -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 30px 10px;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 900px; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #1F3463; padding: 25px 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Evaluation Completion Confirmation</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px; color: #000000;">
                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #000000;">Dear <strong style="color: #000000;">{{ $studentName }}</strong>,</p>

                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #000000;">
                                Thank you for completing your instructor evaluations for <strong>{{ $schoolYear }} - {{ $semester }}</strong>. Your feedback is valuable and will help improve the quality of education at La Verdad Christian College.
                            </p>
                            
                            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
                                <p style="margin: 0; font-size: 16px; color: #000000;">
                                    <strong style="color: #000000;">Evaluation Summary:</strong>
                                </p>
                                <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #000000;">
                                    <li>School Year: {{ $schoolYear }}</li>
                                    <li>Semester: {{ $semester }}</li>
                                    <li>Number of Instructors Evaluated: {{ $instructorCount }}</li>
                                    <li>Submission Date: {{ $submissionDate }}</li>
                                </ul>
                            </div>

                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #000000;">
                                Your evaluations have been successfully recorded in our system. The feedback you provided will be used to help our instructors improve their teaching methods.
                            </p>
                            
                            <!-- CTA -->
                            <!-- <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ route('login') }}" class="button">
                                            Return to Evaluation System
                                        </a>
                                    </td>
                                </tr>
                            </table> -->
                            
                            <div class="divider"></div>
                            
                            <p style="margin: 20px 0 0 0; font-size: 15px; color: #000000;">
                                If you have any questions about the evaluation process or need assistance, please don't hesitate to contact our support team.
                            </p>
                            
                            <p style="margin: 20px 0 0 0; font-size: 16px; color: #000000;">
                                Best regards,<br>
                                <strong style="color: #000000;">The Evaluation Committee</strong><br>
                                <span style="color: #000000; font-size: 14px;">La Verdad Christian College</span>
                            </p>

                            <p class="no-reply">
                                This is an automated message. Please do not reply to this email.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #f0f0f0; padding: 20px; font-size: 12px; color: #000000;">
                            &copy; {{ now()->setTimezone('Asia/Manila')->format('Y') }} LVCC Evaluation System. All rights reserved.<br>
                            <p style="margin: 5px 0 0 0; font-size: 11px; color: #000000;">
                                This email confirms your participation in our instructor evaluation process.
                            </p>
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
    </table>
</body>
</html> 