<template><div><h1 id="redis-基础概念和常用命令介绍" tabindex="-1"><a class="header-anchor" href="#redis-基础概念和常用命令介绍"><span>Redis 基础概念和常用命令介绍</span></a></h1>
<p>Redis 是一个开源的高性能键值数据库，支持多种数据结构，常用于缓存、消息队列、会话存储等场景。
下面是 Redis 的一些基础概念和常用命令。</p>
<h3 id="基础概念" tabindex="-1"><a class="header-anchor" href="#基础概念"><span>基础概念</span></a></h3>
<ol>
<li>
<p><strong>键值对存储（Key-Value Store）</strong>：</p>
<ul>
<li>Redis 以键值对的形式存储数据，每个键值对可以是字符串、哈希、列表、集合、有序集合等
数据结构。</li>
</ul>
</li>
<li>
<p><strong>数据结构</strong>：</p>
<ul>
<li><strong>字符串（String）</strong>：二进制安全的字符串，可以存储任何类型的数据。</li>
<li><strong>哈希（Hash）</strong>：用于存储键值对集合，适合存储对象。</li>
<li><strong>列表（List）</strong>：双向链表，可以存储多个有序的字符串。</li>
<li><strong>集合（Set）</strong>：无序集合，存储唯一的字符串。</li>
<li><strong>有序集合（Sorted Set）</strong>：类似集合，但每个元素都会关联一个评分，用于排序。</li>
</ul>
</li>
<li>
<p><strong>持久化</strong>：</p>
<ul>
<li><strong>RDB（Redis Database File）</strong>：将数据定期快照保存到磁盘。</li>
<li><strong>AOF（Append Only File）</strong>：记录每个写操作日志，可以通过重放日志恢复数据。</li>
</ul>
</li>
<li>
<p><strong>复制</strong>：</p>
<ul>
<li>支持主从复制（Master-Slave Replication），实现数据冗余和读写分离。</li>
</ul>
</li>
<li>
<p><strong>哨兵（Sentinel）</strong>：</p>
<ul>
<li>用于监控 Redis 实例，自动执行故障转移，实现高可用。</li>
</ul>
</li>
<li>
<p><strong>集群（Cluster）</strong>：</p>
<ul>
<li>实现数据分片和水平扩展，支持大规模数据存储和高并发访问。</li>
</ul>
</li>
</ol>
<h3 id="常用命令" tabindex="-1"><a class="header-anchor" href="#常用命令"><span>常用命令</span></a></h3>
<h4 id="字符串-string" tabindex="-1"><a class="header-anchor" href="#字符串-string"><span>字符串（String）</span></a></h4>
<ul>
<li>
<p><strong>SET key value</strong>：设置键的值。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">SET mykey <span class="token string">"Hello"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>GET key</strong>：获取键的值。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">GET mykey</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>INCR key</strong>：将键的值增一。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">INCR mycounter</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>DECR key</strong>：将键的值减一。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">DECR mycounter</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>MSET key value [key value ...]</strong>：批量设置多个键值对。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">MSET key1 <span class="token string">"Hello"</span> key2 <span class="token string">"World"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>MGET key [key ...]</strong>：批量获取多个键的值。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">MGET key1 key2</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
<h4 id="哈希-hash" tabindex="-1"><a class="header-anchor" href="#哈希-hash"><span>哈希（Hash）</span></a></h4>
<ul>
<li>
<p><strong>HSET key field value</strong>：设置哈希表中的字段值。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">HSET myhash field1 <span class="token string">"Hello"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>HGET key field</strong>：获取哈希表中的字段值。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">HGET myhash field1</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>HGETALL key</strong>：获取哈希表中的所有字段和值。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">HGETALL myhash</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>HMSET key field value [field value ...]</strong>：批量设置哈希表中的多个字段值。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">HMSET myhash field1 <span class="token string">"Hello"</span> field2 <span class="token string">"World"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>HMGET key field [field ...]</strong>：批量获取哈希表中的多个字段值。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">HMGET myhash field1 field2</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
<h4 id="列表-list" tabindex="-1"><a class="header-anchor" href="#列表-list"><span>列表（List）</span></a></h4>
<ul>
<li>
<p><strong>LPUSH key value [value ...]</strong>：将一个或多个值插入列表头部。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">LPUSH mylist <span class="token string">"World"</span></span>
<span class="line">LPUSH mylist <span class="token string">"Hello"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>RPUSH key value [value ...]</strong>：将一个或多个值插入列表尾部。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">RPUSH mylist <span class="token string">"Hello"</span></span>
<span class="line">RPUSH mylist <span class="token string">"World"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>LPOP key</strong>：移除并返回列表头部的元素。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">LPOP mylist</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>RPOP key</strong>：移除并返回列表尾部的元素。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">RPOP mylist</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>LRANGE key start stop</strong>：获取列表中指定范围的元素。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">LRANGE mylist <span class="token number">0</span> <span class="token parameter variable">-1</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
<h4 id="集合-set" tabindex="-1"><a class="header-anchor" href="#集合-set"><span>集合（Set）</span></a></h4>
<ul>
<li>
<p><strong>SADD key member [member ...]</strong>：向集合添加一个或多个成员。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">SADD myset <span class="token string">"Hello"</span></span>
<span class="line">SADD myset <span class="token string">"World"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>SMEMBERS key</strong>：获取集合中的所有成员。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">SMEMBERS myset</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>SISMEMBER key member</strong>：判断成员是否存在于集合中。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">SISMEMBER myset <span class="token string">"Hello"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>SREM key member [member ...]</strong>：移除集合中的一个或多个成员。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">SREM myset <span class="token string">"Hello"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
<h4 id="有序集合-sorted-set" tabindex="-1"><a class="header-anchor" href="#有序集合-sorted-set"><span>有序集合（Sorted Set）</span></a></h4>
<ul>
<li>
<p><strong>ZADD key score member [score member ...]</strong>：向有序集合添加一个或多个成员，或者更新
已存在成员的分数。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">ZADD myzset <span class="token number">1</span> <span class="token string">"one"</span></span>
<span class="line">ZADD myzset <span class="token number">2</span> <span class="token string">"two"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>ZRANGE key start stop [WITHSCORES]</strong>：返回有序集合中指定区间内的成员，通过索引，分数从
低到高。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">ZRANGE myzset <span class="token number">0</span> <span class="token parameter variable">-1</span> WITHSCORES</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>ZRANK key member</strong>：返回有序集合中成员的索引，分数从低到高。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">ZRANK myzset <span class="token string">"one"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>ZREM key member [member ...]</strong>：移除有序集合中的一个或多个成员。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">ZREM myzset <span class="token string">"one"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
<h3 id="连接和配置命令" tabindex="-1"><a class="header-anchor" href="#连接和配置命令"><span>连接和配置命令</span></a></h3>
<ul>
<li>
<p><strong>PING</strong>：测试连接是否成功。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">PING</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>AUTH password</strong>：密码认证。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">AUTH mypassword</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>SELECT index</strong>：切换到指定的数据库。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">SELECT <span class="token number">1</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>FLUSHDB</strong>：清空当前数据库中的所有键。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">FLUSHDB</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>FLUSHALL</strong>：清空所有数据库中的所有键。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">FLUSHALL</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>CONFIG GET parameter</strong>：获取配置参数的值。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">CONFIG GET maxmemory</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>CONFIG SET parameter value</strong>：设置配置参数的值。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">CONFIG SET maxmemory 128mb</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
<h3 id="监控和调试命令" tabindex="-1"><a class="header-anchor" href="#监控和调试命令"><span>监控和调试命令</span></a></h3>
<ul>
<li>
<p><strong>INFO</strong>：获取 Redis 服务器的信息和统计数据。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">INFO</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>MONITOR</strong>：实时监控 Redis 服务器接收到的命令。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">MONITOR</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>SLOWLOG</strong>：查看慢查询日志。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line">SLOWLOG GET</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
<h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<p>以上介绍了 Redis 的基础概念和常用命令。通过掌握这些内容，可以高效地使用 Redis 进行各种数据操作。
随着对 Redis 的深入了解，还可以进一步学习其高级特性和优化技巧，以充分发挥 Redis 的性能优势。</p>
</div></template>


