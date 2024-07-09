<template><div><h1 id="kafka-集群安全认证机制的实现" tabindex="-1"><a class="header-anchor" href="#kafka-集群安全认证机制的实现"><span>kafka 集群安全认证机制的实现</span></a></h1>
<p>Kafka 提供了多种安全认证机制来保护数据传输的安全性，包括加密、身份认证和授权。这些机制确保
了 Kafka 集群的通信安全和数据访问控制。以下是 Kafka 安全认证机制的实现和配置指南。</p>
<h3 id="_1-安全认证机制概述" tabindex="-1"><a class="header-anchor" href="#_1-安全认证机制概述"><span>1. 安全认证机制概述</span></a></h3>
<p>Kafka 支持以下几种主要的安全机制：</p>
<ol>
<li><strong>SSL/TLS</strong>：用于加密客户端和服务器之间的通信，防止数据在传输过程中被窃听和篡改。</li>
<li><strong>SASL（Simple Authentication and Security Layer）</strong>：用于身份验证，支持多种认证方式，如
GSSAPI（Kerberos）、PLAIN、SCRAM-SHA-256、SCRAM-SHA-512 等。</li>
<li><strong>ACL（Access Control Lists）</strong>：用于授权控制，定义哪些用户可以访问哪些资源（如 Topic 和分区）。</li>
</ol>
<h3 id="_2-配置-ssl-tls-加密" tabindex="-1"><a class="header-anchor" href="#_2-配置-ssl-tls-加密"><span>2. 配置 SSL/TLS 加密</span></a></h3>
<h4 id="生成-ssl-证书" tabindex="-1"><a class="header-anchor" href="#生成-ssl-证书"><span>生成 SSL 证书</span></a></h4>
<ol>
<li><strong>生成 Kafka 服务端密钥和证书签名请求（CSR）</strong>：</li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">keytool <span class="token parameter variable">-keystore</span> kafka.server.keystore.jks <span class="token parameter variable">-alias</span> localhost <span class="token parameter variable">-keyalg</span> RSA <span class="token parameter variable">-validity</span> <span class="token number">365</span> <span class="token parameter variable">-genkey</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ol start="2">
<li><strong>生成 Kafka 客户端密钥和证书签名请求（CSR）</strong>：</li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">keytool <span class="token parameter variable">-keystore</span> kafka.client.keystore.jks <span class="token parameter variable">-alias</span> localhost <span class="token parameter variable">-keyalg</span> RSA <span class="token parameter variable">-validity</span> <span class="token number">365</span> <span class="token parameter variable">-genkey</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ol start="3">
<li><strong>使用证书颁发机构（CA）签署 CSR</strong>：</li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">openssl req <span class="token parameter variable">-new</span> <span class="token parameter variable">-x509</span> <span class="token parameter variable">-keyout</span> ca-key <span class="token parameter variable">-out</span> ca-cert <span class="token parameter variable">-days</span> <span class="token number">365</span></span>
<span class="line">keytool <span class="token parameter variable">-keystore</span> kafka.server.keystore.jks <span class="token parameter variable">-alias</span> CARoot <span class="token parameter variable">-import</span> <span class="token parameter variable">-file</span> ca-cert</span>
<span class="line">keytool <span class="token parameter variable">-keystore</span> kafka.server.keystore.jks <span class="token parameter variable">-alias</span> localhost <span class="token parameter variable">-certreq</span> <span class="token parameter variable">-file</span> cert-file</span>
<span class="line">openssl x509 <span class="token parameter variable">-req</span> <span class="token parameter variable">-CA</span> ca-cert <span class="token parameter variable">-CAkey</span> ca-key <span class="token parameter variable">-in</span> cert-file <span class="token parameter variable">-out</span> cert-signed <span class="token parameter variable">-days</span> <span class="token number">365</span> <span class="token parameter variable">-CAcreateserial</span></span>
<span class="line">keytool <span class="token parameter variable">-keystore</span> kafka.server.keystore.jks <span class="token parameter variable">-alias</span> localhost <span class="token parameter variable">-import</span> <span class="token parameter variable">-file</span> cert-signed</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="配置-kafka-服务器" tabindex="-1"><a class="header-anchor" href="#配置-kafka-服务器"><span>配置 Kafka 服务器</span></a></h4>
<p>在 <code v-pre>server.properties</code> 文件中配置 SSL：</p>
<div class="language-properties line-numbers-mode" data-highlighter="prismjs" data-ext="properties" data-title="properties"><pre v-pre class="language-properties"><code><span class="line"><span class="token key attr-name">listeners</span><span class="token punctuation">=</span><span class="token value attr-value">SSL://kafka-server:9093</span></span>
<span class="line"><span class="token key attr-name">ssl.keystore.location</span><span class="token punctuation">=</span><span class="token value attr-value">/path/to/kafka.server.keystore.jks</span></span>
<span class="line"><span class="token key attr-name">ssl.keystore.password</span><span class="token punctuation">=</span><span class="token value attr-value">your_keystore_password</span></span>
<span class="line"><span class="token key attr-name">ssl.key.password</span><span class="token punctuation">=</span><span class="token value attr-value">your_key_password</span></span>
<span class="line"><span class="token key attr-name">ssl.truststore.location</span><span class="token punctuation">=</span><span class="token value attr-value">/path/to/kafka.server.truststore.jks</span></span>
<span class="line"><span class="token key attr-name">ssl.truststore.password</span><span class="token punctuation">=</span><span class="token value attr-value">your_truststore_password</span></span>
<span class="line"><span class="token key attr-name">security.inter.broker.protocol</span><span class="token punctuation">=</span><span class="token value attr-value">SSL</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="配置-kafka-客户端" tabindex="-1"><a class="header-anchor" href="#配置-kafka-客户端"><span>配置 Kafka 客户端</span></a></h4>
<p>在客户端配置文件中配置 SSL：</p>
<div class="language-properties line-numbers-mode" data-highlighter="prismjs" data-ext="properties" data-title="properties"><pre v-pre class="language-properties"><code><span class="line"><span class="token key attr-name">bootstrap.servers</span><span class="token punctuation">=</span><span class="token value attr-value">kafka-server:9093</span></span>
<span class="line"><span class="token key attr-name">security.protocol</span><span class="token punctuation">=</span><span class="token value attr-value">SSL</span></span>
<span class="line"><span class="token key attr-name">ssl.keystore.location</span><span class="token punctuation">=</span><span class="token value attr-value">/path/to/kafka.client.keystore.jks</span></span>
<span class="line"><span class="token key attr-name">ssl.keystore.password</span><span class="token punctuation">=</span><span class="token value attr-value">your_keystore_password</span></span>
<span class="line"><span class="token key attr-name">ssl.key.password</span><span class="token punctuation">=</span><span class="token value attr-value">your_key_password</span></span>
<span class="line"><span class="token key attr-name">ssl.truststore.location</span><span class="token punctuation">=</span><span class="token value attr-value">/path/to/kafka.client.truststore.jks</span></span>
<span class="line"><span class="token key attr-name">ssl.truststore.password</span><span class="token punctuation">=</span><span class="token value attr-value">your_truststore_password</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-配置-sasl-认证" tabindex="-1"><a class="header-anchor" href="#_3-配置-sasl-认证"><span>3. 配置 SASL 认证</span></a></h3>
<h4 id="配置-kerberos-gssapi" tabindex="-1"><a class="header-anchor" href="#配置-kerberos-gssapi"><span>配置 Kerberos（GSSAPI）</span></a></h4>
<ol>
<li><strong>设置 Kafka 服务器的 JAAS 配置</strong>：</li>
</ol>
<div class="language-plaintext line-numbers-mode" data-highlighter="prismjs" data-ext="plaintext" data-title="plaintext"><pre v-pre class="language-plaintext"><code><span class="line">KafkaServer {</span>
<span class="line">    com.sun.security.auth.module.Krb5LoginModule required</span>
<span class="line">    useKeyTab=true</span>
<span class="line">    storeKey=true</span>
<span class="line">    keyTab="/path/to/kafka.keytab"</span>
<span class="line">    principal="kafka/kafka-server@EXAMPLE.COM";</span>
<span class="line">};</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2">
<li><strong>在 <code v-pre>server.properties</code> 中配置 SASL</strong>：</li>
</ol>
<div class="language-properties line-numbers-mode" data-highlighter="prismjs" data-ext="properties" data-title="properties"><pre v-pre class="language-properties"><code><span class="line"><span class="token key attr-name">listeners</span><span class="token punctuation">=</span><span class="token value attr-value">SASL_SSL://kafka-server:9093</span></span>
<span class="line"><span class="token key attr-name">security.inter.broker.protocol</span><span class="token punctuation">=</span><span class="token value attr-value">SASL_SSL</span></span>
<span class="line"><span class="token key attr-name">sasl.mechanism.inter.broker.protocol</span><span class="token punctuation">=</span><span class="token value attr-value">GSSAPI</span></span>
<span class="line"><span class="token key attr-name">sasl.enabled.mechanisms</span><span class="token punctuation">=</span><span class="token value attr-value">GSSAPI</span></span>
<span class="line"><span class="token key attr-name">sasl.kerberos.service.name</span><span class="token punctuation">=</span><span class="token value attr-value">kafka</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3">
<li><strong>配置客户端的 JAAS 文件</strong>：</li>
</ol>
<div class="language-plaintext line-numbers-mode" data-highlighter="prismjs" data-ext="plaintext" data-title="plaintext"><pre v-pre class="language-plaintext"><code><span class="line">KafkaClient {</span>
<span class="line">    com.sun.security.auth.module.Krb5LoginModule required</span>
<span class="line">    useTicketCache=true</span>
<span class="line">    renewTicket=true</span>
<span class="line">    principal="kafka-client@EXAMPLE.COM";</span>
<span class="line">};</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4">
<li><strong>在客户端配置文件中配置 SASL</strong>：</li>
</ol>
<div class="language-properties line-numbers-mode" data-highlighter="prismjs" data-ext="properties" data-title="properties"><pre v-pre class="language-properties"><code><span class="line"><span class="token key attr-name">bootstrap.servers</span><span class="token punctuation">=</span><span class="token value attr-value">kafka-server:9093</span></span>
<span class="line"><span class="token key attr-name">security.protocol</span><span class="token punctuation">=</span><span class="token value attr-value">SASL_SSL</span></span>
<span class="line"><span class="token key attr-name">sasl.mechanism</span><span class="token punctuation">=</span><span class="token value attr-value">GSSAPI</span></span>
<span class="line"><span class="token key attr-name">sasl.kerberos.service.name</span><span class="token punctuation">=</span><span class="token value attr-value">kafka</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="配置-sasl-plain" tabindex="-1"><a class="header-anchor" href="#配置-sasl-plain"><span>配置 SASL/PLAIN</span></a></h4>
<ol>
<li><strong>设置 Kafka 服务器的 JAAS 配置</strong>：</li>
</ol>
<div class="language-plaintext line-numbers-mode" data-highlighter="prismjs" data-ext="plaintext" data-title="plaintext"><pre v-pre class="language-plaintext"><code><span class="line">KafkaServer {</span>
<span class="line">    org.apache.kafka.common.security.plain.PlainLoginModule required</span>
<span class="line">    username="admin"</span>
<span class="line">    password="admin-secret"</span>
<span class="line">    user_admin="admin-secret"</span>
<span class="line">    user_user1="user1-secret";</span>
<span class="line">};</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2">
<li><strong>在 <code v-pre>server.properties</code> 中配置 SASL/PLAIN</strong>：</li>
</ol>
<div class="language-properties line-numbers-mode" data-highlighter="prismjs" data-ext="properties" data-title="properties"><pre v-pre class="language-properties"><code><span class="line"><span class="token key attr-name">listeners</span><span class="token punctuation">=</span><span class="token value attr-value">SASL_SSL://kafka-server:9093</span></span>
<span class="line"><span class="token key attr-name">security.inter.broker.protocol</span><span class="token punctuation">=</span><span class="token value attr-value">SASL_SSL</span></span>
<span class="line"><span class="token key attr-name">sasl.mechanism.inter.broker.protocol</span><span class="token punctuation">=</span><span class="token value attr-value">PLAIN</span></span>
<span class="line"><span class="token key attr-name">sasl.enabled.mechanisms</span><span class="token punctuation">=</span><span class="token value attr-value">PLAIN</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3">
<li><strong>配置客户端的 JAAS 文件</strong>：</li>
</ol>
<div class="language-plaintext line-numbers-mode" data-highlighter="prismjs" data-ext="plaintext" data-title="plaintext"><pre v-pre class="language-plaintext"><code><span class="line">KafkaClient {</span>
<span class="line">    org.apache.kafka.common.security.plain.PlainLoginModule required</span>
<span class="line">    username="user1"</span>
<span class="line">    password="user1-secret";</span>
<span class="line">};</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4">
<li><strong>在客户端配置文件中配置 SASL/PLAIN</strong>：</li>
</ol>
<div class="language-properties line-numbers-mode" data-highlighter="prismjs" data-ext="properties" data-title="properties"><pre v-pre class="language-properties"><code><span class="line"><span class="token key attr-name">bootstrap.servers</span><span class="token punctuation">=</span><span class="token value attr-value">kafka-server:9093</span></span>
<span class="line"><span class="token key attr-name">security.protocol</span><span class="token punctuation">=</span><span class="token value attr-value">SASL_SSL</span></span>
<span class="line"><span class="token key attr-name">sasl.mechanism</span><span class="token punctuation">=</span><span class="token value attr-value">PLAIN</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-配置-acl-授权" tabindex="-1"><a class="header-anchor" href="#_4-配置-acl-授权"><span>4. 配置 ACL 授权</span></a></h3>
<p>通过 ACL 来控制哪些用户可以访问哪些资源。</p>
<h4 id="配置示例" tabindex="-1"><a class="header-anchor" href="#配置示例"><span>配置示例</span></a></h4>
<ol>
<li><strong>启用 ACL 控制</strong>：</li>
</ol>
<p>在 <code v-pre>server.properties</code> 中启用 ACL：</p>
<div class="language-properties line-numbers-mode" data-highlighter="prismjs" data-ext="properties" data-title="properties"><pre v-pre class="language-properties"><code><span class="line"><span class="token key attr-name">authorizer.class.name</span><span class="token punctuation">=</span><span class="token value attr-value">kafka.security.auth.SimpleAclAuthorizer</span></span>
<span class="line"><span class="token key attr-name">super.users</span><span class="token punctuation">=</span><span class="token value attr-value">User:admin</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2">
<li><strong>为用户配置权限</strong>：</li>
</ol>
<p>使用 <code v-pre>kafka-acls.sh</code> 脚本为用户配置权限：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">bin/kafka-acls.sh --authorizer-properties <span class="token assign-left variable">zookeeper.connect</span><span class="token operator">=</span>zk-server:2181 <span class="token parameter variable">--add</span> --allow-principal User:user1 <span class="token parameter variable">--operation</span> Read <span class="token parameter variable">--topic</span> test-topic</span>
<span class="line">bin/kafka-acls.sh --authorizer-properties <span class="token assign-left variable">zookeeper.connect</span><span class="token operator">=</span>zk-server:2181 <span class="token parameter variable">--add</span> --allow-principal User:user1 <span class="token parameter variable">--operation</span> Write <span class="token parameter variable">--topic</span> test-topic</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<p>Kafka 通过以下机制实现安全认证：</p>
<ol>
<li><strong>SSL/TLS 加密</strong>：保护数据传输的安全性。</li>
<li><strong>SASL 认证</strong>：支持多种认证方式（如 Kerberos、PLAIN、SCRAM-SHA-256 等），确保身份认证的安全性。</li>
<li><strong>ACL 授权</strong>：通过 ACL 控制用户对 Kafka 资源的访问权限。</li>
</ol>
<p>通过合理配置这些安全机制，可以有效保护 Kafka 集群的通信安全和数据访问控制，确保系统的可靠性和安全性。</p>
</div></template>


