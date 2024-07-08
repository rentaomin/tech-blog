---
date: 2021-07-07
category:
  - Kafka
tag:
  - 消息队列
sticky: true
excerpt: <p>Kafka 集群原理设计分析</p>
---
# kafka 集群原理设计(三)之启动原理介绍

## 业务背景问题描述
现在有三个机器节点192.168.0.200、192.168.0.201、192.168.0.202，分别安装部署zookeeper、
kafka集群，每个topic有3个分区，3个副本，则kafka各个节点在刚启动时，是如何选择哪个Kafka节
点为管理节点，哪个副本为主，其余为副本？


在 Kafka 集群中，部署 ZooKeeper 和 Kafka 后，各个节点在启动时的行为包括以下几个步骤：

1. **ZooKeeper 启动和配置**：每个节点启动 ZooKeeper，配置 ZooKeeper 集群。
2. **Kafka 启动和注册**：每个 Kafka Broker 启动并向 ZooKeeper 注册自身信息。
3. **Controller 选举**：ZooKeeper 选举出 Kafka Controller。
4. **Partition 领导者和副本分配**：Kafka Controller 负责分配 Partition 的领导者和副本。

以下是详细的启动过程、实现原理和核心代码示意：

### 1. ZooKeeper 启动和配置

每个机器节点启动 ZooKeeper，并配置集群。

#### 配置文件 (`zoo.cfg`) 示例：

```properties
tickTime=2000
dataDir=/var/lib/zookeeper
clientPort=2181
initLimit=5
syncLimit=2
server.1=192.168.0.200:2888:3888
server.2=192.168.0.201:2888:3888
server.3=192.168.0.202:2888:3888
```

#### 启动 ZooKeeper：

```sh
# 在每个节点上执行
bin/zkServer.sh start
```

### 2. Kafka 启动和注册

每个 Kafka Broker 启动并向 ZooKeeper 注册自身信息。

#### 配置文件 (`server.properties`) 示例：

```properties
broker.id=0
listeners=PLAINTEXT://192.168.0.200:9092
log.dirs=/var/lib/kafka/logs
zookeeper.connect=192.168.0.200:2181,192.168.0.201:2181,192.168.0.202:2181
```

#### 启动 Kafka Broker：

```sh
# 在每个节点上执行
bin/kafka-server-start.sh config/server.properties
```

### 3. Controller 选举

当所有 Broker 启动后，ZooKeeper 开始选举 Kafka Controller。Controller 是负责管理集群范
围内的管理任务的 Broker。

#### 核心代码示例（ControllerElection.scala）：

```java
class ControllerElection(zooKeeperClient: KafkaZkClient) {
  def elect: Int = {
    val currentControllerId = getControllerId()
    if (currentControllerId == -1) {
      val newControllerId = electController()
      if (newControllerId != -1) {
        info(s"Successfully elected controller $newControllerId")
        newControllerId
      } else {
        error("Failed to elect controller")
        -1
      }
    } else {
      info(s"Controller already elected: $currentControllerId")
      currentControllerId
    }
  }
  
  private def electController(): Int = {
    // 创建 /controller 节点，如果成功则当前 Broker 成为 Controller
    val createResponse = zooKeeperClient.createControllerNode(brokerId)
    if (createResponse.isSuccess) {
      brokerId
    } else {
      -1
    }
  }
  
  private def getControllerId(): Int = {
    // 获取当前的 Controller ID
    val controllerData = zooKeeperClient.getController()
    controllerData.map(_.brokerId).getOrElse(-1)
  }
}
```

### 4. Partition 领导者和副本分配

Controller 负责分配 Partition 的领导者和副本。在创建 Topic 时，指定 Partition 数量和副本
因子，Controller 会分配领导者和副本。

#### 创建 Topic 示例：

```sh
# 创建 Topic "my_topic"，有 3 个分区和 3 个副本
bin/kafka-topics.sh --create --topic my_topic --bootstrap-server localhost:9092 
--partitions 3 --replication-factor 3
```

#### 核心代码示例（PartitionLeaderElection.scala）：

```java
class PartitionLeaderElection(zooKeeperClient: KafkaZkClient) {
  def electLeader(partition: TopicPartition): Option[Int] = {
    val leaderAndIsr = zooKeeperClient.getLeaderAndIsrForPartition(partition)
    val newLeader = selectLeader(leaderAndIsr.isr)
    newLeader.foreach { leader =>
      zooKeeperClient.updateLeaderAndIsr(partition, leaderAndIsr.copy(leader = leader))
    }
    newLeader
  }

  private def selectLeader(isr: Seq[Int]): Option[Int] = {
    // 从 ISR 列表中选出新的 Leader
    if (isr.nonEmpty) Some(isr.head) else None
  }
}
```

### 启动过程实现原理详细介绍

#### 1. ZooKeeper 启动和配置

- 每个节点启动 ZooKeeper。
- ZooKeeper 实例相互通信，形成一个 ZooKeeper 集群。
- ZooKeeper 通过配置文件中的 server 配置确保每个节点的唯一性和集群一致性。

#### 2. Kafka 启动和注册

- 每个 Kafka Broker 启动，并通过配置文件中的 zookeeper.connect 参数连接到 ZooKeeper。
- 启动过程中，Kafka Broker 会向 ZooKeeper 注册自身信息，如 `broker.id` 和网络地址。

#### 3. Controller 选举

- Kafka Broker 启动后，ZooKeeper 选举出一个 Controller。Controller 负责管理集群范围内的
管理任务。

- 通过创建 `/controller` 节点，ZooKeeper 确定当前的 Controller。第一个成功创建该节点的 Broker 
成为 Controller。

#### 4. Partition 领导者和副本分配

- 创建 Topic 时指定 Partition 数量和副本因子。
- Controller 负责将每个 Partition 分配给 Broker，并确定每个 Partition 的 Leader 和 Follower。
- ZooKeeper 维护 Partition 的元数据，包括 Leader 和 ISR 列表。

### 示例说明

在启动过程中，Kafka 集群通过 ZooKeeper 协调多个 Broker 的工作，确保每个 Partition 有一个 Leader 
和多个 Follower，实现高可用性和负载均衡。

1. **启动 ZooKeeper**：确保每个节点的 ZooKeeper 实例正确启动和配置。
2. **启动 Kafka Broker**：每个 Broker 启动并向 ZooKeeper 注册。
3. **Controller 选举**：ZooKeeper 选举出一个 Controller 负责集群管理任务。
4. **Partition 分配**：Controller 分配 Partition 的 Leader 和 Follower，并通过 ZooKeeper 维护
这些元数据。

通过上述过程和核心代码示例，Kafka 集群实现了多个 Broker 的协同工作，确保数据的分布和高可用性。这些机制
和实现原理是理解 Kafka 集群设计和运作的关键。