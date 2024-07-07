---
date: 2021-07-07
category:
  - Kafka
tag:
  - 消息队列
sticky: true
excerpt: <p>Kafka 集群原理设计分析</p>
---
# Kafka 集群节点数量的设计

```
上述副本数量设置为3，如果一个节点故障，会从剩余两个节点选择一个为leader,假如剩余的leader故
障，还有一个节点是否可以正常对外提供服务，如果剩余的folower节点故障，难道不是还有一个节点可
以正常提供服务吗?
```

在 Kafka 集群中，副本数量为 3 的配置下，的确可以容忍最多一个节点故障，而仍然保持数据的高可
用性和一致性。以下是详细解释如果在副本数量为 3 的情况下出现不同故障情景时，Kafka 如何处理及
其工作机制。

### 1. 副本数量为 3 的情况下的故障处理

假设我们有 3 个节点（A、B、C），每个节点上都有一个副本。以下是不同情况下的故障处理：

#### 正常运行状态

- **Partition 0**：
  - **Leader**：节点 A
  - **Follower**：节点 B、节点 C

#### 场景 1：一个节点（非 Leader）故障

假设节点 C 故障：

- **Partition 0**：
  - **Leader**：节点 A
  - **Follower**：节点 B（节点 C 故障）

在这种情况下，Kafka 仍然可以正常工作，因为 Leader 仍然在运行，剩余的 Follower（节点 B）可以继续复
制数据，ISR 列表变为 [A, B]。

#### 场景 2：一个节点（Leader）故障

假设节点 A 故障：

- **Partition 0**：
  - **Leader**：节点 A（故障）
  - **Follower**：节点 B、节点 C

Kafka 会从剩下的 Follower 中选举一个新的 Leader。假设节点 B 被选举为新的 Leader：

- **Partition 0**：
  - **Leader**：节点 B
  - **Follower**：节点 C（节点 A 故障）

在这种情况下，Kafka 仍然可以正常工作，因为新选举的 Leader（节点 B）可以继续处理请求，剩余的 Follower
（节点 C）继续复制数据，ISR 列表变为 [B, C]。

### 2. 副本数量为 3 的情况下的极端故障处理

#### 场景 3：两个节点故障

假设节点 A 和 B 故障：

- **Partition 0**：
  - **Leader**：节点 A（故障）
  - **Follower**：节点 B（故障）、节点 C

在这种情况下，只有一个节点（节点 C）是可用的，并且 Kafka 将无法选举出新的 Leader，因为选举需要大
多数（majority）副本在线。而 3 个副本中的 1 个在线不构成多数。因此，Partition 0 将无法提供服务，直
到至少一个故障节点恢复。

### 3. Kafka 高可用性机制及 ISR 列表

#### ISR 列表管理

ISR（In-Sync Replica）列表包含所有与 Leader 保持同步的副本。Kafka 通过 ISR 列表管理数据一致性
和高可用性：

- **正常状态**：所有副本都在 ISR 列表中。
- **节点故障**：故障节点从 ISR 列表中移除，Kafka 从剩余的 ISR 副本中选举新的 Leader。

#### 核心代码示例

以下是 Kafka 选举新的 Leader 的核心代码示例：

```java
// Partition.scala
class Partition(val topicPartition: TopicPartition, val leader: Int, val replicas: List[Int]) {
    val isr = new AtomicReference[List[Int]](replicas)

    def handleLeaderAndIsrRequest(controllerId: Int, leaderAndIsr: LeaderAndIsr): Unit = {
        this.leader = leaderAndIsr.leader
        this.isr.set(leaderAndIsr.isr)
    }

    def maybeShrinkIsr(replicaId: Int): Unit = {
        val currentIsr = isr.get()
        if (currentIsr.contains(replicaId)) {
            isr.set(currentIsr.filterNot(_ == replicaId))
        }
    }

    def maybeExpandIsr(replicaId: Int): Unit = {
        val currentIsr = isr.get()
        if (!currentIsr.contains(replicaId)) {
            isr.set(replicaId :: currentIsr)
        }
    }
}
```

### 4. 总结

- **单节点故障**：在副本数量为 3 的情况下，可以容忍一个节点故障，Kafka 能从剩余的 Follower 中选举出
新的 Leader 继续提供服务。
- **双节点故障**：如果两个节点同时故障，Kafka 无法保证服务的可用性，因为无法选举出新的 Leader。
- **高可用性和一致性**：通过 ISR 列表和 Leader 选举机制，Kafka 能在大多数副本可用时保证数据
一致性和高可用性。

### 5. 合理设置副本数量和分区数量的建议

