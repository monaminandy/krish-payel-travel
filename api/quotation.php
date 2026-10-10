<?php

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    http_response_code(405);

    echo json_encode([
        "status" => "error",
        "message" => "Only POST requests are allowed."
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| GOOGLE APPS SCRIPT WEB APP URL
|--------------------------------------------------------------------------
*/

$scriptURL =
    "https://script.google.com/macros/s/AKfycbz3Wq3K4Iap6_NXcXbo9l0kVEImMQ5wGN0Vs-KW1Mn6CYaeVLVQIXf3R8Q4MAqXCL6ABg/exec";


/*
|--------------------------------------------------------------------------
| READ REQUEST
|--------------------------------------------------------------------------
*/

$input = file_get_contents("php://input");

if ($input === false || $input === "") {

    http_response_code(400);

    echo json_encode([
        "status" => "error",
        "message" => "No request data received."
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| VALIDATE JSON
|--------------------------------------------------------------------------
*/

$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {

    http_response_code(400);

    echo json_encode([
        "status" => "error",
        "message" => "Invalid JSON data."
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| PREPARE JSON
|--------------------------------------------------------------------------
*/

$jsonData = json_encode($data);

if ($jsonData === false) {

    http_response_code(400);

    echo json_encode([
        "status" => "error",
        "message" => "Unable to encode request data."
    ]);

    exit;
}

$contentLength = strlen($jsonData);


/*
|--------------------------------------------------------------------------
| SEND POST TO GOOGLE APPS SCRIPT
|--------------------------------------------------------------------------
*/

$ch = curl_init($scriptURL);

curl_setopt_array($ch, [

    CURLOPT_POST => true,

    CURLOPT_POSTFIELDS => $jsonData,

    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Accept: application/json",
        "Content-Length: " . $contentLength
    ],

    CURLOPT_RETURNTRANSFER => true,

    /*
     * Google Apps Script returns 302.
     * Follow it while preserving POST.
     */
    CURLOPT_FOLLOWLOCATION => true,

    CURLOPT_MAXREDIRS => 10,

    CURLOPT_POSTREDIR => 7,

    CURLOPT_CONNECTTIMEOUT => 30,

    CURLOPT_TIMEOUT => 120,

    CURLOPT_SSL_VERIFYPEER => true,

    CURLOPT_SSL_VERIFYHOST => 2

]);


$response = curl_exec($ch);

$curlError = curl_error($ch);

$curlErrno = curl_errno($ch);

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);


/*
|--------------------------------------------------------------------------
| CURL ERROR
|--------------------------------------------------------------------------
*/

if ($response === false || $curlError) {

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
|--------------------------------------------------------------------------
| GOOGLE ERROR
|--------------------------------------------------------------------------
*/

if ($httpCode < 200 || $httpCode >= 300) {

    http_response_code(502);

    echo json_encode([
        "status" => "error",
        "message" => "Google Apps Script returned an HTTP error.",
        "httpCode" => $httpCode,
        "response" => $response
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| SUCCESS
|--------------------------------------------------------------------------
*/

echo $response;

?>