"use strict";(self.webpackChunkarch_guide=self.webpackChunkarch_guide||[]).push([[809],{4937:(s,n,a)=>{a.r(n),a.d(n,{comp:()=>p,data:()=>t});var e=a(641);const l=[(0,e.Fv)('<h1 id="minio-集群数据备份和数据复制的区别" tabindex="-1"><a class="header-anchor" href="#minio-集群数据备份和数据复制的区别"><span>Minio 集群数据备份和数据复制的区别？</span></a></h1><h3 id="数据备份与数据复制的区别" tabindex="-1"><a class="header-anchor" href="#数据备份与数据复制的区别"><span>数据备份与数据复制的区别</span></a></h3><h4 id="数据备份" tabindex="-1"><a class="header-anchor" href="#数据备份"><span>数据备份</span></a></h4><p>数据备份是一种将数据从原始存储位置复制到备份存储位置的过程。备份通常是定期进行的，目的是在发生数据损坏、 丢失或其他灾难性事件时恢复数据。备份可以是全量备份，也可以是增量备份。</p><ul><li><strong>全量备份</strong>：将所有数据备份到另一个位置。</li><li><strong>增量备份</strong>：只备份自上次备份以来发生变化的数据。</li></ul><p>优点：</p><ul><li>可以恢复到特定时间点的数据状态。</li><li>数据备份通常存储在异地，可以防止本地灾难导致的数据丢失。</li></ul><p>缺点：</p><ul><li>备份过程可能需要较长时间，特别是全量备份。</li><li>备份期间的性能开销较大。</li></ul><h4 id="数据复制" tabindex="-1"><a class="header-anchor" href="#数据复制"><span>数据复制</span></a></h4><p>数据复制是指将数据从一个存储位置实时同步到另一个存储位置。复制通常是持续进行的，以确保数据在多个位置之间保持 同步。数据复制可以是同步复制或异步复制。</p><ul><li><strong>同步复制</strong>：数据在写入主存储时，同时写入到备份存储，确保数据的一致性。</li><li><strong>异步复制</strong>：数据先写入主存储，然后异步地复制到备份存储，可能会有短暂的延迟。</li></ul><p>优点：</p><ul><li>实时数据同步，确保数据的一致性。</li><li>数据复制通常对性能影响较小。</li></ul><p>缺点：</p><ul><li>异步复制可能会有数据延迟。</li><li>需要稳定的网络连接，尤其是在跨数据中心复制时。</li></ul><h3 id="确保业务数据在备份和复制过程中的一致性" tabindex="-1"><a class="header-anchor" href="#确保业务数据在备份和复制过程中的一致性"><span>确保业务数据在备份和复制过程中的一致性</span></a></h3><p>为了确保在备份和复制过程中，业务正在写入的数据能够正常备份和复制，可以采取以下几种方法：</p><h4 id="_1-快照技术" tabindex="-1"><a class="header-anchor" href="#_1-快照技术"><span>1. 快照技术</span></a></h4><p>使用存储系统的快照技术来创建数据的一致性快照。快照是在某一时刻的数据副本，可以在不影响正在进行的写操作的情况下 进行备份。</p><h5 id="操作步骤" tabindex="-1"><a class="header-anchor" href="#操作步骤"><span>操作步骤</span></a></h5><ol><li><p><strong>创建快照</strong>：</p><ul><li>使用存储系统或文件系统的快照功能创建快照。</li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># 示例：使用 LVM 创建逻辑卷的快照</span></span>\n<span class="line">lvcreate <span class="token parameter variable">--size</span> 10G <span class="token parameter variable">--snapshot</span> <span class="token parameter variable">--name</span> my_snapshot /dev/vg0/my_lv</span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>备份快照</strong>：</p><ul><li>将快照的数据备份到备份存储。</li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mc</span> <span class="token function">cp</span> /mnt/my_snapshot/* myminio/backup-bucket/</span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong>删除快照</strong>：</p><ul><li>备份完成后，删除快照以释放空间。</li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">lvremove /dev/vg0/my_snapshot</span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li></ol><h4 id="_2-应用一致性检查点" tabindex="-1"><a class="header-anchor" href="#_2-应用一致性检查点"><span>2. 应用一致性检查点</span></a></h4><p>在应用程序层面设置一致性检查点，在进行备份时暂停写操作，确保数据的一致性。</p><h5 id="操作步骤-1" tabindex="-1"><a class="header-anchor" href="#操作步骤-1"><span>操作步骤</span></a></h5><ol><li><p><strong>暂停写操作</strong>：</p><ul><li>在备份开始前，通知应用程序暂停所有写操作。</li></ul><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="language-java"><code><span class="line"><span class="token comment">// 示例：Java 应用程序暂停写操作</span></span>\n<span class="line"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">pauseWrites</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">    <span class="token comment">// 实现逻辑</span></span>\n<span class="line"><span class="token punctuation">}</span></span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>进行备份</strong>：</p><ul><li>备份数据到备份存储。</li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mc</span> mirror <span class="token parameter variable">--watch</span> sourceMinIO/ targetMinIO/</span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong>恢复写操作</strong>：</p><ul><li>备份完成后，通知应用程序恢复写操作。</li></ul><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="language-java"><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">resumeWrites</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">    <span class="token comment">// 实现逻辑</span></span>\n<span class="line"><span class="token punctuation">}</span></span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h4 id="_3-实时同步和日志分析" tabindex="-1"><a class="header-anchor" href="#_3-实时同步和日志分析"><span>3. 实时同步和日志分析</span></a></h4><p>使用实时同步和日志分析技术，确保所有写操作在备份和复制过程中都能被捕捉到并处理。</p><h5 id="操作步骤-2" tabindex="-1"><a class="header-anchor" href="#操作步骤-2"><span>操作步骤</span></a></h5><ol><li><p><strong>配置实时同步</strong>：</p><ul><li>配置 MinIO 的异地复制，确保数据在多个位置实时同步。</li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mc</span> replicate <span class="token function">add</span> sourceMinIO/my-bucket --remote-bucket my-bucket --remote-target targetMinIO</span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong>分析写日志</strong>：</p><ul><li>使用应用程序的写日志，跟踪所有写操作，并在备份和复制过程中分析日志，确保没有遗漏的写操作。</li></ul><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="language-java"><code><span class="line"><span class="token comment">// 示例：Java 应用程序写日志</span></span>\n<span class="line"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">logWriteOperation</span><span class="token punctuation">(</span><span class="token class-name">String</span> data<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">    <span class="token comment">// 写日志逻辑</span></span>\n<span class="line"><span class="token punctuation">}</span></span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h3 id="代码示例-使用快照进行数据备份" tabindex="-1"><a class="header-anchor" href="#代码示例-使用快照进行数据备份"><span>代码示例：使用快照进行数据备份</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token shebang important">#!/bin/bash</span></span>\n<span class="line"></span>\n<span class="line"><span class="token comment"># 创建逻辑卷的快照</span></span>\n<span class="line">lvcreate <span class="token parameter variable">--size</span> 10G <span class="token parameter variable">--snapshot</span> <span class="token parameter variable">--name</span> my_snapshot /dev/vg0/my_lv</span>\n<span class="line"></span>\n<span class="line"><span class="token comment"># 使用 mc 工具备份快照的数据</span></span>\n<span class="line"><span class="token function">mc</span> <span class="token builtin class-name">alias</span> <span class="token builtin class-name">set</span> myminio http://minio.example.com accessKey secretKey</span>\n<span class="line"><span class="token function">mc</span> <span class="token function">cp</span> /mnt/my_snapshot/* myminio/backup-bucket/</span>\n<span class="line"></span>\n<span class="line"><span class="token comment"># 删除快照</span></span>\n<span class="line">lvremove /dev/vg0/my_snapshot</span>\n<span class="line"></span>\n<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;Backup completed at <span class="token variable"><span class="token variable">$(</span><span class="token function">date</span><span class="token variable">)</span></span>&quot;</span></span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="代码示例-使用应用一致性检查点" tabindex="-1"><a class="header-anchor" href="#代码示例-使用应用一致性检查点"><span>代码示例：使用应用一致性检查点</span></a></h3><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="language-java"><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Application</span> <span class="token punctuation">{</span></span>\n<span class="line">    <span class="token keyword">private</span> <span class="token keyword">boolean</span> isPaused <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>\n<span class="line"></span>\n<span class="line">    <span class="token keyword">public</span> <span class="token keyword">synchronized</span> <span class="token keyword">void</span> <span class="token function">pauseWrites</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">        isPaused <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>\n<span class="line">    <span class="token punctuation">}</span></span>\n<span class="line"></span>\n<span class="line">    <span class="token keyword">public</span> <span class="token keyword">synchronized</span> <span class="token keyword">void</span> <span class="token function">resumeWrites</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">        isPaused <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>\n<span class="line">        <span class="token function">notifyAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">    <span class="token punctuation">}</span></span>\n<span class="line"></span>\n<span class="line">    <span class="token keyword">public</span> <span class="token keyword">synchronized</span> <span class="token keyword">void</span> <span class="token function">writeData</span><span class="token punctuation">(</span><span class="token class-name">String</span> data<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">InterruptedException</span> <span class="token punctuation">{</span></span>\n<span class="line">        <span class="token keyword">while</span> <span class="token punctuation">(</span>isPaused<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">            <span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">        <span class="token punctuation">}</span></span>\n<span class="line">        <span class="token comment">// 写数据逻辑</span></span>\n<span class="line">        <span class="token function">logWriteOperation</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">    <span class="token punctuation">}</span></span>\n<span class="line"></span>\n<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">logWriteOperation</span><span class="token punctuation">(</span><span class="token class-name">String</span> data<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">        <span class="token comment">// 写日志逻辑</span></span>\n<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;Write operation: &quot;</span> <span class="token operator">+</span> data<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">    <span class="token punctuation">}</span></span>\n<span class="line"><span class="token punctuation">}</span></span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3><p>通过使用快照技术、应用一致性检查点和实时同步等方法，可以确保在备份和复制过程中业务正在写入的数据能够正常备份和复制。 这些方法有助于保证数据的一致性和完整性，并提高系统的容错能力。作为架构师，需要根据具体业务需求选择合适的策略和技术， 确保系统在灾难情况下能够迅速恢复。</p>',36)],i={},p=(0,a(6262).A)(i,[["render",function(s,n){return(0,e.uX)(),(0,e.CE)("div",null,l)}]]),t=JSON.parse('{"path":"/blog/minio/Minio-%E9%9B%86%E7%BE%A4%E6%95%B0%E6%8D%AE%E5%A4%87%E4%BB%BD%E5%92%8C%E6%95%B0%E6%8D%AE%E5%A4%8D%E5%88%B6%E7%9A%84%E5%8C%BA%E5%88%AB.html","title":"Minio 集群数据备份和数据复制的区别？","lang":"zh-CN","frontmatter":{"date":"2021-07-07T00:00:00.000Z","category":["Minio"],"tag":["对象存储"],"sticky":true,"excerpt":"<p> Minio 上传请求负载分析 </p>"},"headers":[{"level":3,"title":"数据备份与数据复制的区别","slug":"数据备份与数据复制的区别","link":"#数据备份与数据复制的区别","children":[]},{"level":3,"title":"确保业务数据在备份和复制过程中的一致性","slug":"确保业务数据在备份和复制过程中的一致性","link":"#确保业务数据在备份和复制过程中的一致性","children":[]},{"level":3,"title":"代码示例：使用快照进行数据备份","slug":"代码示例-使用快照进行数据备份","link":"#代码示例-使用快照进行数据备份","children":[]},{"level":3,"title":"代码示例：使用应用一致性检查点","slug":"代码示例-使用应用一致性检查点","link":"#代码示例-使用应用一致性检查点","children":[]},{"level":3,"title":"总结","slug":"总结","link":"#总结","children":[]}],"git":{"updatedTime":1720532327000,"contributors":[{"name":"asus","email":"939943844@qq.com","commits":1}]},"filePathRelative":"blog/minio/Minio-集群数据备份和数据复制的区别.md"}')}}]);