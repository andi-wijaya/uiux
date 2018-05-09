<?php

$phone = $_GET['phone'];
$text = $_GET['text'];

$data = [
  'phone' => $phone, // Receivers phone
  'body' => $text // Message
];
$json = json_encode($data); // Encode data to JSON

// URL for request POST /message
$url = 'https://eu2.chat-api.com/instance2611/message?token=wavhizrhcmm9x32s';

// Make a POST request
$options = stream_context_create(['http' => [
    'method'  => 'POST',
    'header'  => 'Content-type: application/json',
    'content' => $json
  ]
]);

// Send a request
$result = file_get_contents($url, false, $options);

print_r($result);

?>