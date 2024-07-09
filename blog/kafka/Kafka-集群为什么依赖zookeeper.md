---
date: 2021-07-07
category:
  - Kafka
tag:
  - 消息队列
sticky: true
excerpt: <p>Kafka 集群原理设计分析</p>
---
# kafka 集群为什么依赖 zookeeper ？

在 Kafka 集群中，ZooKeeper 扮演了关键的角色，负责协调和管理 Kafka 的分布式系统。具体来说，ZooKeeper 在 Kafka 集群中主要起到以下几个作用：

### 1. **管理集群元数据**

ZooKeeper 存储和管理 Kafka 集群的元数据信息，包括 Broker 信息、Topic 信息、Partition 信息和 Replica 信息。这些元数据对于 Kafka 的正常运行至关重要。

#### 具体内容：

- **Broker 注册**：每个 Kafka Broker 在启动时会向 ZooKeeper 注册其自身的信息，如 `broker.id` 和网络地址。ZooKeeper 通过这些信息知道当前集群中有哪些 Broker。

- **Topic 和 Partition 信息**：ZooKeeper 保存所有 Topic 和 Partition 的元数据，包括每个 Partition 的 Leader 和 Follower 副本的信息。

- **Replica 信息**：记录每个 Partition 的副本及其同步状态。

### 2. **选举 Kafka Controller**

Kafka Controller 是一个特殊的 Broker，负责管理集群范围内的行政管理任务，比如 Topic 创建、删除和分区重新分配。ZooKeeper 负责选举 Kafka Controller，并在当前 Controller 失效时进行重新选举。

#### 具体内容：
- **Controller 选举**：ZooKeeper 通过创建一个临时节点来选举 Controller，第一个成功创建该节点的 Broker 成为 Controller。当 Controller 挂掉时，ZooKeeper 会删除该临时节点，并触发重新选举。

### 3. **Partition Leader 选举**

Kafka 使用 ZooKeeper 来管理每个 Partition 的 Leader 选举。Leader 是负责处理该 Partition 所有读写请求的 Broker。ZooKeeper 确保在一个 Broker 挂掉后，能够及时选出新的 Leader。

#### 具体内容：

- **Leader 选举**：当一个 Broker 挂掉时，ZooKeeper 会触发 Leader 选举过程，从 ISR（In-Sync Replica）列表中选择新的 Leader。ISR 列表中的副本是与 Leader 同步的副本。

### 4. **监控 Broker 的状态**

ZooKeeper 负责监控每个 Kafka Broker 的运行状态。当某个 Broker 挂掉或重新启动时，ZooKeeper 会通知其他 Broker 和相关组件，进行相应的处理。

#### 具体内容：

- **故障检测**：通过心跳机制监控 Broker 的存活状态，当检测到 Broker 失效时，通知 Kafka Controller 和其他 Broker 进行相应处理。

### 5. **管理消费者组**

ZooKeeper 维护 Kafka 早期版本的消费者组（Consumer Group）的元数据信息，如每个消费者组的成员和每个成员所消费的 Partition 信息。在 Kafka 的新版本中，消费者组元数据已经移到了 Kafka 自身的内部 Topic 中。

#### 具体内容：

- **消费者组协调**：在 Kafka 的早期版本中，ZooKeeper 用于管理消费者组的成员信息和消费的 Offset。在 Kafka 0.9 及以上版本中，这些功能已经由 Kafka 内部 Topic 管理，但 ZooKeeper 仍然保留了一些基础功能。

### 具体实现示例

以下是一些具体的 ZooKeeper 在 Kafka 集群中的实现示例：

#### Broker 注册

当一个 Kafka Broker 启动时，它会向 ZooKeeper 注册自身的信息：

```sh
# Kafka Broker 启动时注册到 ZooKeeper
{
  "broker_id": 1,
  "host": "kafka1",
  "port": 9092
}
```

#### Topic 和 Partition 信息

ZooKeeper 存储的 Topic 和 Partition 信息：

```sh
# 在 ZooKeeper 中存储的 Topic 信息
/kafka-topics/topics/my_topic/partitions
/kafka-topics/topics/my_topic/partitions/0/state
{
  "controller_epoch": 1,
  "leader": 1,
  "version": 1,
  "leader_epoch": 1,
  "isr": [1, 2, 3]
}
```

#### Leader 选举

当一个 Partition 的 Leader 挂掉时，ZooKeeper 触发新的 Leader 选举：

```sh
# ZooKeeper 触发 Leader 选举
/kafka-topics/topics/my_topic/partitions/0/state
{
  "controller_epoch": 2,
  "leader": 2,
  "version": 1,
  "leader_epoch": 2,
  "isr": [2, 3]
}
```

### 结论

在 Kafka 集群中，ZooKeeper 扮演着至关重要的角色，通过管理集群元数据、选举 Kafka Controller、选举 Partition Leader、监控 Broker 状态和管理消费者组等功能，确保了 Kafka 集群的高可用性和一致性。理解 ZooKeeper 在 Kafka 中的作用，对于架构师设计和维护高效、可靠的 Kafka 系统至关重要。