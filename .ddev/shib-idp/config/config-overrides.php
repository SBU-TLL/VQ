<?php
// #ddev-generated
/**
 * DDEV-only SimpleSAMLphp overrides (merged over the shipped defaults by
 * build-config.php at container start). Nothing here is a real secret:
 * this IdP only ever runs locally, for fake test users.
 */

$spHost = getenv('SP_HOSTNAME') ?: 'localhost';

return [
    // Absolute base URL so all generated links/redirects point at the
    // router-exposed https URL, regardless of how the request arrived.
    'baseurlpath' => getenv('IDP_BASEURL') ?: 'simplesaml/',

    'secretsalt' => 'ddev-local-test-idp-not-a-secret',
    'auth.adminpassword' => 'ddev-admin',
    'technicalcontact_email' => 'dev@ddev.local',

    'enable.saml20-idp' => true,
    'module.enable' => [
        'exampleauth' => true,
        'admin' => true,
    ],

    'trusted.url.domains' => [$spHost, $spHost . ':8999', $spHost . ':8998'],

    // TLS terminates at the DDEV router; cookies are seen over https by the browser.
    'session.cookie.secure' => true,

    'logging.handler' => 'errorlog',
    'showerrors' => true,
    'errorreporting' => true,
];
