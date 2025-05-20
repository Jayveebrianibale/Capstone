<?php
$filepath = __DIR__ . '/../vendor/react/http/src/Io/ClientRequestStream.php';

if (!file_exists($filepath)) {
    echo "File not found: $filepath\n";
    exit(1);
}

$content = file_get_contents($filepath);
if (strpos($content, 'closeError(\\Throwable $error)') === false) {
    $content = str_replace(
        'closeError(\\Exception $error)',
        'closeError(\\Throwable $error)',
        $content
    );
    file_put_contents($filepath, $content);
    echo "Patch applied successfully to ClientRequestStream.php\n";
} else {
    echo "Patch already applied.\n";
}
