---
date: 2021-07-07
category:
  - Kafka
tag:
  - 消息队列
sticky: true
excerpt: <p>Kafka 集群原理设计分析</p>
---
# 架构师之 Kafka 核心概念入门

作为架构师，理解 Kafka 的核心概念至关重要。这些概念是构建高效、可靠的 Kafka 系统的基础。
以下是需要掌握的 Kafka 核心概念及其详细说明：

### 1. **Topic**
- **定义**：Topic 是 Kafka 中用于存储和分类消息的逻辑命名空间。每个 Topic 代表一类数据流，
           例如日志、交易记录等。

- **作用**：通过 Topic，可以将不同类型的消息分开，方便管理和消费。

- **操作**：创建、删除和列出现有的 Topic。
  ```sh
  # 创建一个新的 Topic
  kafka-topics.sh --create --topic my_topic --bootstrap-server localhost:9092 --partitions 3 --replication-factor 2

  # 列出所有 Topic
  kafka-topics.sh --list --bootstrap-server localhost:9092

  # 删除一个 Topic
  kafka-topics.sh --delete --topic my_topic --bootstrap-server localhost:9092
  ```

### 2. **Partition**
- **定义**：Partition 是 Topic 的子集，是一个有序的、不可变的消息队列。每个 Partition 可以存储多个消息。
- **作用**：通过 Partition，可以实现消息的并行处理，提升系统的吞吐量。
- **操作**：创建 Topic 时指定 Partition 数量，或者在现有 Topic 上增加 Partition。
  ```sh
  # 增加现有 Topic 的 Partition 数量
  kafka-topics.sh --alter --topic my_topic --partitions 5 --bootstrap-server localhost:9092
  ```

### 3. **Offset**
- **定义**：Offset 是 Partition 中每条消息的唯一标识。Offset 是一个递增的整数，用于定位和跟踪消息。
- **作用**：通过 Offset，可以确保每条消息在消费时的顺序和位置。
- **操作**：消费者通过 Offset 跟踪消费进度，支持自动和手动提交 Offset。
  ```java
  // 消费者配置示例
  Properties props = new Properties();
  props.put("bootstrap.servers", "localhost:9092");
  props.put("group.id", "test_group");
  props.put("enable.auto.commit", "true");
  props.put("auto.commit.interval.ms", "1000");
  props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
  props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
  ```

### 4. **Producer**
- **定义**：Producer 是发送消息到 Kafka Topic 的客户端应用程序。
- **作用**：Producer 将数据发布到指定的 Topic，可以选择将消息发送到特定的 Partition。
- **操作**：配置 Producer 属性，发送消息到 Kafka。
  ```java
  // Producer 配置示例
  Properties props = new Properties();
  props.put("bootstrap.servers", "localhost:9092");
  props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
  props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

  Producer<String, String> producer = new KafkaProducer<>(props);
  producer.send(new ProducerRecord<>("my_topic", "key", "value"));
  producer.close();
  ```

### 5. **Consumer**
- **定义**：Consumer 是从 Kafka Topic 中读取和处理消息的客户端应用程序。
- **作用**：Consumer 可以组成消费组（Consumer Group），每个组内的 Consumer 分配处理不同的 Partition，确保消息只被消费一次。
- **操作**：配置 Consumer 属性，消费 Kafka 中的消息。
  ```java
  // Consumer 配置示例
  Properties props = new Properties();
  props.put("bootstrap.servers", "localhost:9092");
  props.put("group.id", "test_group");
  props.put("enable.auto.commit", "true");
  props.put("auto.commit.interval.ms", "1000");
  props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
  props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

  KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
  consumer.subscribe(Arrays.asList("my_topic"));
  while (true) {
      ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
      for (ConsumerRecord<String, String> record : records) {
          System.out.printf("offset = %d, key = %s, value = %s%n", record.offset(), record.key(), record.value());
      }
  }
  ```

