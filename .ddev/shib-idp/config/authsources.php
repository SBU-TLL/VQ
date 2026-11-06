<?php
// #ddev-generated
/**
 * DDEV-only IdP auth sources: static test users with SBU-shaped Shibboleth
 * attributes. Base personas live in users-base.php; per-app identities (e.g.
 * users matching an app's hardcoded admin allowlist) live in users-app.php
 * and override base entries with the same login name.
 */

$users = require __DIR__ . '/users-base.php';
if (is_file(__DIR__ . '/users-app.php')) {
    $appUsers = require __DIR__ . '/users-app.php';
    // Replace base personas that share the same "login:password" key,
    // and drop base entries whose login name an app user redefines.
    foreach (array_keys($appUsers) as $appKey) {
        $appLogin = explode(':', $appKey, 2)[0];
        foreach (array_keys($users) as $baseKey) {
            if (explode(':', $baseKey, 2)[0] === $appLogin) {
                unset($users[$baseKey]);
            }
        }
    }
    $users = array_merge($users, $appUsers);
}

$config = [
    'admin' => [
        'core:AdminPassword',
    ],
    'example-userpass' => [
        'exampleauth:UserPass',
        'users' => $users,
    ],
];
