<template><div><h1 id="minio-集群冷备数据如何恢复部署-minio-集群冷备数据如何恢复部署" tabindex="-1"><a class="header-anchor" href="#minio-集群冷备数据如何恢复部署-minio-集群冷备数据如何恢复部署"><span>Minio 集群冷备数据如何恢复部署?Minio 集群冷备数据如何恢复部署</span></a></h1>
<p>要在新的节点上使用冷备数据目录恢复 MinIO 并正常提供服务，需要确保 MinIO 服务能够正确识别和
使用这些数据。以下是具体步骤：</p>
<h3 id="_1-停止-minio-服务" tabindex="-1"><a class="header-anchor" href="#_1-停止-minio-服务"><span>1. 停止 MinIO 服务</span></a></h3>
<p>在新节点上开始恢复之前，需要确保 MinIO 服务已经停止运行，以防止数据不一致。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">sudo</span> systemctl stop minio</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="_2-复制数据目录" tabindex="-1"><a class="header-anchor" href="#_2-复制数据目录"><span>2. 复制数据目录</span></a></h3>
<p>将备份的数据目录复制到新节点的 MinIO 数据目录中。例如，如果备份存储在远程服务器 <code v-pre>/path/to/backup/</code>
目录下，可以使用 <code v-pre>rsync</code> 或 <code v-pre>scp</code> 工具进行复制。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token comment"># 使用 rsync 进行恢复</span></span>
<span class="line"><span class="token function">rsync</span> <span class="token parameter variable">-avz</span> user@remote-server:/path/to/backup/ /path/to/minio/data/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 或者使用 scp 进行恢复</span></span>
<span class="line"><span class="token function">scp</span> <span class="token parameter variable">-r</span> user@remote-server:/path/to/backup/ /path/to/minio/data/</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-确保目录权限" tabindex="-1"><a class="header-anchor" href="#_3-确保目录权限"><span>3. 确保目录权限</span></a></h3>
<p>确保新节点上的 MinIO 数据目录具有正确的权限和所有者。通常，MinIO 服务运行的用户应当对该目录具有读写权限。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">sudo</span> <span class="token function">chown</span> <span class="token parameter variable">-R</span> minio-user:minio-user /path/to/minio/data/</span>
<span class="line"><span class="token function">sudo</span> <span class="token function">chmod</span> <span class="token parameter variable">-R</span> <span class="token number">755</span> /path/to/minio/data/</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-配置-minio-服务" tabindex="-1"><a class="header-anchor" href="#_4-配置-minio-服务"><span>4. 配置 MinIO 服务</span></a></h3>
<p>确保 MinIO 服务配置文件（通常为 <code v-pre>/etc/systemd/system/minio.service</code>）中的数据目录路径与恢复后的数据目录
路径一致。如果路径有变化，需要更新配置文件。</p>
<p>示例 MinIO 服务配置文件：</p>
<div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini" data-title="ini"><pre v-pre class="language-ini"><code><span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Unit</span><span class="token punctuation">]</span></span></span>
<span class="line"><span class="token key attr-name">Description</span><span class="token punctuation">=</span><span class="token value attr-value">MinIO</span></span>
<span class="line"><span class="token key attr-name">Documentation</span><span class="token punctuation">=</span><span class="token value attr-value">https://docs.min.io</span></span>
<span class="line"><span class="token key attr-name">Wants</span><span class="token punctuation">=</span><span class="token value attr-value">network-online.target</span></span>
<span class="line"><span class="token key attr-name">After</span><span class="token punctuation">=</span><span class="token value attr-value">network-online.target</span></span>
<span class="line"></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Service</span><span class="token punctuation">]</span></span></span>
<span class="line"><span class="token key attr-name">User</span><span class="token punctuation">=</span><span class="token value attr-value">minio-user</span></span>
<span class="line"><span class="token key attr-name">Group</span><span class="token punctuation">=</span><span class="token value attr-value">minio-user</span></span>
<span class="line"><span class="token key attr-name">ExecStart</span><span class="token punctuation">=</span><span class="token value attr-value">/usr/local/bin/minio server /path/to/minio/data/</span></span>
<span class="line"><span class="token key attr-name">Restart</span><span class="token punctuation">=</span><span class="token value attr-value">always</span></span>
<span class="line"><span class="token key attr-name">RestartSec</span><span class="token punctuation">=</span><span class="token value attr-value">10s</span></span>
<span class="line"><span class="token key attr-name">LimitNOFILE</span><span class="token punctuation">=</span><span class="token value attr-value">65536</span></span>
<span class="line"></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Install</span><span class="token punctuation">]</span></span></span>
<span class="line"><span class="token key attr-name">WantedBy</span><span class="token punctuation">=</span><span class="token value attr-value">multi-user.target</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-启动-minio-服务" tabindex="-1"><a class="header-anchor" href="#_5-启动-minio-服务"><span>5. 启动 MinIO 服务</span></a></h3>
<p>启动 MinIO 服务并检查服务状态以确保其正常运行。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">sudo</span> systemctl start minio</span>
<span class="line"><span class="token function">sudo</span> systemctl status minio</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-验证数据" tabindex="-1"><a class="header-anchor" href="#_6-验证数据"><span>6. 验证数据</span></a></h3>
<p>登录到 MinIO 控制台或使用 MinIO 客户端工具（<code v-pre>mc</code>）来验证数据是否恢复正常。</p>
<h4 id="使用-minio-控制台" tabindex="-1"><a class="header-anchor" href="#使用-minio-控制台"><span>使用 MinIO 控制台</span></a></h4>
<p>访问 MinIO 控制台（通常为 <code v-pre>http://your-minio-server:9000</code>），并使用管理凭证登录，检查数据是否完好无损。</p>
<h4 id="使用-minio-客户端工具-mc" tabindex="-1"><a class="header-anchor" href="#使用-minio-客户端工具-mc"><span>使用 MinIO 客户端工具（<code v-pre>mc</code>）</span></a></h4>
<p>安装 <code v-pre>mc</code> 客户端并配置 MinIO 别名：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">wget</span> https://dl.min.io/client/mc/release/linux-amd64/mc</span>
<span class="line"><span class="token function">chmod</span> +x <span class="token function">mc</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">mv</span> <span class="token function">mc</span> /usr/local/bin/</span>
<span class="line"></span>
<span class="line"><span class="token function">mc</span> <span class="token builtin class-name">alias</span> <span class="token builtin class-name">set</span> myminio http://your-minio-server:9000 accessKey secretKey</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>列出所有桶和对象以确保数据恢复正常：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">mc</span> <span class="token function">ls</span> myminio/</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="示例恢复过程" tabindex="-1"><a class="header-anchor" href="#示例恢复过程"><span>示例恢复过程</span></a></h3>
<p>以下是一个完整的恢复过程示例：</p>
<ol>
<li>
<p><strong>停止 MinIO 服务</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">sudo</span> systemctl stop minio</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>复制数据目录</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">rsync</span> <span class="token parameter variable">-avz</span> user@remote-server:/path/to/backup/ /path/to/minio/data/</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>确保目录权限</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">sudo</span> <span class="token function">chown</span> <span class="token parameter variable">-R</span> minio-user:minio-user /path/to/minio/data/</span>
<span class="line"><span class="token function">sudo</span> <span class="token function">chmod</span> <span class="token parameter variable">-R</span> <span class="token number">755</span> /path/to/minio/data/</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>配置 MinIO 服务</strong></p>
<p>确保 <code v-pre>/etc/systemd/system/minio.service</code> 文件中配置的路径正确：</p>
<div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini" data-title="ini"><pre v-pre class="language-ini"><code><span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Unit</span><span class="token punctuation">]</span></span></span>
<span class="line"><span class="token key attr-name">Description</span><span class="token punctuation">=</span><span class="token value attr-value">MinIO</span></span>
<span class="line"><span class="token key attr-name">Documentation</span><span class="token punctuation">=</span><span class="token value attr-value">https://docs.min.io</span></span>
<span class="line"><span class="token key attr-name">Wants</span><span class="token punctuation">=</span><span class="token value attr-value">network-online.target</span></span>
<span class="line"><span class="token key attr-name">After</span><span class="token punctuation">=</span><span class="token value attr-value">network-online.target</span></span>
<span class="line"></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Service</span><span class="token punctuation">]</span></span></span>
<span class="line"><span class="token key attr-name">User</span><span class="token punctuation">=</span><span class="token value attr-value">minio-user</span></span>
<span class="line"><span class="token key attr-name">Group</span><span class="token punctuation">=</span><span class="token value attr-value">minio-user</span></span>
<span class="line"><span class="token key attr-name">ExecStart</span><span class="token punctuation">=</span><span class="token value attr-value">/usr/local/bin/minio server /path/to/minio/data/</span></span>
<span class="line"><span class="token key attr-name">Restart</span><span class="token punctuation">=</span><span class="token value attr-value">always</span></span>
<span class="line"><span class="token key attr-name">RestartSec</span><span class="token punctuation">=</span><span class="token value attr-value">10s</span></span>
<span class="line"><span class="token key attr-name">LimitNOFILE</span><span class="token punctuation">=</span><span class="token value attr-value">65536</span></span>
<span class="line"></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Install</span><span class="token punctuation">]</span></span></span>
<span class="line"><span class="token key attr-name">WantedBy</span><span class="token punctuation">=</span><span class="token value attr-value">multi-user.target</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>启动 MinIO 服务</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">sudo</span> systemctl start minio</span>
<span class="line"><span class="token function">sudo</span> systemctl status minio</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>验证数据</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">mc</span> <span class="token builtin class-name">alias</span> <span class="token builtin class-name">set</span> myminio http://your-minio-server:9000 accessKey secretKey</span>
<span class="line"><span class="token function">mc</span> <span class="token function">ls</span> myminio/</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ol>
<h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<p>通过上述步骤，可以在新的节点上使用冷备的数据目录恢复 MinIO，并确保其能够正常提供服务。关键点在于停止 MinIO
服务以确保数据一致性，正确复制数据目录，确保目录权限和服务配置无误，最后启动服务并验证数据完整性。这样，MinIO
就可以在新的节点上正常运行，并为用户提供服务。</p>
</div></template>


