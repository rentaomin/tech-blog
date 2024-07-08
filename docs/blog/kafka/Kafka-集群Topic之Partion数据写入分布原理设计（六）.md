---
date: 2021-07-07
category:
  - Kafka
tag:
  - 消息队列
sticky: true
excerpt: <p>Kafka 集群原理设计分析</p>
---
# kafka 集群 Topic 之 Partion 数据写入分布原理设计（六）

```
集群中假如有三个节点，分别ip为200，201，202 创建topic 为test,默认分区2，副本2，在写入消息
到topic时，数据就转的过程是什么，则 partition存储数据分布是如何分布的，各个节点数据如何同步
的，isr如何实现的?
```

在 Kafka 集群中，Topic 的创建和消息写入涉及多个步骤，包括分区和副本的分布、消息的写入、数据
同步以及 ISR 列表的管理。下面详细介绍这些过程。

### 1. 创建 Topic 和分区副本分布

#### 创建 Topic

假设在 Kafka 集群中创建一个名为 `test` 的 Topic，具有 2 个分区和 2 个副本。执行以下命令：

```sh
bin/kafka-topics.sh --create --topic test --bootstrap-server 192.168.0.200:9092 --partitions 2 --replication-factor 2
```

#### 分区和副本的分布

Kafka 会将 Topic `test` 的 2 个分区和 2 个副本分布到 3 个节点上。例如，Kafka 可能会这样分配：

- **Partition 0**：
  - **Leader**：节点 192.168.0.200
  - **Follower**：节点 192.168.0.201
- **Partition 1**：
  - **Leader**：节点 192.168.0.201
  - **Follower**：节点 192.168.0.202

### 2. 消息写入过程

当生产者向 Topic `test` 写入消息时，消息会先写入每个分区的 Leader，然后由 Leader 同步到 Follower。

#### 消息写入示例

假设生产者写入以下消息到 `test`：

```java
ProducerRecord<String, String> record = new ProducerRecord<>("test", "key", "value");
producer.send(record);
```

#### 消息转发过程

1. **生产者发送消息**：生产者根据分区策略（如基于 key 的 hash 分区）选择分区，将消息发送到该分区的 
Leader。
2. **Leader 处理写请求**：分区的 Leader 接收到消息后，将消息写入其本地日志。
3. **Follower 同步数据**：Leader 将消息写入日志后，Follower 从 Leader 拉取消息并写入其本地日志。

### 3. 数据同步和 ISR 列表管理

#### 数据同步

Follower 从 Leader 同步数据的过程是异步进行的，以确保数据的一致性和高可用性。

#### ISR 列表

ISR（In-Sync Replica）列表包含所有与 Leader 保持同步的副本。当所有 ISR 副本都成功写入消息后，
Leader 会确认消息提交。

#### ISR 管理示例

- **初始 ISR**：在 Partition 创建时，ISR 列表包含 Leader 和所有 Follower 副本。
- **更新 ISR**：如果 Follower 无法及时同步数据，Leader 会将其从 ISR 列表中移除；当 Follower 
恢复同步后，再次添加到 ISR 列表中。

### 4. 核心代码示例

#### 生产者发送消息

```java
// Producer.java
Properties props = new Properties();
props.put("bootstrap.servers", "192.168.0.200:9092");
props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

KafkaProducer<String, String> producer = new KafkaProducer<>(props);

ProducerRecord<String, String> record = new ProducerRecord<>("test", "key", "value");
producer.send(record);
```

#### 消息写入和同步

```java
// Log.java
class Log(val dir: File, val config: LogConfig) {
    val segments = new LogSegments(dir)

    def append(records: MemoryRecords): Unit = {
        val segment = maybeRoll()
        segment.append(records)
        // 同步到 Follower
        syncToFollowers(records)
    }

    private def syncToFollowers(records: MemoryRecords): Unit = {
        // 同步数据到 Follower 副本
    }
}

// ReplicaFetcherThread.java
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

### 5. 数据分布和同步示意

#### 数据分布

假设 Partition 0 的 Leader 在节点 192.168.0.200，Follower 在节点 192.168.0.201。当生产者发送消息到 Partition 0 时：

1. **生产者发送消息到 Leader**：消息写入节点 192.168.0.200。
2. **Leader 写入日志**：节点 192.168.0.200 将消息写入本地日志。
3. **Follower 同步数据**：节点 192.168.0.201 从 Leader 拉取消息，并写入本地日志。

#### 数据同步和 ISR

1. **初始状态**：ISR 包含节点 192.168.0.200 和 192.168.0.201。
2. **同步过程**：Follower 节点 192.168.0.201 从 Leader 节点 192.168.0.200 同步数据。
3. **确认同步**：Follower 节点 192.168.0.201 成功写入数据后，向 Leader 确认。Leader 将消息标记
为已提交。

### 6. 总结

- **分区和副本分布**：Topic 的分区和副本分布在不同的节点上，以确保高可用性和容错性。
- **消息写入过程**：生产者将消息写入分区的 Leader，Leader 再同步数据到 Follower。
- **数据同步和 ISR**：Follower 从 Leader 异步同步数据，ISR 列表管理同步状态，确保数据一致性。
- **高效的日志管理**：Kafka 通过日志分段管理和异步复制机制，确保高性能和高可用性。

这些机制共同确保了 Kafka 集群在高并发和高负载下的高效运行，同时保证了数据的一致性和可靠性。