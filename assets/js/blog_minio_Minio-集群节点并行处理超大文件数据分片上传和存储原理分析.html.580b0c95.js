"use strict";(self.webpackChunkarch_guide=self.webpackChunkarch_guide||[]).push([[3609],{8578:(n,s,a)=>{a.r(s),a.d(s,{comp:()=>o,data:()=>c});var p=a(641);const t=[(0,p.Fv)('<h1 id="minio-集群节点并行处理超大文件数据分片上传和存储原理分析" tabindex="-1"><a class="header-anchor" href="#minio-集群节点并行处理超大文件数据分片上传和存储原理分析"><span>Minio 集群节点并行处理超大文件数据分片上传和存储原理分析</span></a></h1><p>在 MinIO 集群中，客户端分片上传超大文件时，各个节点可以并行接收分片数据请求。这种设计能够更好地利用集群的 带宽和计算资源，提高上传速度和系统的吞吐量。以下是 MinIO 集群并行接收分片数据请求的实现方式，以及如何进行 数据冗余存储和完整性检查。</p><h3 id="数据分片并行接收和存储" tabindex="-1"><a class="header-anchor" href="#数据分片并行接收和存储"><span>数据分片并行接收和存储</span></a></h3><h4 id="分片上传过程" tabindex="-1"><a class="header-anchor" href="#分片上传过程"><span>分片上传过程</span></a></h4><ol><li><p><strong>初始化上传</strong>： 客户端请求初始化一个分片上传任务，MinIO 返回一个上传 ID，标识这个上传会话。</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="language-java"><code><span class="line"><span class="token class-name">MinioClient</span> minioClient <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MinioClient</span><span class="token punctuation">(</span><span class="token string">&quot;http://minio-server:9000&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;accessKey&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;secretKey&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"><span class="token class-name">String</span> uploadId <span class="token operator">=</span> minioClient<span class="token punctuation">.</span><span class="token function">initiateMultipartUpload</span><span class="token punctuation">(</span>bucketName<span class="token punctuation">,</span> objectKey<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>上传分片</strong>： 客户端将文件分成多个分片，并将这些分片并行上传到 MinIO 集群。每个分片上传请求可以由不同的节点处理。</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="language-java"><code><span class="line"><span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">PartETag</span><span class="token punctuation">&gt;</span></span> partETags <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"><span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> totalParts<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">    <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> data <span class="token operator">=</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">;</span> <span class="token comment">// Load the part data</span></span>\n<span class="line">    <span class="token class-name">String</span> etag <span class="token operator">=</span> minioClient<span class="token punctuation">.</span><span class="token function">uploadPart</span><span class="token punctuation">(</span>bucketName<span class="token punctuation">,</span> objectKey<span class="token punctuation">,</span> uploadId<span class="token punctuation">,</span> partNumber<span class="token punctuation">,</span> data<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">    partETags<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">PartETag</span><span class="token punctuation">(</span>partNumber<span class="token punctuation">,</span> etag<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"><span class="token punctuation">}</span></span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>完成上传</strong>： 客户端发送完成上传请求，MinIO 集群将所有分片合并成一个完整的文件。</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="language-java"><code><span class="line">minioClient<span class="token punctuation">.</span><span class="token function">completeMultipartUpload</span><span class="token punctuation">(</span>bucketName<span class="token punctuation">,</span> objectKey<span class="token punctuation">,</span> uploadId<span class="token punctuation">,</span> partETags<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li></ol><h3 id="数据冗余存储和完整性检查" tabindex="-1"><a class="header-anchor" href="#数据冗余存储和完整性检查"><span>数据冗余存储和完整性检查</span></a></h3><h4 id="数据冗余存储" tabindex="-1"><a class="header-anchor" href="#数据冗余存储"><span>数据冗余存储</span></a></h4><p>MinIO 使用 Erasure Coding（纠删码）技术进行数据冗余存储。纠删码将数据分割成数据块和冗余块，这些块分布在不同的节点 上。即使部分节点发生故障，数据仍然可以通过冗余块进行恢复。</p><ol><li><p><strong>数据分块</strong>： 上传的每个分片在存储前被分割成多个数据块和冗余块。例如，将一个 1MB 的分片分成 8 个数据块和 4 个冗余块，总共 12 个块。</p></li><li><p><strong>块分布</strong>： 这些块被分布到不同的存储节点上，以确保高可用性和数据冗余。</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="language-java"><code><span class="line"><span class="token keyword">int</span> dataBlocks <span class="token operator">=</span> <span class="token number">8</span><span class="token punctuation">;</span></span>\n<span class="line"><span class="token keyword">int</span> parityBlocks <span class="token operator">=</span> <span class="token number">4</span><span class="token punctuation">;</span></span>\n<span class="line"><span class="token class-name">ErasureEncoder</span> encoder <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ErasureEncoder</span><span class="token punctuation">(</span>dataBlocks<span class="token punctuation">,</span> parityBlocks<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"><span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">]</span> blocks <span class="token operator">=</span> encoder<span class="token punctuation">.</span><span class="token function">encode</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>块存储</strong>： 每个存储节点接收到其负责的块，并将其存储在本地磁盘上。</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="language-java"><code><span class="line"><span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> blocks<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">    <span class="token class-name">String</span> node <span class="token operator">=</span> <span class="token function">getNodeForBlock</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">    <span class="token function">storeBlock</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> blocks<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"><span class="token punctuation">}</span></span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h4 id="完整性检查" tabindex="-1"><a class="header-anchor" href="#完整性检查"><span>完整性检查</span></a></h4><ol><li><p><strong>分片校验</strong>： 在每个分片上传完成后，MinIO 生成一个 ETag（实体标签）用于标识该分片。ETag 是通过对分片数据计算 MD5 哈希值生成的。</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="language-java"><code><span class="line"><span class="token class-name">MessageDigest</span> md5Digest <span class="token operator">=</span> <span class="token class-name">MessageDigest</span><span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token string">&quot;MD5&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"><span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> etagBytes <span class="token operator">=</span> md5Digest<span class="token punctuation">.</span><span class="token function">digest</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"><span class="token class-name">String</span> etag <span class="token operator">=</span> <span class="token class-name">Base64</span><span class="token punctuation">.</span><span class="token function">getEncoder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">encodeToString</span><span class="token punctuation">(</span>etagBytes<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>合并校验</strong>： 在完成上传时，MinIO 集群对所有分片进行校验，确保每个分片的数据完整性和顺序正确。</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="language-java"><code><span class="line"><span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">PartETag</span><span class="token punctuation">&gt;</span></span> partETags <span class="token operator">=</span> minioClient<span class="token punctuation">.</span><span class="token function">listMultipartUploadParts</span><span class="token punctuation">(</span>bucketName<span class="token punctuation">,</span> objectKey<span class="token punctuation">,</span> uploadId<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"><span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">PartETag</span> partETag <span class="token operator">:</span> partETags<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">    <span class="token function">validatePartETag</span><span class="token punctuation">(</span>partETag<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"><span class="token punctuation">}</span></span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>数据恢复</strong>： 如果某个节点上的块损坏或丢失，MinIO 可以通过纠删码技术，从剩余的数据块和冗余块中恢复数据。</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="language-java"><code><span class="line"><span class="token class-name">ErasureDecoder</span> decoder <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ErasureDecoder</span><span class="token punctuation">(</span>dataBlocks<span class="token punctuation">,</span> parityBlocks<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"><span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> recoveredData <span class="token operator">=</span> decoder<span class="token punctuation">.</span><span class="token function">decode</span><span class="token punctuation">(</span>blocks<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h3 id="设计实现原理" tabindex="-1"><a class="header-anchor" href="#设计实现原理"><span>设计实现原理</span></a></h3><ul><li><strong>分片上传</strong>：客户端将文件分割成多个分片，并通过并行上传将这些分片上传到不同的存储节点。</li><li><strong>纠删码</strong>：每个分片在存储前被分割成数据块和冗余块，并分布到不同的节点上，确保数据冗余和高可用性。</li><li><strong>完整性检查</strong>：上传过程中和完成后，使用 ETag 进行数据校验，确保数据完整性。</li><li><strong>数据恢复</strong>：通过纠删码技术，在节点故障时从剩余的块中恢复数据，确保数据不丢失。</li></ul><h3 id="java-示例代码" tabindex="-1"><a class="header-anchor" href="#java-示例代码"><span>Java 示例代码</span></a></h3><p>下面是一个简单的 Java 示例，展示了如何通过分片上传和纠删码实现 MinIO 集群的数据冗余存储和完整性检查。</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="language-java"><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MinioErasureCodingExample</span> <span class="token punctuation">{</span></span>\n<span class="line"></span>\n<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">DATA_BLOCKS</span> <span class="token operator">=</span> <span class="token number">8</span><span class="token punctuation">;</span></span>\n<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">PARITY_BLOCKS</span> <span class="token operator">=</span> <span class="token number">4</span><span class="token punctuation">;</span></span>\n<span class="line"></span>\n<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span></span>\n<span class="line">        <span class="token class-name">MinioClient</span> minioClient <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MinioClient</span><span class="token punctuation">(</span><span class="token string">&quot;http://minio-server:9000&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;accessKey&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;secretKey&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">        <span class="token class-name">String</span> bucketName <span class="token operator">=</span> <span class="token string">&quot;my-bucket&quot;</span><span class="token punctuation">;</span></span>\n<span class="line">        <span class="token class-name">String</span> objectKey <span class="token operator">=</span> <span class="token string">&quot;large-file&quot;</span><span class="token punctuation">;</span></span>\n<span class="line">        <span class="token class-name">String</span> uploadId <span class="token operator">=</span> minioClient<span class="token punctuation">.</span><span class="token function">initiateMultipartUpload</span><span class="token punctuation">(</span>bucketName<span class="token punctuation">,</span> objectKey<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"></span>\n<span class="line">        <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">PartETag</span><span class="token punctuation">&gt;</span></span> partETags <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">        <span class="token class-name">File</span> file <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">File</span><span class="token punctuation">(</span><span class="token string">&quot;large-file.dat&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">        <span class="token keyword">long</span> partSize <span class="token operator">=</span> <span class="token number">5</span> <span class="token operator">*</span> <span class="token number">1024</span> <span class="token operator">*</span> <span class="token number">1024</span><span class="token punctuation">;</span> <span class="token comment">// 5MB</span></span>\n<span class="line"></span>\n<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">(</span><span class="token class-name">FileInputStream</span> fis <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FileInputStream</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">            <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> buffer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">)</span> partSize<span class="token punctuation">]</span><span class="token punctuation">;</span></span>\n<span class="line">            <span class="token keyword">int</span> partNumber <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>\n<span class="line">            <span class="token keyword">int</span> bytesRead<span class="token punctuation">;</span></span>\n<span class="line">            <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>bytesRead <span class="token operator">=</span> fis<span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>buffer<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">                <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> data <span class="token operator">=</span> <span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">copyOf</span><span class="token punctuation">(</span>buffer<span class="token punctuation">,</span> bytesRead<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"></span>\n<span class="line">                <span class="token comment">// Erasure coding</span></span>\n<span class="line">                <span class="token class-name">ErasureEncoder</span> encoder <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ErasureEncoder</span><span class="token punctuation">(</span><span class="token constant">DATA_BLOCKS</span><span class="token punctuation">,</span> <span class="token constant">PARITY_BLOCKS</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">                <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">]</span> blocks <span class="token operator">=</span> encoder<span class="token punctuation">.</span><span class="token function">encode</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"></span>\n<span class="line">                <span class="token comment">// Upload blocks to different nodes</span></span>\n<span class="line">                <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> blocks<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">                    <span class="token class-name">String</span> node <span class="token operator">=</span> <span class="token function">getNodeForBlock</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">                    <span class="token class-name">String</span> blockKey <span class="token operator">=</span> objectKey <span class="token operator">+</span> <span class="token string">&quot;/part-&quot;</span> <span class="token operator">+</span> partNumber <span class="token operator">+</span> <span class="token string">&quot;-block-&quot;</span> <span class="token operator">+</span> i<span class="token punctuation">;</span></span>\n<span class="line">                    minioClient<span class="token punctuation">.</span><span class="token function">putObject</span><span class="token punctuation">(</span>bucketName<span class="token punctuation">,</span> blockKey<span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">ByteArrayInputStream</span><span class="token punctuation">(</span>blocks<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">,</span> </span>\n<span class="line">                    blocks<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>length<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">                <span class="token punctuation">}</span></span>\n<span class="line"></span>\n<span class="line">                <span class="token comment">// Calculate ETag for the part</span></span>\n<span class="line">                <span class="token class-name">MessageDigest</span> md5Digest <span class="token operator">=</span> <span class="token class-name">MessageDigest</span><span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token string">&quot;MD5&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">                <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> etagBytes <span class="token operator">=</span> md5Digest<span class="token punctuation">.</span><span class="token function">digest</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">                <span class="token class-name">String</span> etag <span class="token operator">=</span> <span class="token class-name">Base64</span><span class="token punctuation">.</span><span class="token function">getEncoder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">encodeToString</span><span class="token punctuation">(</span>etagBytes<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line"></span>\n<span class="line">                partETags<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">PartETag</span><span class="token punctuation">(</span>partNumber<span class="token punctuation">,</span> etag<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">                partNumber<span class="token operator">++</span><span class="token punctuation">;</span></span>\n<span class="line">            <span class="token punctuation">}</span></span>\n<span class="line">        <span class="token punctuation">}</span></span>\n<span class="line"></span>\n<span class="line">        minioClient<span class="token punctuation">.</span><span class="token function">completeMultipartUpload</span><span class="token punctuation">(</span>bucketName<span class="token punctuation">,</span> objectKey<span class="token punctuation">,</span> uploadId<span class="token punctuation">,</span> partETags<span class="token punctuation">)</span><span class="token punctuation">;</span></span>\n<span class="line">    <span class="token punctuation">}</span></span>\n<span class="line"></span>\n<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">String</span> <span class="token function">getNodeForBlock</span><span class="token punctuation">(</span><span class="token keyword">int</span> blockIndex<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>\n<span class="line">        <span class="token comment">// Determine the node for the block based on the block index</span></span>\n<span class="line">        <span class="token comment">// For simplicity, assume a static mapping</span></span>\n<span class="line">        <span class="token keyword">return</span> <span class="token string">&quot;http://minio-node-&quot;</span> <span class="token operator">+</span> <span class="token punctuation">(</span>blockIndex <span class="token operator">%</span> <span class="token number">4</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;:9000&quot;</span><span class="token punctuation">;</span></span>\n<span class="line">    <span class="token punctuation">}</span></span>\n<span class="line"><span class="token punctuation">}</span></span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3><p>MinIO 集群在处理超大文件上传时，通过并行分片上传和纠删码技术实现数据的冗余存储和完整性检查。各个节点并行接收分 片数据请求，利用纠删码技术分割数据块和冗余块，确保高可用性和数据恢复能力。同时，通过 ETag 校验和分块合并，保证 数据的完整性和一致性。</p>',18)],e={},o=(0,a(6262).A)(e,[["render",function(n,s){return(0,p.uX)(),(0,p.CE)("div",null,t)}]]),c=JSON.parse('{"path":"/blog/minio/Minio-%E9%9B%86%E7%BE%A4%E8%8A%82%E7%82%B9%E5%B9%B6%E8%A1%8C%E5%A4%84%E7%90%86%E8%B6%85%E5%A4%A7%E6%96%87%E4%BB%B6%E6%95%B0%E6%8D%AE%E5%88%86%E7%89%87%E4%B8%8A%E4%BC%A0%E5%92%8C%E5%AD%98%E5%82%A8%E5%8E%9F%E7%90%86%E5%88%86%E6%9E%90.html","title":"Minio 集群节点并行处理超大文件数据分片上传和存储原理分析","lang":"zh-CN","frontmatter":{"date":"2021-07-07T00:00:00.000Z","category":["Minio"],"tag":["对象存储"],"sticky":true,"excerpt":"<p> Minio 上传请求负载分析 </p>"},"headers":[{"level":3,"title":"数据分片并行接收和存储","slug":"数据分片并行接收和存储","link":"#数据分片并行接收和存储","children":[]},{"level":3,"title":"数据冗余存储和完整性检查","slug":"数据冗余存储和完整性检查","link":"#数据冗余存储和完整性检查","children":[]},{"level":3,"title":"设计实现原理","slug":"设计实现原理","link":"#设计实现原理","children":[]},{"level":3,"title":"Java 示例代码","slug":"java-示例代码","link":"#java-示例代码","children":[]},{"level":3,"title":"总结","slug":"总结","link":"#总结","children":[]}],"git":{"updatedTime":1720532327000,"contributors":[{"name":"asus","email":"939943844@qq.com","commits":1}]},"filePathRelative":"blog/minio/Minio-集群节点并行处理超大文件数据分片上传和存储原理分析.md"}')}}]);