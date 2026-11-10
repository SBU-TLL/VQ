<!-- #ddev-generated -->
<SPConfig xmlns="urn:mace:shibboleth:3.0:native:sp:config"
          xmlns:conf="urn:mace:shibboleth:3.0:native:sp:config"
          clockSkew="180">
    <!--
      DDEV-only Shibboleth SP configuration template.
      Rendered at container start by .ddev/shib/shibd-wrapper.sh, which
      substitutes ${SP_HOSTNAME} with the project's DDEV hostname.
      The IdP is the bundled test IdP container (see docker-compose.shib-idp.yaml).
    -->

    <!-- Socket in /tmp so shibd can run as the non-root DDEV web user. -->
    <UnixListener address="/tmp/shibd/shibd.sock"/>

    <!-- signing=false: the SP keypair is generated per-container, so the test
         IdP has no SP certificate on file; a signed LogoutRequest makes
         SimpleSAMLphp error with "Missing certificate in metadata". Unsigned
         messages are fine for the dev IdP (validate.* false on its side). -->
    <ApplicationDefaults entityID="https://${SP_HOSTNAME}/shibboleth"
                         REMOTE_USER="eppn cn mail persistent-id targeted-id"
                         signing="false" encryption="false"
                         metadataAttributePrefix="Meta-">

        <!--
          handlerSSL is false because TLS terminates at the DDEV router and
          Apache sees plain http; ShibURLScheme https (Apache conf) makes all
          generated URLs https. checkAddress off: Docker NAT changes addresses.
        -->
        <Sessions lifetime="28800" timeout="3600" relayState="ss:mem"
                  checkAddress="false" handlerSSL="false" cookieProps="https"
                  redirectLimit="none">

            <!-- forceAuthn: always show the IdP login form for a new app
                 session, so switching test users (student/professor/admin)
                 is just Logout -> log in as someone else. -->
            <SSO entityID="urn:x-ddev:shib-idp" forceAuthn="true">SAML2</SSO>

            <Logout>SAML2 Local</Logout>

            <Handler type="MetadataGenerator" Location="/Metadata" signing="false"/>
            <Handler type="Status" Location="/Status" acl="127.0.0.1 ::1"/>
            <Handler type="Session" Location="/Session" showAttributeValues="true"/>
        </Sessions>

        <Errors supportContact="dev@ddev.local"
                helpLocation="/"
                styleSheet="/shibboleth-sp/main.css"/>

        <MetadataProvider type="XML" validate="false" path="idp-metadata.xml"/>

        <AttributeExtractor type="XML" validate="false" reloadChanges="true" path="attribute-map.xml"/>
        <AttributeFilter type="XML" validate="false" path="attribute-policy.xml"/>
        <AttributeResolver type="Query" subjectMatch="true"/>

        <CredentialResolver type="File" key="sp-key.pem" certificate="sp-cert.pem"/>
    </ApplicationDefaults>

    <SecurityPolicyProvider type="XML" validate="false" path="security-policy.xml"/>
    <ProtocolProvider type="XML" validate="false" reloadChanges="false" path="protocols.xml"/>
</SPConfig>