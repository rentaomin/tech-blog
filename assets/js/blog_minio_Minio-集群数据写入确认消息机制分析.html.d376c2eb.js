"use strict";(self.webpackChunkarch_guide=self.webpackChunkarch_guide||[]).push([[5862],{8043:(n,s,a)=>{a.r(s),a.d(s,{comp:()=>c,data:()=>o});var p=a(641);const e=[(0,p.Fv)('<h1 id="minio-集群数据写入确认消息机制分析" tabindex="-1"><a class="header-anchor" href="#minio-集群数据写入确认消息机制分析"><span>Minio 集群数据写入确认消息机制分析</span></a></h1><p>在 MinIO 集群中，数据写入的确认消息机制并不要求集群中的所有节点都确认成功，而是基于纠删码（Erasure Coding） 和写入配额（Write Quorum）的机制。具体来说，当一个文件被分成多个分片并分布到不同节点时，数据的写入确认依赖于 满足特定的配额要求，而不是所有节点的确认。</p><h3 id="纠删码和写入配额-write-quorum" tabindex="-1"><a class="header-anchor" href="#纠删码和写入配额-write-quorum"><span>纠删码和写入配额（Write Quorum）</span></a></h3><h4 id="纠删码简介" tabindex="-1"><a class="header-anchor" href="#纠删码简介"><span>纠删码简介</span></a></h4><p>MinIO 使用纠删码技术将数据分割成多个数据块和冗余块。这些块分布在不同的节点上，以提高数据的可靠性和可用性。例如， 一个文件可以被分成 8 个数据块和 4 个冗余块，总共 12 个块，分布在不同的节点上。</p><h4 id="写入配额-write-quorum" tabindex="-1"><a class="header-anchor" href="#写入配额-write-quorum"><span>写入配额（Write Quorum）</span></a></h4><p>写入配额是指为了确认数据写入成功所需的最少节点数。例如，如果一个文件被分成 12 个块，写入配额可能是 8，这意味着只 要有 8 个块成功写入，数据写入就被认为是成功的。</p><h3 id="数据写入确认机制" tabindex="-1"><a class="header-anchor" href="#数据写入确认机制"><span>数据写入确认机制</span></a></h3><ol><li><p><strong>数据分片和写入</strong>： 客户端将文件分成多个分片，每个分片被进一步分割成数据块和冗余块，并分布到多个存储节点上。</p></li><li><p><strong>节点确认消息</strong>： 每个节点在成功写入一个数据块或冗余块后，会发送一个确认消息（ACK）给主控节点或协调器。主控节点收集这些确认消息。</p></li><li><p><strong>确认消息配额</strong>： 主控节点只需要收到满足写入配额的确认消息。例如，如果写入配额是 8，只要有 8 个确认消息，就可以认为数据写入成功。</p></li><li><p><strong>数据完整性检查</strong>： 主控节点在收到足够多的确认消息后，进行数据完整性检查，确保数据未被篡改或损坏。</p></li><li><p><strong>客户端通知</strong>： 在数据完整性检查通过后，主控节点通知客户端数据写入成功。</p></li></ol><h3 id="代码示例" tabindex="-1"><a class="header-anchor" href="#代码示例"><span>代码示例</span></a></h3><p>以下是一个简单的 Java 示例，展示了如何通过写入配额机制进行数据写入确认。</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="language-java"><code><span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token operator">*</span></span><span class="token punctuation">;</span></span>\n<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token operator">*</span></span><span class="token punctuation">;</span></span>\n<span class="line"></span>\n<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MinioDataShardWriter</span> <span class="token punctuation">{</span></span>\n<span class="line"></span>\n<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">DATA_BLOCKS</span> <span class="token operator">=</span> <span class="token number">8</span><span class="token punctuation">;</span></span>\n<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">PARITY_BLOCKS</span> <span class="token operator">=</span> <span class="token number">4</span><span class="token punctuation">;</span></span>\n<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">TOTAL_BLOCKS</span> <span class="token operator">=</span> <span class="token constant">DATA_BLOCKS</span> <span class="token operator">+</span> <span class="token constant">PARITY_BLOCKS</span><span class="token punctuation">;</span></span>\n<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">WRITE_QUORUM</span> <span class="token operator">=</span> <span class="token number">8</span><span class="token punctuation">;</span></span>\n<span class="line"></span>\n<span class="line">    <span class="token keyword">private</span> <span class="token class-name">ConcurrentMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Set</span><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> receivedAcks <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ConcurrentHashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"></span>\n<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">writeData</span><span class="token punctuation">(</span><span class="token class-name">String</span> bucketName<span class="token punctuation">,</span> <span class="token class-name">String</span> objectKey<span class="token punctuation">,</span> <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> data<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span></span>\n<span class="line">        <span class="token comment">// Erasure coding</span></span>\n<span class="line">        <span class="token class-name">ErasureEncoder</span> encoder <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ErasureEncoder</span><span class="token punctuation">(</span><span class="token constant">DATA_BLOCKS</span><span class="token punctuation">,</span> <span class="token constant">PARITY_BLOCKS</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">        <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">]</span> blocks <span class="token operator">=</span> encoder<span class="token punctuation">.</span><span class="token function">encode</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"></span>\n<span class="line">        <span class="token comment">// Distribute blocks to different nodes</span></span>\n<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> blocks<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">            <span class="token class-name">String</span> node <span class="token operator">=</span> <span class="token function">getNodeForBlock</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">            <span class="token function">sendDataToNode</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> bucketName<span class="token punctuation">,</span> objectKey<span class="token punctuation">,</span> blocks<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> i<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">        <span class="token punctuation">}</span></span>\n<span class="line"></span>\n<span class="line">        <span class="token comment">// Wait for enough acks to meet the write quorum</span></span>\n<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">waitForAcks</span><span class="token punctuation">(</span>bucketName<span class="token punctuation">,</span> objectKey<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">IOException</span><span class="token punctuation">(</span><span class="token string">&quot;Failed to receive enough acks for write quorum&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">        <span class="token punctuation">}</span></span>\n<span class="line"></span>\n<span class="line">        <span class="token comment">// Data integrity check and notify client</span></span>\n<span class="line">        <span class="token function">completeWrite</span><span class="token punctuation">(</span>bucketName<span class="token punctuation">,</span> objectKey<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">    <span class="token punctuation">}</span></span>\n<span class="line"></span>\n<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> <span class="token function">getNodeForBlock</span><span class="token punctuation">(</span><span class="token keyword">int</span> blockIndex<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">        <span class="token comment">// Determine the node for the block based on the block index</span></span>\n<span class="line">        <span class="token comment">// For simplicity, assume a static mapping</span></span>\n<span class="line">        <span class="token keyword">return</span> <span class="token string">&quot;http://minio-node-&quot;</span> <span class="token operator">+</span> <span class="token punctuation">(</span>blockIndex <span class="token operator">%</span> <span class="token number">4</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;:9000&quot;</span><span class="token punctuation">;</span></span>\n<span class="line">    <span class="token punctuation">}</span></span>\n<span class="line"></span>\n<span class="line">    <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">sendDataToNode</span><span class="token punctuation">(</span><span class="token class-name">String</span> node<span class="token punctuation">,</span> <span class="token class-name">String</span> bucketName<span class="token punctuation">,</span> <span class="token class-name">String</span> objectKey<span class="token punctuation">,</span> <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> block<span class="token punctuation">,</span> </span>\n<span class="line">    <span class="token keyword">int</span> blockIndex<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span> <span class="token punctuation">{</span></span>\n<span class="line">        <span class="token comment">// Send data to the node</span></span>\n<span class="line">        <span class="token comment">// Here you can use HTTP client or MinIO SDK to send data</span></span>\n<span class="line"></span>\n<span class="line">        <span class="token comment">// Simulate sending ACK after successful write</span></span>\n<span class="line">        <span class="token function">sendAckToCoordinator</span><span class="token punctuation">(</span>bucketName<span class="token punctuation">,</span> objectKey<span class="token punctuation">,</span> blockIndex<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">    <span class="token punctuation">}</span></span>\n<span class="line"></span>\n<span class="line">    <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">sendAckToCoordinator</span><span class="token punctuation">(</span><span class="token class-name">String</span> bucketName<span class="token punctuation">,</span> <span class="token class-name">String</span> objectKey<span class="token punctuation">,</span> <span class="token keyword">int</span> blockIndex<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">        <span class="token class-name">String</span> key <span class="token operator">=</span> bucketName <span class="token operator">+</span> <span class="token string">&quot;/&quot;</span> <span class="token operator">+</span> objectKey<span class="token punctuation">;</span></span>\n<span class="line">        receivedAcks<span class="token punctuation">.</span><span class="token function">putIfAbsent</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">HashSet</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">        receivedAcks<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>blockIndex<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">    <span class="token punctuation">}</span></span>\n<span class="line"></span>\n<span class="line">    <span class="token keyword">private</span> <span class="token keyword">boolean</span> <span class="token function">waitForAcks</span><span class="token punctuation">(</span><span class="token class-name">String</span> bucketName<span class="token punctuation">,</span> <span class="token class-name">String</span> objectKey<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">InterruptedException</span> <span class="token punctuation">{</span></span>\n<span class="line">        <span class="token class-name">String</span> key <span class="token operator">=</span> bucketName <span class="token operator">+</span> <span class="token string">&quot;/&quot;</span> <span class="token operator">+</span> objectKey<span class="token punctuation">;</span></span>\n<span class="line">        <span class="token keyword">int</span> maxWaitTime <span class="token operator">=</span> <span class="token number">10000</span><span class="token punctuation">;</span> <span class="token comment">// Maximum wait time in milliseconds</span></span>\n<span class="line">        <span class="token keyword">int</span> waitInterval <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span> <span class="token comment">// Wait interval in milliseconds</span></span>\n<span class="line">        <span class="token keyword">int</span> waitedTime <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>\n<span class="line"></span>\n<span class="line">        <span class="token keyword">while</span> <span class="token punctuation">(</span>waitedTime <span class="token operator">&lt;</span> maxWaitTime<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>receivedAcks<span class="token punctuation">.</span><span class="token function">containsKey</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> receivedAcks<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&gt;=</span> <span class="token constant">WRITE_QUORUM</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">                <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>\n<span class="line">            <span class="token punctuation">}</span></span>\n<span class="line">            <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span>waitInterval<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">            waitedTime <span class="token operator">+=</span> waitInterval<span class="token punctuation">;</span></span>\n<span class="line">        <span class="token punctuation">}</span></span>\n<span class="line"></span>\n<span class="line">        <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>\n<span class="line">    <span class="token punctuation">}</span></span>\n<span class="line"></span>\n<span class="line">    <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">completeWrite</span><span class="token punctuation">(</span><span class="token class-name">String</span> bucketName<span class="token punctuation">,</span> <span class="token class-name">String</span> objectKey<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">        <span class="token comment">// Perform data integrity check and notify client</span></span>\n<span class="line">        <span class="token comment">// This could involve updating metadata, notifying client, etc.</span></span>\n<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;Write completed for &quot;</span> <span class="token operator">+</span> bucketName <span class="token operator">+</span> <span class="token string">&quot;/&quot;</span> <span class="token operator">+</span> objectKey<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">    <span class="token punctuation">}</span></span>\n<span class="line"><span class="token punctuation">}</span></span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3><p>在 MinIO 集群中，数据写入的确认消息机制并不依赖于所有节点的确认，而是基于纠删码和写入配额的机制。通过满足写入 配额的确认消息数量，MinIO 能够在保证数据完整性和一致性的前提下，实现高效的数据写入和存储。这种机制提高了系统的 容错能力和可用性，即使部分节点出现故障，数据仍然可以被可靠地存储和恢复。</p>',14)],t={},c=(0,a(6262).A)(t,[["render",function(n,s){return(0,p.uX)(),(0,p.CE)("div",null,e)}]]),o=JSON.parse('{"path":"/blog/minio/Minio-%E9%9B%86%E7%BE%A4%E6%95%B0%E6%8D%AE%E5%86%99%E5%85%A5%E7%A1%AE%E8%AE%A4%E6%B6%88%E6%81%AF%E6%9C%BA%E5%88%B6%E5%88%86%E6%9E%90.html","title":"Minio 集群数据写入确认消息机制分析","lang":"zh-CN","frontmatter":{"date":"2021-07-07T00:00:00.000Z","category":["Minio"],"tag":["对象存储"],"sticky":true,"excerpt":"<p> Minio 上传请求负载分析 </p>"},"headers":[{"level":3,"title":"纠删码和写入配额（Write Quorum）","slug":"纠删码和写入配额-write-quorum","link":"#纠删码和写入配额-write-quorum","children":[]},{"level":3,"title":"数据写入确认机制","slug":"数据写入确认机制","link":"#数据写入确认机制","children":[]},{"level":3,"title":"代码示例","slug":"代码示例","link":"#代码示例","children":[]},{"level":3,"title":"总结","slug":"总结","link":"#总结","children":[]}],"git":{"updatedTime":1720532327000,"contributors":[{"name":"asus","email":"939943844@qq.com","commits":1}]},"filePathRelative":"blog/minio/Minio-集群数据写入确认消息机制分析.md"}')}}]);