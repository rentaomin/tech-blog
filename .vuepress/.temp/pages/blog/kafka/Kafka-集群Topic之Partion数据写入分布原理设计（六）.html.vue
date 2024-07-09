<template><div><h1 id="kafka-集群-topic-之-partion-数据写入分布原理设计-六" tabindex="-1"><a class="header-anchor" href="#kafka-集群-topic-之-partion-数据写入分布原理设计-六"><span>kafka 集群 Topic 之 Partion 数据写入分布原理设计（六）</span></a></h1>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">集群中假如有三个节点，分别ip为200，201，202 创建topic 为test,默认分区2，副本2，在写入消息</span>
<span class="line">到topic时，数据就转的过程是什么，则 partition存储数据分布是如何分布的，各个节点数据如何同步</span>
<span class="line">的，isr如何实现的?</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 Kafka 集群中，Topic 的创建和消息写入涉及多个步骤，包括分区和副本的分布、消息的写入、数据
同步以及 ISR 列表的管理。下面详细介绍这些过程。</p>
<h3 id="_1-创建-topic-和分区副本分布" tabindex="-1"><a class="header-anchor" href="#_1-创建-topic-和分区副本分布"><span>1. 创建 Topic 和分区副本分布</span></a></h3>
<h4 id="创建-topic" tabindex="-1"><a class="header-anchor" href="#创建-topic"><span>创建 Topic</span></a></h4>
<p>假设在 Kafka 集群中创建一个名为 <code v-pre>test</code> 的 Topic，具有 2 个分区和 2 个副本。执行以下命令：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">bin/kafka-topics.sh <span class="token parameter variable">--create</span> <span class="token parameter variable">--topic</span> <span class="token builtin class-name">test</span> --bootstrap-server <span class="token number">192.168</span>.0.200:9092 <span class="token parameter variable">--partitions</span> <span class="token number">2</span> --replication-factor <span class="token number">2</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="分区和副本的分布" tabindex="-1"><a class="header-anchor" href="#分区和副本的分布"><span>分区和副本的分布</span></a></h4>
<p>Kafka 会将 Topic <code v-pre>test</code> 的 2 个分区和 2 个副本分布到 3 个节点上。例如，Kafka 可能会这样分配：</p>
<ul>
<li><strong>Partition 0</strong>：
<ul>
<li><strong>Leader</strong>：节点 192.168.0.200</li>
<li><strong>Follower</strong>：节点 192.168.0.201</li>
</ul>
</li>
<li><strong>Partition 1</strong>：
<ul>
<li><strong>Leader</strong>：节点 192.168.0.201</li>
<li><strong>Follower</strong>：节点 192.168.0.202</li>
</ul>
</li>
</ul>
<h3 id="_2-消息写入过程" tabindex="-1"><a class="header-anchor" href="#_2-消息写入过程"><span>2. 消息写入过程</span></a></h3>
<p>当生产者向 Topic <code v-pre>test</code> 写入消息时，消息会先写入每个分区的 Leader，然后由 Leader 同步到 Follower。</p>
<h4 id="消息写入示例" tabindex="-1"><a class="header-anchor" href="#消息写入示例"><span>消息写入示例</span></a></h4>
<p>假设生产者写入以下消息到 <code v-pre>test</code>：</p>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre v-pre class="language-java"><code><span class="line"><span class="token class-name">ProducerRecord</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">></span></span> record <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ProducerRecord</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token string">"test"</span><span class="token punctuation">,</span> <span class="token string">"key"</span><span class="token punctuation">,</span> <span class="token string">"value"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">producer<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>record<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="消息转发过程" tabindex="-1"><a class="header-anchor" href="#消息转发过程"><span>消息转发过程</span></a></h4>
<ol>
<li><strong>生产者发送消息</strong>：生产者根据分区策略（如基于 key 的 hash 分区）选择分区，将消息发送到该分区的
Leader。</li>
<li><strong>Leader 处理写请求</strong>：分区的 Leader 接收到消息后，将消息写入其本地日志。</li>
<li><strong>Follower 同步数据</strong>：Leader 将消息写入日志后，Follower 从 Leader 拉取消息并写入其本地日志。</li>
</ol>
<h3 id="_3-数据同步和-isr-列表管理" tabindex="-1"><a class="header-anchor" href="#_3-数据同步和-isr-列表管理"><span>3. 数据同步和 ISR 列表管理</span></a></h3>
<h4 id="数据同步" tabindex="-1"><a class="header-anchor" href="#数据同步"><span>数据同步</span></a></h4>
<p>Follower 从 Leader 同步数据的过程是异步进行的，以确保数据的一致性和高可用性。</p>
<h4 id="isr-列表" tabindex="-1"><a class="header-anchor" href="#isr-列表"><span>ISR 列表</span></a></h4>
<p>ISR（In-Sync Replica）列表包含所有与 Leader 保持同步的副本。当所有 ISR 副本都成功写入消息后，
Leader 会确认消息提交。</p>
<h4 id="isr-管理示例" tabindex="-1"><a class="header-anchor" href="#isr-管理示例"><span>ISR 管理示例</span></a></h4>
<ul>
<li><strong>初始 ISR</strong>：在 Partition 创建时，ISR 列表包含 Leader 和所有 Follower 副本。</li>
<li><strong>更新 ISR</strong>：如果 Follower 无法及时同步数据，Leader 会将其从 ISR 列表中移除；当 Follower
恢复同步后，再次添加到 ISR 列表中。</li>
</ul>
<h3 id="_4-核心代码示例" tabindex="-1"><a class="header-anchor" href="#_4-核心代码示例"><span>4. 核心代码示例</span></a></h3>
<h4 id="生产者发送消息" tabindex="-1"><a class="header-anchor" href="#生产者发送消息"><span>生产者发送消息</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre v-pre class="language-java"><code><span class="line"><span class="token comment">// Producer.java</span></span>
<span class="line"><span class="token class-name">Properties</span> props <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Properties</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">"bootstrap.servers"</span><span class="token punctuation">,</span> <span class="token string">"192.168.0.200:9092"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">"key.serializer"</span><span class="token punctuation">,</span> <span class="token string">"org.apache.kafka.common.serialization.StringSerializer"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">"value.serializer"</span><span class="token punctuation">,</span> <span class="token string">"org.apache.kafka.common.serialization.StringSerializer"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token class-name">KafkaProducer</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">></span></span> producer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">KafkaProducer</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token class-name">ProducerRecord</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">></span></span> record <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ProducerRecord</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token string">"test"</span><span class="token punctuation">,</span> <span class="token string">"key"</span><span class="token punctuation">,</span> <span class="token string">"value"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">producer<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>record<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="消息写入和同步" tabindex="-1"><a class="header-anchor" href="#消息写入和同步"><span>消息写入和同步</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre v-pre class="language-java"><code><span class="line"><span class="token comment">// Log.java</span></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">Log</span><span class="token punctuation">(</span>val dir<span class="token operator">:</span> <span class="token class-name">File</span><span class="token punctuation">,</span> val config<span class="token operator">:</span> <span class="token class-name">LogConfig</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    val segments <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">LogSegments</span><span class="token punctuation">(</span>dir<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">    def <span class="token function">append</span><span class="token punctuation">(</span>records<span class="token operator">:</span> <span class="token class-name">MemoryRecords</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token class-name">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">        val segment <span class="token operator">=</span> <span class="token function">maybeRoll</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">        segment<span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span>records<span class="token punctuation">)</span></span>
<span class="line">        <span class="token comment">// 同步到 Follower</span></span>
<span class="line">        <span class="token function">syncToFollowers</span><span class="token punctuation">(</span>records<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">private</span> def <span class="token function">syncToFollowers</span><span class="token punctuation">(</span>records<span class="token operator">:</span> <span class="token class-name">MemoryRecords</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token class-name">Unit</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 同步数据到 Follower 副本</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// ReplicaFetcherThread.java</span></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">ReplicaFetcherThread</span><span class="token punctuation">(</span>replicaId<span class="token operator">:</span> <span class="token class-name">Int</span><span class="token punctuation">,</span> leaderId<span class="token operator">:</span> <span class="token class-name">Int</span><span class="token punctuation">,</span> partition<span class="token operator">:</span> <span class="token class-name">TopicPartition</span><span class="token punctuation">)</span> <span class="token keyword">extends</span> <span class="token class-name">AbstractFetcherThread</span><span class="token punctuation">(</span>replicaId<span class="token punctuation">,</span> leaderId<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    override def <span class="token function">fetch</span><span class="token punctuation">(</span>fetchRequest<span class="token operator">:</span> <span class="token class-name">FetchRequest<span class="token punctuation">.</span>Builder</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token class-name">Map</span><span class="token punctuation">[</span><span class="token class-name">TopicPartition</span><span class="token punctuation">,</span> <span class="token class-name">FetchDataInfo</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">        val fetchResponse <span class="token operator">=</span> leaderBroker<span class="token punctuation">.</span><span class="token function">fetch</span><span class="token punctuation">(</span>fetchRequest<span class="token punctuation">)</span></span>
<span class="line">        fetchResponse<span class="token punctuation">.</span>data<span class="token punctuation">.</span>asScala<span class="token punctuation">.</span>map <span class="token punctuation">{</span> <span class="token keyword">case</span> <span class="token punctuation">(</span>tp<span class="token punctuation">,</span> data<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span></span>
<span class="line">            partition<span class="token punctuation">.</span>log<span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span></span>
<span class="line">            tp <span class="token operator">-></span> <span class="token class-name">FetchDataInfo</span><span class="token punctuation">(</span>partition<span class="token punctuation">.</span>log<span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>data<span class="token punctuation">.</span>baseOffset<span class="token punctuation">,</span> data<span class="token punctuation">.</span>records<span class="token punctuation">.</span>sizeInBytes<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">.</span>toMap</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-数据分布和同步示意" tabindex="-1"><a class="header-anchor" href="#_5-数据分布和同步示意"><span>5. 数据分布和同步示意</span></a></h3>
<h4 id="数据分布" tabindex="-1"><a class="header-anchor" href="#数据分布"><span>数据分布</span></a></h4>
<p>假设 Partition 0 的 Leader 在节点 192.168.0.200，Follower 在节点 192.168.0.201。当生产者发送消息到 Partition 0 时：</p>
<ol>
<li><strong>生产者发送消息到 Leader</strong>：消息写入节点 192.168.0.200。</li>
<li><strong>Leader 写入日志</strong>：节点 192.168.0.200 将消息写入本地日志。</li>
<li><strong>Follower 同步数据</strong>：节点 192.168.0.201 从 Leader 拉取消息，并写入本地日志。</li>
</ol>
<h4 id="数据同步和-isr" tabindex="-1"><a class="header-anchor" href="#数据同步和-isr"><span>数据同步和 ISR</span></a></h4>
<ol>
<li><strong>初始状态</strong>：ISR 包含节点 192.168.0.200 和 192.168.0.201。</li>
<li><strong>同步过程</strong>：Follower 节点 192.168.0.201 从 Leader 节点 192.168.0.200 同步数据。</li>
<li><strong>确认同步</strong>：Follower 节点 192.168.0.201 成功写入数据后，向 Leader 确认。Leader 将消息标记
为已提交。</li>
</ol>
<h3 id="_6-总结" tabindex="-1"><a class="header-anchor" href="#_6-总结"><span>6. 总结</span></a></h3>
<ul>
<li><strong>分区和副本分布</strong>：Topic 的分区和副本分布在不同的节点上，以确保高可用性和容错性。</li>
<li><strong>消息写入过程</strong>：生产者将消息写入分区的 Leader，Leader 再同步数据到 Follower。</li>
<li><strong>数据同步和 ISR</strong>：Follower 从 Leader 异步同步数据，ISR 列表管理同步状态，确保数据一致性。</li>
<li><strong>高效的日志管理</strong>：Kafka 通过日志分段管理和异步复制机制，确保高性能和高可用性。</li>
</ul>
<p>这些机制共同确保了 Kafka 集群在高并发和高负载下的高效运行，同时保证了数据的一致性和可靠性。</p>
</div></template>


