import comp from "D:/a/tech-blog/tech-blog/docs/.vuepress/.temp/pages/blog/zookeeper/Zookeeper集群节点选举原理实现(三).html.vue"
const data = JSON.parse("{\"path\":\"/blog/zookeeper/Zookeeper%E9%9B%86%E7%BE%A4%E8%8A%82%E7%82%B9%E9%80%89%E4%B8%BE%E5%8E%9F%E7%90%86%E5%AE%9E%E7%8E%B0(%E4%B8%89).html\",\"title\":\"Zookeeper 集群节点选举原理实现(三)\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2021-07-07T00:00:00.000Z\",\"category\":[\"Zookeeper\"],\"tag\":[\"分布式管理\"],\"sticky\":true,\"excerpt\":\"<p> Zookeeper 客户端命令操作 </p>\"},\"headers\":[{\"level\":3,\"title\":\"初始化 ZXID 的过程\",\"slug\":\"初始化-zxid-的过程\",\"link\":\"#初始化-zxid-的过程\",\"children\":[]},{\"level\":3,\"title\":\"领导节点选举过程中的 ZXID 确保有序\",\"slug\":\"领导节点选举过程中的-zxid-确保有序\",\"link\":\"#领导节点选举过程中的-zxid-确保有序\",\"children\":[]},{\"level\":3,\"title\":\"实现逻辑示例\",\"slug\":\"实现逻辑示例\",\"link\":\"#实现逻辑示例\",\"children\":[]},{\"level\":3,\"title\":\"选举过程中的同步\",\"slug\":\"选举过程中的同步\",\"link\":\"#选举过程中的同步\",\"children\":[]},{\"level\":3,\"title\":\"总结\",\"slug\":\"总结\",\"link\":\"#总结\",\"children\":[]},{\"level\":2,\"title\":\"快照文件和日志文件的zxid是一样的吗，为什么要都读取获取zxid，以哪个为准？\",\"slug\":\"快照文件和日志文件的zxid是一样的吗-为什么要都读取获取zxid-以哪个为准\",\"link\":\"#快照文件和日志文件的zxid是一样的吗-为什么要都读取获取zxid-以哪个为准\",\"children\":[{\"level\":3,\"title\":\"快照文件和日志文件\",\"slug\":\"快照文件和日志文件\",\"link\":\"#快照文件和日志文件\",\"children\":[]},{\"level\":3,\"title\":\"为什么要读取快照文件和日志文件\",\"slug\":\"为什么要读取快照文件和日志文件\",\"link\":\"#为什么要读取快照文件和日志文件\",\"children\":[]},{\"level\":3,\"title\":\"以哪个 ZXID 为准\",\"slug\":\"以哪个-zxid-为准\",\"link\":\"#以哪个-zxid-为准\",\"children\":[]},{\"level\":3,\"title\":\"实现逻辑\",\"slug\":\"实现逻辑\",\"link\":\"#实现逻辑\",\"children\":[]},{\"level\":3,\"title\":\"步骤解释\",\"slug\":\"步骤解释\",\"link\":\"#步骤解释\",\"children\":[]},{\"level\":3,\"title\":\"领导节点选举过程中的 ZXID\",\"slug\":\"领导节点选举过程中的-zxid\",\"link\":\"#领导节点选举过程中的-zxid\",\"children\":[]},{\"level\":3,\"title\":\"总结\",\"slug\":\"总结-1\",\"link\":\"#总结-1\",\"children\":[]},{\"level\":3,\"title\":\"快照文件和日志文件的区别，联系？\",\"slug\":\"快照文件和日志文件的区别-联系\",\"link\":\"#快照文件和日志文件的区别-联系\",\"children\":[]},{\"level\":3,\"title\":\"快照文件和日志文件的区别与联系\",\"slug\":\"快照文件和日志文件的区别与联系\",\"link\":\"#快照文件和日志文件的区别与联系\",\"children\":[]},{\"level\":3,\"title\":\"联系\",\"slug\":\"联系\",\"link\":\"#联系\",\"children\":[]},{\"level\":3,\"title\":\"例子：恢复过程\",\"slug\":\"例子-恢复过程\",\"link\":\"#例子-恢复过程\",\"children\":[]},{\"level\":3,\"title\":\"示例代码\",\"slug\":\"示例代码\",\"link\":\"#示例代码\",\"children\":[]},{\"level\":3,\"title\":\"总结\",\"slug\":\"总结-2\",\"link\":\"#总结-2\",\"children\":[]}]}],\"git\":{\"updatedTime\":1720877624000,\"contributors\":[{\"name\":\"asus\",\"email\":\"939943844@qq.com\",\"commits\":1}]},\"filePathRelative\":\"blog/zookeeper/Zookeeper集群节点选举原理实现(三).md\"}")
export { comp, data }