### 6. **Broker**
- **定义**：Broker 是 Kafka 的运行实例，负责接收、存储和传递消息。
- **作用**：Broker 是 Kafka 集群的节点，每个集群可以包含一个或多个 Broker。
- **操作**：启动和停止 Broker，查看 Broker 状态。
  ```sh
  # 启动 Kafka Broker
  bin/kafka-server-start.sh config/server.properties

  # 停止 Kafka Broker
  bin/kafka-server-stop.sh
  ```

### 7. **ZooKeeper**
- **定义**：ZooKeeper 是 Kafka 集群的协调服务，用于管理元数据和集群配置。
- **作用**：ZooKeeper 负责维护 Kafka 集群的节点状态，进行 Leader 选举和元数据管理。
- **操作**：启动和停止 ZooKeeper，查看 ZooKeeper 状态。
  ```sh
  # 启动 ZooKeeper
  bin/zkServer.sh start

  # 停止 ZooKeeper
  bin/zkServer.sh stop
  ```

### 8. **Replication（数据复制）**
- **定义**：Replication 是 Kafka 中的消息副本机制，每个 Partition 可以有多个副本。
- **作用**：通过复制，Kafka 提供了数据的高可用性和容错能力。
- **操作**：配置 Topic 的副本因子，查看副本状态。
  ```sh
  # 创建一个具有复制因子的 Topic
  kafka-topics.sh --create --topic my_topic --bootstrap-server localhost:9092 --partitions 3 --replication-factor 2

  # 查看 Topic 的详细信息
  kafka-topics.sh --describe --topic my_topic --bootstrap-server localhost:9092
  ```

### 9. **Leader 和 Follower**
- **定义**：每个 Partition 都有一个 Leader 和多个 Follower。Leader 负责处理所有读写请求，Follower 复制 Leader 的数据。
- **作用**：确保数据的高可用性和一致性，当 Leader 发生故障时，Follower 可以提升为新的 Leader。
- **操作**：查看 Partition 的 Leader 和 Follower 状态。
  ```sh
  # 查看 Topic 的详细信息，包括 Leader 和 Follower
  kafka-topics.sh --describe --topic my_topic --bootstrap-server localhost:9092
  ```

### 10. **Consumer Group**
- **定义**：Consumer Group 是一组 Consumer 实例，共同消费一个或多个 Topic。
- **作用**：Consumer Group 提供了消息的负载均衡和容错机制，同一组内的 Consumer 会分摊不同的 Partition，每条消息只
            会被消费一次。
- **操作**：管理 Consumer Group，查看消费进度。
  ```sh
  # 查看 Consumer Group 的状态
  kafka-consumer-groups.sh --describe --group my_group --bootstrap-server localhost:9092
  ```

### 11. **Retention（消息保留）**
- **定义**：Retention 是指 Kafka 中消息的保留策略，可以基于时间或大小来配置。
- **作用**：通过配置消息保留策略，确保 Kafka 存储空间的有效利用和历史数据的保留。
- **操作**：配置 Topic 的消息保留策略。
  ```sh
  # 配置 Topic 的消息保留时间为 7 天
  kafka-configs.sh --alter --entity-type topics --entity-name my_topic --add-config retention.ms=604800000 --bootstrap-server localhost:9092
  ```

### 12. **Log Compaction（日志压缩）**
- **定义**：Log Compaction 是 Kafka 的一种日志清理机制，保留每个键的最新值，删除旧的冗余数据。
- **作用**：通过日志压缩，可以减少存储空间，确保每个键只有最新的值。
- **操作**：配置 Topic 的日志压缩策略。
  ```sh
  # 配置 Topic 的日志压缩策略
  kafka-configs.sh --alter --entity-type topics --entity-name my_topic --add-config cleanup.policy=compact --bootstrap-server localhost:9092
  ```

### 总结

作为架构师，掌握 Kafka 的核心概念是设计和维护 Kafka 系统的基础。这些概念包括 Topic、Partition、Offset、Producer、Consumer、Broker、ZooKeeper、Replication、Leader 和 Follower、Consumer Group、Retention 和 Log Compaction。理解并熟练运用这些概念，
可以有效地设计、部署和优化 Kafka 系统，满足业务需求。