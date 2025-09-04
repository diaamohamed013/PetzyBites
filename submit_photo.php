<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');

$db_host = 'localhost';
$db_name = 'u200136222_petzybites';
$db_user = 'u200136222_PetzyBites';
$db_pass = '10102020Aa@';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!isset($_FILES["petImage"]) || $_FILES["petImage"]["error"] !== UPLOAD_ERR_OK) {
            throw new Exception("لم يتم رفع أي صورة أو حدث خطأ أثناء الرفع.");
        }

        $target_dir = "uploads/";
        if (!file_exists($target_dir)) {
            mkdir($target_dir, 0777, true);
        }

        $file_extension = strtolower(pathinfo($_FILES["petImage"]["name"], PATHINFO_EXTENSION));
        $new_filename = uniqid() . '.' . $file_extension;
        $target_file = $target_dir . $new_filename;

        $valid_types = array('jpg', 'jpeg', 'png', 'gif');
        if (!in_array($file_extension, $valid_types)) {
            throw new Exception("عذراً، فقط ملفات JPG و JPEG و PNG و GIF مسموح بها.");
        }

        if ($_FILES["petImage"]["size"] > 5000000) {
            throw new Exception("عذراً، حجم الملف كبير جداً. الحد الأقصى هو 5 ميجابايت.");
        }

        if (file_exists($target_file)) {
            throw new Exception("عذراً، حدث خطأ أثناء رفع الملف. يرجى المحاولة مرة أخرى.");
        }

        $check = getimagesize($_FILES["petImage"]["tmp_name"]);
        if ($check === false) {
            throw new Exception("الملف المرفوع ليس صورة صالحة.");
        }

        if (move_uploaded_file($_FILES["petImage"]["tmp_name"], $target_file)) {
            $relative_path = $target_file;
            
            $stmt = $pdo->prepare("INSERT INTO pet_submissions (
                species, pet_name, pet_birthday, description, album, 
                full_name, mobile_number, email, governorate, image_path
            ) VALUES (
                :species, :pet_name, :pet_birthday, :description, :album,
                :full_name, :mobile_number, :email, :governorate, :image_path
            )");

            $stmt->execute([
                ':species' => $_POST['species'],
                ':pet_name' => $_POST['petName'],
                ':pet_birthday' => $_POST['petBirthday'],
                ':description' => $_POST['description'],
                ':album' => $_POST['album'],
                ':full_name' => $_POST['fullName'],
                ':mobile_number' => $_POST['mobileNumber'],
                ':email' => $_POST['email'],
                ':governorate' => $_POST['governorate'],
                ':image_path' => $relative_path
            ]);

            $to = "dr.refaee@yahoo.com"; 
            $subject = "New Pet Submission - " . $_POST['petName'];
            
            $message = "New Pet Submission Details:\n\n";
            $message .= "Species: " . $_POST['species'] . "\n";
            $message .= "Pet Name: " . $_POST['petName'] . "\n";
            $message .= "Pet Birthday: " . $_POST['petBirthday'] . "\n";
            $message .= "Description: " . $_POST['description'] . "\n";
            $message .= "Album: " . $_POST['album'] . "\n";
            $message .= "Owner Name: " . $_POST['fullName'] . "\n";
            $message .= "Mobile Number: " . $_POST['mobileNumber'] . "\n";
            $message .= "Email: " . $_POST['email'] . "\n";
            $message .= "Governorate: " . $_POST['governorate'] . "\n";
            
            $headers = "From: " . $_POST['email'] . "\r\n";
            $headers .= "Reply-To: " . $_POST['email'] . "\r\n";
            $headers .= "X-Mailer: PHP/" . phpversion();

            mail($to, $subject, $message, $headers);

            $response = [
                'success' => true, 
                'message' => 'تم رفع الصورة بنجاح!',
                'image_path' => $relative_path
            ];
            echo json_encode($response);
            exit;
        } else {
            if (file_exists($target_file)) {
                unlink($target_file);
            }
            throw new Exception("عذراً، حدث خطأ أثناء رفع الملف.");
        }
    }
} catch (Exception $e) {
    if (isset($target_file) && file_exists($target_file)) {
        unlink($target_file);
    }
    
    http_response_code(500);
    $response = [
        'success' => false, 
        'message' => $e->getMessage()
    ];
    echo json_encode($response);
    exit;
}
?> 