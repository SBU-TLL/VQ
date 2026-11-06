#!/usr/bin/env bash
#ddev-generated
# Renders SimpleSAMLphp config for this DDEV project (hostname comes from the
# environment set in docker-compose.shib-idp.yaml), then starts Apache.
set -euo pipefail

SSP=/var/simplesamlphp
CFG=/opt/idp-config

: "${SP_HOSTNAME:?SP_HOSTNAME env var is required}"
: "${IDP_BASEURL:?IDP_BASEURL env var is required}"
export SP_HOSTNAME IDP_BASEURL

# Metadata: who the SP (the app container) is.
envsubst '${SP_HOSTNAME}' \
    < "$CFG/metadata/saml20-sp-remote.php.tpl" \
    > "$SSP/metadata/saml20-sp-remote.php"
cp "$CFG/metadata/saml20-idp-hosted.php" "$SSP/metadata/saml20-idp-hosted.php"

# Config: merge SimpleSAMLphp's shipped default config with our overrides.
dist=""
for candidate in "$SSP/config/config.php.dist" "$SSP/config-templates/config.php"; do
    if [ -f "$candidate" ]; then
        dist="$candidate"
        break
    fi
done
if [ -z "$dist" ]; then
    echo "idp-entrypoint: no SimpleSAMLphp config template found" >&2
    exit 1
fi
php "$CFG/build-config.php" "$dist" "$CFG/config-overrides.php" "$SSP/config/config.php"

cp "$CFG/authsources.php" "$CFG/users-base.php" "$SSP/config/"
if [ -f "$CFG/users-app.php" ]; then
    cp "$CFG/users-app.php" "$SSP/config/"
fi

exec apache2-foreground
