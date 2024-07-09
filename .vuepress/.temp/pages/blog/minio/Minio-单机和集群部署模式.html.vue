<template><div><h1 id="minio-单机和集群部署模式" tabindex="-1"><a class="header-anchor" href="#minio-单机和集群部署模式"><span>Minio 单机和集群部署模式</span></a></h1>
<p>MinIO 是一个高性能的对象存储系统，支持单机和集群两种部署模式。以下是 MinIO 单机和集群部署模式
的详细介绍和步骤。</p>
<h3 id="_1-单机部署模式" tabindex="-1"><a class="header-anchor" href="#_1-单机部署模式"><span>1. 单机部署模式</span></a></h3>
<p>单机部署模式适用于开发、测试环境和小规模的生产环境。此模式下，MinIO 在一台机器上运行，不具备高可
用性和容错能力。</p>
<h4 id="部署步骤" tabindex="-1"><a class="header-anchor" href="#部署步骤"><span>部署步骤</span></a></h4>
<ol>
<li>
<p><strong>下载 MinIO 可执行文件</strong></p>
<p>从 MinIO 官方网站下载最新的 MinIO 可执行文件。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">wget</span> https://dl.min.io/server/minio/release/linux-amd64/minio</span>
<span class="line"><span class="token function">chmod</span> +x minio</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>启动 MinIO 服务</strong></p>
<p>使用 <code v-pre>minio server</code> 命令启动 MinIO 服务。指定数据存储路径 <code v-pre>/data</code>。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">./minio server /data</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>访问 MinIO 控制台</strong></p>
<p>启动后，MinIO 会在默认端口 9000 上运行。可以通过浏览器访问 MinIO 控制台 <code v-pre>http://localhost:9000</code>，
使用默认的访问密钥（Access Key）和密钥（Secret Key）登录。</p>
</li>
</ol>
<h3 id="_2-集群部署模式" tabindex="-1"><a class="header-anchor" href="#_2-集群部署模式"><span>2. 集群部署模式</span></a></h3>
<p>集群部署模式适用于生产环境，通过多个节点提供高可用性和扩展性。至少需要 4 个节点来实现分布式部署。</p>
<h4 id="部署步骤-1" tabindex="-1"><a class="header-anchor" href="#部署步骤-1"><span>部署步骤</span></a></h4>
<ol>
<li>
<p><strong>准备工作</strong></p>
<p>确保每个节点上都安装了 MinIO 可执行文件，并配置好网络连接。以下示例使用 4 个节点，每个节点的 IP 分别为
<code v-pre>192.168.1.1</code>、<code v-pre>192.168.1.2</code>、<code v-pre>192.168.1.3</code> 和 <code v-pre>192.168.1.4</code>。</p>
</li>
<li>
<p><strong>启动 MinIO 服务</strong></p>
<p>在每个节点上使用 <code v-pre>minio server</code> 命令启动 MinIO 服务，指定每个节点的数据存储路径和其他节点的地址。</p>
<p><strong>节点 1:</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">./minio server http://192.168.1.1/data http://192.168.1.2/data http://192.168.1.3/data </span>
<span class="line">http://192.168.1.4/data</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>节点 2:</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">./minio server http://192.168.1.1/data http://192.168.1.2/data http://192.168.1.3/data </span>
<span class="line">http://192.168.1.4/data</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>节点 3:</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">./minio server http://192.168.1.1/data http://192.168.1.2/data http://192.168.1.3/data </span>
<span class="line">http://192.168.1.4/data</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>节点 4:</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">./minio server http://192.168.1.1/data http://192.168.1.2/data http://192.168.1.3/data </span>
<span class="line">http://192.168.1.4/data</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>访问 MinIO 控制台</strong></p>
<p>集群启动后，可以通过任意一个节点的 IP 地址访问 MinIO 控制台。例如，访问 <code v-pre>http://192.168.1.1:9000</code>，
使用集群的访问密钥（Access Key）和密钥（Secret Key）登录。</p>
</li>
</ol>
<h3 id="配置和管理" tabindex="-1"><a class="header-anchor" href="#配置和管理"><span>配置和管理</span></a></h3>
<h4 id="_1-配置文件" tabindex="-1"><a class="header-anchor" href="#_1-配置文件"><span>1. 配置文件</span></a></h4>
<p>可以使用环境变量或配置文件来配置 MinIO。例如，在 <code v-pre>~/.minio/config.json</code> 文件中定义配置参数：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre class="language-json"><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"version"</span><span class="token operator">:</span> <span class="token string">"19"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"credential"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">"accessKey"</span><span class="token operator">:</span> <span class="token string">"YOUR-ACCESS-KEY"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"secretKey"</span><span class="token operator">:</span> <span class="token string">"YOUR-SECRET-KEY"</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"region"</span><span class="token operator">:</span> <span class="token string">"us-east-1"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"browser"</span><span class="token operator">:</span> <span class="token string">"on"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"logger"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">"console"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">"level"</span><span class="token operator">:</span> <span class="token string">"error"</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"enable"</span><span class="token operator">:</span> <span class="token boolean">true</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"file"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">"level"</span><span class="token operator">:</span> <span class="token string">"error"</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"enable"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"filename"</span><span class="token operator">:</span> <span class="token string">"/var/log/minio.log"</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"notify"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">"webhook"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">"1"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token property">"enable"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">                <span class="token property">"endpoint"</span><span class="token operator">:</span> <span class="token string">"http://localhost:9000/minio/webhook"</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-用户和权限管理" tabindex="-1"><a class="header-anchor" href="#_2-用户和权限管理"><span>2. 用户和权限管理</span></a></h4>
<p>使用 <code v-pre>mc</code>（MinIO Client）工具管理用户和权限。</p>
<p><strong>安装 MinIO Client</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">wget</span> https://dl.min.io/client/mc/release/linux-amd64/mc</span>
<span class="line"><span class="token function">chmod</span> +x <span class="token function">mc</span></span>
<span class="line">./mc <span class="token builtin class-name">alias</span> <span class="token builtin class-name">set</span> myminio http://192.168.1.1:9000 YOUR-ACCESS-KEY YOUR-SECRET-KEY</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>添加用户和设置策略</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">./mc admin user <span class="token function">add</span> myminio myuser mypassword</span>
<span class="line">./mc admin policy <span class="token builtin class-name">set</span> myminio readwrite <span class="token assign-left variable">user</span><span class="token operator">=</span>myuser</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="高可用性和容灾" tabindex="-1"><a class="header-anchor" href="#高可用性和容灾"><span>高可用性和容灾</span></a></h3>
<h4 id="_1-数据冗余" tabindex="-1"><a class="header-anchor" href="#_1-数据冗余"><span>1. 数据冗余</span></a></h4>
<p>MinIO 使用 erasure coding 技术，将数据分片和冗余存储在多个节点上，以确保数据的高可用性和容错能力。</p>
<h4 id="_2-跨数据中心复制" tabindex="-1"><a class="header-anchor" href="#_2-跨数据中心复制"><span>2. 跨数据中心复制</span></a></h4>
<p>MinIO 支持跨数据中心复制（异地备份），可以将数据复制到远程数据中心，实现异地灾备。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">./mc mirror <span class="token parameter variable">--watch</span> /data myminio/mybucket</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<ul>
<li><strong>单机模式</strong>：适用于开发和测试环境，部署简单，但没有高可用性和容错能力。</li>
<li><strong>集群模式</strong>：适用于生产环境，通过多个节点提供高可用性和扩展性，使用 erasure coding 技术实现数据冗余，
支持跨数据中心复制以实现异地灾备。</li>
</ul>
<p>通过以上步骤和配置，您可以根据业务需求选择合适的 MinIO 部署模式，确保系统的高效运行和数据安全。</p>
</div></template>


