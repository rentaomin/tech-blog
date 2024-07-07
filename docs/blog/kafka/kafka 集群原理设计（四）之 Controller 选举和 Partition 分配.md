---
date: 2021-07-07
category:
  - Kafka
tag:
  - 消息队列
sticky: true
excerpt: <p>Kafka 集群原理设计分析</p>
---
# kafka 集群原理设计（四）之 Controller 选举和 Partition 分配

Kafka 集群中的 Controller 选举和 Partition 分配涉及 ZooKeeper 和 Kafka 两部分的协作。
ZooKeeper 负责协调和维护元数据，而 Kafka 负责具体的实现和业务逻辑。下面详细介绍启动过程
中的关键步骤，包括 ZooKeeper 如何触发 Controller 节点的创建，以及 Controller 如何实现 
Partition 分配。

### 1. 启动过程和 Controller 选举

#### ZooKeeper 启动

当 ZooKeeper 启动时，每个 Kafka Broker 会连接到 ZooKeeper 并注册自身的信息。ZooKeeper 
负责监控这些 Broker 的状态，并在 Controller 选举过程中起关键作用。

#### Kafka Broker 启动并注册

每个 Kafka Broker 启动时，会向 ZooKeeper 注册自身信息，并尝试创建 `/controller` 节点。

### 2. Controller 选举

#### 创建 `/controller` 节点

在 Kafka 中，Controller 选举通过创建 ZooKeeper 的 `/controller` 节点实现。以下是 Kafka 
源码中的关键部分：

```java
// ControllerElection.scala
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

#### 触发创建 `/controller` 节点

每个 Kafka Broker 在启动时都会尝试创建 `/controller` 节点，成功创建的 Broker 成为 
Controller。这是通过 ZooKeeper 的 `create` 接口实现的，如果节点已经存在，则创建失败。

```java
public CreateResponse createControllerNode(int brokerId) {
    final String path = ZkController.path;
    final byte[] data = controllerInfo.encode(brokerId).getBytes(StandardCharsets.UTF_8);
    return zkClient.createPersistentNode(path, data, ZkVersion.NoVersion);
}
```

### 3. Controller 如何实现 Partition 分配

#### Partition 分配过程

一旦 Controller 选举完成，新的 Controller 会承担管理集群范围内的任务，包括 Partition 分配。
这是通过 Kafka 内部逻辑实现的，而不是在 ZooKeeper 中直接触发。

```java
// KafkaController.scala
class KafkaController(zooKeeperClient: KafkaZkClient, config: KafkaConfig) {
    def onControllerFailover() {
        info("Controller is now active")
        partitionStateMachine.startup() // 启动分区状态机
        replicaStateMachine.startup()   // 启动副本状态机
        onPartitionModifications()
        onNewBrokerRegistration()
    }

    private def onPartitionModifications() {
        // 分配 Partition 的逻辑
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

#### 分区状态机

Kafka 使用分区状态机和副本状态机来管理 Partition 和 Replica 的状态。在启动过程中，新的 
Controller 会调用 `partitionStateMachine` 和 `replicaStateMachine` 来处理分区和副本
的状态变化。

### 4. ZooKeeper 和 Kafka 的协作

在 Kafka 的设计中，ZooKeeper 主要负责协调和存储元数据，而实际的业务逻辑和处理是在 Kafka 内
部实现的。具体来说：

- **ZooKeeper**：存储和管理 Broker 列表、Topic 列表、Partition 信息、Controller 节点等元数据。
- **Kafka Controller**：负责具体的管理任务，包括 Partition 分配、Leader 选举等。

### 原理示例

#### 启动 Kafka Broker

每个 Kafka Broker 启动时，会尝试创建 `/controller` 节点。如果成功创建，该 Broker 成为 Controller。

```java
public void startup() {
    zkClient = KafkaZkClient(zookeeper.connect, zkSessionTimeoutMs, zkConnectionTimeoutMs, zkEnableSecureAcls)
    controllerElector = new ControllerElection(zkClient)
    val controllerId = controllerElector.elect()
    if (controllerId == config.brokerId) {
        // 当前 Broker 成为 Controller
        onControllerFailover()
    }
}
```

#### Controller 分配 Partition

新选举的 Controller 负责分配 Partition 的 Leader 和 Follower，并更新 ZooKeeper 中的元数据。

```java
public void onControllerFailover() {
    partitionStateMachine.startup() // 启动分区状态机
    replicaStateMachine.startup()   // 启动副本状态机
    onPartitionModifications()      // 处理分区修改
    onNewBrokerRegistration()       // 处理新的 Broker 注册
}
```

### 总结

Kafka 集群在启动过程中，通过 ZooKeeper 协调各个 Broker 的工作。ZooKeeper 负责选举 Controller，
成功创建 `/controller` 节点的 Broker 成为 Controller。Controller 负责管理集群范围内的任务，包
括 Partition 分配和 Leader 选举。这些操作主要通过 Kafka 内部的逻辑实现，而不是直接在 ZooKeeper 
中触发。理解这些原理和实现细节，有助于架构师更好地设计和维护 Kafka 系统。