---
date: 2021-07-07
category:
  - Kafka
tag:
  - 消息队列
sticky: true
excerpt: <p>Kafka 集群原理设计分析</p>
---
# kafka 集群 Topic 之 Partion 消息可靠性设计（一）
```
kafka 集群每个Topic 分为多个Partition 如何关联的，每个Partittion 如何设计，如何
保证消息不丢失，有序，可以重复消费，并行处理?
```

Kafka 集群中的每个 Topic 可以分为多个 Partition，这是 Kafka 实现高吞吐量、并行处理和数据可靠性的
关键设计。下面详细介绍 Kafka 中 Topic 和 Partition 的关联，每个 Partition 的设计，以及如何保证消
息不丢失、有序、可以重复消费和并行处理。

### 1. Topic 和 Partition 的关联

在 Kafka 中，Topic 是逻辑上的数据类别，Partition 是物理上的分区。每个 Topic 可以有多个 Partition，Partition 使得 Kafka 可以并行处理消息，提高系统的吞吐量和性能。

#### 创建 Topic 时指定 Partition 数量和副本因子

```sh
# 创建一个名为 "my_topic" 的 Topic，具有 3 个分区和 3 个副本
bin/kafka-topics.sh --create --topic my_topic --bootstrap-server localhost:9092 --partitions 3 --replication-factor 3
```

### 2. Partition 的设计

每个 Partition 是一个有序的、不可变的消息队列，消息按照追加的顺序存储在 Partition 中。

#### Partition 内部结构

1. **日志分段**：每个 Partition 由多个日志分段（Log Segment）组成，每个日志分段是一个文件，包含若干条消息。
2. **消息索引**：为了快速定位消息，每个日志分段有一个对应的索引文件，记录消息在日志分段中的偏移量（offset）。

### 3. 消息的可靠性和有序性

#### 保证消息不丢失

1. **复制机制**：每个 Partition 有多个副本（Replica），其中一个是 Leader，其他是 Follower。所有的
读写请求都由 Leader 处理，Follower 复制 Leader 的数据。

2. **同步机制**：Kafka 使用 ISR（In-Sync Replica）列表，确保消息被写入到所有同步的副本中。只有在
消息被写入到 ISR 列表中的所有副本后，才认为消息被成功提交。

3. **持久化**：Kafka 将消息持久化到磁盘，即使在 Broker 故障时，消息也不会丢失。

#### 保证消息有序

1. **分区内有序**：在同一个 Partition 内，消息按照追加的顺序存储和消费，保证分区内消息的有序性。
2. **全局有序**：如果需要全局有序性，可以将所有消息写入到一个 Partition 中，但这会限制并行处理的能力。

#### 代码示例：生产者发送消息

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;

public class KafkaProducerExample {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());

        KafkaProducer<String, String> producer = new KafkaProducer<>(props);

        for (int i = 0; i < 10; i++) {
            producer.send(new ProducerRecord<>("my_topic", Integer.toString(i), "message-" + i));
        }

        producer.close();
    }
}
```

### 4. 消息重复消费

Kafka 允许消息重复消费，即使消息已经被消费过，也可以再次消费。这是通过消费者控制偏移量（offset）实现的。

#### 消费者控制偏移量

消费者在消费消息时，会记录每个 Partition 的消费偏移量。偏移量可以存储在 Kafka 自身的内部 Topic 中（默认是 `__consumer_offsets`），也可以由应用程序自行管理。

#### 代码示例：消费者消费消息

```java
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.time.Duration;
import java.util.Collections;
import java.util.Properties;

public class KafkaConsumerExample {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "test_group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());

        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
        consumer.subscribe(Collections.singletonList("my_topic"));

        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
            for (ConsumerRecord<String, String> record : records) {
                System.out.printf("offset = %d, key = %s, value = %s%n", record.offset(), record.key(), record.value());
            }
        }
    }
}
```

### 5. 并行处理

Kafka 通过 Partition 实现并行处理。每个 Partition 可以由不同的消费者实例消费，从而提高并行处理能力。

#### 消费者组

消费者组（Consumer Group）是一组消费者实例，共同消费一个或多个 Topic 的分区。每个分区只能由消费者组中
的一个消费者实例消费，从而实现负载均衡。

#### 代码示例：消费者组

```java
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.time.Duration;
import java.util.Collections;
import java.util.Properties;

public class KafkaConsumerGroupExample {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "test_group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());

        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
        consumer.subscribe(Collections.singletonList("my_topic"));

        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
            for (ConsumerRecord<String, String> record : records) {
                System.out.printf("offset = %d, key = %s, value = %s%n", record.offset(), record.key(), record.value());
            }
        }
    }
}
```

### 6. 总结

Kafka 通过分区和副本机制实现了高吞吐量和高可用性。每个 Topic 可以分为多个 Partition，每个 Partition 是一个有序的消息队列，支持并行处理。Kafka 通过复制机制和 ISR 列表保证消息不丢失，通过偏移量控制保证消息可以重复消费。消费者组实现了负载均衡，提高了并行处理能力。这些设计使 Kafka 成为一个高效、可靠的分布式消息系统。
