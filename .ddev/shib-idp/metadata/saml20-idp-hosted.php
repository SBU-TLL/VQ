<?php
// #ddev-generated
/**
 * DDEV-only hosted IdP metadata. Fixed entityID so every project's SP config
 * can reference the same IdP identifier.
 */
$metadata['urn:x-ddev:shib-idp'] = [
    'host' => '__DEFAULT__',
    'privatekey' => 'idp.key',
    'certificate' => 'idp.crt',
    'auth' => 'example-userpass',
    // Plain attribute names ("basic" format) — matched by the SP's attribute-map.xml.
    'attributes.NameFormat' => 'urn:oasis:names:tc:SAML:2.0:attrname-format:basic',
    // Sign logout messages: mod_shib rejects an unauthenticated LogoutResponse
    // ("Security of LogoutResponse not established"). The SP verifies with the
    // IdP certificate from the fetched metadata.
    'sign.logout' => true,
];
