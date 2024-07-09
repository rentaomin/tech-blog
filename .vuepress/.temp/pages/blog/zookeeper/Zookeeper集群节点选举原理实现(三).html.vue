<template><div><h1 id="zookeeper-集群节点选举原理实现-三" tabindex="-1"><a class="header-anchor" href="#zookeeper-集群节点选举原理实现-三"><span>Zookeeper 集群节点选举原理实现(三)</span></a></h1>
<p>刚部署三个节点或者多个节点启动时，此时还未选择出领导节点，不同节点的初始化zxid
是如何保证不重复不冲突有序呢？</p>
<p>在 Zookeeper 集群的初始启动阶段，所有节点会在选举领导节点之前先初始化自己的状态和 ZXID。为了确保不同节点的初始化 ZXID 不重复、不冲突且有序，Zookeeper 采用了一套完整的机制来管理和分配 ZXID。以下是详细的原理和实现逻辑。</p>
<h3 id="初始化-zxid-的过程" tabindex="-1"><a class="header-anchor" href="#初始化-zxid-的过程"><span>初始化 ZXID 的过程</span></a></h3>
<ol>
<li>
<p><strong>读取持久化数据</strong>：</p>
<ul>
<li>每个节点在启动时，会首先读取本地磁盘上的快照文件和事务日志文件。这些文件包含了该节点的最新状态和已处理的事务记录。</li>
<li>如果节点是第一次启动，没有任何持久化数据，那么它的初始 ZXID 为 0。</li>
</ul>
</li>
<li>
<p><strong>确定最新的 ZXID</strong>：</p>
<ul>
<li>节点通过解析快照文件和事务日志文件，确定本地存储的最新事务的 ZXID。</li>
<li>每个节点会将解析到的最新 ZXID 作为其当前的 ZXID。</li>
</ul>
</li>
</ol>
<h3 id="领导节点选举过程中的-zxid-确保有序" tabindex="-1"><a class="header-anchor" href="#领导节点选举过程中的-zxid-确保有序"><span>领导节点选举过程中的 ZXID 确保有序</span></a></h3>
<p>领导节点选举过程中，ZXID 的有序性和唯一性是通过以下步骤确保的：</p>
<ol>
<li>
<p><strong>节点投票</strong>：</p>
<ul>
<li>每个节点在启动时都会投票给自己，并将自己的投票信息（包含自己的 ZXID）广播给其他节点。</li>
<li>初始阶段，每个节点的投票信息中包含的 ZXID 是该节点从持久化文件中解析到的最新 ZXID。如果是全新部署，ZXID 为 0。</li>
</ul>
</li>
<li>
<p><strong>收集和比较投票</strong>：</p>
<ul>
<li>每个节点会收集其他节点的投票信息，并比较这些投票的 ZXID 和节点 ID。</li>
<li>投票信息包括节点的 ID 和 ZXID。</li>
</ul>
</li>
<li>
<p><strong>选举出拥有最新 ZXID 的节点作为领导节点</strong>：</p>
<ul>
<li>通过比较 ZXID，拥有最大 ZXID 的节点更有可能成为领导节点。</li>
<li>如果 ZXID 相同，则比较节点 ID，ID 较大的节点优先成为领导节点。</li>
<li>这一步确保选出的领导节点拥有最新的事务，并保证了事务的顺序性。</li>
</ul>
</li>
<li>
<p><strong>领导节点同步最新状态</strong>：</p>
<ul>
<li>新的领导节点选举成功后，会将自己的最新状态同步给所有跟随节点。</li>
<li>跟随节点会更新自己的状态，并设置最新的 ZXID，确保所有节点的 ZXID 有序且一致。</li>
</ul>
</li>
</ol>
<h3 id="实现逻辑示例" tabindex="-1"><a class="header-anchor" href="#实现逻辑示例"><span>实现逻辑示例</span></a></h3>
<p>以下是 Zookeeper 中初始化 ZXID 和领导节点选举的简化代码示例，展示了如何确保 ZXID 的有序性和唯一性：</p>
<h4 id="初始化-zxid-的逻辑" tabindex="-1"><a class="header-anchor" href="#初始化-zxid-的逻辑"><span>初始化 ZXID 的逻辑</span></a></h4>
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
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="领导节点选举的逻辑" tabindex="-1"><a class="header-anchor" href="#领导节点选举的逻辑"><span>领导节点选举的逻辑</span></a></h4>
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
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>bestVote <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> vote<span class="token punctuation">.</span>zxid <span class="token operator">></span> bestVote<span class="token punctuation">.</span>zxid <span class="token operator">||</span> <span class="token punctuation">(</span>vote<span class="token punctuation">.</span>zxid <span class="token operator">==</span> bestVote<span class="token punctuation">.</span>zxid <span class="token operator">&amp;&amp;</span> vote<span class="token punctuation">.</span>nodeId <span class="token operator">></span> bestVote<span class="token punctuation">.</span>nodeId<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
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
<span class="line">        <span class="token comment">// 初始化节点和其 ZXID（假设从持久化数据中读取）</span></span>
<span class="line">        <span class="token class-name">QuorumPeer</span> nodeA <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">QuorumPeer</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">QuorumPeer</span> nodeB <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">QuorumPeer</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">101</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">QuorumPeer</span> nodeC <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">QuorumPeer</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">// 收集投票</span></span>
<span class="line">        nodeA<span class="token punctuation">.</span><span class="token function">receiveVote</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">101</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        nodeA<span class="token punctuation">.</span><span class="token function">receiveVote</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        nodeB<span class="token punctuation">.</span><span class="token function">receiveVote</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        nodeB<span class="token punctuation">.</span><span class="token function">receiveVote</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        nodeC<span class="token punctuation">.</span><span class="token function">receiveVote</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        nodeC<span class="token punctuation">.</span><span class="token function">receiveVote</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">101</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">// 选举领导节点</span></span>
<span class="line">        <span class="token class-name">Vote</span> leaderA <span class="token operator">=</span> nodeA<span class="token punctuation">.</span><span class="token function">lookForLeader</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">Vote</span> leaderB <span class="token operator">=</span> nodeB<span class="token punctuation">.</span><span class="token function">lookForLeader</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">Vote</span> leaderC <span class="token operator">=</span> nodeC<span class="token punctuation">.</span><span class="token function">lookForLeader</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">// 输出结果</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Node A elected leader: "</span> <span class="token operator">+</span> leaderA<span class="token punctuation">.</span>nodeId<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Node B elected leader: "</span> <span class="token operator">+</span> leaderB<span class="token punctuation">.</span>nodeId<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Node C elected leader: "</span> <span class="token operator">+</span> leaderC<span class="token punctuation">.</span>nodeId<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="选举过程中的同步" tabindex="-1"><a class="header-anchor" href="#选举过程中的同步"><span>选举过程中的同步</span></a></h3>
<ol>
<li>
<p><strong>选举结果确定后</strong>：</p>
<ul>
<li>新的领导节点会将其最新状态同步给所有跟随节点。</li>
<li>领导节点会确保所有跟随节点的 ZXID 更新到最新的值。</li>
</ul>
</li>
<li>
<p><strong>跟随节点更新状态</strong>：</p>
<ul>
<li>跟随节点接收到领导节点的同步信息后，会更新自己的状态和 ZXID。</li>
<li>这样，整个集群的 ZXID 保持一致和有序。</li>
</ul>
</li>
</ol>
<h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<p>通过以上步骤和机制，Zookeeper 在初始化和选举过程中确保了每个节点的 ZXID 不重复、不冲突且有序。
每个节点在启动时读取持久化数据来初始化 ZXID，选举过程中通过比较 ZXID 来确保选出的领导节点拥有
最新的事务数据。领导节点同步后，所有跟随节点的 ZXID 也会更新到最新的值，确保集群的一致性和有序性。</p>
<h2 id="快照文件和日志文件的zxid是一样的吗-为什么要都读取获取zxid-以哪个为准" tabindex="-1"><a class="header-anchor" href="#快照文件和日志文件的zxid是一样的吗-为什么要都读取获取zxid-以哪个为准"><span>快照文件和日志文件的zxid是一样的吗，为什么要都读取获取zxid，以哪个为准？</span></a></h2>
<p>在 Zookeeper 中，快照文件和日志文件的 ZXID 不一定是完全一样的。它们分别记录了不同的事务状态，因此需要一起读取和解析，以确保节点能够恢复到最新的事务状态。以下是为什么要读取快照文件和日志文件来获取 ZXID 的详细解释，以及以哪个为准的逻辑。</p>
<h3 id="快照文件和日志文件" tabindex="-1"><a class="header-anchor" href="#快照文件和日志文件"><span>快照文件和日志文件</span></a></h3>
<ul>
<li><strong>快照文件（Snapshot）</strong>：记录了某个时刻节点的数据状态，它包含了所有 ZNode 的完整数据结构，但不包括从创建快照到当前的所有事务。</li>
<li><strong>日志文件（Transaction Log）</strong>：记录了从上一次快照之后发生的所有事务操作（如创建、删除、更新节点）。日志文件按顺序记录了每个事务的操作和 ZXID。</li>
</ul>
<h3 id="为什么要读取快照文件和日志文件" tabindex="-1"><a class="header-anchor" href="#为什么要读取快照文件和日志文件"><span>为什么要读取快照文件和日志文件</span></a></h3>
<ol>
<li>
<p><strong>数据完整性</strong>：</p>
<ul>
<li>快照文件提供了一个时间点的完整数据状态，但它不包括之后的事务。</li>
<li>日志文件包含了从上一次快照以来的所有事务，确保节点能够恢复到最新的状态。</li>
<li>通过结合快照文件和日志文件，节点可以恢复到最近一次快照后的最新事务状态，确保数据完整性和一致性。</li>
</ul>
</li>
<li>
<p><strong>获取最新的 ZXID</strong>：</p>
<ul>
<li>快照文件和日志文件中的 ZXID 可能不同。快照文件的 ZXID 表示创建快照时的最新事务，而日志文件的 ZXID 表示之后发生的事务。</li>
<li>读取并比较快照文件和日志文件中的 ZXID 可以确定当前节点的最新 ZXID。</li>
</ul>
</li>
</ol>
<h3 id="以哪个-zxid-为准" tabindex="-1"><a class="header-anchor" href="#以哪个-zxid-为准"><span>以哪个 ZXID 为准</span></a></h3>
<ul>
<li><strong>最新的 ZXID</strong>：节点在启动时会读取快照文件和所有日志文件，比较它们的 ZXID，选择其中最大的 ZXID 作为当前节点的最新 ZXID。</li>
</ul>
<h3 id="实现逻辑" tabindex="-1"><a class="header-anchor" href="#实现逻辑"><span>实现逻辑</span></a></h3>
<p>以下是一个简化的代码示例，展示了如何读取快照文件和日志文件来获取最新的 ZXID：</p>
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
<span class="line">        <span class="token comment">// 读取快照文件</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">File</span> file <span class="token operator">:</span> snapshotFiles<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">long</span> zxid <span class="token operator">=</span> <span class="token function">parseSnapshotFile</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>zxid <span class="token operator">></span> currentZxid<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                currentZxid <span class="token operator">=</span> zxid<span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">// 读取日志文件</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">File</span> file <span class="token operator">:</span> logFiles<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">long</span> zxid <span class="token operator">=</span> <span class="token function">parseLogFile</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>zxid <span class="token operator">></span> currentZxid<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                currentZxid <span class="token operator">=</span> zxid<span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Initialized ZXID: "</span> <span class="token operator">+</span> currentZxid<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">long</span> <span class="token function">parseSnapshotFile</span><span class="token punctuation">(</span><span class="token class-name">File</span> file<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 假设快照文件的 ZXID 存储在文件的开头 8 字节</span></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">(</span><span class="token class-name">FileInputStream</span> fis <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FileInputStream</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> buffer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token number">8</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">            fis<span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>buffer<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token class-name">ByteBuffer</span><span class="token punctuation">.</span><span class="token function">wrap</span><span class="token punctuation">(</span>buffer<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getLong</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">long</span> <span class="token function">parseLogFile</span><span class="token punctuation">(</span><span class="token class-name">File</span> file<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 假设日志文件的 ZXID 存储在文件的开头 8 字节</span></span>
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
<span class="line">        <span class="token comment">// 假设已加载的快照文件和日志文件列表</span></span>
<span class="line">        <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">File</span><span class="token punctuation">></span></span> snapshotFiles <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">File</span><span class="token punctuation">></span></span> logFiles <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        snapshotFiles<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">File</span><span class="token punctuation">(</span><span class="token string">"snapshot1"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        logFiles<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">File</span><span class="token punctuation">(</span><span class="token string">"log1"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token class-name">ZookeeperNode</span> node <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ZookeeperNode</span><span class="token punctuation">(</span>snapshotFiles<span class="token punctuation">,</span> logFiles<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        node<span class="token punctuation">.</span><span class="token function">initialize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Node's current ZXID: "</span> <span class="token operator">+</span> node<span class="token punctuation">.</span><span class="token function">getCurrentZxid</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="步骤解释" tabindex="-1"><a class="header-anchor" href="#步骤解释"><span>步骤解释</span></a></h3>
<ol>
<li>
<p><strong>读取快照文件</strong>：</p>
<ul>
<li>调用 <code v-pre>parseSnapshotFile</code> 方法读取快照文件中的 ZXID。</li>
<li>如果读取的 ZXID 大于当前的 <code v-pre>currentZxid</code>，则更新 <code v-pre>currentZxid</code>。</li>
</ul>
</li>
<li>
<p><strong>读取日志文件</strong>：</p>
<ul>
<li>调用 <code v-pre>parseLogFile</code> 方法读取日志文件中的 ZXID。</li>
<li>如果读取的 ZXID 大于当前的 <code v-pre>currentZxid</code>，则更新 <code v-pre>currentZxid</code>。</li>
</ul>
</li>
<li>
<p><strong>初始化最新的 ZXID</strong>：</p>
<ul>
<li>最终，<code v-pre>currentZxid</code> 存储的是读取到的最大 ZXID，即节点的最新 ZXID。</li>
</ul>
</li>
</ol>
<h3 id="领导节点选举过程中的-zxid" tabindex="-1"><a class="header-anchor" href="#领导节点选举过程中的-zxid"><span>领导节点选举过程中的 ZXID</span></a></h3>
<p>在领导节点选举过程中，每个节点会发送它们的最新 ZXID。拥有最大 ZXID 的节点更有可能成为领导节点，
因为它拥有最新的事务数据。</p>
<h3 id="总结-1" tabindex="-1"><a class="header-anchor" href="#总结-1"><span>总结</span></a></h3>
<p>通过读取快照文件和日志文件，Zookeeper 节点可以确定其最新的 ZXID，并在启动时恢复到最新的事务状态。
选举过程中，节点的 ZXID 用于比较最新状态，确保选出的领导节点拥有最新的事务数据，从而保持集群的一
致性和有序性。</p>
<h3 id="快照文件和日志文件的区别-联系" tabindex="-1"><a class="header-anchor" href="#快照文件和日志文件的区别-联系"><span>快照文件和日志文件的区别，联系？</span></a></h3>
<h3 id="快照文件和日志文件的区别与联系" tabindex="-1"><a class="header-anchor" href="#快照文件和日志文件的区别与联系"><span>快照文件和日志文件的区别与联系</span></a></h3>
<p>Zookeeper 使用快照文件和日志文件来持久化数据，确保在节点重启或故障时能够恢复数据的一致性和完整性。
两者的作用和内容有所不同，但相互联系紧密，共同保证 Zookeeper 的高可用性和可靠性。</p>
<h4 id="快照文件-snapshot" tabindex="-1"><a class="header-anchor" href="#快照文件-snapshot"><span>快照文件（Snapshot）</span></a></h4>
<p><strong>作用</strong>：</p>
<ul>
<li>快照文件保存了某一时刻整个 Zookeeper 数据树的完整状态。</li>
<li>它记录了所有 ZNode 的数据和元数据，但不包含从快照生成时刻之后的任何事务。</li>
</ul>
<p><strong>内容</strong>：</p>
<ul>
<li>快照文件包含 ZNode 树的完整结构和数据。</li>
<li>包括每个 ZNode 的数据内容、ACL（访问控制列表）、版本号等元数据。</li>
</ul>
<p><strong>生成时机</strong>：</p>
<ul>
<li>Zookeeper 在后台定期生成快照文件，或在集群进行特定操作时生成。</li>
<li>快照生成的频率和时机可以通过 Zookeeper 配置文件进行设置。</li>
</ul>
<p><strong>存储位置</strong>：</p>
<ul>
<li>快照文件通常存储在 Zookeeper 数据目录中，文件名包含生成快照时的 ZXID。</li>
</ul>
<h4 id="日志文件-transaction-log" tabindex="-1"><a class="header-anchor" href="#日志文件-transaction-log"><span>日志文件（Transaction Log）</span></a></h4>
<p><strong>作用</strong>：</p>
<ul>
<li>日志文件记录了从上一次快照生成之后发生的所有事务操作。</li>
<li>它包含事务的顺序和详情，确保可以重放这些事务来恢复数据状态。</li>
</ul>
<p><strong>内容</strong>：</p>
<ul>
<li>每个事务的操作类型（如创建、删除、更新节点）。</li>
<li>每个事务的 ZXID，确保事务顺序。</li>
<li>事务涉及的 ZNode 的路径和数据。</li>
</ul>
<p><strong>生成时机</strong>：</p>
<ul>
<li>每次有事务操作（如创建、删除、更新 ZNode）时，Zookeeper 会将该操作记录到日志文件中。</li>
<li>日志文件会在达到一定大小或时间间隔后滚动生成新的日志文件。</li>
</ul>
<p><strong>存储位置</strong>：</p>
<ul>
<li>日志文件通常存储在 Zookeeper 日志目录中，文件名包含创建时的 ZXID 范围。</li>
</ul>
<h3 id="联系" tabindex="-1"><a class="header-anchor" href="#联系"><span>联系</span></a></h3>
<ol>
<li>
<p><strong>数据恢复</strong>：</p>
<ul>
<li><strong>快照文件</strong>：提供一个特定时间点的完整数据树状态。</li>
<li><strong>日志文件</strong>：记录从快照时间点之后的所有事务，通过重放这些事务，可以将数据状态恢复到最新。</li>
<li>恢复过程：先加载最新的快照文件，然后重放所有未包含在快照中的日志文件中的事务。</li>
</ul>
</li>
<li>
<p><strong>保证一致性</strong>：</p>
<ul>
<li>快照文件和日志文件共同确保 Zookeeper 的数据一致性。</li>
<li>在系统崩溃或重启时，快照文件提供了基础数据，日志文件确保事务顺序和数据的最新状态。</li>
</ul>
</li>
<li>
<p><strong>事务顺序</strong>：</p>
<ul>
<li>快照文件和日志文件中的事务都有唯一的 ZXID，保证事务的全局顺序。</li>
<li>在恢复数据时，通过 ZXID 可以确定事务的顺序，确保一致性。</li>
</ul>
</li>
</ol>
<h3 id="例子-恢复过程" tabindex="-1"><a class="header-anchor" href="#例子-恢复过程"><span>例子：恢复过程</span></a></h3>
<p>假设有以下快照文件和日志文件：</p>
<ul>
<li><strong>快照文件</strong>：<code v-pre>snapshot.100</code> （包含到 ZXID 100 的数据状态）</li>
<li><strong>日志文件</strong>：
<ul>
<li><code v-pre>log.101</code>（记录从 ZXID 101 开始的事务）</li>
<li><code v-pre>log.201</code>（记录从 ZXID 201 开始的事务）</li>
</ul>
</li>
</ul>
<p>恢复过程如下：</p>
<ol>
<li>
<p><strong>加载快照文件</strong>：</p>
<ul>
<li>读取 <code v-pre>snapshot.100</code> 文件，恢复到 ZXID 100 的数据状态。</li>
</ul>
</li>
<li>
<p><strong>重放日志文件</strong>：</p>
<ul>
<li>读取 <code v-pre>log.101</code> 文件，从 ZXID 101 开始重放事务，更新数据状态。</li>
<li>读取 <code v-pre>log.201</code> 文件，从 ZXID 201 开始重放事务，更新数据状态。</li>
</ul>
</li>
</ol>
<p>最终，节点的状态会恢复到最新的事务状态（假设最新的事务是 ZXID 300）。</p>
<h3 id="示例代码" tabindex="-1"><a class="header-anchor" href="#示例代码"><span>示例代码</span></a></h3>
<p>以下是一个简化的代码示例，展示了如何读取快照文件和日志文件来恢复最新的数据状态：</p>
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
<span class="line">        <span class="token comment">// 读取快照文件</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">File</span> file <span class="token operator">:</span> snapshotFiles<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">long</span> zxid <span class="token operator">=</span> <span class="token function">parseSnapshotFile</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>zxid <span class="token operator">></span> currentZxid<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                currentZxid <span class="token operator">=</span> zxid<span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">// 读取日志文件</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">File</span> file <span class="token operator">:</span> logFiles<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">long</span> zxid <span class="token operator">=</span> <span class="token function">parseLogFile</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>zxid <span class="token operator">></span> currentZxid<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                currentZxid <span class="token operator">=</span> zxid<span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Initialized ZXID: "</span> <span class="token operator">+</span> currentZxid<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">long</span> <span class="token function">parseSnapshotFile</span><span class="token punctuation">(</span><span class="token class-name">File</span> file<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 假设快照文件的 ZXID 存储在文件的开头 8 字节</span></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">(</span><span class="token class-name">FileInputStream</span> fis <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FileInputStream</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> buffer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token number">8</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">            fis<span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>buffer<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token class-name">ByteBuffer</span><span class="token punctuation">.</span><span class="token function">wrap</span><span class="token punctuation">(</span>buffer<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getLong</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">long</span> <span class="token function">parseLogFile</span><span class="token punctuation">(</span><span class="token class-name">File</span> file<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 假设日志文件的 ZXID 存储在文件的开头 8 字节</span></span>
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
<span class="line">        <span class="token comment">// 假设已加载的快照文件和日志文件列表</span></span>
<span class="line">        <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">File</span><span class="token punctuation">></span></span> snapshotFiles <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">File</span><span class="token punctuation">></span></span> logFiles <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        snapshotFiles<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">File</span><span class="token punctuation">(</span><span class="token string">"snapshot1"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        logFiles<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">File</span><span class="token punctuation">(</span><span class="token string">"log1"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token class-name">ZookeeperNode</span> node <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ZookeeperNode</span><span class="token punctuation">(</span>snapshotFiles<span class="token punctuation">,</span> logFiles<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        node<span class="token punctuation">.</span><span class="token function">initialize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Node's current ZXID: "</span> <span class="token operator">+</span> node<span class="token punctuation">.</span><span class="token function">getCurrentZxid</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="总结-2" tabindex="-1"><a class="header-anchor" href="#总结-2"><span>总结</span></a></h3>
<ul>
<li><strong>快照文件</strong>：记录了某一时刻的完整数据状态，不包含之后的事务。</li>
<li><strong>日志文件</strong>：记录了从上一次快照之后的所有事务操作，确保数据可以恢复到最新状态。</li>
<li><strong>联系</strong>：快照文件提供基础数据状态，日志文件补充从快照生成时刻之后的事务，两者结合保证数据的一致性和完整性。</li>
<li><strong>恢复过程</strong>：通过加载最新快照文件并重放所有日志文件中的事务，可以将节点状态恢复到最新。</li>
</ul>
<p>理解快照文件和日志文件的区别和联系，对于掌握 Zookeeper 的数据持久化机制和确保数据一致性至关重要。</p>
</div></template>


