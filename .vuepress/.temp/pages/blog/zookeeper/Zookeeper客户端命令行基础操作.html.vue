<template><div><h1 id="zookeeper-客户端命令行基础操作" tabindex="-1"><a class="header-anchor" href="#zookeeper-客户端命令行基础操作"><span>Zookeeper 客户端命令行基础操作</span></a></h1>
<p>在 Zookeeper 客户端命令行中，可以使用 <code v-pre>create</code>
命令创建不同类型的节点。以下是如何创建临时节点、顺序节点、
临时顺序节点和持久顺序节点的示例：</p>
<h3 id="连接到-zookeeper-客户端" tabindex="-1"><a class="header-anchor" href="#连接到-zookeeper-客户端"><span>连接到 Zookeeper 客户端</span></a></h3>
<p>首先，连接到 Zookeeper 客户端：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token builtin class-name">cd</span> /opt/zookeeper/bin</span>
<span class="line">./zkCli.sh <span class="token parameter variable">-server</span> <span class="token number">192.168</span>.0.200:2181</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建不同类型的节点" tabindex="-1"><a class="header-anchor" href="#创建不同类型的节点"><span>创建不同类型的节点</span></a></h3>
<h4 id="创建持久节点-persistent-znode" tabindex="-1"><a class="header-anchor" href="#创建持久节点-persistent-znode"><span>创建持久节点（Persistent ZNode）</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create /persistentNode <span class="token string">"Persistent Node Data"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="创建临时节点-ephemeral-znode" tabindex="-1"><a class="header-anchor" href="#创建临时节点-ephemeral-znode"><span>创建临时节点（Ephemeral ZNode）</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create <span class="token parameter variable">-e</span> /ephemeralNode <span class="token string">"Ephemeral Node Data"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="创建顺序节点-sequential-znode" tabindex="-1"><a class="header-anchor" href="#创建顺序节点-sequential-znode"><span>创建顺序节点（Sequential ZNode）</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create <span class="token parameter variable">-s</span> /sequentialNode <span class="token string">"Sequential Node Data"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="创建临时顺序节点-ephemeral-sequential-znode" tabindex="-1"><a class="header-anchor" href="#创建临时顺序节点-ephemeral-sequential-znode"><span>创建临时顺序节点（Ephemeral Sequential ZNode）</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create <span class="token parameter variable">-e</span> <span class="token parameter variable">-s</span> /ephemeralSequentialNode <span class="token string">"Ephemeral Sequential Node Data"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="创建持久顺序节点-persistent-sequential-znode" tabindex="-1"><a class="header-anchor" href="#创建持久顺序节点-persistent-sequential-znode"><span>创建持久顺序节点（Persistent Sequential ZNode）</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create <span class="token parameter variable">-s</span> /persistentSequentialNode <span class="token string">"Persistent Sequential Node Data"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="示例操作" tabindex="-1"><a class="header-anchor" href="#示例操作"><span>示例操作</span></a></h3>
<h4 id="创建持久节点" tabindex="-1"><a class="header-anchor" href="#创建持久节点"><span>创建持久节点</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create /persistentNode <span class="token string">"Persistent Node Data"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>输出：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">Created /persistentNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="创建临时节点" tabindex="-1"><a class="header-anchor" href="#创建临时节点"><span>创建临时节点</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create <span class="token parameter variable">-e</span> /ephemeralNode <span class="token string">"Ephemeral Node Data"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>输出：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">Created /ephemeralNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="创建顺序节点" tabindex="-1"><a class="header-anchor" href="#创建顺序节点"><span>创建顺序节点</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create <span class="token parameter variable">-s</span> /sequentialNode <span class="token string">"Sequential Node Data"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>输出：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">Created /sequentialNode0000000000</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="创建临时顺序节点" tabindex="-1"><a class="header-anchor" href="#创建临时顺序节点"><span>创建临时顺序节点</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create <span class="token parameter variable">-e</span> <span class="token parameter variable">-s</span> /ephemeralSequentialNode <span class="token string">"Ephemeral Sequential Node Data"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>输出：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">Created /ephemeralSequentialNode0000000000</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="创建持久顺序节点" tabindex="-1"><a class="header-anchor" href="#创建持久顺序节点"><span>创建持久顺序节点</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create <span class="token parameter variable">-s</span> /persistentSequentialNode <span class="token string">"Persistent Sequential Node Data"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>输出：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">Created /persistentSequentialNode0000000000</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="说明" tabindex="-1"><a class="header-anchor" href="#说明"><span>说明</span></a></h3>
<ul>
<li><code v-pre>create /persistentNode &quot;Persistent Node Data&quot;</code>：创建一个持久节点 <code v-pre>/persistentNode</code>，存储数据为 <code v-pre>&quot;Persistent Node Data&quot;</code>。</li>
<li><code v-pre>create -e /ephemeralNode &quot;Ephemeral Node Data&quot;</code>：创建一个临时节点 <code v-pre>/ephemeralNode</code>，存储数据为 <code v-pre>&quot;Ephemeral Node Data&quot;</code>。</li>
<li><code v-pre>create -s /sequentialNode &quot;Sequential Node Data&quot;</code>：创建一个顺序节点 <code v-pre>/sequentialNode</code>，Zookeeper 会在节点名称末尾附加一个递增的数字，如 <code v-pre>/sequentialNode0000000000</code>。</li>
<li><code v-pre>create -e -s /ephemeralSequentialNode &quot;Ephemeral Sequential Node Data&quot;</code>：创建一个临时顺序节点 <code v-pre>/ephemeralSequentialNode</code>，Zookeeper 会在节点名称末尾附加一个递增的数字，如 <code v-pre>/ephemeralSequentialNode0000000000</code>。</li>
<li><code v-pre>create -s /persistentSequentialNode &quot;Persistent Sequential Node Data&quot;</code>：创建一个持久顺序节点 <code v-pre>/persistentSequentialNode</code>，Zookeeper 会在节点名称末尾附加一个递增的数字，如 <code v-pre>/persistentSequentialNode0000000000</code>。</li>
</ul>
<p>通过这些命令，您可以在 Zookeeper 客户端中创建不同类型的 ZNode 以满足不同的需求。</p>
<h2 id="zookeeper-acl-权限管控操作" tabindex="-1"><a class="header-anchor" href="#zookeeper-acl-权限管控操作"><span>Zookeeper Acl 权限管控操作</span></a></h2>
<p>在 Zookeeper 中，ACL（访问控制列表）用于控制对 ZNode 的访问权限。ACL 由身份和权限组成，权限可
以包括读取、写入、创建、删除、管理等操作。以下是如何在 Zookeeper 客户端命令行中设置 ACL 的示例：</p>
<h3 id="acl-权限" tabindex="-1"><a class="header-anchor" href="#acl-权限"><span>ACL 权限</span></a></h3>
<p>Zookeeper 中的权限包括：</p>
<ul>
<li><strong>CREATE (c)</strong>：创建子节点的权限。</li>
<li><strong>READ (r)</strong>：读取节点数据和子节点列表的权限。</li>
<li><strong>WRITE (w)</strong>：设置节点数据的权限。</li>
<li><strong>DELETE (d)</strong>：删除子节点的权限。</li>
<li><strong>ADMIN (a)</strong>：设置和获取 ACL 的权限。</li>
</ul>
<h3 id="连接到-zookeeper-客户端-1" tabindex="-1"><a class="header-anchor" href="#连接到-zookeeper-客户端-1"><span>连接到 Zookeeper 客户端</span></a></h3>
<p>首先，连接到 Zookeeper 客户端：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token builtin class-name">cd</span> /opt/zookeeper/bin</span>
<span class="line">./zkCli.sh <span class="token parameter variable">-server</span> <span class="token number">192.168</span>.0.200:2181</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建-znode-并设置-acl" tabindex="-1"><a class="header-anchor" href="#创建-znode-并设置-acl"><span>创建 ZNode 并设置 ACL</span></a></h3>
<h4 id="创建节点并设置-world-acl" tabindex="-1"><a class="header-anchor" href="#创建节点并设置-world-acl"><span>创建节点并设置 <code v-pre>world</code> ACL</span></a></h4>
<p><code v-pre>world</code> ACL 是 Zookeeper 中最常见的 ACL 模式，它不需要认证，所有客户端都可以访问。以下命令
创建一个持久节点并设置 <code v-pre>world</code> ACL，允许所有权限：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create /exampleNode <span class="token string">"exampleData"</span> world:anyone:cdrwa</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="创建节点并设置-auth-acl" tabindex="-1"><a class="header-anchor" href="#创建节点并设置-auth-acl"><span>创建节点并设置 <code v-pre>auth</code> ACL</span></a></h4>
<p><code v-pre>auth</code> ACL 使用客户端的认证信息。以下命令创建一个持久节点并设置 <code v-pre>auth</code> ACL：</p>
<p>首先，添加认证信息：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">addauth digest user1:password1</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>然后，创建节点并设置 <code v-pre>auth</code> ACL：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create /authNode <span class="token string">"authData"</span> auth:user1:cdrwa</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="创建节点并设置-digest-acl" tabindex="-1"><a class="header-anchor" href="#创建节点并设置-digest-acl"><span>创建节点并设置 <code v-pre>digest</code> ACL</span></a></h4>
<p><code v-pre>digest</code> ACL 使用用户名和密码进行认证，采用 MD5 哈希。以下命令创建一个持久节点并设置 <code v-pre>digest</code> ACL：</p>
<p>首先，添加认证信息：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">addauth digest user2:password2</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>然后，创建节点并设置 <code v-pre>digest</code> ACL：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create /digestNode <span class="token string">"digestData"</span> digest:user2:password2:cdrwa</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="创建节点并设置-ip-acl" tabindex="-1"><a class="header-anchor" href="#创建节点并设置-ip-acl"><span>创建节点并设置 <code v-pre>ip</code> ACL</span></a></h4>
<p><code v-pre>ip</code> ACL 通过 IP 地址进行访问控制。以下命令创建一个持久节点并设置 <code v-pre>ip</code> ACL：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create /ipNode <span class="token string">"ipData"</span> ip:192.168.0.200:cdrwa</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="修改节点的-acl" tabindex="-1"><a class="header-anchor" href="#修改节点的-acl"><span>修改节点的 ACL</span></a></h3>
<p>您可以使用 <code v-pre>setAcl</code> 命令修改现有节点的 ACL。</p>
<h4 id="修改节点的-world-acl" tabindex="-1"><a class="header-anchor" href="#修改节点的-world-acl"><span>修改节点的 <code v-pre>world</code> ACL</span></a></h4>
<p>将 <code v-pre>/exampleNode</code> 的 ACL 修改为仅允许读取：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">setAcl /exampleNode world:anyone:r</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="修改节点的-auth-acl" tabindex="-1"><a class="header-anchor" href="#修改节点的-auth-acl"><span>修改节点的 <code v-pre>auth</code> ACL</span></a></h4>
<p>将 <code v-pre>/authNode</code> 的 ACL 修改为仅允许创建和读取：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">setAcl /authNode auth:user1:cr</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="查看节点的-acl" tabindex="-1"><a class="header-anchor" href="#查看节点的-acl"><span>查看节点的 ACL</span></a></h3>
<p>使用 <code v-pre>getAcl</code> 命令查看节点的 ACL。</p>
<h4 id="查看-examplenode-的-acl" tabindex="-1"><a class="header-anchor" href="#查看-examplenode-的-acl"><span>查看 <code v-pre>/exampleNode</code> 的 ACL</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">getAcl /exampleNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>输出示例：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">'world,'anyone</span>
<span class="line">: r</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="查看-authnode-的-acl" tabindex="-1"><a class="header-anchor" href="#查看-authnode-的-acl"><span>查看 <code v-pre>/authNode</code> 的 ACL</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">getAcl /authNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>输出示例：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">'digest,'user1:************************</span>
<span class="line">: cr</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="示例操作-1" tabindex="-1"><a class="header-anchor" href="#示例操作-1"><span>示例操作</span></a></h3>
<h4 id="创建节点并设置-acl" tabindex="-1"><a class="header-anchor" href="#创建节点并设置-acl"><span>创建节点并设置 ACL</span></a></h4>
<ol>
<li>
<p><strong>创建具有 <code v-pre>world</code> ACL 的节点</strong>：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create /exampleNode <span class="token string">"exampleData"</span> world:anyone:cdrwa</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>创建具有 <code v-pre>auth</code> ACL 的节点</strong>：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">addauth digest user1:password1</span>
<span class="line">create /authNode <span class="token string">"authData"</span> auth:user1:cdrwa</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>创建具有 <code v-pre>digest</code> ACL 的节点</strong>：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">addauth digest user2:password2</span>
<span class="line">create /digestNode <span class="token string">"digestData"</span> digest:user2:password2:cdrwa</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>创建具有 <code v-pre>ip</code> ACL 的节点</strong>：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create /ipNode <span class="token string">"ipData"</span> ip:192.168.0.200:cdrwa</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ol>
<h4 id="修改节点-acl" tabindex="-1"><a class="header-anchor" href="#修改节点-acl"><span>修改节点 ACL</span></a></h4>
<ol>
<li>
<p><strong>修改 <code v-pre>/exampleNode</code> 的 ACL</strong>：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">setAcl /exampleNode world:anyone:r</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>修改 <code v-pre>/authNode</code> 的 ACL</strong>：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">setAcl /authNode auth:user1:cr</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ol>
<h4 id="查看节点-acl" tabindex="-1"><a class="header-anchor" href="#查看节点-acl"><span>查看节点 ACL</span></a></h4>
<ol>
<li>
<p><strong>查看 <code v-pre>/exampleNode</code> 的 ACL</strong>：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">getAcl /exampleNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>查看 <code v-pre>/authNode</code> 的 ACL</strong>：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">getAcl /authNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ol>
<p>通过这些命令，您可以在 Zookeeper 中设置和管理 ZNode 的 ACL，从而控制对 ZNode 的访问权限。
这些操作对于确保数据安全和管理分布式系统中的权限至关重要。</p>
<h3 id="设置权限后如何访问验证" tabindex="-1"><a class="header-anchor" href="#设置权限后如何访问验证"><span>设置权限后如何访问验证</span></a></h3>
<p>要验证设置的 ACL（访问控制列表）权限，您可以通过以下步骤进行验证。
以下示例演示了如何验证不同类型的 ACL 设置。</p>
<h3 id="_1-验证-world-acl" tabindex="-1"><a class="header-anchor" href="#_1-验证-world-acl"><span>1. 验证 <code v-pre>world</code> ACL</span></a></h3>
<p><code v-pre>world</code> ACL 允许任何人访问。</p>
<h4 id="创建具有-world-acl-的节点" tabindex="-1"><a class="header-anchor" href="#创建具有-world-acl-的节点"><span>创建具有 <code v-pre>world</code> ACL 的节点</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create /exampleNode <span class="token string">"exampleData"</span> world:anyone:cdrwa</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="验证-world-acl-的访问权限" tabindex="-1"><a class="header-anchor" href="#验证-world-acl-的访问权限"><span>验证 <code v-pre>world</code> ACL 的访问权限</span></a></h4>
<ol>
<li>
<p><strong>读取节点数据</strong>（任何人都可以读取）：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">get /exampleNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>输出示例：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">exampleData</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>更新节点数据</strong>（任何人都可以更新）：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token builtin class-name">set</span> /exampleNode <span class="token string">"newExampleData"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>验证更新</strong>：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">get /exampleNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>输出示例：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">newExampleData</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ol>
<h3 id="_2-验证-auth-acl" tabindex="-1"><a class="header-anchor" href="#_2-验证-auth-acl"><span>2. 验证 <code v-pre>auth</code> ACL</span></a></h3>
<p><code v-pre>auth</code> ACL 需要客户端进行认证。</p>
<h4 id="创建具有-auth-acl-的节点" tabindex="-1"><a class="header-anchor" href="#创建具有-auth-acl-的节点"><span>创建具有 <code v-pre>auth</code> ACL 的节点</span></a></h4>
<ol>
<li>
<p>添加认证信息：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">addauth digest user1:password1</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p>创建节点并设置 <code v-pre>auth</code> ACL：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create /authNode <span class="token string">"authData"</span> auth:user1:cdrwa</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ol>
<h4 id="验证-auth-acl-的访问权限" tabindex="-1"><a class="header-anchor" href="#验证-auth-acl-的访问权限"><span>验证 <code v-pre>auth</code> ACL 的访问权限</span></a></h4>
<ol>
<li>
<p><strong>验证未认证的访问</strong>（未认证的客户端无法访问）：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">get /authNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>输出示例：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">Authentication is not valid : /authNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>验证认证后的访问</strong>：</p>
<ul>
<li>
<p>添加认证信息：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">addauth digest user1:password1</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p>读取节点数据：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">get /authNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>输出示例：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">authData</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
</li>
<li>
<p><strong>更新节点数据</strong>：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token builtin class-name">set</span> /authNode <span class="token string">"newAuthData"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>验证更新</strong>：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">get /authNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>输出示例：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">newAuthData</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ol>
<h3 id="_3-验证-digest-acl" tabindex="-1"><a class="header-anchor" href="#_3-验证-digest-acl"><span>3. 验证 <code v-pre>digest</code> ACL</span></a></h3>
<p><code v-pre>digest</code> ACL 使用用户名和密码进行认证。</p>
<h4 id="创建具有-digest-acl-的节点" tabindex="-1"><a class="header-anchor" href="#创建具有-digest-acl-的节点"><span>创建具有 <code v-pre>digest</code> ACL 的节点</span></a></h4>
<ol>
<li>
<p>添加认证信息：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">addauth digest user2:password2</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p>创建节点并设置 <code v-pre>digest</code> ACL：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create /digestNode <span class="token string">"digestData"</span> digest:user2:password2:cdrwa</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ol>
<h4 id="验证-digest-acl-的访问权限" tabindex="-1"><a class="header-anchor" href="#验证-digest-acl-的访问权限"><span>验证 <code v-pre>digest</code> ACL 的访问权限</span></a></h4>
<ol>
<li>
<p><strong>验证未认证的访问</strong>（未认证的客户端无法访问）：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">get /digestNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>输出示例：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">Authentication is not valid : /digestNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>验证认证后的访问</strong>：</p>
<ul>
<li>
<p>添加认证信息：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">addauth digest user2:password2</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p>读取节点数据：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">get /digestNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>输出示例：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">digestData</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
</li>
<li>
<p><strong>更新节点数据</strong>：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token builtin class-name">set</span> /digestNode <span class="token string">"newDigestData"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>验证更新</strong>：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">get /digestNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>输出示例：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">newDigestData</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ol>
<h3 id="_4-验证-ip-acl" tabindex="-1"><a class="header-anchor" href="#_4-验证-ip-acl"><span>4. 验证 <code v-pre>ip</code> ACL</span></a></h3>
<p><code v-pre>ip</code> ACL 通过 IP 地址进行访问控制。</p>
<h4 id="创建具有-ip-acl-的节点" tabindex="-1"><a class="header-anchor" href="#创建具有-ip-acl-的节点"><span>创建具有 <code v-pre>ip</code> ACL 的节点</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">create /ipNode <span class="token string">"ipData"</span> ip:192.168.0.200:cdrwa</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="验证-ip-acl-的访问权限" tabindex="-1"><a class="header-anchor" href="#验证-ip-acl-的访问权限"><span>验证 <code v-pre>ip</code> ACL 的访问权限</span></a></h4>
<ol>
<li>
<p><strong>在授权 IP 地址上验证访问</strong>：</p>
<ul>
<li>
<p>在 192.168.0.200 机器上读取节点数据：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">get /ipNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>输出示例：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">ipData</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p>更新节点数据：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token builtin class-name">set</span> /ipNode <span class="token string">"newIpData"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p>验证更新：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">get /ipNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>输出示例：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">newIpData</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
</li>
<li>
<p><strong>在未授权 IP 地址上验证访问</strong>（未授权的客户端无法访问）：</p>
<ul>
<li>
<p>在非 192.168.0.200 机器上读取节点数据：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">get /ipNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>输出示例：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">Authentication is not valid : /ipNode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
</li>
</ol>
<h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<p>通过上述步骤，您可以验证 Zookeeper 中设置的 ACL 是否生效。不同类型的 ACL 有不同的认证和访问方式，
确保在实际应用中正确配置和验证 ACL，以保护 ZNode 数据的安全性。</p>
</div></template>


