#!/usr/bin/env bash
#ddev-generated
# DDEV-only post-start hook: wait until shibd-wrapper.sh has rendered the
# project-specific /etc/shibboleth config (Apache booted with the package
# default), then gracefully reload Apache so mod_shib picks up the real config.
for _ in $(seq 1 120); do
    [ -f /tmp/shibd/config-ready ] && break
    sleep 1
done

# Canonicalize the server URL inside DDEV's generated vhosts (they have no
# ServerName): TLS terminates at the router, Apache sees http on :80, and
# without this mod_shib computes ...:80 URLs and rejects the SAML POST
# ("delivered to incorrect server URL"). Standard SP-behind-proxy recipe.
HOST="${DDEV_HOSTNAME%%,*}"
SITE=/etc/apache2/sites-enabled/apache-site.conf
if [ -n "$HOST" ] && [ -f "$SITE" ] && ! grep -q "ServerName https://${HOST}:443" "$SITE"; then
    sudo sed -i "s#^<VirtualHost \(.*\)>#<VirtualHost \1>\n    ServerName https://${HOST}:443#" "$SITE"
fi

if [ ! -f /etc/shibboleth/idp-metadata.xml ]; then
    echo "shibboleth-auth: WARNING: IdP metadata missing; logins will fail (try 'ddev restart')" >&2
fi

sudo apachectl -k graceful >/dev/null 2>&1 || sudo service apache2 reload >/dev/null 2>&1 || true
echo "shibboleth-auth: Apache reloaded with local Shibboleth SP config"
