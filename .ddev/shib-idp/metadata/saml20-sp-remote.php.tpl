<?php
// #ddev-generated
/**
 * DDEV-only SP registration: trust the app container's Shibboleth SP.
 * ${SP_HOSTNAME} is substituted by entrypoint.sh from the DDEV project hostname.
 */
$metadata['https://${SP_HOSTNAME}/shibboleth'] = [
    'AssertionConsumerService' => [
        [
            'Binding' => 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
            'Location' => 'https://${SP_HOSTNAME}/Shibboleth.sso/SAML2/POST',
            'index' => 1,
        ],
    ],
    'SingleLogoutService' => [
        [
            'Binding' => 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
            'Location' => 'https://${SP_HOSTNAME}/Shibboleth.sso/SLO/Redirect',
        ],
    ],
    // Dev SP: no certificate registered, so never require signatures
    // (the SP is configured with signing="false" to match).
    'validate.authnrequest' => false,
    'validate.logout' => false,
];
