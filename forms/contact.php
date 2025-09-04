<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (empty($_POST['name']) || empty($_POST['email']) || empty($_POST['subject']) || empty($_POST['message'])) {
            throw new Exception('جميع الحقول مطلوبة');
        }

        $name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
        $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
        $subject = filter_var($_POST['subject'], FILTER_SANITIZE_STRING);
        $message = filter_var($_POST['message'], FILTER_SANITIZE_STRING);

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('البريد الإلكتروني غير صالح');
        }

        $to = "dr.refaee@yahoo.com";
        $email_subject = "New Contact Form Submission: " . $subject;
        
        $email_body = "You have received a new message from your website contact form.\n\n";
        $email_body .= "Here are the details:\n\n";
        $email_body .= "Name: " . $name . "\n";
        $email_body .= "Email: " . $email . "\n";
        $email_body .= "Subject: " . $subject . "\n";
        $email_body .= "Message:\n" . $message . "\n";

        $headers = "From: " . $email . "\r\n";
        $headers .= "Reply-To: " . $email . "\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        if (mail($to, $email_subject, $email_body, $headers)) {
            $response = [
                'success' => true,
                'message' => 'تم إرسال رسالتك بنجاح!'
            ];
        } else {
            throw new Exception('حدث خطأ أثناء إرسال الرسالة');
        }

    } catch (Exception $e) {
        $response = [
            'success' => false,
            'message' => $e->getMessage()
        ];
    }

    echo json_encode($response);
    exit;
}
?> 