#ddev-generated
# DDEV-only test SAML IdP (SimpleSAMLphp) for local Shibboleth logins.
# Built locally (arm64/amd64-native); never deployed anywhere.
FROM php:8.3-apache

ARG SSP_VERSION=2.3.7

RUN apt-get update \
    && apt-get install -y --no-install-recommends libicu-dev gettext-base \
    && docker-php-ext-install intl \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL -o /tmp/ssp.tar.gz \
      "https://github.com/simplesamlphp/simplesamlphp/releases/download/v${SSP_VERSION}/simplesamlphp-${SSP_VERSION}-full.tar.gz" \
    && mkdir -p /var/simplesamlphp \
    && tar -xzf /tmp/ssp.tar.gz -C /var/simplesamlphp --strip-components=1 \
    && rm /tmp/ssp.tar.gz

# Dev-only IdP signing key, baked into the image (not a secret).
RUN mkdir -p /var/simplesamlphp/cert \
    && openssl req -x509 -newkey rsa:2048 -nodes -days 3650 \
       -subj "/CN=ddev-shib-idp" \
       -keyout /var/simplesamlphp/cert/idp.key \
       -out /var/simplesamlphp/cert/idp.crt \
    && chmod 644 /var/simplesamlphp/cert/idp.key

# Runtime dirs SimpleSAMLphp (www-data) must be able to write.
RUN mkdir -p /var/cache/simplesamlphp /var/simplesamlphp/data /var/simplesamlphp/log \
    && chown -R www-data:www-data /var/cache/simplesamlphp /var/simplesamlphp/data /var/simplesamlphp/log

RUN printf '%s\n' \
      'Alias /simplesaml /var/simplesamlphp/public' \
      '<Directory /var/simplesamlphp/public>' \
      '    Require all granted' \
      '    AllowOverride None' \
      '</Directory>' \
      > /etc/apache2/conf-enabled/simplesaml.conf

COPY config/ /opt/idp-config/
COPY metadata/ /opt/idp-config/metadata/
COPY entrypoint.sh /usr/local/bin/idp-entrypoint.sh
RUN chmod +x /usr/local/bin/idp-entrypoint.sh

ENTRYPOINT ["idp-entrypoint.sh"]