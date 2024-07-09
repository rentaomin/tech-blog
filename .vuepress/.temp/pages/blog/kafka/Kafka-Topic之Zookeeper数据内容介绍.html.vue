<template><div><h1 id="kafka-topic-之-zookeeper-数据内容介绍" tabindex="-1"><a class="header-anchor" href="#kafka-topic-之-zookeeper-数据内容介绍"><span>Kafka Topic 之 Zookeeper 数据内容介绍</span></a></h1>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token punctuation">[</span>zk: <span class="token number">192.168</span>.0.200:2181<span class="token punctuation">(</span>CONNECTED<span class="token punctuation">)</span> <span class="token number">13</span><span class="token punctuation">]</span> get /brokers/topics/test_cluster</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">{</span><span class="token string">"partitions"</span>:<span class="token punctuation">{</span><span class="token string">"0"</span>:<span class="token punctuation">[</span><span class="token number">0,2</span>,3<span class="token punctuation">]</span>,<span class="token string">"1"</span>:<span class="token punctuation">[</span><span class="token number">2,3</span>,0<span class="token punctuation">]</span>,<span class="token string">"2"</span>:<span class="token punctuation">[</span><span class="token number">3,0</span>,2<span class="token punctuation">]</span><span class="token punctuation">}</span>,<span class="token string">"topic_id"</span><span class="token builtin class-name">:</span><span class="token string">"aSFJVxF7SIaTCptmWn_GgA"</span>,<span class="token string">"adding_replicas"</span>:<span class="token punctuation">{</span><span class="token punctuation">}</span>,<span class="token string">"removing_replicas"</span>:<span class="token punctuation">{</span><span class="token punctuation">}</span>,<span class="token string">"version"</span>:3<span class="token punctuation">}</span>；</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从提供的 ZooKeeper 输出中可以看出 Kafka Topic <code v-pre>test_cluster</code> 的分区和副本分布情况。以下是对输出内容
的详细解释：</p>
<h3 id="_1-zookeeper-中的-topic-配置信息" tabindex="-1"><a class="header-anchor" href="#_1-zookeeper-中的-topic-配置信息"><span>1. ZooKeeper 中的 Topic 配置信息</span></a></h3>
<p>ZooKeeper 中存储了 Kafka 的元数据信息，包括 Topic 的分区、分区的副本分布等。通过
<code v-pre>get /brokers/topics/test_cluster</code> 命令获取的结果展示了 Topic <code v-pre>test_cluster</code> 的配置信息。</p>
<h3 id="_2-json-结构解析" tabindex="-1"><a class="header-anchor" href="#_2-json-结构解析"><span>2. JSON 结构解析</span></a></h3>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre class="language-json"><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"partitions"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"0"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"1"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"2"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">]</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"topic_id"</span><span class="token operator">:</span> <span class="token string">"aSFJVxF7SIaTCptmWn_GgA"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"adding_replicas"</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"removing_replicas"</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"version"</span><span class="token operator">:</span> <span class="token number">3</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="各字段含义" tabindex="-1"><a class="header-anchor" href="#各字段含义"><span>各字段含义：</span></a></h4>
<ul>
<li><strong>partitions</strong>：分区和副本的分布信息。
<ul>
<li><strong>&quot;0&quot;: [0, 2, 3]</strong>：表示分区 0 的副本分布在 Broker 0、Broker 2 和 Broker 3 上。</li>
<li><strong>&quot;1&quot;: [2, 3, 0]</strong>：表示分区 1 的副本分布在 Broker 2、Broker 3 和 Broker 0 上。</li>
<li><strong>&quot;2&quot;: [3, 0, 2]</strong>：表示分区 2 的副本分布在 Broker 3、Broker 0 和 Broker 2 上。</li>
</ul>
</li>
<li><strong>topic_id</strong>：<code v-pre>test_cluster</code> 这个 Topic 的唯一标识符。</li>
<li><strong>adding_replicas</strong>：正在添加的副本信息（当前为空）。</li>
<li><strong>removing_replicas</strong>：正在移除的副本信息（当前为空）。</li>
<li><strong>version</strong>：Topic 配置的版本号，用于兼容性管理。</li>
</ul>
<h3 id="_3-分区和副本分布详情" tabindex="-1"><a class="header-anchor" href="#_3-分区和副本分布详情"><span>3. 分区和副本分布详情</span></a></h3>
<p>根据输出的分布信息，可以看出 <code v-pre>test_cluster</code> 这个 Topic 有 3 个分区（0、1、2），每个分区有 3 个
副本。具体分布如下：</p>
<ul>
<li>
<p><strong>分区 0</strong>：</p>
<ul>
<li><strong>副本列表</strong>：Broker 0、Broker 2、Broker 3</li>
<li><strong>Leader 角色</strong>：假设 Broker 0 是 Leader，则 Broker 2 和 Broker 3 是 Follower。</li>
</ul>
</li>
<li>
<p><strong>分区 1</strong>：</p>
<ul>
<li><strong>副本列表</strong>：Broker 2、Broker 3、Broker 0</li>
<li><strong>Leader 角色</strong>：假设 Broker 2 是 Leader，则 Broker 3 和 Broker 0 是 Follower。</li>
</ul>
</li>
<li>
<p><strong>分区 2</strong>：</p>
<ul>
<li><strong>副本列表</strong>：Broker 3、Broker 0、Broker 2</li>
<li><strong>Leader 角色</strong>：假设 Broker 3 是 Leader，则 Broker 0 和 Broker 2 是 Follower。</li>
</ul>
</li>
</ul>
<h3 id="_4-kafka-副本分布策略" tabindex="-1"><a class="header-anchor" href="#_4-kafka-副本分布策略"><span>4. Kafka 副本分布策略</span></a></h3>
<p>Kafka 采用一种叫做“交错副本分配”（interleaved replica assignment）的策略来分配分区和副本。这种
策略确保分区和副本均匀分布在不同的 Broker 上，以实现负载均衡和高可用性。</p>
<h4 id="分布策略示例" tabindex="-1"><a class="header-anchor" href="#分布策略示例"><span>分布策略示例</span></a></h4>
<p>假设有 3 个 Broker（0, 2, 3），3 个分区，3 个副本，分配策略如下：</p>
<ul>
<li>分区 0：副本分布在 Broker 0、Broker 2、Broker 3</li>
<li>分区 1：副本分布在 Broker 2、Broker 3、Broker 0</li>
<li>分区 2：副本分布在 Broker 3、Broker 0、Broker 2</li>
</ul>
<h3 id="_5-数据同步机制" tabindex="-1"><a class="header-anchor" href="#_5-数据同步机制"><span>5. 数据同步机制</span></a></h3>
<h4 id="leader-和-follower" tabindex="-1"><a class="header-anchor" href="#leader-和-follower"><span>Leader 和 Follower</span></a></h4>
<ul>
<li><strong>Leader 副本</strong>：负责处理所有的读写请求。</li>
<li><strong>Follower 副本</strong>：从 Leader 复制数据，保持与 Leader 数据一致。</li>
</ul>
<h4 id="isr-in-sync-replica" tabindex="-1"><a class="header-anchor" href="#isr-in-sync-replica"><span>ISR（In-Sync Replica）</span></a></h4>
<ul>
<li>ISR 列表包含所有与 Leader 保持同步的副本。当消息被写入到所有 ISR 副本后，Leader 会确认消息提交。</li>
<li>如果某个 Follower 长时间未能同步数据，Kafka 会将其从 ISR 列表中移除。</li>
</ul>
<h3 id="_6-副本同步过程" tabindex="-1"><a class="header-anchor" href="#_6-副本同步过程"><span>6. 副本同步过程</span></a></h3>
<ol>
<li><strong>生产者发送消息到 Leader</strong>：生产者根据分区策略将消息发送到分区的 Leader。</li>
<li><strong>Leader 写入日志</strong>：Leader 将消息写入本地日志，并开始同步到 Follower。</li>
<li><strong>Follower 复制消息</strong>：Follower 从 Leader 拉取消息，并写入本地日志。</li>
<li><strong>确认消息提交</strong>：当消息被写入到所有 ISR 副本后，Leader 确认消息提交。</li>
</ol>
<h3 id="核心代码示例" tabindex="-1"><a class="header-anchor" href="#核心代码示例"><span>核心代码示例</span></a></h3>
<p>以下是 Kafka 中处理副本同步的核心代码示例：</p>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre v-pre class="language-java"><code><span class="line"><span class="token comment">// ReplicaFetcherThread.scala</span></span>
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
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-高可用性和容错机制" tabindex="-1"><a class="header-anchor" href="#_7-高可用性和容错机制"><span>7. 高可用性和容错机制</span></a></h3>
<p>Kafka 通过副本机制和 ISR 列表实现高可用性和容错：</p>
<ul>
<li><strong>副本机制</strong>：每个分区有多个副本，分布在不同的 Broker 上。如果某个 Broker 故障，其他 Broker 上的副本
可以继续提供服务。</li>
<li><strong>ISR 列表</strong>：确保数据的一致性和高可用性。只有当所有 ISR 副本都成功写入消息后，Leader 才确认消息提交。</li>
</ul>
<h3 id="_8-小结" tabindex="-1"><a class="header-anchor" href="#_8-小结"><span>8. 小结</span></a></h3>
<p>通过以上分析，可以看出 Kafka 通过分区和副本机制实现了高可用性和高性能。分区和副本的均匀分布确保了负载均衡，
而 ISR 列表确保了数据一致性和容错能力。这些设计使得 Kafka 成为一个高效、可靠的分布式消息系统。</p>
</div></template>


