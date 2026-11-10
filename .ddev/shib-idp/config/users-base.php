<?php
// #ddev-generated
/**
 * Generic SBU-shaped test personas, shared by every repo that bundles this
 * test IdP. Login as "<name>" with password "<name>pass" on the IdP form.
 * All identities are obviously fake and namespaced to test.* — except where
 * a repo's users-app.php overrides a persona to match the app's own
 * hardcoded allowlists (roles are computed by app code from identity).
 */
return [
    'student:studentpass' => [
        'cn' => ['teststudent'],
        'eppn' => ['test.student@stonybrook.edu'],
        'mail' => ['test.student@stonybrook.edu'],
        'givenName' => ['Test'],
        'nickname' => ['Test'],
        'sn' => ['Student'],
        'displayName' => ['Test Student'],
        'affiliation' => ['student@stonybrook.edu'],
    ],
    'ta:tapass' => [
        'cn' => ['testta'],
        'eppn' => ['test.ta@stonybrook.edu'],
        'mail' => ['test.ta@stonybrook.edu'],
        'givenName' => ['Test'],
        'nickname' => ['Test'],
        'sn' => ['TA'],
        'displayName' => ['Test TA'],
        'affiliation' => ['employee@stonybrook.edu'],
    ],
    'professor:professorpass' => [
        'cn' => ['testprof'],
        'eppn' => ['test.professor@stonybrook.edu'],
        'mail' => ['test.professor@stonybrook.edu'],
        'givenName' => ['Test'],
        'nickname' => ['Test'],
        'sn' => ['Professor'],
        'displayName' => ['Test Professor'],
        'affiliation' => ['faculty@stonybrook.edu'],
    ],
    'admin:adminpass' => [
        'cn' => ['testadmin'],
        'eppn' => ['test.admin@stonybrook.edu'],
        'mail' => ['test.admin@stonybrook.edu'],
        'givenName' => ['Test'],
        'nickname' => ['Test'],
        'sn' => ['Admin'],
        'displayName' => ['Test Admin'],
        'affiliation' => ['staff@stonybrook.edu'],
    ],
];
