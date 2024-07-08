---
date: 2021-07-07
category:
  - Minio 
tag:
  - 对象存储
sticky: true
excerpt: <p> Minio 上传请求负载分析 </p>
---
# Minio 集群数据写入确认消息机制分析

在 MinIO 集群中，数据写入的确认消息机制并不要求集群中的所有节点都确认成功，而是基于纠删码（Erasure Coding）
和写入配额（Write Quorum）的机制。具体来说，当一个文件被分成多个分片并分布到不同节点时，数据的写入确认依赖于
满足特定的配额要求，而不是所有节点的确认。

### 纠删码和写入配额（Write Quorum）

#### 纠删码简介

MinIO 使用纠删码技术将数据分割成多个数据块和冗余块。这些块分布在不同的节点上，以提高数据的可靠性和可用性。例如，
一个文件可以被分成 8 个数据块和 4 个冗余块，总共 12 个块，分布在不同的节点上。

#### 写入配额（Write Quorum）

写入配额是指为了确认数据写入成功所需的最少节点数。例如，如果一个文件被分成 12 个块，写入配额可能是 8，这意味着只
要有 8 个块成功写入，数据写入就被认为是成功的。

### 数据写入确认机制

1. **数据分片和写入**：
   客户端将文件分成多个分片，每个分片被进一步分割成数据块和冗余块，并分布到多个存储节点上。

2. **节点确认消息**：
   每个节点在成功写入一个数据块或冗余块后，会发送一个确认消息（ACK）给主控节点或协调器。主控节点收集这些确认消息。

3. **确认消息配额**：
   主控节点只需要收到满足写入配额的确认消息。例如，如果写入配额是 8，只要有 8 个确认消息，就可以认为数据写入成功。

4. **数据完整性检查**：
   主控节点在收到足够多的确认消息后，进行数据完整性检查，确保数据未被篡改或损坏。

5. **客户端通知**：
   在数据完整性检查通过后，主控节点通知客户端数据写入成功。

### 代码示例

以下是一个简单的 Java 示例，展示了如何通过写入配额机制进行数据写入确认。

```java
import java.util.*;
import java.util.concurrent.*;

public class MinioDataShardWriter {

    private static final int DATA_BLOCKS = 8;
    private static final int PARITY_BLOCKS = 4;
    private static final int TOTAL_BLOCKS = DATA_BLOCKS + PARITY_BLOCKS;
    private static final int WRITE_QUORUM = 8;

    private ConcurrentMap<String, Set<Integer>> receivedAcks = new ConcurrentHashMap<>();

    public void writeData(String bucketName, String objectKey, byte[] data) throws Exception {
        // Erasure coding
        ErasureEncoder encoder = new ErasureEncoder(DATA_BLOCKS, PARITY_BLOCKS);
        byte[][] blocks = encoder.encode(data);

        // Distribute blocks to different nodes
        for (int i = 0; i < blocks.length; i++) {
            String node = getNodeForBlock(i);
            sendDataToNode(node, bucketName, objectKey, blocks[i], i);
        }

        // Wait for enough acks to meet the write quorum
        if (!waitForAcks(bucketName, objectKey)) {
            throw new IOException("Failed to receive enough acks for write quorum");
        }

        // Data integrity check and notify client
        completeWrite(bucketName, objectKey);
    }

    private String getNodeForBlock(int blockIndex) {
        // Determine the node for the block based on the block index
        // For simplicity, assume a static mapping
        return "http://minio-node-" + (blockIndex % 4) + ":9000";
    }

    private void sendDataToNode(String node, String bucketName, String objectKey, byte[] block, 
    int blockIndex) throws IOException {
        // Send data to the node
        // Here you can use HTTP client or MinIO SDK to send data

        // Simulate sending ACK after successful write
        sendAckToCoordinator(bucketName, objectKey, blockIndex);
    }

    private void sendAckToCoordinator(String bucketName, String objectKey, int blockIndex) {
        String key = bucketName + "/" + objectKey;
        receivedAcks.putIfAbsent(key, new HashSet<>());
        receivedAcks.get(key).add(blockIndex);
    }

    private boolean waitForAcks(String bucketName, String objectKey) throws InterruptedException {
        String key = bucketName + "/" + objectKey;
        int maxWaitTime = 10000; // Maximum wait time in milliseconds
        int waitInterval = 100; // Wait interval in milliseconds
        int waitedTime = 0;

        while (waitedTime < maxWaitTime) {
            if (receivedAcks.containsKey(key) && receivedAcks.get(key).size() >= WRITE_QUORUM) {
                return true;
            }
            Thread.sleep(waitInterval);
            waitedTime += waitInterval;
        }

        return false;
    }

    private void completeWrite(String bucketName, String objectKey) {
        // Perform data integrity check and notify client
        // This could involve updating metadata, notifying client, etc.
        System.out.println("Write completed for " + bucketName + "/" + objectKey);
    }
}
```

### 总结

在 MinIO 集群中，数据写入的确认消息机制并不依赖于所有节点的确认，而是基于纠删码和写入配额的机制。通过满足写入
配额的确认消息数量，MinIO 能够在保证数据完整性和一致性的前提下，实现高效的数据写入和存储。这种机制提高了系统的
容错能力和可用性，即使部分节点出现故障，数据仍然可以被可靠地存储和恢复。