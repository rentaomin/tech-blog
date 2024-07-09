<template><div><h3 id="环境说明" tabindex="-1"><a class="header-anchor" href="#环境说明"><span>环境说明</span></a></h3>
<p>以下是 Zookeeper 3.8 在三台机器（IP 分别为 192.168.0.200、192.168.0.201、
192.168.0.202）上部署 集群模式的详细指导。操作系统为 RedHat 8.2。</p>
<h3 id="前提条件" tabindex="-1"><a class="header-anchor" href="#前提条件"><span>前提条件</span></a></h3>
<ol>
<li>确保所有机器上已经安装了 Java 环境（JDK 8 或以上）。</li>
<li>确保所有机器之间的网络连接正常。</li>
</ol>
<h3 id="步骤-1-在每台机器上下载并解压-zookeeper" tabindex="-1"><a class="header-anchor" href="#步骤-1-在每台机器上下载并解压-zookeeper"><span>步骤 1：在每台机器上下载并解压 Zookeeper</span></a></h3>
<ol>
<li>
<p>登录到每台机器。</p>
</li>
<li>
<p>下载 Zookeeper 3.8 并解压：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">wget</span> https://downloads.apache.org/zookeeper/stable/apache-zookeeper-3.8.0-bin.tar.gz</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xzf</span> apache-zookeeper-3.8.0-bin.tar.gz</span>
<span class="line"><span class="token function">mv</span> apache-zookeeper-3.8.0-bin /opt/zookeeper</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ol>
<h3 id="步骤-2-配置-zookeeper" tabindex="-1"><a class="header-anchor" href="#步骤-2-配置-zookeeper"><span>步骤 2：配置 Zookeeper</span></a></h3>
<ol>
<li>
<p>在每台机器上，进入 Zookeeper 目录并复制示例配置文件：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token builtin class-name">cd</span> /opt/zookeeper</span>
<span class="line"><span class="token function">cp</span> conf/zoo_sample.cfg conf/zoo.cfg</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>编辑 <code v-pre>conf/zoo.cfg</code> 文件，确保内容如下：</p>
<div class="language-properties line-numbers-mode" data-highlighter="prismjs" data-ext="properties" data-title="properties"><pre v-pre class="language-properties"><code><span class="line"><span class="token key attr-name">tickTime</span><span class="token punctuation">=</span><span class="token value attr-value">2000</span></span>
<span class="line"><span class="token key attr-name">initLimit</span><span class="token punctuation">=</span><span class="token value attr-value">10</span></span>
<span class="line"><span class="token key attr-name">syncLimit</span><span class="token punctuation">=</span><span class="token value attr-value">5</span></span>
<span class="line"><span class="token key attr-name">dataDir</span><span class="token punctuation">=</span><span class="token value attr-value">/var/lib/zookeeper</span></span>
<span class="line"><span class="token key attr-name">dataLogDir</span><span class="token punctuation">=</span><span class="token value attr-value">/var/log/zookeeper</span></span>
<span class="line"><span class="token key attr-name">clientPort</span><span class="token punctuation">=</span><span class="token value attr-value">2181</span></span>
<span class="line"><span class="token key attr-name">server.1</span><span class="token punctuation">=</span><span class="token value attr-value">192.168.0.200:2888:3888</span></span>
<span class="line"><span class="token key attr-name">server.2</span><span class="token punctuation">=</span><span class="token value attr-value">192.168.0.201:2888:3888</span></span>
<span class="line"><span class="token key attr-name">server.3</span><span class="token punctuation">=</span><span class="token value attr-value">192.168.0.202:2888:3888</span></span>
<span class="line"><span class="token key attr-name">4lw.commands.whitelist</span><span class="token punctuation">=</span><span class="token value attr-value">*</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ol>
<h3 id="步骤-3-创建数据和日志目录" tabindex="-1"><a class="header-anchor" href="#步骤-3-创建数据和日志目录"><span>步骤 3：创建数据和日志目录</span></a></h3>
<ol>
<li>
<p>在每台机器上，创建数据目录和日志目录，并设置权限：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /var/lib/zookeeper</span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /var/log/zookeeper</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ol>
<h3 id="步骤-4-配置-myid-文件" tabindex="-1"><a class="header-anchor" href="#步骤-4-配置-myid-文件"><span>步骤 4：配置 myid 文件</span></a></h3>
<ol>
<li>
<p>在每台机器的 <code v-pre>dataDir</code> 目录中创建 <code v-pre>myid</code> 文件。根据每台机器的 IP 地址，写入对应的 ID：</p>
<ul>
<li>
<p>在 <code v-pre>192.168.0.200</code> 上：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token builtin class-name">echo</span> <span class="token string">"1"</span> <span class="token operator">></span> /var/lib/zookeeper/myid</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p>在 <code v-pre>192.168.0.201</code> 上：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token builtin class-name">echo</span> <span class="token string">"2"</span> <span class="token operator">></span> /var/lib/zookeeper/myid</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p>在 <code v-pre>192.168.0.202</code> 上：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token builtin class-name">echo</span> <span class="token string">"3"</span> <span class="token operator">></span> /var/lib/zookeeper/myid</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
</li>
</ol>
<h3 id="步骤-5-启动-zookeeper-服务" tabindex="-1"><a class="header-anchor" href="#步骤-5-启动-zookeeper-服务"><span>步骤 5：启动 Zookeeper 服务</span></a></h3>
<ol>
<li>
<p>在每台机器上启动 Zookeeper 服务：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token builtin class-name">cd</span> /opt/zookeeper</span>
<span class="line">bin/zkServer.sh start</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>验证 Zookeeper 服务状态：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">bin/zkServer.sh status</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ol>
<h3 id="步骤-6-防火墙配置" tabindex="-1"><a class="header-anchor" href="#步骤-6-防火墙配置"><span>步骤 6：防火墙配置</span></a></h3>
<ol>
<li>
<p>在每台机器上，确保防火墙允许 Zookeeper 所使用的端口（2181、2888、3888）进行通信：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">sudo</span> firewall-cmd <span class="token parameter variable">--permanent</span> --add-port<span class="token operator">=</span><span class="token number">2181</span>/tcp</span>
<span class="line"><span class="token function">sudo</span> firewall-cmd <span class="token parameter variable">--permanent</span> --add-port<span class="token operator">=</span><span class="token number">2888</span>/tcp</span>
<span class="line"><span class="token function">sudo</span> firewall-cmd <span class="token parameter variable">--permanent</span> --add-port<span class="token operator">=</span><span class="token number">3888</span>/tcp</span>
<span class="line"><span class="token function">sudo</span> firewall-cmd <span class="token parameter variable">--reload</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ol>
<h3 id="步骤-7-验证-zookeeper-集群" tabindex="-1"><a class="header-anchor" href="#步骤-7-验证-zookeeper-集群"><span>步骤 7：验证 Zookeeper 集群</span></a></h3>
<ol>
<li>
<p>使用 Zookeeper 客户端工具连接到集群并验证集群状态。在任何一台机器上执行以下命令：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token builtin class-name">cd</span> /opt/zookeeper</span>
<span class="line">bin/zkCli.sh <span class="token parameter variable">-server</span> <span class="token number">192.168</span>.0.200:2181</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>在 Zookeeper CLI 中，运行以下命令查看集群状态：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">stat</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>您应该能看到 Leader 和 Follower 的信息，表明集群已经成功启动并运行。</p>
</li>
</ol>
<h3 id="示例配置文件" tabindex="-1"><a class="header-anchor" href="#示例配置文件"><span>示例配置文件</span></a></h3>
<p>以下是完整的 <code v-pre>zoo.cfg</code> 配置文件示例：</p>
<div class="language-properties line-numbers-mode" data-highlighter="prismjs" data-ext="properties" data-title="properties"><pre v-pre class="language-properties"><code><span class="line"><span class="token key attr-name">tickTime</span><span class="token punctuation">=</span><span class="token value attr-value">2000</span></span>
<span class="line"><span class="token key attr-name">initLimit</span><span class="token punctuation">=</span><span class="token value attr-value">10</span></span>
<span class="line"><span class="token key attr-name">syncLimit</span><span class="token punctuation">=</span><span class="token value attr-value">5</span></span>
<span class="line"><span class="token key attr-name">dataDir</span><span class="token punctuation">=</span><span class="token value attr-value">/var/lib/zookeeper</span></span>
<span class="line"><span class="token key attr-name">dataLogDir</span><span class="token punctuation">=</span><span class="token value attr-value">/var/log/zookeeper</span></span>
<span class="line"><span class="token key attr-name">clientPort</span><span class="token punctuation">=</span><span class="token value attr-value">2181</span></span>
<span class="line"><span class="token key attr-name">server.1</span><span class="token punctuation">=</span><span class="token value attr-value">192.168.0.200:2888:3888</span></span>
<span class="line"><span class="token key attr-name">server.2</span><span class="token punctuation">=</span><span class="token value attr-value">192.168.0.201:2888:3888</span></span>
<span class="line"><span class="token key attr-name">server.3</span><span class="token punctuation">=</span><span class="token value attr-value">192.168.0.202:2888:3888</span></span>
<span class="line"><span class="token key attr-name">4lw.commands.whitelist</span><span class="token punctuation">=</span><span class="token value attr-value">*</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="完成后的检查和维护" tabindex="-1"><a class="header-anchor" href="#完成后的检查和维护"><span>完成后的检查和维护</span></a></h3>
<ol>
<li>
<p><strong>日志检查</strong>：</p>
<ul>
<li>查看 Zookeeper 日志文件，确保没有错误或警告。日志文件通常位于 <code v-pre>dataLogDir</code> 目录中，例如 <code v-pre>/var/log/zookeeper/zookeeper.out</code>。</li>
</ul>
</li>
<li>
<p><strong>健康检查</strong>：</p>
<ul>
<li>定期检查集群的健康状态，确保所有节点都在正常运行。</li>
</ul>
</li>
<li>
<p><strong>配置管理</strong>：</p>
<ul>
<li>确保所有节点上的配置文件一致。如果需要更新配置，确保同步更新所有节点。</li>
</ul>
</li>
</ol>
<p>通过上述步骤，您可以成功部署并配置一个 Zookeeper 集群，以便为分布式应用提供可靠的协调服务。</p>
</div></template>