1. **副本数量**：一般建议设置为 3，以在保证高可用性的同时提供容错能力。
2. **分区数量**：根据业务需求和并行处理能力设置，确保能够均衡分布在所有 Broker 上。
3. **监控和运维**：定期检查集群状态，确保各个节点和副本的健康状态。

通过合理设置副本数量和分区数量，可以优化 Kafka 集群的性能和可靠性，确保其在高并发和高负载的情况
下稳定运行。

### 如果双节点故障，剩余一个节点，为什么不设计为这个节点为默认leader节点?

设计Kafka时，考虑到数据一致性、数据可用性和故障恢复等问题，双节点故障时不将剩余一个节点自动设为
Leader的原因如下：

### 1. 数据一致性保障

Kafka需要确保在任何时间点的数据都是一致的。如果只剩一个节点，而该节点自动成为Leader，则可能会导致
数据不一致。

- **多数原则（Quorum）**：Kafka使用多数原则来确保数据的一致性。为了选举出新的Leader，必须有多
数（即超过一半）的副本在线。例如，3个副本中需要至少2个在线才能进行选举。这确保了不会出现“脑裂”情况，
即两个节点分别认为自己是Leader。
- **分区日志一致性**：如果剩余的节点自动成为Leader，而之前的数据同步未完成，可能会导致数据丢失或
数据不一致。

### 2. 数据持久性和可靠性

自动将剩余的一个节点设为Leader可能会影响数据的可靠性和持久性。

- **数据丢失风险**：在双节点故障时，只有一个节点在线，意味着只有一个副本的数据。如果这个节点在短时间
内再次发生故障，所有数据将丢失。
- **无法保证数据完整性**：只有一个副本在线时，Kafka无法确认该副本包含所有已提交的数据，因为其他副
本可能未能同步最新的数据。

### 3. 故障恢复和高可用性

确保系统在故障发生后的恢复能力和高可用性。

- **恢复策略**：通过多数原则，Kafka可以确保在故障恢复后，仍然可以保持数据的一致性和完整性。一旦双节
点故障的情况恢复，剩余的节点可以继续同步数据，确保数据的一致性。
- **高可用性**：多数原则有助于防止在部分网络分区或节点故障的情况下出现多个Leader，保证系统的高可用性
和一致性。

### 4. 集群分裂和“脑裂”问题

自动将剩余的一个节点设为Leader可能会导致集群分裂和“脑裂”问题。

- **“脑裂”风险**：在分布式系统中，“脑裂”指的是集群分裂成多个部分，各部分都认为自己是唯一的Leader。通
过多数原则，Kafka避免了这种情况，因为只有大多数副本在线时才能选举出新的Leader。
- **一致性保证**：通过确保至少大多数副本在线，Kafka可以防止在网络分区或故障情况下出现不一致的数据状态。

### 解决双节点故障的策略

1. **快速故障恢复**：在双节点故障时，尽快恢复故障节点，确保至少有大多数副本在线，从而使Kafka能够正
常选举新的Leader并恢复服务。
2. **监控和报警**：设置监控和报警系统，及时发现和处理节点故障，确保集群的高可用性。
3. **增加副本数量**：在需要更高可用性和容错能力的场景中，可以增加副本数量。例如，将副本数量设置为5，
以容忍最多2个节点故障。

### 核心代码示例：多数原则的实现

以下是Kafka选举新Leader的多数原则实现的核心代码示例：

```java
// Partition.scala
class Partition(val topicPartition: TopicPartition, val leader: Int, val replicas: List[Int]) {
    val isr = new AtomicReference[List[Int]](replicas)

    def handleLeaderAndIsrRequest(controllerId: Int, leaderAndIsr: LeaderAndIsr): Unit = {
        this.leader = leaderAndIsr.leader
        this.isr.set(leaderAndIsr.isr)
    }

    def maybeShrinkIsr(replicaId: Int): Unit = {
        val currentIsr = isr.get()
        if (currentIsr.contains(replicaId)) {
            isr.set(currentIsr.filterNot(_ == replicaId))
        }
    }

    def maybeExpandIsr(replicaId: Int): Unit = {
        val currentIsr = isr.get()
        if (!currentIsr.contains(replicaId)) {
            isr.set(replicaId :: currentIsr)
        }
    }
}
```

### 总结

- **数据一致性和可靠性**：通过多数原则，Kafka可以确保数据的一致性和可靠性，避免数据丢失和不一致的风险。
- **高可用性和恢复能力**：多数原则有助于Kafka在故障恢复后保持高可用性和一致性。
- **防止“脑裂”**：多数原则防止了在部分节点故障或网络分区时出现集群分裂和“脑裂”问题。

因此，在双节点故障的情况下，不将剩余的一个节点自动设为Leader是为了确保Kafka集群的数据一致性、可靠性
和高可用性。
