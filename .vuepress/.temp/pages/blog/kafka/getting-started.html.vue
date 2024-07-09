<template><div><h1 id="kafka-文档概览" tabindex="-1"><a class="header-anchor" href="#kafka-文档概览"><span>Kafka 文档概览</span></a></h1>
<p>欢迎阅读 Kafka 文档。本节提供了 Kafka 的基本概览、入门指南和详细内容。</p>
<h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始"><span>快速开始</span></a></h2>
<p>如果你是新手，建议先阅读 <RouteLink to="/blog/kafka/Kafka-%E5%AD%A6%E4%B9%A0%E7%9B%AE%E6%A0%87.html">学习目标</RouteLink> 文档，了解如何安装和配置 Kafka。</p>
<h2 id="详细内容" tabindex="-1"><a class="header-anchor" href="#详细内容"><span>详细内容</span></a></h2>
<h3 id="kafka-集群原理分析概览" tabindex="-1"><a class="header-anchor" href="#kafka-集群原理分析概览"><span>Kafka 集群原理分析概览</span></a></h3>
<ol>
<li><RouteLink to="/blog/kafka/Kafka-%E5%AD%A6%E4%B9%A0%E7%9B%AE%E6%A0%87.html">Kafka-学习目标</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E5%BF%85%E5%A4%87%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86.html">Kafka-必备基础知识</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E7%BB%84%E4%BB%B6%E6%9E%B6%E6%9E%84%E5%B8%88%E9%9C%80%E8%A6%81%E6%8E%8C%E6%8F%A1%E5%93%AA%E4%BA%9B%E8%A6%81%E7%82%B9.html">Kafka-组件架构师需要掌握哪些要点</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E7%9A%84%E5%8D%95%E6%9C%BA%E3%80%81%E9%9B%86%E7%BE%A4%E9%83%A8%E7%BD%B2%E5%AE%89%E8%A3%85.html">Kafka-单机、集群部署安装</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4%E4%B8%BA%E4%BB%80%E4%B9%88%E4%BE%9D%E8%B5%96zookeeper.html">Kafka-集群为什么依赖 zookeeper</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4%E5%85%83%E6%95%B0%E6%8D%AE%E4%B9%8BZookeeper%E5%AD%98%E5%82%A8%E4%BB%8B%E7%BB%8D.html">Kafka-集群元数据之Zookeeper存储介绍</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4%E5%8E%9F%E7%90%86%E8%AE%BE%E8%AE%A1%E5%92%8C%E5%AE%9E%E7%8E%B0%E6%A6%82%E8%BF%B0(%E4%B8%80).html">Kafka-集群原理设计和实现概述(一)</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kakfa-%E9%9B%86%E7%BE%A4%E5%8E%9F%E7%90%86%E8%AE%BE%E8%AE%A1%EF%BC%88%E4%BA%8C%EF%BC%89%E4%B9%8B%E6%BA%90%E7%A0%81%E8%AE%BE%E8%AE%A1%E7%A4%BA%E4%BE%8B%E5%88%86%E6%9E%90.html">Kakfa-集群原理设计（二）之源码设计示例分析</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4%E5%8E%9F%E7%90%86%E8%AE%BE%E8%AE%A1(%E4%B8%89)%E4%B9%8B%E5%90%AF%E5%8A%A8%E5%8E%9F%E7%90%86%E4%BB%8B%E7%BB%8D.html">Kafka-集群原理设计(三)之启动原理介绍</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4%E5%8E%9F%E7%90%86%E8%AE%BE%E8%AE%A1%EF%BC%88%E5%9B%9B%EF%BC%89%E4%B9%8BController%E9%80%89%E4%B8%BE%E5%92%8CPartition%E5%88%86%E9%85%8D.html">Kafka-集群原理设计（四）之Controller选举和Partition分配</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4Controller%E8%8A%82%E7%82%B9%E5%92%8CZookeeper%E9%9B%86%E7%BE%A4leader%E8%8A%82%E7%82%B9%E6%9C%89%E4%BD%95%E5%8C%BA%E5%88%AB%E8%81%94%E7%B3%BB.html">Kafka-集群Controller节点和Zookeeper集群leader节点有何区别联系</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E7%AE%A1%E7%90%86%E8%8A%82%E7%82%B9Controller%E8%AE%BE%E8%AE%A1%E5%88%86%E6%9E%90.html">Kafka-管理节点 Controller 设计分析</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4%E7%8A%B6%E6%80%81%E7%9B%91%E6%B5%8B%E3%80%81%E6%95%85%E9%9A%9C%E5%88%87%E6%8D%A2%E6%9C%BA%E5%88%B6%E5%8E%9F%E7%90%86.html">Kafka-集群状态监测、故障切换机制原理</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4Topic%E4%B9%8BPartion%E6%B6%88%E6%81%AF%E5%8F%AF%E9%9D%A0%E6%80%A7%E8%AE%BE%E8%AE%A1%EF%BC%88%E4%B8%80%EF%BC%89.html">Kafka-集群 Topic 之 Partion 消息可靠性设计（一）</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4Topic%E4%B9%8BPartion%E6%B6%88%E6%81%AF%E5%8F%AF%E9%9D%A0%E6%80%A7%E8%AE%BE%E8%AE%A1%EF%BC%88%E4%BA%8C%EF%BC%89.html">Kafka-集群 Topic 之 Partion 消息可靠性设计（二）</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4Topic%E4%B9%8BPartion%E5%88%86%E5%B8%83%E5%8E%9F%E7%90%86%E8%AE%BE%E8%AE%A1%EF%BC%88%E4%B8%89%EF%BC%89.html">Kafka-集群 Topic 之 Partion 分布原理设计（三）</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4Topic%E4%B9%8BPartion%E5%89%AF%E6%9C%AC%E5%90%8C%E6%AD%A5%E6%80%A7%E8%83%BD%E8%AE%BE%E8%AE%A1%EF%BC%88%E5%9B%9B%EF%BC%89.html">Kafka-集群 Topic 之 Partion 副本同步性能设计（四）</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4Topic%E4%B9%8BPartion%E6%97%A5%E5%BF%97%E5%88%86%E6%AE%B5%E5%AD%98%E5%82%A8%E5%8E%9F%E7%90%86%E8%AE%BE%E8%AE%A1%EF%BC%88%E4%BA%94%EF%BC%89.html">Kafka-集群 Topic 之 Partion日志分段存储原理设计（五）</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4Topic%E4%B9%8BPartion%E6%95%B0%E6%8D%AE%E5%86%99%E5%85%A5%E5%88%86%E5%B8%83%E5%8E%9F%E7%90%86%E8%AE%BE%E8%AE%A1%EF%BC%88%E5%85%AD%EF%BC%89.html">Kafka-集群 Topic 之 Partion 数据写入分布原理设计（六）</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4%E8%8A%82%E7%82%B9%E6%95%B0%E9%87%8F%E4%B8%8EPartition%E5%89%AF%E6%9C%AC%E6%95%B0%E9%87%8F%E5%85%B3%E7%B3%BB%E5%8E%9F%E7%90%86.html">Kafka-集群节点数量与Partition 副本数量关系原理</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-Topic%E4%B9%8BZookeeper%E6%95%B0%E6%8D%AE%E5%86%85%E5%AE%B9%E4%BB%8B%E7%BB%8D.html">Kafka-Topic 之 Zookeeper 数据内容介绍</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4Topic%E3%80%81%E6%B6%88%E6%81%AF%E5%A4%A7%E5%B0%8F%E3%80%81%E8%8A%82%E7%82%B9%E6%A0%BC%E5%BC%8F%E4%B8%8A%E9%99%90%E7%AE%A1%E6%8E%A7%E5%8E%9F%E7%90%86.html">Kafka-集群 Topic、消息大小、节点格式上限管控原理</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4%E8%8A%82%E7%82%B9%E6%95%B0%E9%87%8F%E7%9A%84%E8%AE%BE%E8%AE%A1.html">Kafka-集群节点数量的设计</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-Stream%E6%B5%81%E5%A4%84%E7%90%86%E8%AE%BE%E8%AE%A1%E6%A6%82%E8%BF%B0.html">Kafka-Stream 流处理设计概述</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4%E5%92%8CZookeeper%E9%9B%86%E7%BE%A4%E6%9E%B6%E6%9E%84%E8%AE%BE%E8%AE%A1%E5%AF%B9%E6%AF%94%E5%88%86%E6%9E%90.html">Kafka-和Zookeeper 集群架构设计对比分析</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4%E5%AE%89%E5%85%A8%E8%AE%A4%E8%AF%81%E6%9C%BA%E5%88%B6%E7%9A%84%E5%AE%9E%E7%8E%B0.html">Kafka-集群安全认证机制的实现</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4%E7%9A%84%E6%95%B0%E6%8D%AE%E9%A1%BA%E5%BA%8F%E5%86%99%E5%85%A5%E5%92%8C%E9%9B%B6%E6%8B%B7%E8%B4%9D%E6%8A%80%E6%9C%AF%E8%AE%BE%E8%AE%A1%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86.html">Kafka-集群的数据顺序写入和零拷贝技术设计实现原理</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4%E6%9E%B6%E6%9E%84%E8%AE%BE%E8%AE%A1%E5%8E%9F%E7%90%86%E6%A6%82%E8%BF%B0.html">Kafka-集群架构设计原理概述</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4%E5%A6%82%E4%BD%95%E5%A4%84%E7%90%86%E7%94%9F%E4%BA%A7%E8%80%85%E5%92%8C%E6%B6%88%E8%B4%B9%E8%80%85%E5%A4%84%E7%90%86%E6%B6%88%E6%81%AF%E9%80%9F%E7%8E%87%E5%B7%AE%E5%BC%82%E9%97%AE%E9%A2%98.html">Kafka-集群如何处理生产者和消费者处理消息速率差异问题</RouteLink></li>
<li><RouteLink to="/blog/kafka/Kafka-%E9%9B%86%E7%BE%A4%E7%94%9F%E4%BA%A7%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E4%B8%9A%E5%8A%A1%E5%9C%BA%E6%99%AF.html">Kafka-集群生产性能调优业务场景</RouteLink></li>
</ol>
<h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://kafka.apache.org/documentation/" target="_blank" rel="noopener noreferrer">Kafka 官方文档</a></li>
<li><a href="https://github.com/apache/kafka" target="_blank" rel="noopener noreferrer">Kafka Github</a></li>
</ul>
</div></template>


