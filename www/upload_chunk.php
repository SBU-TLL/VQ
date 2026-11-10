<?php
declare(strict_types=1);

header('Content-Type: application/json');

// Define temp and final upload directories
// $uploadDir = sys_get_temp_dir() . '/chunk_uploads/';
// $finalDir  = sys_get_temp_dir() . '/completed_uploads/';

$uploadDir = 'chunk_uploads/';
$finalDir  = 'completed_uploads/';


// Basic input validation
$fileId      = preg_replace('/[^a-zA-Z0-9_\-]/', '', $_POST['file_id'] ?? '');
$chunkIndex  = filter_var($_POST['chunk_index'] ?? null, FILTER_VALIDATE_INT);
$totalChunks = filter_var($_POST['total_chunks'] ?? null, FILTER_VALIDATE_INT);
$fileName    = basename($_POST['file_name'] ?? 'upload.bin');

if (!$fileId || $chunkIndex === false || $totalChunks === false || !isset($_FILES['file_chunk'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid parameters.']);
    exit;
}

if ($_FILES['file_chunk']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Chunk upload failed on server.']);
    exit;
}

// Save the incoming slice to its numbered chunk file
$chunkFile = sprintf('%s/%s.part_%05d', $uploadDir, $fileId, $chunkIndex);
if (!move_uploaded_file($_FILES['file_chunk']['tmp_name'], $chunkFile)) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to store chunk.']);
    exit;
}

// Check if this was the last chunk
if ($chunkIndex === ($totalChunks - 1)) {
    // Verify all chunks exist before assembling
    for ($i = 0; $i < $totalChunks; $i++) {
        $part = sprintf('%s/%s.part_%05d', $uploadDir, $fileId, $i);
        if (!file_exists($part)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => "Missing chunk {$i}."]);
            exit;
        }
    }

    // Assemble the complete file
    $finalPath = $finalDir . $fileId . '_' . $fileName;
    $finalHandle = fopen($finalPath, 'wb');

    if (!$finalHandle) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to initialize final file.']);
        exit;
    }

    for ($i = 0; $i < $totalChunks; $i++) {
        $part = sprintf('%s/%s.part_%05d', $uploadDir, $fileId, $i);
        $chunkHandle = fopen($part, 'rb');
        stream_copy_to_stream($chunkHandle, $finalHandle);
        fclose($chunkHandle);
        unlink($part); // Clean up slice
    }

    fclose($finalHandle);

    echo json_encode([
        'status' => 'complete',
        'message' => 'File successfully uploaded and merged.',
        'file_name' => $fileName,
        'final_size' => filesize($finalPath),
        'saved_to' => $finalPath,
    ]);
    exit;
}

// Intermediate chunk received
echo json_encode([
    'status' => 'in_progress',
    'chunk' => $chunkIndex + 1,
    'total' => $totalChunks,
]);