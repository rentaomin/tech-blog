<template><div><h1 id="zookeeper-集群节点实现通信原理-一" tabindex="-1"><a class="header-anchor" href="#zookeeper-集群节点实现通信原理-一"><span>Zookeeper 集群节点实现通信原理(一)</span></a></h1>
<p>多节点部署完启动时，为了选举发送自己节点选举的信息，是如何实现通信的，实现原理</p>
<p>在 Zookeeper 的多节点集群中，为了选举领导节点，每个节点需要互相通信以发送和接收选举信息。
这种通信是通过一种称为 <strong>Fast Leader Election</strong> 的算法来实现的。以下是实现通信的原理和详细步骤。</p>
<h3 id="fast-leader-election-算法" tabindex="-1"><a class="header-anchor" href="#fast-leader-election-算法"><span>Fast Leader Election 算法</span></a></h3>
<p>Fast Leader Election 算法是 Zookeeper 中用于快速选举领导节点的一种算法。它依赖于所有节点之间的通信来交换
选举信息，并通过比较 ZXID 和节点 ID 来确定新的领导节点。</p>
<h3 id="通信的实现原理" tabindex="-1"><a class="header-anchor" href="#通信的实现原理"><span>通信的实现原理</span></a></h3>
<h4 id="_1-节点间的连接和通信" tabindex="-1"><a class="header-anchor" href="#_1-节点间的连接和通信"><span>1. 节点间的连接和通信</span></a></h4>
<p>每个 Zookeeper 节点启动时，会尝试与集群中的其他节点建立 TCP 连接。这种连接用于在选举过程中交换选举消息。</p>
<ul>
<li><strong>QuorumPeer</strong> 类：每个 Zookeeper 节点运行一个 <code v-pre>QuorumPeer</code> 实例，负责选举过程和与其他节点的通信。</li>
<li><strong>QuorumCnxManager</strong> 类：负责管理节点之间的连接和消息传递。它使用 TCP 连接来传输选举消息。</li>
</ul>
<h4 id="_2-发送选举信息" tabindex="-1"><a class="header-anchor" href="#_2-发送选举信息"><span>2. 发送选举信息</span></a></h4>
<p>当节点启动时，它会进入选举模式，并将自己认为的领导节点信息广播给所有其他节点。这包括节点 ID、ZXID 和
投票的领导节点 ID。</p>
<ul>
<li><strong>投票信息</strong>：包括当前节点的 ID、ZXID 和投票的领导节点 ID。</li>
<li><strong>消息格式</strong>：选举消息包含投票信息，被封装成一个 <code v-pre>Vote</code> 对象，并通过 TCP 连接发送给其他节点。</li>
</ul>
<h4 id="_3-接收和处理选举信息" tabindex="-1"><a class="header-anchor" href="#_3-接收和处理选举信息"><span>3. 接收和处理选举信息</span></a></h4>
<p>每个节点会接收来自其他节点的选举消息，并根据消息内容进行处理和比较。</p>
<ul>
<li><strong>接收消息</strong>：节点通过 <code v-pre>QuorumCnxManager</code> 接收来自其他节点的选举消息。</li>
<li><strong>处理消息</strong>：节点比较接收到的投票信息，根据 ZXID 和节点 ID 选择新的领导节点。</li>
<li><strong>更新投票</strong>：如果接收到的投票信息更优（即 ZXID 更高或节点 ID 更大），则更新本节点的投票，并广
播新的投票信息。</li>
</ul>
<h3 id="详细步骤和实现逻辑" tabindex="-1"><a class="header-anchor" href="#详细步骤和实现逻辑"><span>详细步骤和实现逻辑</span></a></h3>
<p>以下是 Fast Leader Election 算法的详细步骤和代码示例：</p>
<h4 id="_1-初始化节点和连接" tabindex="-1"><a class="header-anchor" href="#_1-初始化节点和连接"><span>1. 初始化节点和连接</span></a></h4>
<p>每个节点启动时，会初始化自己的状态，并尝试与其他节点建立连接。</p>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre v-pre class="language-java"><code><span class="line"><span class="token keyword">class</span> <span class="token class-name">QuorumPeer</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">int</span> myId<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">long</span> myZxid<span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">QuorumCnxManager</span> cnxManager<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">QuorumPeer</span><span class="token punctuation">(</span><span class="token keyword">int</span> id<span class="token punctuation">,</span> <span class="token keyword">long</span> zxid<span class="token punctuation">,</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">InetSocketAddress</span><span class="token punctuation">></span></span> peerAddresses<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>myId <span class="token operator">=</span> id<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>myZxid <span class="token operator">=</span> zxid<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>cnxManager <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">QuorumCnxManager</span><span class="token punctuation">(</span>peerAddresses<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-发送和接收选举消息" tabindex="-1"><a class="header-anchor" href="#_2-发送和接收选举消息"><span>2. 发送和接收选举消息</span></a></h4>
<p>每个节点会发送自己的投票信息，并接收来自其他节点的投票信息。</p>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre v-pre class="language-java"><code><span class="line"><span class="token keyword">class</span> <span class="token class-name">QuorumCnxManager</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">,</span> <span class="token class-name">Socket</span><span class="token punctuation">></span></span> peerSockets <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">QuorumCnxManager</span><span class="token punctuation">(</span><span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">InetSocketAddress</span><span class="token punctuation">></span></span> peerAddresses<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">InetSocketAddress</span> address <span class="token operator">:</span> peerAddresses<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token class-name">Socket</span> socket <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Socket</span><span class="token punctuation">(</span>address<span class="token punctuation">.</span><span class="token function">getHostName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> address<span class="token punctuation">.</span><span class="token function">getPort</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                peerSockets<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span>address<span class="token punctuation">.</span><span class="token function">getPort</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> socket<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">IOException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">void</span> <span class="token function">sendVote</span><span class="token punctuation">(</span><span class="token class-name">Vote</span> vote<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Socket</span> socket <span class="token operator">:</span> peerSockets<span class="token punctuation">.</span><span class="token function">values</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token class-name">ObjectOutputStream</span> out <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ObjectOutputStream</span><span class="token punctuation">(</span>socket<span class="token punctuation">.</span><span class="token function">getOutputStream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                out<span class="token punctuation">.</span><span class="token function">writeObject</span><span class="token punctuation">(</span>vote<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">IOException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">Vote</span> <span class="token function">receiveVote</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Socket</span> socket <span class="token operator">:</span> peerSockets<span class="token punctuation">.</span><span class="token function">values</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token class-name">ObjectInputStream</span> in <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ObjectInputStream</span><span class="token punctuation">(</span>socket<span class="token punctuation">.</span><span class="token function">getInputStream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token class-name">Vote</span><span class="token punctuation">)</span> in<span class="token punctuation">.</span><span class="token function">readObject</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">IOException</span> <span class="token operator">|</span> <span class="token class-name">ClassNotFoundException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-选举过程" tabindex="-1"><a class="header-anchor" href="#_3-选举过程"><span>3. 选举过程</span></a></h4>
<p>每个节点在选举过程中会不断接收和处理投票信息，直到选举出新的领导节点。</p>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre v-pre class="language-java"><code><span class="line"><span class="token keyword">class</span> <span class="token class-name">Vote</span> <span class="token keyword">implements</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span></span>
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
<span class="line">    <span class="token comment">// ... 上文中的内容</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">void</span> <span class="token function">lookForLeader</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">,</span> <span class="token class-name">Vote</span><span class="token punctuation">></span></span> votes <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        votes<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span>myId<span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">Vote</span><span class="token punctuation">(</span>myId<span class="token punctuation">,</span> myZxid<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            cnxManager<span class="token punctuation">.</span><span class="token function">sendVote</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Vote</span><span class="token punctuation">(</span>myId<span class="token punctuation">,</span> myZxid<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">            <span class="token class-name">Vote</span> receivedVote <span class="token operator">=</span> cnxManager<span class="token punctuation">.</span><span class="token function">receiveVote</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>receivedVote <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                votes<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span>receivedVote<span class="token punctuation">.</span>nodeId<span class="token punctuation">,</span> receivedVote<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">                <span class="token class-name">Vote</span> bestVote <span class="token operator">=</span> <span class="token function">getBestVote</span><span class="token punctuation">(</span>votes<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isMajority</span><span class="token punctuation">(</span>bestVote<span class="token punctuation">,</span> votes<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Elected leader: "</span> <span class="token operator">+</span> bestVote<span class="token punctuation">.</span>nodeId<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                    <span class="token keyword">break</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">Vote</span> <span class="token function">getBestVote</span><span class="token punctuation">(</span><span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">,</span> <span class="token class-name">Vote</span><span class="token punctuation">></span></span> votes<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
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
<span class="line">    <span class="token keyword">boolean</span> <span class="token function">isMajority</span><span class="token punctuation">(</span><span class="token class-name">Vote</span> vote<span class="token punctuation">,</span> <span class="token keyword">int</span> totalNodes<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">int</span> count <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Vote</span> v <span class="token operator">:</span> votes<span class="token punctuation">.</span><span class="token function">values</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>v<span class="token punctuation">.</span>zxid <span class="token operator">==</span> vote<span class="token punctuation">.</span>zxid <span class="token operator">&amp;&amp;</span> v<span class="token punctuation">.</span>nodeId <span class="token operator">==</span> vote<span class="token punctuation">.</span>nodeId<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                count<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">return</span> count <span class="token operator">></span> <span class="token punctuation">(</span>totalNodes <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ZookeeperLeaderElection</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">InetSocketAddress</span><span class="token punctuation">></span></span> peerAddresses <span class="token operator">=</span> <span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">asList</span><span class="token punctuation">(</span></span>
<span class="line">            <span class="token keyword">new</span> <span class="token class-name">InetSocketAddress</span><span class="token punctuation">(</span><span class="token string">"192.168.0.200"</span><span class="token punctuation">,</span> <span class="token number">2181</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token keyword">new</span> <span class="token class-name">InetSocketAddress</span><span class="token punctuation">(</span><span class="token string">"192.168.0.201"</span><span class="token punctuation">,</span> <span class="token number">2181</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token keyword">new</span> <span class="token class-name">InetSocketAddress</span><span class="token punctuation">(</span><span class="token string">"192.168.0.202"</span><span class="token punctuation">,</span> <span class="token number">2181</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token class-name">QuorumPeer</span> node <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">QuorumPeer</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">,</span> peerAddresses<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        node<span class="token punctuation">.</span><span class="token function">lookForLeader</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="选举过程的总结" tabindex="-1"><a class="header-anchor" href="#选举过程的总结"><span>选举过程的总结</span></a></h3>
<ol>
<li><strong>初始化连接</strong>：每个节点在启动时初始化自身的状态和与其他节点的连接。</li>
<li><strong>发送投票信息</strong>：每个节点广播自己的投票信息，包括节点 ID 和 ZXID。</li>
<li><strong>接收投票信息</strong>：每个节点接收其他节点的投票信息，并进行比较。</li>
<li><strong>更新投票</strong>：如果接收到的投票信息更优，则更新本节点的投票，并继续广播新的投票信息。</li>
<li><strong>确定领导节点</strong>：当一个节点获得多数节点的支持时，选举结束，该节点成为新的领导节点。</li>
</ol>
<p>通过上述步骤，Zookeeper 实现了高效的领导节点选举机制，确保集群的高可用性和一致性。</p>
</div></template>


