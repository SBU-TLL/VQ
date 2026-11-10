#!/usr/bin/env bash
#ddev-generated
# DDEV-only: renders the Shibboleth SP config from templates, waits for the
# bundled test IdP's metadata, then runs shibd (the SP daemon) in the
# foreground. Started by DDEV via web_extra_daemons (config.shibboleth-auth.yaml).
set -u

CONF=/etc/shibboleth
TPL=/mnt/ddev_config/shib

HOST="${DDEV_HOSTNAME:-}"
if [ -z "$HOST" ] && [ -n "${DDEV_PRIMARY_URL:-}" ]; then
    HOST=$(printf '%s' "$DDEV_PRIMARY_URL" | sed -E 's~^https?://([^/:]+).*~\1~')
fi
HOST="${HOST%%,*}"   # first hostname if several

mkdir -p /tmp/shibd /var/log/shibboleth 2>/dev/null || true

# Dev-only self-signed SP keypair (gitignored config dir; regenerated per container).
if [ ! -f "$CONF/sp-key.pem" ]; then
    openssl req -x509 -newkey rsa:2048 -nodes -days 3650 \
        -subj "/CN=${HOST}" -keyout "$CONF/sp-key.pem" -out "$CONF/sp-cert.pem" \
        >/dev/null 2>&1
fi

export SP_HOSTNAME="$HOST"
envsubst '${SP_HOSTNAME}' < "$TPL/shibboleth2.xml.tpl" > "$CONF/shibboleth2.xml.tmp" \
    && mv "$CONF/shibboleth2.xml.tmp" "$CONF/shibboleth2.xml"
cp "$TPL/attribute-map.xml" "$TPL/attribute-policy.xml" "$CONF/"

# The IdP container generates its metadata at startup; retry until available.
ok=""
for _ in $(seq 1 90); do
    if curl -fsS -o "$CONF/idp-metadata.xml.tmp" \
            "http://shib-idp/simplesaml/module.php/saml/idp/metadata" 2>/dev/null \
       && grep -q EntityDescriptor "$CONF/idp-metadata.xml.tmp"; then
        mv "$CONF/idp-metadata.xml.tmp" "$CONF/idp-metadata.xml"
        ok=1
        break
    fi
    sleep 2
done
[ -n "$ok" ] || echo "shibd-wrapper: WARNING: could not fetch IdP metadata from http://shib-idp/" >&2

touch /tmp/shibd/config-ready
exec /usr/sbin/shibd -f -F -p /tmp/shibd/shibd.pid
