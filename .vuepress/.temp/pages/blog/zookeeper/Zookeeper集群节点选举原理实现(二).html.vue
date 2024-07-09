<template><div><h1 id="zookeeper-集群节点选举原理实现-二" tabindex="-1"><a class="header-anchor" href="#zookeeper-集群节点选举原理实现-二"><span>Zookeeper 集群节点选举原理实现(二)</span></a></h1>
<p>#集群中每个 zookeeper 节点zxid 如何实现的？</p>
<h3 id="zxid-zookeeper-transaction-id" tabindex="-1"><a class="header-anchor" href="#zxid-zookeeper-transaction-id"><span>ZXID（Zookeeper Transaction ID）</span></a></h3>
<p>ZXID（Zookeeper Transaction ID）是 Zookeeper 中用于唯一标识每个事务的 ID。
它是一个 64 位的数字，表示事务的顺序。ZXID 在 Zookeeper 中有两个主要作用：</p>
<ol>
<li><strong>事务顺序性</strong>：ZXID 用于保证事务的顺序性，每个事务都有一个唯一的 ZXID，保证了事务的全局顺序。</li>
<li><strong>领导节点选举</strong>：在领导节点选举过程中，ZXID 用于比较节点的最新事务，确保选出的领导节点拥有最新的数据。</li>
</ol>
<h4 id="zxid-的实现" tabindex="-1"><a class="header-anchor" href="#zxid-的实现"><span>ZXID 的实现</span></a></h4>
<p>ZXID 是一个 64 位的长整型（long），它由两部分组成：</p>
<ul>
<li><strong>Epoch</strong>（32 位）：表示领导节点的任期，每次选举新的领导节点时，Epoch 会递增。</li>
<li><strong>Counter</strong>（32 位）：表示领导节点在当前任期内处理的事务数量，每次新的事务提交时，Counter 会递增。</li>
</ul>
<p>ZXID 的格式如下：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">ZXID = (Epoch &lt;&lt; 32) | Counter</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li><strong>Epoch</strong> 占据高 32 位。</li>
<li><strong>Counter</strong> 占据低 32 位。</li>
</ul>
<h3 id="majority-方法核心逻辑" tabindex="-1"><a class="header-anchor" href="#majority-方法核心逻辑"><span>Majority 方法核心逻辑</span></a></h3>
<p><code v-pre>isMajority()</code> 方法用于判断一个投票是否获得了多数节点的支持。在 Zookeeper 集群中，多数节点的支
持意味着超过半数的节点。</p>
<h4 id="核心逻辑" tabindex="-1"><a class="header-anchor" href="#核心逻辑"><span>核心逻辑</span></a></h4>
<p><code v-pre>isMajority()</code> 方法通过以下步骤来判断是否获得多数节点的支持：</p>
<ol>
<li><strong>统计支持该投票的节点数</strong>：遍历所有收到的投票，统计支持指定投票的节点数。</li>
<li><strong>判断是否超过半数</strong>：如果支持该投票的节点数超过集群节点数的一半，则认为该投票获得了多数支持。</li>
</ol>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre v-pre class="language-java"><code><span class="line"><span class="token keyword">boolean</span> <span class="token function">isMajority</span><span class="token punctuation">(</span><span class="token class-name">Vote</span> vote<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">int</span> count <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Vote</span> v <span class="token operator">:</span> votes<span class="token punctuation">.</span><span class="token function">values</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>v<span class="token punctuation">.</span>zxid <span class="token operator">==</span> vote<span class="token punctuation">.</span>zxid <span class="token operator">&amp;&amp;</span> v<span class="token punctuation">.</span>nodeId <span class="token operator">==</span> vote<span class="token punctuation">.</span>nodeId<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            count<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">return</span> count <span class="token operator">></span> <span class="token punctuation">(</span>votes<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="详细解释" tabindex="-1"><a class="header-anchor" href="#详细解释"><span>详细解释</span></a></h4>
<ol>
<li>
<p><strong>初始化计数器</strong>：<code v-pre>int count = 0;</code></p>
<ul>
<li>初始化计数器 <code v-pre>count</code>，用于统计支持指定投票的节点数。</li>
</ul>
</li>
<li>
<p><strong>遍历所有投票</strong>：<code v-pre>for (Vote v : votes.values())</code></p>
<ul>
<li>遍历存储在 <code v-pre>votes</code> 集合中的所有投票。</li>
</ul>
</li>
<li>
<p><strong>检查投票是否匹配</strong>：<code v-pre>if (v.zxid == vote.zxid &amp;&amp; v.nodeId == vote.nodeId)</code></p>
<ul>
<li>检查当前遍历的投票 <code v-pre>v</code> 是否与指定的投票 <code v-pre>vote</code> 匹配。</li>
<li>比较的条件是投票的 <code v-pre>zxid</code> 和 <code v-pre>nodeId</code> 是否相同。</li>
</ul>
</li>
<li>
<p><strong>增加计数器</strong>：<code v-pre>count++;</code></p>
<ul>
<li>如果投票匹配，则增加计数器 <code v-pre>count</code>。</li>
</ul>
</li>
<li>
<p><strong>判断是否超过半数</strong>：<code v-pre>return count &gt; (votes.size() / 2);</code></p>
<ul>
<li>最后，判断计数器 <code v-pre>count</code> 是否超过节点总数的一半。</li>
<li>如果超过，则返回 <code v-pre>true</code>，表示该投票获得了多数支持。</li>
<li>否则返回 <code v-pre>false</code>。</li>
</ul>
</li>
</ol>
<h3 id="代码示例解释" tabindex="-1"><a class="header-anchor" href="#代码示例解释"><span>代码示例解释</span></a></h3>
<p>以下是一个简化的领导节点选举过程的代码示例和解释：</p>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre v-pre class="language-java"><code><span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">HashMap</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Map</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">Vote</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">int</span> nodeId<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">long</span> zxid<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">Vote</span><span class="token punctuation">(</span><span class="token keyword">int</span> nodeId<span class="token punctuation">,</span> <span class="token keyword">long</span> zxid<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>nodeId <span class="token operator">=</span> nodeId<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>zxid <span class="token operator">=</span> zxid<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">QuorumPeer</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">int</span> myId<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">long</span> myZxid<span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">,</span> <span class="token class-name">Vote</span><span class="token punctuation">></span></span> votes <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">QuorumPeer</span><span class="token punctuation">(</span><span class="token keyword">int</span> myId<span class="token punctuation">,</span> <span class="token keyword">long</span> myZxid<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>myId <span class="token operator">=</span> myId<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>myZxid <span class="token operator">=</span> myZxid<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">Vote</span> <span class="token function">lookForLeader</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        votes<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span>myId<span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">Vote</span><span class="token punctuation">(</span>myId<span class="token punctuation">,</span> myZxid<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">Vote</span> bestVote <span class="token operator">=</span> <span class="token function">getBestVote</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isMajority</span><span class="token punctuation">(</span>bestVote<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">return</span> bestVote<span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">Vote</span> <span class="token function">getBestVote</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Vote</span> bestVote <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Vote</span> vote <span class="token operator">:</span> votes<span class="token punctuation">.</span><span class="token function">values</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>bestVote <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> vote<span class="token punctuation">.</span>zxid <span class="token operator">></span> bestVote<span class="token punctuation">.</span>zxid <span class="token operator">||</span> </span>
<span class="line">            <span class="token punctuation">(</span>vote<span class="token punctuation">.</span>zxid <span class="token operator">==</span> bestVote<span class="token punctuation">.</span>zxid <span class="token operator">&amp;&amp;</span> vote<span class="token punctuation">.</span>nodeId <span class="token operator">></span> bestVote<span class="token punctuation">.</span>nodeId<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                bestVote <span class="token operator">=</span> vote<span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">return</span> bestVote<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">boolean</span> <span class="token function">isMajority</span><span class="token punctuation">(</span><span class="token class-name">Vote</span> vote<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">int</span> count <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Vote</span> v <span class="token operator">:</span> votes<span class="token punctuation">.</span><span class="token function">values</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>v<span class="token punctuation">.</span>zxid <span class="token operator">==</span> vote<span class="token punctuation">.</span>zxid <span class="token operator">&amp;&amp;</span> v<span class="token punctuation">.</span>nodeId <span class="token operator">==</span> vote<span class="token punctuation">.</span>nodeId<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                count<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">return</span> count <span class="token operator">></span> <span class="token punctuation">(</span>votes<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">void</span> <span class="token function">receiveVote</span><span class="token punctuation">(</span><span class="token keyword">int</span> nodeId<span class="token punctuation">,</span> <span class="token keyword">long</span> zxid<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        votes<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span>nodeId<span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">Vote</span><span class="token punctuation">(</span>nodeId<span class="token punctuation">,</span> zxid<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ZookeeperLeaderElection</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">QuorumPeer</span> nodeA <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">QuorumPeer</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">QuorumPeer</span> nodeB <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">QuorumPeer</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">101</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">QuorumPeer</span> nodeC <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">QuorumPeer</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        nodeA<span class="token punctuation">.</span><span class="token function">receiveVote</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">101</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        nodeA<span class="token punctuation">.</span><span class="token function">receiveVote</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        nodeB<span class="token punctuation">.</span><span class="token function">receiveVote</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        nodeB<span class="token punctuation">.</span><span class="token function">receiveVote</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        nodeC<span class="token punctuation">.</span><span class="token function">receiveVote</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        nodeC<span class="token punctuation">.</span><span class="token function">receiveVote</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">101</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token class-name">Vote</span> leaderA <span class="token operator">=</span> nodeA<span class="token punctuation">.</span><span class="token function">lookForLeader</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">Vote</span> leaderB <span class="token operator">=</span> nodeB<span class="token punctuation">.</span><span class="token function">lookForLeader</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">Vote</span> leaderC <span class="token operator">=</span> nodeC<span class="token punctuation">.</span><span class="token function">lookForLeader</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Node A elected leader: "</span> <span class="token operator">+</span> leaderA<span class="token punctuation">.</span>nodeId<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Node B elected leader: "</span> <span class="token operator">+</span> leaderB<span class="token punctuation">.</span>nodeId<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Node C elected leader: "</span> <span class="token operator">+</span> leaderC<span class="token punctuation">.</span>nodeId<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="代码分析" tabindex="-1"><a class="header-anchor" href="#代码分析"><span>代码分析</span></a></h4>
<ol>
<li><strong>初始化节点</strong>：每个 <code v-pre>QuorumPeer</code> 节点被初始化，具有节点 ID 和 ZXID。</li>
<li><strong>接收投票</strong>：每个节点接收来自其他节点的投票。</li>
<li><strong>领导节点选举</strong>：
<ul>
<li><code v-pre>lookForLeader()</code> 方法发起选举并持续收集投票，直到选出新的领导节点。</li>
<li><code v-pre>getBestVote()</code> 方法根据投票的 ZXID 和节点 ID 选出最佳投票。</li>
<li><code v-pre>isMajority()</code> 方法判断是否获得多数支持。</li>
</ul>
</li>
</ol>
<p>通过这个示例，可以清楚地了解 Zookeeper 中领导节点选举的基本流程和关键逻辑。
ZXID 用于保证事务顺序和领导节点选举的一致性，而 <code v-pre>isMajority()</code> 方法确保选
举结果的合法性。</p>
<h3 id="每个节点启动初始化zxid的值是否一样-如何初始化实现的" tabindex="-1"><a class="header-anchor" href="#每个节点启动初始化zxid的值是否一样-如何初始化实现的"><span>每个节点启动初始化zxid的值是否一样，如何初始化实现的？</span></a></h3>
<p>在 Zookeeper 中，每个节点启动时初始化的 ZXID 值是不一样的。ZXID（Zookeeper Transaction ID）
是一个全局唯一的事务 ID，它确保事务在分布式系统中的顺序一致性。</p>
<h3 id="zxid-的初始化和实现" tabindex="-1"><a class="header-anchor" href="#zxid-的初始化和实现"><span>ZXID 的初始化和实现</span></a></h3>
<h4 id="zxid-的结构" tabindex="-1"><a class="header-anchor" href="#zxid-的结构"><span>ZXID 的结构</span></a></h4>
<p>ZXID 是一个 64 位的长整数，它由两个部分组成：</p>
<ul>
<li><strong>Epoch（32 位）</strong>：表示领导节点的任期，每次选举新的领导节点时，Epoch 会递增。</li>
<li><strong>Counter（32 位）</strong>：表示领导节点在当前任期内处理的事务数量，每次新的事务提交时，Counter 会递增。</li>
</ul>
<p>ZXID 的格式如下：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre class="language-text"><code><span class="line">ZXID = (Epoch &lt;&lt; 32) | Counter</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li><strong>Epoch</strong> 占据高 32 位。</li>
<li><strong>Counter</strong> 占据低 32 位。</li>
</ul>
<h4 id="zxid-的初始化" tabindex="-1"><a class="header-anchor" href="#zxid-的初始化"><span>ZXID 的初始化</span></a></h4>
<ol>
<li>
<p><strong>读取持久化数据</strong>：当 Zookeeper 节点启动时，会读取本地磁盘上的快照文件和事务日志文件，这些文
件包含了该节点的最新状态和已处理的事务记录。</p>
</li>
<li>
<p><strong>确定最新的 ZXID</strong>：节点通过解析这些持久化文件，确定本地存储的最新事务的 ZXID。这确保了即使在
节点重启后，ZXID 也能继续保持唯一和递增。</p>
</li>
<li>
<p><strong>初始化 ZXID</strong>：节点会将解析到的最新 ZXID 作为初始化值，继续处理新的事务。</p>
</li>
</ol>
<h4 id="实现逻辑" tabindex="-1"><a class="header-anchor" href="#实现逻辑"><span>实现逻辑</span></a></h4>
<p>以下是 Zookeeper 如何初始化 ZXID 的大致实现逻辑：</p>
<ol>
<li>
<p><strong>读取快照和事务日志</strong>：</p>
<ul>
<li>Zookeeper 启动时会加载最新的快照文件（snapshot）和事务日志文件（log）。</li>
<li>通过解析这些文件，节点可以恢复到最近的已提交状态，并获取最新的 ZXID。</li>
</ul>
</li>
<li>
<p><strong>确定最新的 ZXID</strong>：</p>
<ul>
<li>在解析快照文件和事务日志文件时，Zookeeper 会记录所有事务的 ZXID。</li>
<li>节点会选择其中最大的 ZXID 作为当前节点的最新 ZXID。</li>
</ul>
</li>
<li>
<p><strong>初始化 ZXID</strong>：</p>
<ul>
<li>节点将确定的最新 ZXID 作为初始值，继续递增 ZXID 以处理新的事务。</li>
</ul>
</li>
</ol>
<h4 id="代码示例" tabindex="-1"><a class="header-anchor" href="#代码示例"><span>代码示例</span></a></h4>
<p>以下是一个简化的代码示例，展示了 Zookeeper 如何通过读取快照和日志文件来初始化 ZXID：</p>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre v-pre class="language-java"><code><span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>io<span class="token punctuation">.</span></span><span class="token class-name">File</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>io<span class="token punctuation">.</span></span><span class="token class-name">FileInputStream</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>io<span class="token punctuation">.</span></span><span class="token class-name">IOException</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>nio<span class="token punctuation">.</span></span><span class="token class-name">ByteBuffer</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">ArrayList</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">List</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">ZookeeperNode</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">long</span> currentZxid<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">File</span><span class="token punctuation">></span></span> snapshotFiles<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">File</span><span class="token punctuation">></span></span> logFiles<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">ZookeeperNode</span><span class="token punctuation">(</span><span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">File</span><span class="token punctuation">></span></span> snapshotFiles<span class="token punctuation">,</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">File</span><span class="token punctuation">></span></span> logFiles<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>snapshotFiles <span class="token operator">=</span> snapshotFiles<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>logFiles <span class="token operator">=</span> logFiles<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>currentZxid <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">initialize</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">File</span> file <span class="token operator">:</span> snapshotFiles<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">long</span> zxid <span class="token operator">=</span> <span class="token function">parseFile</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>zxid <span class="token operator">></span> currentZxid<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                currentZxid <span class="token operator">=</span> zxid<span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">File</span> file <span class="token operator">:</span> logFiles<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">long</span> zxid <span class="token operator">=</span> <span class="token function">parseFile</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>zxid <span class="token operator">></span> currentZxid<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                currentZxid <span class="token operator">=</span> zxid<span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Initialized ZXID: "</span> <span class="token operator">+</span> currentZxid<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">long</span> <span class="token function">parseFile</span><span class="token punctuation">(</span><span class="token class-name">File</span> file<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">(</span><span class="token class-name">FileInputStream</span> fis <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FileInputStream</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> buffer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token number">8</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">            fis<span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>buffer<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token class-name">ByteBuffer</span><span class="token punctuation">.</span><span class="token function">wrap</span><span class="token punctuation">(</span>buffer<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getLong</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">long</span> <span class="token function">getCurrentZxid</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> currentZxid<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ZookeeperZXIDInitialization</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">File</span><span class="token punctuation">></span></span> snapshotFiles <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">File</span><span class="token punctuation">></span></span> logFiles <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">// 假设已加载文件列表</span></span>
<span class="line">        snapshotFiles<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">File</span><span class="token punctuation">(</span><span class="token string">"snapshot1"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        logFiles<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">File</span><span class="token punctuation">(</span><span class="token string">"log1"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token class-name">ZookeeperNode</span> node <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ZookeeperNode</span><span class="token punctuation">(</span>snapshotFiles<span class="token punctuation">,</span> logFiles<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        node<span class="token punctuation">.</span><span class="token function">initialize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Node's current ZXID: "</span> <span class="token operator">+</span> node<span class="token punctuation">.</span><span class="token function">getCurrentZxid</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="领导节点选举中的-zxid" tabindex="-1"><a class="header-anchor" href="#领导节点选举中的-zxid"><span>领导节点选举中的 ZXID</span></a></h3>
<p>在领导节点选举过程中，节点的 ZXID 用于比较节点的最新状态。选举的过程如下：</p>
<ol>
<li><strong>每个节点投票给自己</strong>，并将自己的 ZXID 发送给其他节点。</li>
<li><strong>节点接收其他节点的投票信息</strong>，并比较 ZXID。拥有最大 ZXID 的节点更有可能成为领导节点。</li>
<li><strong>多数节点达成一致</strong>，选举出拥有最大 ZXID 的节点为新的领导节点。</li>
</ol>
<h3 id="ismajority-方法的核心逻辑" tabindex="-1"><a class="header-anchor" href="#ismajority-方法的核心逻辑"><span><code v-pre>isMajority</code> 方法的核心逻辑</span></a></h3>
<p><code v-pre>isMajority</code> 方法用于判断一个投票是否获得了多数节点的支持。以下是该方法的核心逻辑：</p>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre v-pre class="language-java"><code><span class="line"><span class="token keyword">boolean</span> <span class="token function">isMajority</span><span class="token punctuation">(</span><span class="token class-name">Vote</span> vote<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">int</span> count <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Vote</span> v <span class="token operator">:</span> votes<span class="token punctuation">.</span><span class="token function">values</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>v<span class="token punctuation">.</span>zxid <span class="token operator">==</span> vote<span class="token punctuation">.</span>zxid <span class="token operator">&amp;&amp;</span> v<span class="token punctuation">.</span>nodeId <span class="token operator">==</span> vote<span class="token punctuation">.</span>nodeId<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            count<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">return</span> count <span class="token operator">></span> <span class="token punctuation">(</span>votes<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="解释" tabindex="-1"><a class="header-anchor" href="#解释"><span>解释</span></a></h4>
<ol>
<li>
<p><strong>初始化计数器</strong>：</p>
<ul>
<li><code v-pre>int count = 0;</code></li>
<li>初始化计数器 <code v-pre>count</code>，用于统计支持指定投票的节点数。</li>
</ul>
</li>
<li>
<p><strong>遍历所有投票</strong>：</p>
<ul>
<li><code v-pre>for (Vote v : votes.values())</code></li>
<li>遍历存储在 <code v-pre>votes</code> 集合中的所有投票。</li>
</ul>
</li>
<li>
<p><strong>检查投票是否匹配</strong>：</p>
<ul>
<li><code v-pre>if (v.zxid == vote.zxid &amp;&amp; v.nodeId == vote.nodeId)</code></li>
<li>检查当前遍历的投票 <code v-pre>v</code> 是否与指定的投票 <code v-pre>vote</code> 匹配。</li>
<li>比较的条件是投票的 <code v-pre>zxid</code> 和 <code v-pre>nodeId</code> 是否相同。</li>
</ul>
</li>
<li>
<p><strong>增加计数器</strong>：</p>
<ul>
<li><code v-pre>count++;</code></li>
<li>如果投票匹配，则增加计数器 <code v-pre>count</code>。</li>
</ul>
</li>
<li>
<p><strong>判断是否超过半数</strong>：</p>
<ul>
<li><code v-pre>return count &gt; (votes.size() / 2);</code></li>
<li>最后，判断计数器 <code v-pre>count</code> 是否超过节点总数的一半。</li>
<li>如果超过，则返回 <code v-pre>true</code>，表示该投票获得了多数支持。</li>
<li>否则返回 <code v-pre>false</code>。</li>
</ul>
</li>
</ol>
<h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<p>通过以上解释，我们可以了解 Zookeeper 如何初始化和实现 ZXID 以及领导节点选举过程中的核心逻辑。
ZXID 确保了事务的全局顺序一致性，而 <code v-pre>isMajority</code> 方法确保了选举结果的合法性。理解这些原理和
实现逻辑对于掌握 Zookeeper 的工作机制至关重要。</p>
</div></template>


