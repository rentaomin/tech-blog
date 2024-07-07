---
date: 2021-07-07
category:
  - Kafka
tag:
  - 消息队列
sticky: true
excerpt: <p>Kafka 集群原理设计分析</p>
---
# kafka 集群 Topic 之 Partion 消息可靠性设计（二）
```
kafka topic 的多个partition 存储的数据区别与关系，kafka集群，是在单个节点通过多个副本来保证
同一消息高可用，还是跨节点保证同一个消息的高可用?
```

在 Kafka 中，Topic 是逻辑上的数据类别，而 Partition 是物理上的分区，每个 Partition 是一个有序的、
不可变的消息队列。以下是关于 Kafka Topic 的多个 Partition 之间的数据区别与关系，以及 Kafka 集群中
如何保证消息的高可用性的详细解析。

### 1. Kafka Topic 和 Partition 的关系

#### 数据区别：

- **Partition 内部数据有序**：每个 Partition 内部的数据是有序的，消息按照追加的顺序存储。

- **Partition 之间数据无序**：不同 Partition 之间的数据没有顺序关系。即使同一个 Topic 的消息在不
同 Partition 中，消息的顺序也无法保证。

- **独立存储**：每个 Partition 独立存储消息，有自己的日志文件和索引文件。

#### 数据关系：

- **逻辑上的一个整体**：虽然每个 Partition 独立存储数据，但它们共同组成一个 Topic。Topic 中的所有
 Partition 共同存储该 Topic 的所有消息。

- **并行处理**：多个 Partition 允许并行处理，从而提高吞吐量。生产者和消费者可以并行地向不同的 Partition 
写入和读取数据。

### 2. Kafka 集群的高可用性设计

Kafka 通过副本机制和跨节点分布来实现消息的高可用性。

#### 副本机制：

- **Leader 和 Follower**：每个 Partition 有一个 Leader 和多个 Follower。Leader 负责处理所有的读写
   请求，Follower 从 Leader 复制数据。

- **ISR 列表**：In-Sync Replica（ISR）列表包含所有与 Leader 保持同步的副本。如果一个 Follower 不能及
   时同步数据，它将被从 ISR 列表中移除。

#### 跨节点分布：

- **跨节点副本**：Kafka 的副本机制确保同一 Partition 的副本分布在不同的节点上，以实现高可用性和容错性。
- **故障切换**：如果 Leader 节点故障，Kafka 会从 ISR 列表中选举一个新的 Leader，从而实现故障切换和高可用性。

### 3. 原理解析

#### Partition 内部结构

每个 Partition 是一个有序的消息队列，包含以下主要部分：

- **日志文件**：存储实际的消息数据。
- **索引文件**：记录消息在日志文件中的偏移量，便于快速查找。

#### 副本分布和高可用性

1. **副本分布**：

   Kafka 在创建 Topic 时，会根据配置的副本因子（replication factor）在不同的节点上创建副本。每个 
   Partition 的副本分布在不同的 Broker 上。

   ```sh
   # 创建一个名为 "my_topic" 的 Topic，具有 3 个分区和 3 个副本
   bin/kafka-topics.sh --create --topic my_topic --bootstrap-server localhost:9092 --partitions 3 
   --replication-factor 3
   ```

2. **Leader 选举**：

   Kafka 使用 ZooKeeper 进行 Leader 选举。Leader 负责处理读写请求，Follower 从 Leader 复制数据。

   ```java
   class PartitionStateMachine(controller: KafkaController) {
       def handleStateChanges(partitions: Set[TopicPartition], targetState: PartitionState, 
       assignments: Map[TopicPartition, Seq[Int]]) {
           partitions.foreach { partition =>
               val currentState = controllerContext.partitionLeadershipInfo(partition)
               targetState match {
                   case OnlinePartition =>
                       // 将分区设置为在线状态
                       makeLeader(partition, assignments(partition))
                   case OfflinePartition =>
                       // 将分区设置为离线状态
                       makeFollower(partition)
               }
           }
       }
       
       private def makeLeader(partition: TopicPartition, assignedReplicas: Seq[Int]) {
           // 选举 Leader 并更新 ISR 列表
           val leader = assignedReplicas.head
           val isr = assignedReplicas
           controllerContext.putPartitionLeadershipInfo(partition, LeaderAndIsr(leader, isr))
           zkClient.updateLeaderAndIsr(partition, LeaderAndIsr(leader, isr))
       }
       
       private def makeFollower(partition: TopicPartition) {
           // 将分区设置为 Follower 状态
           controllerContext.removePartitionLeadershipInfo(partition)
           zkClient.deleteLeaderAndIsr(partition)
       }
   }
   ```

3. **高可用性和故障恢复**：

   - 当一个 Broker 故障时，Kafka Controller 会从 ISR 列表中选举新的 Leader，并更新 ZooKeeper 中的元数据。
   - 新的 Leader 接管读写请求，确保服务不中断。

   ```java
   class KafkaController(zooKeeperClient: KafkaZkClient, config: KafkaConfig) {
       def onPartitionModifications() {
           val partitions = zkClient.getAllPartitions()
           partitions.foreach { partition =>
               val leaderIsrAndControllerEpoch = zkClient.getLeaderAndIsrForPartition(partition)
               if (leaderIsrAndControllerEpoch.isEmpty) {
                   // 如果没有 Leader，选举新的 Leader
                   partitionStateMachine.handleStateChanges(
                       Set(partition), OnlinePartition, Map.empty
                   )
               }
           }
       }
   }
   ```

#### 数据同步和消息保证

- **数据同步**：Follower 副本从 Leader 复制数据，确保所有副本的数据一致性。
- **消息有序**：在同一个 Partition 内，消息按照追加的顺序存储和消费，保证分区内消息的有序性。
- **消息不丢失**：通过副本机制和持久化存储，确保消息即使在 Broker 故障时也不会丢失。
- **重复消费**：消费者可以控制偏移量，实现消息的重复消费。

### 总结

- **Partition 是 Kafka 提高并行处理能力和吞吐量的关键设计**。每个 Partition 是一个独立的消息队列，
分区内的数据是有序的，但不同分区之间的数据无序。

- **Kafka 通过副本机制和跨节点分布来保证消息的高可用性**。同一 Partition 的副本分布在不同的节点上，
确保即使一个节点故障，消息也不会丢失。

- **ZooKeeper 在 Kafka 集群管理中起到关键作用**，包括 Leader 选举、分区状态管理和故障切换。

通过这些设计，Kafka 实现了高性能、高可用性和可靠性的分布式消息系统。