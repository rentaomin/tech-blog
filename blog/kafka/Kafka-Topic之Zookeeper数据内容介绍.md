---
date: 2021-07-07
category:
  - Kafka
tag:
  - 消息队列
sticky: true
excerpt: <p>Kafka 集群原理设计分析</p>
---
#  Kafka Topic 之 Zookeeper 数据内容介绍
```shell
[zk: 192.168.0.200:2181(CONNECTED) 13] get /brokers/topics/test_cluster

{"partitions":{"0":[0,2,3],"1":[2,3,0],"2":[3,0,2]},"topic_id":"aSFJVxF7SIaTCptmWn_GgA","adding_replicas":{},"removing_replicas":{},"version":3}；
```
从提供的 ZooKeeper 输出中可以看出 Kafka Topic `test_cluster` 的分区和副本分布情况。以下是对输出内容
的详细解释：

### 1. ZooKeeper 中的 Topic 配置信息

ZooKeeper 中存储了 Kafka 的元数据信息，包括 Topic 的分区、分区的副本分布等。通过 
`get /brokers/topics/test_cluster` 命令获取的结果展示了 Topic `test_cluster` 的配置信息。

### 2. JSON 结构解析

```json
{
  "partitions": {
    "0": [0, 2, 3],
    "1": [2, 3, 0],
    "2": [3, 0, 2]
  },
  "topic_id": "aSFJVxF7SIaTCptmWn_GgA",
  "adding_replicas": {},
  "removing_replicas": {},
  "version": 3
}
```

#### 各字段含义：

- **partitions**：分区和副本的分布信息。
  - **"0": [0, 2, 3]**：表示分区 0 的副本分布在 Broker 0、Broker 2 和 Broker 3 上。
  - **"1": [2, 3, 0]**：表示分区 1 的副本分布在 Broker 2、Broker 3 和 Broker 0 上。
  - **"2": [3, 0, 2]**：表示分区 2 的副本分布在 Broker 3、Broker 0 和 Broker 2 上。
- **topic_id**：`test_cluster` 这个 Topic 的唯一标识符。
- **adding_replicas**：正在添加的副本信息（当前为空）。
- **removing_replicas**：正在移除的副本信息（当前为空）。
- **version**：Topic 配置的版本号，用于兼容性管理。

### 3. 分区和副本分布详情

根据输出的分布信息，可以看出 `test_cluster` 这个 Topic 有 3 个分区（0、1、2），每个分区有 3 个
副本。具体分布如下：

- **分区 0**：
  - **副本列表**：Broker 0、Broker 2、Broker 3
  - **Leader 角色**：假设 Broker 0 是 Leader，则 Broker 2 和 Broker 3 是 Follower。
  
- **分区 1**：
  - **副本列表**：Broker 2、Broker 3、Broker 0
  - **Leader 角色**：假设 Broker 2 是 Leader，则 Broker 3 和 Broker 0 是 Follower。
  
- **分区 2**：
  - **副本列表**：Broker 3、Broker 0、Broker 2
  - **Leader 角色**：假设 Broker 3 是 Leader，则 Broker 0 和 Broker 2 是 Follower。

### 4. Kafka 副本分布策略

Kafka 采用一种叫做“交错副本分配”（interleaved replica assignment）的策略来分配分区和副本。这种
策略确保分区和副本均匀分布在不同的 Broker 上，以实现负载均衡和高可用性。

#### 分布策略示例

假设有 3 个 Broker（0, 2, 3），3 个分区，3 个副本，分配策略如下：

- 分区 0：副本分布在 Broker 0、Broker 2、Broker 3
- 分区 1：副本分布在 Broker 2、Broker 3、Broker 0
- 分区 2：副本分布在 Broker 3、Broker 0、Broker 2

### 5. 数据同步机制

#### Leader 和 Follower

- **Leader 副本**：负责处理所有的读写请求。
- **Follower 副本**：从 Leader 复制数据，保持与 Leader 数据一致。

#### ISR（In-Sync Replica）

- ISR 列表包含所有与 Leader 保持同步的副本。当消息被写入到所有 ISR 副本后，Leader 会确认消息提交。
- 如果某个 Follower 长时间未能同步数据，Kafka 会将其从 ISR 列表中移除。

### 6. 副本同步过程

1. **生产者发送消息到 Leader**：生产者根据分区策略将消息发送到分区的 Leader。
2. **Leader 写入日志**：Leader 将消息写入本地日志，并开始同步到 Follower。
3. **Follower 复制消息**：Follower 从 Leader 拉取消息，并写入本地日志。
4. **确认消息提交**：当消息被写入到所有 ISR 副本后，Leader 确认消息提交。

### 核心代码示例

以下是 Kafka 中处理副本同步的核心代码示例：

```java
// ReplicaFetcherThread.scala
class ReplicaFetcherThread(replicaId: Int, leaderId: Int, partition: TopicPartition) extends AbstractFetcherThread(replicaId, leaderId) {
    override def fetch(fetchRequest: FetchRequest.Builder): Map[TopicPartition, FetchDataInfo] = {
        val fetchResponse = leaderBroker.fetch(fetchRequest)
        fetchResponse.data.asScala.map { case (tp, data) =>
            partition.log.append(data)
            tp -> FetchDataInfo(partition.log.read(data.baseOffset, data.records.sizeInBytes))
        }.toMap
    }
}
```

### 7. 高可用性和容错机制

Kafka 通过副本机制和 ISR 列表实现高可用性和容错：

- **副本机制**：每个分区有多个副本，分布在不同的 Broker 上。如果某个 Broker 故障，其他 Broker 上的副本
可以继续提供服务。
- **ISR 列表**：确保数据的一致性和高可用性。只有当所有 ISR 副本都成功写入消息后，Leader 才确认消息提交。

### 8. 小结

通过以上分析，可以看出 Kafka 通过分区和副本机制实现了高可用性和高性能。分区和副本的均匀分布确保了负载均衡，
而 ISR 列表确保了数据一致性和容错能力。这些设计使得 Kafka 成为一个高效、可靠的分布式消息系统。