(()=>{"use strict";var o,e,a,l={},i={};function t(o){var e=i[o];if(void 0!==e)return e.exports;var a=i[o]={exports:{}};return l[o](a,a.exports,t),a.exports}t.m=l,o=[],t.O=(e,a,l,i)=>{if(!a){var _=1/0;for(m=0;m<o.length;m++){for(var[a,l,i]=o[m],b=!0,r=0;r<a.length;r++)(!1&i||_>=i)&&Object.keys(t.O).every((o=>t.O[o](a[r])))?a.splice(r--,1):(b=!1,i<_&&(_=i));if(b){o.splice(m--,1);var n=l();void 0!==n&&(e=n)}}return e}i=i||0;for(var m=o.length;m>0&&o[m-1][2]>i;m--)o[m]=o[m-1];o[m]=[a,l,i]},t.d=(o,e)=>{for(var a in e)t.o(e,a)&&!t.o(o,a)&&Object.defineProperty(o,a,{enumerable:!0,get:e[a]})},t.f={},t.e=o=>Promise.all(Object.keys(t.f).reduce(((e,a)=>(t.f[a](o,e),e)),[])),t.u=o=>"assets/js/"+{4:"blog_kafka_Kafka-集群原理设计（二）之源码设计示例分析.html",217:"tag_消息队列_index.html",304:"blog_minio_Minio-集群对象版本控制介绍.html",446:"blog_kafka_Kafka-集群状态监测、故障切换机制原理.html",468:"blog_minio_getting-started.html",712:"blog_minio_Minio-分布式锁实现机制.html",749:"blog_minio_Minio-集群数据分片如何确认完整性和一致性.html",809:"blog_minio_Minio-集群数据备份和数据复制的区别.html",900:"blog_minio_Minio-集群超大文件上传和异步复制如何确定分块大小.html",936:"blog_minio_Minio-单机和集群部署模式.html",958:"blog_zookeeper_zookeeper集群部署安装.html",1060:"blog_minio_Minio-灾难恢复操作与原理分析.html",1797:"tag_index.html",1799:"blog_kafka_Kafka-集群Topic之Partion分布原理设计（三）.html",1831:"blog_kafka_Kafka-集群Topic之Partion消息可靠性设计（一）.html",1916:"blog_minio_Minio-集群是如何处理客户端请求.html",2198:"blog_kafka_Kafka-集群原理设计(三)之启动原理介绍.html",2380:"blog_kafka_Kafka-必备基础知识.html",2402:"blog_zookeeper_zookeeper-znode数据结构.html",3428:"blog_minio_Minio-集群节点是如何实现通信和数据同步的.html",3546:"blog_zookeeper_getting-started.html",3583:"category_index.html",3603:"blog_kafka_Kafka-集群Topic之Partion副本同步性能设计（四）.html",3609:"blog_minio_Minio-集群节点并行处理超大文件数据分片上传和存储原理分析.html",3829:"blog_zookeeper_Zookeeper学习目标.html",3949:"blog_kafka_Kafka-的单机、集群部署安装.html",3989:"blog_zookeeper_Zookeeper集群节点选举原理实现(三).html",4027:"blog_minio_Minio-数据分片多节点存储Java实现.html",4083:"blog_minio_Minio-集群安全管控实现原理分析.html",4124:"blog_kafka_Kafka-组件架构师需要掌握哪些要点.html",4220:"blog_minio_Minio-集群启动过程执行了哪些逻辑.html",4266:"blog_zookeeper_Zookeeper集群数据视图一致性原理.html",4382:"blog_minio_Minio-架构师必备掌握知识点概览.html",4466:"blog_kafka_getting-started.html",4470:"index.html",4634:"blog_zookeeper_Zookeeper集群节点实现通信原理(一).html",4646:"blog_minio_Minio-集群复制队列超大文件（100G）如何存储复制.html",4742:"category_zookeeper_index.html",4853:"blog_minio_Minio-集群数据备份如何进行冷备.html",5057:"tag_分布式管理_index.html",5163:"blog_kafka_Kafka-集群Topic之Partion数据写入分布原理设计（六）.html",5319:"blog_kafka_Kafka-集群和Zookeeper集群架构设计对比分析.html",5334:"blog_kafka_Kafka-集群如何处理生产者和消费者处理消息速率差异问题.html",5335:"blog_zookeeper_Zookeeper集群节点故障剔除、切换、恢复原理.html",5464:"timeline_index.html",5500:"blog_kafka_Kafka-集群Topic、消息大小、节点格式上限管控原理.html",5628:"blog_kafka_Kafka-集群生产性能调优业务场景.html",5862:"blog_minio_Minio-集群数据写入确认消息机制分析.html",5952:"blog_minio_Minio-学习目标.html",6164:"tag_对象存储_index.html",6280:"blog_zookeeper_Zookeeper集群节点选举原理实现(二).html",6284:"blog_minio_Minio-跨中心集群为什么采用异步复制而非构建一个超大集群.html",6408:"blog_kafka_Kafka-学习目标.html",6430:"blog_zookeeper_Zookeeper集群节点实现通信原理(二).html",6604:"blog_kafka_Kafka-集群Topic之Partion日志分段存储原理设计（五）.html",6618:"blog_kafka_Kafka-集群为什么依赖zookeeper.html",6647:"blog_minio_Minio-基础知识和架构设计概览.html",6711:"blog_zookeeper_Zookeeper集群Session会话一致性实现原理.html",6767:"blog_kafka_Kafka-Topic之Zookeeper数据内容介绍.html",6924:"blog_zookeeper_Zookeeper集群节点选举原理实现(一).html",7218:"blog_minio_Minio-集群生产环境部署示例.html",7281:"blog_minio_Minio-集群冷备数据如何恢复部署.html",7294:"blog_kafka_Kafka-集群节点数量的设计.html",7348:"blog_minio_Minio-上传文件请求负载原理分析.html",7366:"blog_minio_Minio-多站点部署_地理容灾和恢复.html",7378:"blog_kafka_Kafka-集群节点数量与Partition副本数量关系原理.html",7406:"blog_minio_Minio-是如何拆分数据多节点存储的.html",7424:"geting-started.html",7490:"404.html",7511:"article_index.html",7517:"blog_kafka_Kafka-集群元数据之Zookeeper存储介绍.html",7551:"blog_minio_Minio-集群事务日志机制介绍.html",7579:"blog_minio_Minio-集群备份或异地复制如何进行网络带宽限速.html",7726:"blog_kafka_Kafka-集群原理设计（四）之Controller选举和Partition分配.html",7780:"blog_kafka_Kafka-管理节点Controller设计分析.html",7909:"blog_minio_Minio-超大文件优化原理分析.html",8117:"blog_kafka_Kafka-集群的数据顺序写入和零拷贝技术设计实现原理.html",8165:"blog_zookeeper_Zookeeper集群广播事务性能如何保证.html",8204:"blog_minio_Minio-集群部署为什么至少4个节点.html",8422:"blog_kafka_Kafka-集群Controller节点和Zookeeper集群leader节点有何区别联系.html",8656:"category_minio_index.html",8707:"blog_kafka_Kafka-集群安全认证机制的实现.html",8727:"blog_zookeeper_Zookeeper集群的应用场景.html",8895:"blog_zookeeper_Zookeeper集群如何实现数据一致性和顺序性原理.html",8926:"blog_minio_Minio-集群备份全部数据非特定bucket.html",8979:"blog_kafka_Kafka-集群Topic之Partion消息可靠性设计（二）.html",9187:"blog_kafka_Kafka-集群架构设计原理概述.html",9216:"blog_kafka_Kafka-集群原理设计和实现概述(一).html",9299:"blog_kafka_Kafka-Stream流处理设计概述.html",9403:"blog_minio_Minio-集群是如何实现异步复制.html",9536:"blog_zookeeper_Zookeeper客户端命令行基础操作.html",9630:"category_kafka_index.html",9739:"blog_minio_Minio-无中心节点集群与有中心节点集群优缺点.html"}[o]+"."+{4:"fb280bf2",217:"70b5fea0",304:"f8c33fa4",446:"8633583d",468:"1fed05a4",712:"a20b59c7",749:"d0b39f8b",809:"d0421cb3",900:"6de757df",936:"4663b89c",958:"1543e3f8",1060:"66eae94c",1797:"937bf476",1799:"763b6ca6",1831:"914e8411",1916:"fb420448",2198:"aa5d3dbc",2380:"faa11bfd",2402:"91ac7695",3428:"a4d94d06",3546:"ed907369",3583:"99c05b96",3603:"fb32a0c6",3609:"580b0c95",3829:"0fe338e6",3949:"d8d2944c",3989:"eb6c1c79",4027:"f08194b4",4083:"ab01383c",4124:"02846623",4220:"c1e9b319",4266:"f60f119d",4382:"4b0f2c29",4466:"669e13ca",4470:"fb12c32a",4634:"fefbbd37",4646:"d350a0cc",4742:"ea8d8ff0",4853:"8bd9a610",5057:"e14ac87f",5163:"cee6520b",5319:"dc5ed8e0",5334:"dcb7958c",5335:"82b5c262",5464:"411f6642",5500:"0bc2ef37",5628:"6e5bcb30",5862:"d376c2eb",5952:"7da89c03",6164:"e6d6d752",6280:"314dfa8c",6284:"c50e8ba6",6408:"80f7dada",6430:"62254f8d",6604:"b862a21e",6618:"088603dc",6647:"1d54431d",6711:"56f7976f",6767:"0873b624",6924:"402bc6bf",7218:"507a3c9e",7281:"c3d70300",7294:"572c5a8b",7348:"df3570bb",7366:"756663e0",7378:"52963bac",7406:"96b07ba3",7424:"27489d85",7490:"06ca67e5",7511:"e22623f9",7517:"4c0f1bb9",7551:"2b24b295",7579:"ec1fdbf1",7726:"72435c1b",7780:"fbd1dfd3",7909:"b17bad76",8117:"3ae502be",8165:"176cd9b6",8204:"d866db61",8422:"833db838",8656:"909c2d43",8707:"c6400609",8727:"72f5013a",8895:"b8802bd4",8926:"a3efc6a2",8979:"210b729f",9187:"3057e1fa",9216:"8e18d456",9299:"da6680b7",9403:"ca5b5fe7",9536:"0571dd86",9630:"d21e5901",9739:"7533cc62"}[o]+".js",t.miniCssF=o=>{},t.o=(o,e)=>Object.prototype.hasOwnProperty.call(o,e),e={},a="arch-guide:",t.l=(o,l,i,_)=>{if(e[o])e[o].push(l);else{var b,r;if(void 0!==i)for(var n=document.getElementsByTagName("script"),m=0;m<n.length;m++){var k=n[m];if(k.getAttribute("src")==o||k.getAttribute("data-webpack")==a+i){b=k;break}}b||(r=!0,(b=document.createElement("script")).charset="utf-8",b.timeout=120,t.nc&&b.setAttribute("nonce",t.nc),b.setAttribute("data-webpack",a+i),b.src=o),e[o]=[l];var f=(a,l)=>{b.onerror=b.onload=null,clearTimeout(g);var i=e[o];if(delete e[o],b.parentNode&&b.parentNode.removeChild(b),i&&i.forEach((o=>o(l))),a)return a(l)},g=setTimeout(f.bind(null,void 0,{type:"timeout",target:b}),12e4);b.onerror=f.bind(null,b.onerror),b.onload=f.bind(null,b.onload),r&&document.head.appendChild(b)}},t.r=o=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(o,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(o,"__esModule",{value:!0})},t.p="/tech-blog/",(()=>{var o={2750:0,7528:0};t.f.j=(e,a)=>{var l=t.o(o,e)?o[e]:void 0;if(0!==l)if(l)a.push(l[2]);else if(/^(2750|7528)$/.test(e))o[e]=0;else{var i=new Promise(((a,i)=>l=o[e]=[a,i]));a.push(l[2]=i);var _=t.p+t.u(e),b=new Error;t.l(_,(a=>{if(t.o(o,e)&&(0!==(l=o[e])&&(o[e]=void 0),l)){var i=a&&("load"===a.type?"missing":a.type),_=a&&a.target&&a.target.src;b.message="Loading chunk "+e+" failed.\n("+i+": "+_+")",b.name="ChunkLoadError",b.type=i,b.request=_,l[1](b)}}),"chunk-"+e,e)}},t.O.j=e=>0===o[e];var e=(e,a)=>{var l,i,[_,b,r]=a,n=0;if(_.some((e=>0!==o[e]))){for(l in b)t.o(b,l)&&(t.m[l]=b[l]);if(r)var m=r(t)}for(e&&e(a);n<_.length;n++)i=_[n],t.o(o,i)&&o[i]&&o[i][0](),o[i]=0;return t.O(m)},a=self.webpackChunkarch_guide=self.webpackChunkarch_guide||[];a.forEach(e.bind(null,0)),a.push=e.bind(null,a.push.bind(a))})()})();