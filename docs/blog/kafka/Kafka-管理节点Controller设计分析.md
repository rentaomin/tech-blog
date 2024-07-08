---
date: 2021-07-07
category:
  - Kafka
tag:
  - 消息队列
sticky: true
excerpt: <p>Kafka 集群原理设计分析</p>
---
# kafka 管理节点 Controller 角色分析

```
kafka controller 如何管理分区的创建、状态监测、故障切换、内容复制、如何管控分区副本的状态检测故障切换、数据同步、learder 选举？
```

Kafka Controller 是 Kafka 集群中的一个关键组件，负责管理分区的创建、状态监测、故障切换、内容
复制等任务。它通过 ZooKeeper 协调和管理这些任务，确保 Kafka 集群的高可用性和一致性。以下是 Kafka Controller 管理分区和副本的详细实现原理和示例代码：

### 1. 管理分区的创建

当创建一个新的 Topic 时，Kafka Controller 会负责分区和副本的分配。

#### 创建 Topic 示例

```sh
# 创建 Topic "my_topic"，有 3 个分区和 3 个副本
bin/kafka-topics.sh --create --topic my_topic --bootstrap-server localhost:9092 --partitions 3 --replication-factor 3
```

#### Controller 处理分区创建的核心代码

```java
// KafkaController.scala
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

### 2. 分区状态监测

Kafka Controller 通过 ZooKeeper 监控分区的状态，包括分区的 Leader 和 ISR 列表的变化。

#### 分区状态监测的核心代码

```java
class PartitionStateMachine(controller: KafkaController) {
    def handleStateChanges(partitions: Set[TopicPartition], targetState: PartitionState, assignments: Map[TopicPartition, Seq[Int]]) {
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

### 3. 故障切换和内容复制

当分区的 Leader 发生故障时，Kafka Controller 负责故障切换，并确保内容复制的正确性。

#### 故障切换的核心代码

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

### 4. 分区副本的状态检测

Kafka Controller 通过 ZooKeeper 监控分区副本的状态，包括副本的同步状态和副本的健康状况。

#### 分区副本状态检测的核心代码

```java
class ReplicaStateMachine(controller: KafkaController) {
    def handleStateChanges(replicas: Set[Replica], targetState: ReplicaState) {
        replicas.foreach { replica =>
            targetState match {
                case OnlineReplica =>
                    // 将副本设置为在线状态
                    makeOnline(replica)
                case OfflineReplica =>
                    // 将副本设置为离线状态
                    makeOffline(replica)
            }
        }
    }
    
    private def makeOnline(replica: Replica) {
        // 更新副本状态为在线
        controllerContext.putReplicaState(replica, OnlineReplica)
        zkClient.updateReplicaState(replica, OnlineReplica)
    }
    
    private def makeOffline(replica: Replica) {
        // 更新副本状态为离线
        controllerContext.putReplicaState(replica, OfflineReplica)
        zkClient.updateReplicaState(replica, OfflineReplica)
    }
}
```

### 5. 故障切换和数据同步

当副本发生故障时，Kafka Controller 负责故障切换，并确保数据同步的正确性。

#### 故障切换和数据同步的核心代码

```java
class KafkaController(zooKeeperClient: KafkaZkClient, config: KafkaConfig) {
    def onReplicaModifications() {
        val replicas = zkClient.getAllReplicas()
        replicas.foreach { replica =>
            val replicaState = zkClient.getReplicaState(replica)
            if (replicaState == OfflineReplica) {
                // 如果副本离线，尝试重新上线
                replicaStateMachine.handleStateChanges(
                    Set(replica), OnlineReplica
                )
            }
        }
    }
}
```

### 6. Leader 选举

当分区的 Leader 发生故障时，Kafka Controller 从 ISR 列表中选举新的 Leader，并更新 ZooKeeper 
中的元数据。

#### Leader 选举的核心代码

```java
class PartitionStateMachine(controller: KafkaController) {
    def handleStateChanges(partitions: Set[TopicPartition], targetState: PartitionState, assignments: Map[TopicPartition, Seq[Int]]) {
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

### 总结

Kafka Controller 通过 ZooKeeper 管理分区的创建、状态监测、故障切换和内容复制。它通过分区和副本
状态机来管理分区和副本的状态变化，并在发生故障时进行切换和数据同步。ZooKeeper 提供了必要的协调和
存储机制，确保 Kafka 集群的一致性和高可用性。理解这些实现原理和核心代码，有助于架构师更好地设计和
维护 Kafka 系统。