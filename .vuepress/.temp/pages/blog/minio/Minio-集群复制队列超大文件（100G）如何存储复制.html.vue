<template><div><h1 id="minio-集群复制队列超大文件-100g-如何存储复制" tabindex="-1"><a class="header-anchor" href="#minio-集群复制队列超大文件-100g-如何存储复制"><span>Minio 集群复制队列超大文件（100G）如何存储复制？</span></a></h1>
<p>在 MinIO 的异步复制过程中，复制队列中的消息内容主要包括对象元数据和复制操作的详细信息，
而不是实际的数据内容。对于大文件（如 100GB 或更大文件）的复制，MinIO 采用了分块上传和分
块复制的策略，以确保复制过程的稳定和高效。</p>
<h3 id="复制队列中的消息内容示例" tabindex="-1"><a class="header-anchor" href="#复制队列中的消息内容示例"><span>复制队列中的消息内容示例</span></a></h3>
<p>复制队列中的消息内容通常包括以下信息：</p>
<ul>
<li>源对象的路径和名称</li>
<li>目标对象的路径和名称</li>
<li>对象的元数据（例如大小、MD5 校验和等）</li>
<li>复制策略的相关信息</li>
</ul>
<h4 id="示例消息内容" tabindex="-1"><a class="header-anchor" href="#示例消息内容"><span>示例消息内容</span></a></h4>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre class="language-json"><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"source_bucket"</span><span class="token operator">:</span> <span class="token string">"my-bucket"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"source_object"</span><span class="token operator">:</span> <span class="token string">"large-file.bin"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"target_bucket"</span><span class="token operator">:</span> <span class="token string">"my-bucket"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"target_object"</span><span class="token operator">:</span> <span class="token string">"large-file.bin"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"metadata"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">"size"</span><span class="token operator">:</span> <span class="token number">100000000000</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"md5sum"</span><span class="token operator">:</span> <span class="token string">"9e107d9d372bb6826bd81d3542a419d6"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"etag"</span><span class="token operator">:</span> <span class="token string">"1b2cf535f27731c974343645a3985328"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"content_type"</span><span class="token operator">:</span> <span class="token string">"application/octet-stream"</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"replication_status"</span><span class="token operator">:</span> <span class="token string">"pending"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"created_time"</span><span class="token operator">:</span> <span class="token string">"2024-07-01T22:00:00Z"</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="分块上传和分块复制的工作原理" tabindex="-1"><a class="header-anchor" href="#分块上传和分块复制的工作原理"><span>分块上传和分块复制的工作原理</span></a></h3>
<p>对于大文件，MinIO 使用了分块上传（multipart upload）机制，将文件分割成多个较小的块，每个块单独
上传和复制。这种方式不仅提高了传输的可靠性和效率，还能更好地利用网络带宽和资源。</p>
<h4 id="分块上传的步骤" tabindex="-1"><a class="header-anchor" href="#分块上传的步骤"><span>分块上传的步骤</span></a></h4>
<ol>
<li>
<p><strong>初始化分块上传</strong>：
客户端请求初始化分块上传，并获得一个上传 ID。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">mc</span> <span class="token function">cp</span> <span class="token parameter variable">--attr</span> x-amz-meta-my-key<span class="token operator">=</span>my-value large-file.bin sourceMinIO/my-bucket/large-file.bin</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>上传分块</strong>：
客户端将文件分割成多个块，并使用上传 ID 分别上传每个块。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">mc</span> <span class="token function">cp</span> <span class="token parameter variable">--attr</span> x-amz-meta-my-key<span class="token operator">=</span>my-value large-file.bin sourceMinIO/my-bucket/large-file.bin</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>完成分块上传</strong>：
客户端发送一个请求，通知服务器所有块上传完毕，服务器将这些块合并成一个完整的对象。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">mc</span> <span class="token function">cp</span> <span class="token parameter variable">--attr</span> x-amz-meta-my-key<span class="token operator">=</span>my-value large-file.bin sourceMinIO/my-bucket/large-file.bin</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ol>
<h4 id="分块复制的步骤" tabindex="-1"><a class="header-anchor" href="#分块复制的步骤"><span>分块复制的步骤</span></a></h4>
<ol>
<li>
<p><strong>初始化分块复制</strong>：
当源对象上传完成后，复制队列会记录分块复制任务，后台任务负责分块复制的执行。</p>
</li>
<li>
<p><strong>复制分块</strong>：
后台任务从复制队列中读取消息，获取分块信息，并将每个分块异步复制到目标集群。</p>
</li>
<li>
<p><strong>完成分块复制</strong>：
当所有分块都复制完成后，目标集群将这些分块合并成一个完整的对象。</p>
</li>
</ol>
<h3 id="分块复制的示例代码" tabindex="-1"><a class="header-anchor" href="#分块复制的示例代码"><span>分块复制的示例代码</span></a></h3>
<p>假设用户上传了一个 100GB 的大文件，MinIO 会将文件分割成多个 5GB 的块进行上传和复制。以下是分块上传和
复制的过程示例：</p>
<h4 id="初始化分块上传" tabindex="-1"><a class="header-anchor" href="#初始化分块上传"><span>初始化分块上传</span></a></h4>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py" data-title="py"><pre v-pre class="language-python"><code><span class="line"><span class="token keyword">import</span> boto3</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 boto3 初始化分块上传</span></span>
<span class="line">s3_client <span class="token operator">=</span> boto3<span class="token punctuation">.</span>client<span class="token punctuation">(</span><span class="token string">'s3'</span><span class="token punctuation">,</span> endpoint_url<span class="token operator">=</span><span class="token string">'http://source-minio.example.com'</span><span class="token punctuation">,</span> </span>
<span class="line">aws_access_key_id<span class="token operator">=</span><span class="token string">'accessKey'</span><span class="token punctuation">,</span> aws_secret_access_key<span class="token operator">=</span><span class="token string">'secretKey'</span><span class="token punctuation">)</span></span>
<span class="line">response <span class="token operator">=</span> s3_client<span class="token punctuation">.</span>create_multipart_upload<span class="token punctuation">(</span>Bucket<span class="token operator">=</span><span class="token string">'my-bucket'</span><span class="token punctuation">,</span> Key<span class="token operator">=</span><span class="token string">'large-file.bin'</span><span class="token punctuation">)</span></span>
<span class="line">upload_id <span class="token operator">=</span> response<span class="token punctuation">[</span><span class="token string">'UploadId'</span><span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="上传分块" tabindex="-1"><a class="header-anchor" href="#上传分块"><span>上传分块</span></a></h4>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py" data-title="py"><pre v-pre class="language-python"><code><span class="line">part_number <span class="token operator">=</span> <span class="token number">1</span></span>
<span class="line"><span class="token keyword">with</span> <span class="token builtin">open</span><span class="token punctuation">(</span><span class="token string">'large-file.bin'</span><span class="token punctuation">,</span> <span class="token string">'rb'</span><span class="token punctuation">)</span> <span class="token keyword">as</span> <span class="token builtin">file</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token keyword">while</span> <span class="token boolean">True</span><span class="token punctuation">:</span></span>
<span class="line">        data <span class="token operator">=</span> <span class="token builtin">file</span><span class="token punctuation">.</span>read<span class="token punctuation">(</span><span class="token number">5</span> <span class="token operator">*</span> <span class="token number">1024</span> <span class="token operator">*</span> <span class="token number">1024</span> <span class="token operator">*</span> <span class="token number">1024</span><span class="token punctuation">)</span>  <span class="token comment"># 读取 5GB 的数据</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token keyword">not</span> data<span class="token punctuation">:</span></span>
<span class="line">            <span class="token keyword">break</span></span>
<span class="line">        response <span class="token operator">=</span> s3_client<span class="token punctuation">.</span>upload_part<span class="token punctuation">(</span>Bucket<span class="token operator">=</span><span class="token string">'my-bucket'</span><span class="token punctuation">,</span> Key<span class="token operator">=</span><span class="token string">'large-file.bin'</span><span class="token punctuation">,</span> </span>
<span class="line">        PartNumber<span class="token operator">=</span>part_number<span class="token punctuation">,</span> UploadId<span class="token operator">=</span>upload_id<span class="token punctuation">,</span> Body<span class="token operator">=</span>data<span class="token punctuation">)</span></span>
<span class="line">        part_number <span class="token operator">+=</span> <span class="token number">1</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="完成分块上传" tabindex="-1"><a class="header-anchor" href="#完成分块上传"><span>完成分块上传</span></a></h4>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py" data-title="py"><pre v-pre class="language-python"><code><span class="line">parts <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span></span>
<span class="line"><span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> part_number<span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">    parts<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token string">'PartNumber'</span><span class="token punctuation">:</span> i<span class="token punctuation">,</span> <span class="token string">'ETag'</span><span class="token punctuation">:</span> s3_client<span class="token punctuation">.</span>head_object<span class="token punctuation">(</span>Bucket<span class="token operator">=</span><span class="token string">'my-bucket'</span><span class="token punctuation">,</span> </span>
<span class="line">    Key<span class="token operator">=</span><span class="token string">'large-file.bin'</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token string">'ETag'</span><span class="token punctuation">]</span><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">s3_client<span class="token punctuation">.</span>complete_multipart_upload<span class="token punctuation">(</span>Bucket<span class="token operator">=</span><span class="token string">'my-bucket'</span><span class="token punctuation">,</span> Key<span class="token operator">=</span><span class="token string">'large-file.bin'</span><span class="token punctuation">,</span> </span>
<span class="line">UploadId<span class="token operator">=</span>upload_id<span class="token punctuation">,</span> MultipartUpload<span class="token operator">=</span><span class="token punctuation">{</span><span class="token string">'Parts'</span><span class="token punctuation">:</span> parts<span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="分块复制的工作原理" tabindex="-1"><a class="header-anchor" href="#分块复制的工作原理"><span>分块复制的工作原理</span></a></h4>
<p>MinIO 后台任务读取复制队列中的消息，根据上传 ID 和分块信息，依次复制每个分块到目标集群。完成所有
分块复制后，目标集群合并这些分块，形成完整的对象。</p>
<h3 id="控制网络占用和资源" tabindex="-1"><a class="header-anchor" href="#控制网络占用和资源"><span>控制网络占用和资源</span></a></h3>
<p>为了在异步复制过程中控制网络占用，可以采用以下措施：</p>
<ol>
<li>
<p><strong>带宽限制</strong>：
使用带宽限制参数控制复制任务的网络使用。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="line"><span class="token function">mc</span> replicate <span class="token builtin class-name">set</span> <span class="token parameter variable">--bandwidth</span> <span class="token string">"10MB/s"</span> sourceMinIO/my-bucket</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>分批次复制</strong>：
分批次进行大文件的分块复制，减少瞬时网络压力。</p>
</li>
<li>
<p><strong>时间窗口</strong>：
在业务低峰期进行分块复制，避免高峰期对业务的影响。</p>
</li>
<li>
<p><strong>监控和调整</strong>：
实时监控网络使用情况，并动态调整带宽和复制策略。</p>
</li>
</ol>
<h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<p>MinIO 异步复制通过分块上传和分块复制的机制，确保大文件的高效复制。复制队列存储对象的元数据和复制操作的
信息，而不是实际的数据内容。通过分块上传和分块复制，MinIO 能够在不影响业务正常运行的情况下，实现大文件
的异地复制。利用带宽限制、分批次复制和时间窗口等策略，可以有效控制网络占用，保证业务的正常使用。</p>
</div></template>


