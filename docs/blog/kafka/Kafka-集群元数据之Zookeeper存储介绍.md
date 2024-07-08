---
date: 2021-07-07
category:
  - Kafka
tag:
  - 消息队列
sticky: true
excerpt: <p>Kafka 集群原理设计分析</p>
---
# Kafka 集群元数据之Zookeeper存储介绍？

在 Kafka 集群中，ZooKeeper 存储了大量的元数据，管理和协调 Kafka 的各个组件。以下是 ZooKeeper 中创建
的主要信息及其作用：

### 1. **Broker 信息**

**路径**：
- `/brokers/ids/[broker_id]`
- `/brokers/topics/[topic_name]`
- `/brokers/seqid`

**作用**：
- **Broker 注册和发现**：每个 Kafka Broker 在启动时会在 ZooKeeper 中注册自己的信息，包括 `broker.id`、主机名和端口号。其他组件可以通过读取这些节点来发现当前集群中的所有 Broker。
- **Topic 配置管理**：存储每个 Topic 的配置信息，包括 Partition 数量和副本因子等。
- **序列 ID 管理**：用于生成唯一的序列 ID，确保每个 Topic 和 Partition 的唯一性。

### 2. **Topic 和 Partition 信息**

**路径**：
- `/brokers/topics/[topic_name]/partitions/[partition_id]/state`

**作用**：
- **Partition Leader 信息**：存储每个 Partition 的 Leader 和 Follower 信息，确定哪个 Broker 是当前 Partition 的 Leader。
- **ISR 列表**：记录当前 Partition 的 In-Sync Replica (ISR) 列表，标识哪些副本是与 Leader 同步的。

### 3. **Controller 信息**

**路径**：
- `/controller`
- `/controller_epoch`

**作用**：
- **Controller 选举**：存储当前 Kafka Controller 的信息，Controller 是一个特殊的 Broker，负责管理集群范围内的行政任务，如分区重新分配和副本管理。
- **Controller 纪元**：记录 Controller 的纪元（epoch），用于确保每个 Controller 任期内的唯一性和一致性。

### 4. **Consumer Group 信息**

（适用于 Kafka 早期版本，0.9 及以上版本已移至 Kafka 内部 Topic）

**路径**：
- `/consumers/[group_id]/ids/[consumer_id]`
- `/consumers/[group_id]/offsets/[topic]/[partition]`

**作用**：
- **消费者组成员**：记录每个消费者组中的消费者实例信息，包括消费者 ID 和分配的 Partition。
- **消费偏移量**：存储每个消费者组在各个 Partition 上的消费偏移量，用于消费者重启后的恢复。

### 5. **配置信息**

**路径**：
- `/config/topics/[topic_name]`
- `/config/changes/config_change_[sequence_number]`

**作用**：
- **Topic 配置**：存储每个 Topic 的详细配置信息，包括清理策略、保留时间等。
- **配置变更记录**：记录每次配置变更的详细信息，确保配置变更的有序性和一致性。

### 6. **ACL（访问控制列表）**

**路径**：
- `/zookeeper/quota`
- `/zookeeper/config`
- `/zookeeper/quota/limits`

**作用**：
- **访问控制**：存储 Kafka 集群的 ACL 信息，管理对 Kafka 资源的访问权限，确保安全性。
- **配额管理**：存储集群的配额限制，防止过度使用资源。

### 具体信息示例

以下是一些具体的 ZooKeeper 中存储的信息示例：

#### Broker 信息

**路径**：`/brokers/ids/1`
```json
{
  "broker_id": 1,
  "host": "kafka1",
  "port": 9092
}
```

#### Topic 和 Partition 信息

**路径**：`/brokers/topics/my_topic/partitions/0/state`
```json
{
  "controller_epoch": 1,
  "leader": 1,
  "version": 1,
  "leader_epoch": 1,
  "isr": [1, 2, 3]
}
```

#### Controller 信息

**路径**：`/controller`
```json
{
  "version": 1,
  "brokerid": 1,
  "timestamp": "1632951600000"
}
```

#### Consumer Group 信息（适用于早期版本）

**路径**：`/consumers/my_group/offsets/my_topic/0`
```json
{
  "offset": 12345
}
```

### 总结

在 Kafka 集群中，ZooKeeper 存储和管理了大量的元数据信息，确保了 Kafka 的高可用性和一致性。理解这些信息的具体作用，有助于更好地设计、部署和维护 Kafka 系统。主要信息包括 Broker 注册和发现、Topic 和 Partition 信息、Controller 选举、消费者组管理、配置信息和 ACL 管理。通过这些信息，ZooKeeper 有效地协调和管理了 Kafka 的各个组件。