---
date: 2021-07-07
category:
  - Kafka
tag:
  - 消息队列
sticky: true
excerpt: <p>Kafka 集群原理设计分析</p>
---
# kafka 集群 Topic 之 Partion日志分段存储原理设计（五）
```
kafka 的 topic 中 partition 将消息存储在多个日志分段中，配置文件不是只配置了一个日志路径，
那kafka是如何实现分为多个日志分段文件的，并存储写入topic消息内容的？
```
Kafka 通过将消息日志分成多个分段文件（log segments）来管理每个 Partition 的存储。虽然 Kafka 在配置
文件中只指定了一个日志存储路径，但它会在该路径下根据需要自动创建和管理这些分段文件。以下是详细的实现原
理和操作流程。

### 1. 配置文件中的日志存储路径

在 Kafka 的配置文件（`server.properties`）中，日志存储路径通常通过以下配置项指定：

```properties
log.dirs=/var/lib/kafka/logs
```

这个配置项指定了 Kafka 存储日志文件的目录路径。

### 2. 日志分段文件的自动管理

Kafka 会在配置的日志存储路径下自动创建和管理日志分段文件。每个分段文件有固定的大小，当一个分段文件
达到指定大小后，Kafka 会自动创建一个新的分段文件来继续写入消息。

#### 分段文件的命名规则

Kafka 通过文件名来管理和区分不同的分段文件。每个分段文件的文件名是该分段内第一个消息的偏移量。例如：

```
/var/lib/kafka/logs/my_topic-0/
  - 00000000000000000000.log
  - 00000000000000001000.log
  - 00000000000000002000.log
```

### 3. 核心代码示例和流程

#### 日志分段管理

Kafka 在每个 Partition 的目录下管理多个分段文件。每个分段文件有固定的大小，当一个分段文件写满后，
Kafka 会创建一个新的分段文件。

```java
// Log.scala
class Log(val dir: File, val config: LogConfig) {
    val segments = new LogSegments(dir)

    def append(records: MemoryRecords): Unit = {
        val segment = maybeRoll()
        segment.append(records)
    }

    private def maybeRoll(): LogSegment = {
        val activeSegment = segments.activeSegment
        if (activeSegment.size > config.segmentSize) {
            val newSegment = createNewSegment(activeSegment.baseOffset + activeSegment.size)
            segments.add(newSegment)
        }
        segments.activeSegment
    }

    private def createNewSegment(baseOffset: Long): LogSegment = {
        val logFile = new File(dir, s"$baseOffset.log")
        val indexFile = new File(dir, s"$baseOffset.index")
        new LogSegment(baseOffset, logFile, indexFile)
    }
}
```

#### 日志分段文件的写入

当生产者向 Kafka 发送消息时，Kafka 会将这些消息写入当前活动的日志分段文件。如果该分段文件已经达到配置
的最大大小，Kafka 会滚动到一个新的分段文件继续写入。

```java
// LogSegment.scala
class LogSegment(val baseOffset: Long, val log: File, val index: File) {
    val logFile = new FileChannel(log)
    val indexFile = new IndexChannel(index)

    def append(record: Record): Unit = {
        logFile.write(record)
        indexFile.append(record.offset, logFile.position)
    }
}
```

### 4. 配置日志分段的参数

Kafka 通过配置文件中的参数来控制日志分段的大小和滚动策略：

```properties
log.segment.bytes=1073741824  # 每个分段文件的最大大小，默认1GB
log.roll.hours=168            # 日志分段文件的最大滚动时间，默认7天
```

这些参数确保 Kafka 能够有效地管理日志文件，避免单个文件过大影响性能，并确保日志文件按时间滚动。

### 5. 日志分段文件的读取

Kafka 通过索引文件快速定位消息，然后从相应的日志分段文件中读取消息。

```java
// LogSegment.scala
class LogSegment(val baseOffset: Long, val log: File, val index: File) {
    def read(offset: Long, maxBytes: Int): MemoryRecords = {
        val position = index.lookup(offset)
        logFile.read(position, maxBytes)
    }
}
```

### 6. 消息存储和读取的完整流程

1. **生产者发送消息**：生产者将消息发送到 Kafka 的某个 Topic 的某个 Partition。
2. **写入活动日志分段文件**：Kafka 将消息写入当前活动的日志分段文件。如果该文件已达到最大大小，则滚动到新
的分段文件。
3. **创建新分段文件**：当活动日志分段文件达到最大大小时，Kafka 会创建新的分段文件继续写入消息。
4. **读取消息**：消费者根据消息偏移量读取消息，Kafka 使用索引文件快速定位消息在日志分段文件中的位置，然后
从相应的分段文件中读取消息。

### 总结

- **日志分段管理**：Kafka 在配置的日志存储路径下自动创建和管理日志分段文件。每个分段文件有固定的大小，达到
最大大小后自动滚动到新的分段文件。
- **参数配置**：通过配置参数控制日志分段的大小和滚动策略，确保日志文件管理的高效性。
- **分段文件写入和读取**：生产者发送消息时写入当前活动的日志分段文件，消费者读取消息时通过索引文件快速定
位并读取相应的分段文件。

这些机制确保 Kafka 能够高效地存储和管理大量的消息，提供高吞吐量和可靠性。