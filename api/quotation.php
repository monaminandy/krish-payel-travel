<?php

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "status" => "error",
        "message" => "Only POST requests are allowed."
    ]);

    exit;
}

$scriptURL =
    "https://script.google.com/macros/s/AKfycbz3Wq3K4Iap6_NXcXbo9l0kVEImMQ5wGN0Vs-KW1Mn6CYaeVLVQIXf3R8Q4MAqXCL6ABg/exec";

$input = file_get_contents("php://input");

if (!$input) {
    http_response_code(400);

    echo json_encode([
        "status" => "error",
        "message" => "No request data received."
    ]);

    exit;
}

$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);

    echo json_encode([
        "status" => "error",
        "message" => "Invalid JSON received from browser.",
        "jsonError" => json_last_error_msg()
    ]);

    exit;
}

$ch = curl_init($scriptURL);

curl_setopt_array($ch, [
    CURLOPT_POST => true,

    CURLOPT_POSTFIELDS => json_encode(
        $data,
        JSON_UNESCAPED_UNICODE
    ),

    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Accept: application/json"
    ],

    CURLOPT_RETURNTRANSFER => true,

    CURLOPT_FOLLOWLOCATION => true,

    CURLOPT_MAXREDIRS => 10,

    CURLOPT_TIMEOUT => 120,

    CURLOPT_CONNECTTIMEOUT => 20,

    CURLOPT_SSL_VERIFYPEER => true,

    CURLOPT_SSL_VERIFYHOST => 2
]);

$response = curl_exec($ch);

$curlError = curl_error($ch);
$curlErrno = curl_errno($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);

curl_close($ch);

if ($response === false) {

    http_response_code(502);

    echo json_encode([
        "status" => "error",
        "message" => "PHP could not connect to Google Apps Script.",
        "curlError" => $curlError,
        "curlErrno" => $curlErrno
    ]);

    exit;
}

/*
 * Check whether Apps Script actually returned JSON.
 */
$decoded = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE) {

    http_response_code(502);

    echo json_encode([
        "status" => "error",
        "message" => "Google Apps Script did not return valid JSON.",
        "appsScriptHttpCode" => $httpCode,
        "appsScriptContentType" => $contentType,
        "appsScriptResponse" => substr($response, 0, 5000),
        "jsonError" => json_last_error_msg()
    ]);

    exit;
}

/*
 * Return Apps Script JSON unchanged.
 */
http_response_code($httpCode >= 200 && $httpCode < 300 ? 200 : 502);

echo json_encode(
    $decoded,
    JSON_UNESCAPED_UNICODE
);

?>