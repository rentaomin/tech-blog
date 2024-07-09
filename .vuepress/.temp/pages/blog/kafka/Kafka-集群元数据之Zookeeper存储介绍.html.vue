<template><div><h1 id="kafka-集群元数据之zookeeper存储介绍" tabindex="-1"><a class="header-anchor" href="#kafka-集群元数据之zookeeper存储介绍"><span>Kafka 集群元数据之Zookeeper存储介绍？</span></a></h1>
<p>在 Kafka 集群中，ZooKeeper 存储了大量的元数据，管理和协调 Kafka 的各个组件。以下是 ZooKeeper 中创建
的主要信息及其作用：</p>
<h3 id="_1-broker-信息" tabindex="-1"><a class="header-anchor" href="#_1-broker-信息"><span>1. <strong>Broker 信息</strong></span></a></h3>
<p><strong>路径</strong>：</p>
<ul>
<li><code v-pre>/brokers/ids/[broker_id]</code></li>
<li><code v-pre>/brokers/topics/[topic_name]</code></li>
<li><code v-pre>/brokers/seqid</code></li>
</ul>
<p><strong>作用</strong>：</p>
<ul>
<li><strong>Broker 注册和发现</strong>：每个 Kafka Broker 在启动时会在 ZooKeeper 中注册自己的信息，包括 <code v-pre>broker.id</code>、主机名和端口号。其他组件可以通过读取这些节点来发现当前集群中的所有 Broker。</li>
<li><strong>Topic 配置管理</strong>：存储每个 Topic 的配置信息，包括 Partition 数量和副本因子等。</li>
<li><strong>序列 ID 管理</strong>：用于生成唯一的序列 ID，确保每个 Topic 和 Partition 的唯一性。</li>
</ul>
<h3 id="_2-topic-和-partition-信息" tabindex="-1"><a class="header-anchor" href="#_2-topic-和-partition-信息"><span>2. <strong>Topic 和 Partition 信息</strong></span></a></h3>
<p><strong>路径</strong>：</p>
<ul>
<li><code v-pre>/brokers/topics/[topic_name]/partitions/[partition_id]/state</code></li>
</ul>
<p><strong>作用</strong>：</p>
<ul>
<li><strong>Partition Leader 信息</strong>：存储每个 Partition 的 Leader 和 Follower 信息，确定哪个 Broker 是当前 Partition 的 Leader。</li>
<li><strong>ISR 列表</strong>：记录当前 Partition 的 In-Sync Replica (ISR) 列表，标识哪些副本是与 Leader 同步的。</li>
</ul>
<h3 id="_3-controller-信息" tabindex="-1"><a class="header-anchor" href="#_3-controller-信息"><span>3. <strong>Controller 信息</strong></span></a></h3>
<p><strong>路径</strong>：</p>
<ul>
<li><code v-pre>/controller</code></li>
<li><code v-pre>/controller_epoch</code></li>
</ul>
<p><strong>作用</strong>：</p>
<ul>
<li><strong>Controller 选举</strong>：存储当前 Kafka Controller 的信息，Controller 是一个特殊的 Broker，负责管理集群范围内的行政任务，如分区重新分配和副本管理。</li>
<li><strong>Controller 纪元</strong>：记录 Controller 的纪元（epoch），用于确保每个 Controller 任期内的唯一性和一致性。</li>
</ul>
<h3 id="_4-consumer-group-信息" tabindex="-1"><a class="header-anchor" href="#_4-consumer-group-信息"><span>4. <strong>Consumer Group 信息</strong></span></a></h3>
<p>（适用于 Kafka 早期版本，0.9 及以上版本已移至 Kafka 内部 Topic）</p>
<p><strong>路径</strong>：</p>
<ul>
<li><code v-pre>/consumers/[group_id]/ids/[consumer_id]</code></li>
<li><code v-pre>/consumers/[group_id]/offsets/[topic]/[partition]</code></li>
</ul>
<p><strong>作用</strong>：</p>
<ul>
<li><strong>消费者组成员</strong>：记录每个消费者组中的消费者实例信息，包括消费者 ID 和分配的 Partition。</li>
<li><strong>消费偏移量</strong>：存储每个消费者组在各个 Partition 上的消费偏移量，用于消费者重启后的恢复。</li>
</ul>
<h3 id="_5-配置信息" tabindex="-1"><a class="header-anchor" href="#_5-配置信息"><span>5. <strong>配置信息</strong></span></a></h3>
<p><strong>路径</strong>：</p>
<ul>
<li><code v-pre>/config/topics/[topic_name]</code></li>
<li><code v-pre>/config/changes/config_change_[sequence_number]</code></li>
</ul>
<p><strong>作用</strong>：</p>
<ul>
<li><strong>Topic 配置</strong>：存储每个 Topic 的详细配置信息，包括清理策略、保留时间等。</li>
<li><strong>配置变更记录</strong>：记录每次配置变更的详细信息，确保配置变更的有序性和一致性。</li>
</ul>
<h3 id="_6-acl-访问控制列表" tabindex="-1"><a class="header-anchor" href="#_6-acl-访问控制列表"><span>6. <strong>ACL（访问控制列表）</strong></span></a></h3>
<p><strong>路径</strong>：</p>
<ul>
<li><code v-pre>/zookeeper/quota</code></li>
<li><code v-pre>/zookeeper/config</code></li>
<li><code v-pre>/zookeeper/quota/limits</code></li>
</ul>
<p><strong>作用</strong>：</p>
<ul>
<li><strong>访问控制</strong>：存储 Kafka 集群的 ACL 信息，管理对 Kafka 资源的访问权限，确保安全性。</li>
<li><strong>配额管理</strong>：存储集群的配额限制，防止过度使用资源。</li>
</ul>
<h3 id="具体信息示例" tabindex="-1"><a class="header-anchor" href="#具体信息示例"><span>具体信息示例</span></a></h3>
<p>以下是一些具体的 ZooKeeper 中存储的信息示例：</p>
<h4 id="broker-信息" tabindex="-1"><a class="header-anchor" href="#broker-信息"><span>Broker 信息</span></a></h4>
<p><strong>路径</strong>：<code v-pre>/brokers/ids/1</code></p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre class="language-json"><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"broker_id"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"host"</span><span class="token operator">:</span> <span class="token string">"kafka1"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"port"</span><span class="token operator">:</span> <span class="token number">9092</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="topic-和-partition-信息" tabindex="-1"><a class="header-anchor" href="#topic-和-partition-信息"><span>Topic 和 Partition 信息</span></a></h4>
<p><strong>路径</strong>：<code v-pre>/brokers/topics/my_topic/partitions/0/state</code></p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre class="language-json"><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"controller_epoch"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"leader"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"version"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"leader_epoch"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"isr"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="controller-信息" tabindex="-1"><a class="header-anchor" href="#controller-信息"><span>Controller 信息</span></a></h4>
<p><strong>路径</strong>：<code v-pre>/controller</code></p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre class="language-json"><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"version"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"brokerid"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"timestamp"</span><span class="token operator">:</span> <span class="token string">"1632951600000"</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="consumer-group-信息-适用于早期版本" tabindex="-1"><a class="header-anchor" href="#consumer-group-信息-适用于早期版本"><span>Consumer Group 信息（适用于早期版本）</span></a></h4>
<p><strong>路径</strong>：<code v-pre>/consumers/my_group/offsets/my_topic/0</code></p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre class="language-json"><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"offset"</span><span class="token operator">:</span> <span class="token number">12345</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<p>在 Kafka 集群中，ZooKeeper 存储和管理了大量的元数据信息，确保了 Kafka 的高可用性和一致性。理解这些信息的具体作用，有助于更好地设计、部署和维护 Kafka 系统。主要信息包括 Broker 注册和发现、Topic 和 Partition 信息、Controller 选举、消费者组管理、配置信息和 ACL 管理。通过这些信息，ZooKeeper 有效地协调和管理了 Kafka 的各个组件。</p>
</div></template>


