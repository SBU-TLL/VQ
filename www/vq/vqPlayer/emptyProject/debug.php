<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Ensure session cookie parameters match your environment before starting
session_start();

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Auth & Session Debugger</title>
    <style>
        body { font-family: monospace; background: #1e1e1e; color: #ddd; padding: 20px; }
        h2 { color: #4ec9b0; border-bottom: 1px solid #444; padding-bottom: 5px; margin-top: 30px; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; background: #252526; }
        th, td { border: 1px solid #3c3c3c; padding: 8px 12px; text-align: left; vertical-align: top; }
        th { background: #333; color: #9cdcfe; width: 25%; }
        pre { margin: 0; white-space: pre-wrap; word-break: break-all; }
        .empty { color: #f48771; font-style: italic; }
        .highlight { color: #ce9178; font-weight: bold; }
    </style>
</head>
<body>

    <h1>Auth State / Session Debugger</h1>

    <h2>1. PHP Session Details</h2>
    <table>
        <tr><th>Session ID</th><td><?= session_id() ?: '<span class="empty">No active session ID</span>' ?></td></tr>
        <tr><th>Session Save Path</th><td><?= htmlspecialchars(session_save_path()) ?></td></tr>
        <tr><th>Session Status</th><td><?= session_status() === PHP_SESSION_ACTIVE ? 'PHP_SESSION_ACTIVE' : session_status() ?></td></tr>
        <tr><th>$_SESSION Contents</th><td><pre><?= htmlspecialchars(print_r($_SESSION, true)) ?></pre></td></tr>
    </table>

    <h2>2. HTTP Request Cookies ($_COOKIE)</h2>
    <table>
        <?php if (!empty($_COOKIE)): ?>
            <?php foreach ($_COOKIE as $key => $val): ?>
                <tr>
                    <th><?= htmlspecialchars($key) ?></th>
                    <td><pre><?= htmlspecialchars($val) ?></pre></td>
                </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr><td colspan="2" class="empty">No cookies received in this request.</td></tr>
        <?php endif; ?>
    </table>

    <h2>3. Shibboleth Detected Attributes</h2>
    <table>
        <?php
        // Filter $_SERVER for common Shibboleth keys and headers
        $shibKeys = [
            'Shib-Session-ID', 'Shib-Identity-Provider', 'Shib-Authentication-Instant',
            'Shib-AuthnContext-Class', 'REMOTE_USER', 'AUTH_TYPE', 'HTTP_SHIB_SESSION_ID',
            'mail', 'givenName', 'sn', 'cn', 'displayName', 'eppn', 'persistent-id',
            'affiliation', 'unscoped-affiliation', 'entitlement'
        ];
        $foundShib = false;

        foreach ($_SERVER as $key => $val) {
            $isShibKey = in_array($key, $shibKeys) 
                         || stripos($key, 'shib') !== false 
                         || stripos($key, 'persistent') !== false;
            if ($isShibKey) {
                $foundShib = true;
                echo "<tr><th>" . htmlspecialchars($key) . "</th><td><span class='highlight'>" . htmlspecialchars(is_array($val) ? print_r($val, true) : $val) . "</span></td></tr>";
            }
        }
        if (!$foundShib) {
            echo "<tr><td colspan='2' class='empty'>No Shibboleth-related environment variables or headers found in \$_SERVER.</td></tr>";
        }
        ?>
    </table>

    <h2>4. Full Server Environment ($_SERVER)</h2>
    <table>
        <?php foreach ($_SERVER as $key => $val): ?>
            <tr>
                <th><?= htmlspecialchars($key) ?></th>
                <td><pre><?= htmlspecialchars(is_array($val) ? print_r($val, true) : (string)$val) ?></pre></td>
            </tr>
        <?php endforeach; ?>
    </table>

</body>
</html>