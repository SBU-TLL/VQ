<?php
// Hardened local-dev Shibboleth mock for VQ (see memory:
// shibboleth-dev-bypass-hardened-pattern). FENCED (under .ddev/, never deployed),
// FAIL-CLOSED (env flag must be local), NON-DESTRUCTIVE, NO real credentials.
// Seeds the $_SERVER Shibboleth attributes the app reads (cn=netID, plus
// mail / givenName / nickname / sn) so userCheck.php doesn't redirect to
// /Shibboleth.sso/Login and the DAL can resolve an author identity locally.
//
// Gate: activates ONLY when ENVIRONMENT or APP_ENV is explicitly local/dev.
// Defaults to "production" when unset -> the mock is inert everywhere that
// isn't an intentional dev box, even if this file somehow leaks.

$env = getenv('ENVIRONMENT');
if ($env === false || $env === '') { $env = $_SERVER['ENVIRONMENT'] ?? ''; }
if ($env === '') { $env = getenv('APP_ENV') ?: ($_SERVER['APP_ENV'] ?? 'production'); }
if (!in_array(strtolower($env), ['local', 'development', 'dev'], true)) {
    return; // PRODUCTION / unknown -> no-op; real Shibboleth is the only auth
}

$mock = [
    'cn'        => getenv('MOCK_CN')        ?: 'teststudent',
    'mail'      => getenv('MOCK_MAIL')      ?: 'teststudent@stonybrook.edu',
    'givenName' => getenv('MOCK_GIVENNAME') ?: 'Test',
    'nickname'  => getenv('MOCK_NICKNAME')  ?: 'Test',
    'sn'        => getenv('MOCK_SN')        ?: 'Student',
];

// Only fill gaps: never overwrite a value a real mod_shib may have set.
foreach ($mock as $k => $v) {
    if (empty($_SERVER[$k])) {
        $_SERVER[$k] = $v;
    }
}
