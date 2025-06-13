<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instructor Evaluation Results</title>
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
        Your instructor evaluation results are now available. Overall rating: {{ number_format($instructor->overallRating, 2) }}%.
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
                            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Instructor Evaluation Summary</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px; color: #000000;">
                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #000000;">Dear <strong style="color: #000000;">{{ $instructor->name }}</strong>,</p>

                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #000000;">
                                Your evaluation results have been compiled and are now available for review.
                            </p>
                            
                            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
                                <p style="margin: 0; font-size: 16px; color: #000000;">
                                    <strong style="color: #000000;">Overall Rating:</strong>
                                    <span style="color: #000000; font-weight: bold; font-size: 18px;">
                                        {{ number_format($instructor->overallRating, 2) }}%
                                    </span>
                                </p>
                            </div>

                            @if(!empty($comments))
                            <!-- <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
                                <p style="margin: 0 0 15px 0; font-size: 16px; color: #000000;">
                                    <strong style="color: #000000;">Student Comments:</strong>
                                </p>
                                <div style="margin-left: 15px;">
                                    @foreach($comments as $comment)
                                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #000000; font-style: italic;">
                                            "{{ $comment }}"
                                        </p>
                                    @endforeach
                                </div>
                            </div> -->
                            @endif

                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #000000;">
                                You may access your detailed evaluation report using one of the following methods:
                            </p>
                            
                            <!-- Primary CTA -->
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $pdfUrl }}" target="_blank" class="button">
                                            View Evaluation Report (PDF)
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="text-align: center; margin: 15px 0; font-size: 14px; color: #000000;">or</p>
                            
                            <!-- Secondary CTA -->
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ route('login') }}" class="button" style="background-color: #2d4373;">
                                            Sign in to Teachers' Performance Evaluation System
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <div class="divider"></div>
                            
                            <p style="margin: 20px 0 0 0; font-size: 15px; color: #000000;">
                                If you have any questions about your evaluation results, please don't hesitate to contact our support team.
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
                                This email was sent to you as part of our instructor evaluation process.
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