<template><div><h1 id="架构师之-kafka-核心概念入门" tabindex="-1"><a class="header-anchor" href="#架构师之-kafka-核心概念入门"><span>架构师之 Kafka 核心概念入门</span></a></h1>
<p>作为架构师，理解 Kafka 的核心概念至关重要。这些概念是构建高效、可靠的 Kafka 系统的基础。
以下是需要掌握的 Kafka 核心概念及其详细说明：</p>
<h3 id="_1-topic" tabindex="-1"><a class="header-anchor" href="#_1-topic"><span>1. <strong>Topic</strong></span></a></h3>
<ul>
<li>
<p><strong>定义</strong>：Topic 是 Kafka 中用于存储和分类消息的逻辑命名空间。每个 Topic 代表一类数据流，
例如日志、交易记录等。</p>
</li>
<li>
<p><strong>作用</strong>：通过 Topic，可以将不同类型的消息分开，方便管理和消费。</p>
</li>
<li>
<p><strong>操作</strong>：创建、删除和列出现有的 Topic。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token comment"># 创建一个新的 Topic</span></span>
<span class="line">kafka-topics.sh <span class="token parameter variable">--create</span> <span class="token parameter variable">--topic</span> my_topic --bootstrap-server localhost:9092 <span class="token parameter variable">--partitions</span> <span class="token number">3</span> --replication-factor <span class="token number">2</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 列出所有 Topic</span></span>
<span class="line">kafka-topics.sh <span class="token parameter variable">--list</span> --bootstrap-server localhost:9092</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 删除一个 Topic</span></span>
<span class="line">kafka-topics.sh <span class="token parameter variable">--delete</span> <span class="token parameter variable">--topic</span> my_topic --bootstrap-server localhost:9092</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="_2-partition" tabindex="-1"><a class="header-anchor" href="#_2-partition"><span>2. <strong>Partition</strong></span></a></h3>
<ul>
<li><strong>定义</strong>：Partition 是 Topic 的子集，是一个有序的、不可变的消息队列。每个 Partition 可以存储多个消息。</li>
<li><strong>作用</strong>：通过 Partition，可以实现消息的并行处理，提升系统的吞吐量。</li>
<li><strong>操作</strong>：创建 Topic 时指定 Partition 数量，或者在现有 Topic 上增加 Partition。<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token comment"># 增加现有 Topic 的 Partition 数量</span></span>
<span class="line">kafka-topics.sh <span class="token parameter variable">--alter</span> <span class="token parameter variable">--topic</span> my_topic <span class="token parameter variable">--partitions</span> <span class="token number">5</span> --bootstrap-server localhost:9092</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="_3-offset" tabindex="-1"><a class="header-anchor" href="#_3-offset"><span>3. <strong>Offset</strong></span></a></h3>
<ul>
<li><strong>定义</strong>：Offset 是 Partition 中每条消息的唯一标识。Offset 是一个递增的整数，用于定位和跟踪消息。</li>
<li><strong>作用</strong>：通过 Offset，可以确保每条消息在消费时的顺序和位置。</li>
<li><strong>操作</strong>：消费者通过 Offset 跟踪消费进度，支持自动和手动提交 Offset。<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre v-pre class="language-java"><code><span class="line"><span class="token comment">// 消费者配置示例</span></span>
<span class="line"><span class="token class-name">Properties</span> props <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Properties</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">"bootstrap.servers"</span><span class="token punctuation">,</span> <span class="token string">"localhost:9092"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">"group.id"</span><span class="token punctuation">,</span> <span class="token string">"test_group"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">"enable.auto.commit"</span><span class="token punctuation">,</span> <span class="token string">"true"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">"auto.commit.interval.ms"</span><span class="token punctuation">,</span> <span class="token string">"1000"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">"key.deserializer"</span><span class="token punctuation">,</span> <span class="token string">"org.apache.kafka.common.serialization.StringDeserializer"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">"value.deserializer"</span><span class="token punctuation">,</span> <span class="token string">"org.apache.kafka.common.serialization.StringDeserializer"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="_4-producer" tabindex="-1"><a class="header-anchor" href="#_4-producer"><span>4. <strong>Producer</strong></span></a></h3>
<ul>
<li><strong>定义</strong>：Producer 是发送消息到 Kafka Topic 的客户端应用程序。</li>
<li><strong>作用</strong>：Producer 将数据发布到指定的 Topic，可以选择将消息发送到特定的 Partition。</li>
<li><strong>操作</strong>：配置 Producer 属性，发送消息到 Kafka。<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre v-pre class="language-java"><code><span class="line"><span class="token comment">// Producer 配置示例</span></span>
<span class="line"><span class="token class-name">Properties</span> props <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Properties</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">"bootstrap.servers"</span><span class="token punctuation">,</span> <span class="token string">"localhost:9092"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">"key.serializer"</span><span class="token punctuation">,</span> <span class="token string">"org.apache.kafka.common.serialization.StringSerializer"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">"value.serializer"</span><span class="token punctuation">,</span> <span class="token string">"org.apache.kafka.common.serialization.StringSerializer"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token class-name">Producer</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">></span></span> producer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">KafkaProducer</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">producer<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">ProducerRecord</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token string">"my_topic"</span><span class="token punctuation">,</span> <span class="token string">"key"</span><span class="token punctuation">,</span> <span class="token string">"value"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">producer<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="_5-consumer" tabindex="-1"><a class="header-anchor" href="#_5-consumer"><span>5. <strong>Consumer</strong></span></a></h3>
<ul>
<li><strong>定义</strong>：Consumer 是从 Kafka Topic 中读取和处理消息的客户端应用程序。</li>
<li><strong>作用</strong>：Consumer 可以组成消费组（Consumer Group），每个组内的 Consumer 分配处理不同的 Partition，确保消息只被消费一次。</li>
<li><strong>操作</strong>：配置 Consumer 属性，消费 Kafka 中的消息。<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre v-pre class="language-java"><code><span class="line"><span class="token comment">// Consumer 配置示例</span></span>
<span class="line"><span class="token class-name">Properties</span> props <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Properties</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">"bootstrap.servers"</span><span class="token punctuation">,</span> <span class="token string">"localhost:9092"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">"group.id"</span><span class="token punctuation">,</span> <span class="token string">"test_group"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">"enable.auto.commit"</span><span class="token punctuation">,</span> <span class="token string">"true"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">"auto.commit.interval.ms"</span><span class="token punctuation">,</span> <span class="token string">"1000"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">"key.deserializer"</span><span class="token punctuation">,</span> <span class="token string">"org.apache.kafka.common.serialization.StringDeserializer"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">props<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">"value.deserializer"</span><span class="token punctuation">,</span> <span class="token string">"org.apache.kafka.common.serialization.StringDeserializer"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token class-name">KafkaConsumer</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">></span></span> consumer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">KafkaConsumer</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">consumer<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">asList</span><span class="token punctuation">(</span><span class="token string">"my_topic"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">ConsumerRecords</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">></span></span> records <span class="token operator">=</span> consumer<span class="token punctuation">.</span><span class="token function">poll</span><span class="token punctuation">(</span><span class="token class-name">Duration</span><span class="token punctuation">.</span><span class="token function">ofMillis</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">ConsumerRecord</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">></span></span> record <span class="token operator">:</span> records<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">"offset = %d, key = %s, value = %s%n"</span><span class="token punctuation">,</span> record<span class="token punctuation">.</span><span class="token function">offset</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> record<span class="token punctuation">.</span><span class="token function">key</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> record<span class="token punctuation">.</span><span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="_6-broker" tabindex="-1"><a class="header-anchor" href="#_6-broker"><span>6. <strong>Broker</strong></span></a></h3>
<ul>
<li><strong>定义</strong>：Broker 是 Kafka 的运行实例，负责接收、存储和传递消息。</li>
<li><strong>作用</strong>：Broker 是 Kafka 集群的节点，每个集群可以包含一个或多个 Broker。</li>
<li><strong>操作</strong>：启动和停止 Broker，查看 Broker 状态。<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token comment"># 启动 Kafka Broker</span></span>
<span class="line">bin/kafka-server-start.sh config/server.properties</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 停止 Kafka Broker</span></span>
<span class="line">bin/kafka-server-stop.sh</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="_7-zookeeper" tabindex="-1"><a class="header-anchor" href="#_7-zookeeper"><span>7. <strong>ZooKeeper</strong></span></a></h3>
<ul>
<li><strong>定义</strong>：ZooKeeper 是 Kafka 集群的协调服务，用于管理元数据和集群配置。</li>
<li><strong>作用</strong>：ZooKeeper 负责维护 Kafka 集群的节点状态，进行 Leader 选举和元数据管理。</li>
<li><strong>操作</strong>：启动和停止 ZooKeeper，查看 ZooKeeper 状态。<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token comment"># 启动 ZooKeeper</span></span>
<span class="line">bin/zkServer.sh start</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 停止 ZooKeeper</span></span>
<span class="line">bin/zkServer.sh stop</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="_8-replication-数据复制" tabindex="-1"><a class="header-anchor" href="#_8-replication-数据复制"><span>8. <strong>Replication（数据复制）</strong></span></a></h3>
<ul>
<li><strong>定义</strong>：Replication 是 Kafka 中的消息副本机制，每个 Partition 可以有多个副本。</li>
<li><strong>作用</strong>：通过复制，Kafka 提供了数据的高可用性和容错能力。</li>
<li><strong>操作</strong>：配置 Topic 的副本因子，查看副本状态。<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token comment"># 创建一个具有复制因子的 Topic</span></span>
<span class="line">kafka-topics.sh <span class="token parameter variable">--create</span> <span class="token parameter variable">--topic</span> my_topic --bootstrap-server localhost:9092 <span class="token parameter variable">--partitions</span> <span class="token number">3</span> --replication-factor <span class="token number">2</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看 Topic 的详细信息</span></span>
<span class="line">kafka-topics.sh <span class="token parameter variable">--describe</span> <span class="token parameter variable">--topic</span> my_topic --bootstrap-server localhost:9092</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="_9-leader-和-follower" tabindex="-1"><a class="header-anchor" href="#_9-leader-和-follower"><span>9. <strong>Leader 和 Follower</strong></span></a></h3>
<ul>
<li><strong>定义</strong>：每个 Partition 都有一个 Leader 和多个 Follower。Leader 负责处理所有读写请求，Follower 复制 Leader 的数据。</li>
<li><strong>作用</strong>：确保数据的高可用性和一致性，当 Leader 发生故障时，Follower 可以提升为新的 Leader。</li>
<li><strong>操作</strong>：查看 Partition 的 Leader 和 Follower 状态。<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token comment"># 查看 Topic 的详细信息，包括 Leader 和 Follower</span></span>
<span class="line">kafka-topics.sh <span class="token parameter variable">--describe</span> <span class="token parameter variable">--topic</span> my_topic --bootstrap-server localhost:9092</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="_10-consumer-group" tabindex="-1"><a class="header-anchor" href="#_10-consumer-group"><span>10. <strong>Consumer Group</strong></span></a></h3>
<ul>
<li><strong>定义</strong>：Consumer Group 是一组 Consumer 实例，共同消费一个或多个 Topic。</li>
<li><strong>作用</strong>：Consumer Group 提供了消息的负载均衡和容错机制，同一组内的 Consumer 会分摊不同的 Partition，每条消息只
会被消费一次。</li>
<li><strong>操作</strong>：管理 Consumer Group，查看消费进度。<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token comment"># 查看 Consumer Group 的状态</span></span>
<span class="line">kafka-consumer-groups.sh <span class="token parameter variable">--describe</span> <span class="token parameter variable">--group</span> my_group --bootstrap-server localhost:9092</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="_11-retention-消息保留" tabindex="-1"><a class="header-anchor" href="#_11-retention-消息保留"><span>11. <strong>Retention（消息保留）</strong></span></a></h3>
<ul>
<li><strong>定义</strong>：Retention 是指 Kafka 中消息的保留策略，可以基于时间或大小来配置。</li>
<li><strong>作用</strong>：通过配置消息保留策略，确保 Kafka 存储空间的有效利用和历史数据的保留。</li>
<li><strong>操作</strong>：配置 Topic 的消息保留策略。<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token comment"># 配置 Topic 的消息保留时间为 7 天</span></span>
<span class="line">kafka-configs.sh <span class="token parameter variable">--alter</span> --entity-type topics --entity-name my_topic --add-config <span class="token assign-left variable">retention.ms</span><span class="token operator">=</span><span class="token number">604800000</span> --bootstrap-server localhost:9092</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="_12-log-compaction-日志压缩" tabindex="-1"><a class="header-anchor" href="#_12-log-compaction-日志压缩"><span>12. <strong>Log Compaction（日志压缩）</strong></span></a></h3>
<ul>
<li><strong>定义</strong>：Log Compaction 是 Kafka 的一种日志清理机制，保留每个键的最新值，删除旧的冗余数据。</li>
<li><strong>作用</strong>：通过日志压缩，可以减少存储空间，确保每个键只有最新的值。</li>
<li><strong>操作</strong>：配置 Topic 的日志压缩策略。<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token comment"># 配置 Topic 的日志压缩策略</span></span>
<span class="line">kafka-configs.sh <span class="token parameter variable">--alter</span> --entity-type topics --entity-name my_topic --add-config <span class="token assign-left variable">cleanup.policy</span><span class="token operator">=</span>compact --bootstrap-server localhost:9092</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<p>作为架构师，掌握 Kafka 的核心概念是设计和维护 Kafka 系统的基础。这些概念包括 Topic、Partition、Offset、Producer、Consumer、Broker、ZooKeeper、Replication、Leader 和 Follower、Consumer Group、Retention 和 Log Compaction。理解并熟练运用这些概念，
可以有效地设计、部署和优化 Kafka 系统，满足业务需求。</p>
</div></template>


