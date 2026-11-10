<?php
// #ddev-generated
/**
 * Merge SimpleSAMLphp's shipped default config with our dev overrides and
 * write the final config.php. Usage:
 *   php build-config.php <dist-config> <overrides> <output>
 */
[$distPath, $overridesPath, $outPath] = array_slice($argv, 1);

// The dist config instantiates SimpleSAML classes; load the autoloader first.
foreach (['/var/simplesamlphp/vendor/autoload.php', '/var/simplesamlphp/src/_autoload.php'] as $autoload) {
    if (is_file($autoload)) {
        require_once $autoload;
        break;
    }
}

$config = [];
require $distPath;                      // defines $config (all defaults)
$overrides = require $overridesPath;    // returns override array
$config = array_replace($config, $overrides);

file_put_contents($outPath, "<?php\n\$config = " . var_export($config, true) . ";\n");
