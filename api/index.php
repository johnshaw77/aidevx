<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$response = [
    'status' => 'success',
    'message' => 'AI DevX API 運行正常',
    'version' => '1.0.0',
    'timestamp' => date('Y-m-d H:i:s'),
    'server' => [
        'ip' => $_SERVER['SERVER_ADDR'] ?? '152.42.160.234',
        'domain' => 'api.aidevx.pro'
    ],
    'endpoints' => [
        'GET /api/' => '獲取 API 狀態',
        'POST /api/ai' => 'AI 模型推理',
        'GET /api/models' => '獲取可用模型列表'
    ]
];

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
