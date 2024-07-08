---
date: 2021-07-07
category:
  - Minio 
tag:
  - 对象存储
sticky: true
excerpt: <p> Minio 上传请求负载分析 </p>
---
# Minio 是如何拆分数据多节点存储的？

MinIO 使用 Reed-Solomon erasure coding 技术，将数据分成多个数据片（data shards）和冗余片（parity shards）。
这些片段被分布存储在不同的节点上。以下是如何将数据拆分并在每个节点存储的详细说明。

### Erasure Coding 基础

在 erasure coding 中，数据被分成 n 个数据片和 m 个冗余片。为了恢复原始数据，至少需要 n 个片段（数据片或冗余片）。
典型配置如下：

- (n, m) = (2, 2)：2 个数据片和 2 个冗余片，总共 4 个片段。
- (n, m) = (2, 1)：2 个数据片和 1 个冗余片，总共 3 个片段。

### 数据拆分和存储示例

#### 配置 (2, 2) - 4 个节点

1. **原始数据**：
   假设我们有一个原始数据块 D。

2. **数据拆分**：
   - D 被分成两个数据片：Data1 和 Data2。
   - 生成两个冗余片：Parity1 和 Parity2。

3. **存储在节点上**：
   - Node1 存储 Data1。
   - Node2 存储 Data2。
   - Node3 存储 Parity1。
   - Node4 存储 Parity2。

```plaintext
Node1: Data1
Node2: Data2
Node3: Parity1
Node4: Parity2
```

#### 配置 (2, 1) - 3 个节点

1. **原始数据**：
   假设我们有一个原始数据块 D。

2. **数据拆分**：
   - D 被分成两个数据片：Data1 和 Data2。
   - 生成一个冗余片：Parity1。

3. **存储在节点上**：
   - Node1 存储 Data1。
   - Node2 存储 Data2。
   - Node3 存储 Parity1。

```plaintext
Node1: Data1
Node2: Data2
Node3: Parity1
```

### 冗余和容错能力

#### (2, 2) 配置的容错能力

- 可以容忍最多 2 个节点故障。
- 需要至少 2 个数据片才能恢复原始数据。

例如：
- 如果 Node1 和 Node2 都故障，剩下的 Parity1 和 Parity2 可以恢复 Data1 和 Data2。
- 如果 Node1 和 Node3 都故障，剩下的 Data2 和 Parity2 可以恢复 Data1。

#### (2, 1) 配置的容错能力

- 可以容忍 1 个节点故障。
- 需要至少 2 个片段（包括数据片和冗余片）才能恢复原始数据。

例如：
- 如果 Node1 故障，剩下的 Data2 和 Parity1 可以恢复 Data1。
- 如果 Node3 故障，剩下的 Data1 和 Data2 已经足够恢复原始数据。

### 具体的拆分和存储过程

1. **拆分数据**：
   - MinIO 使用 Reed-Solomon 算法将原始数据分割成 n 个数据片和 m 个冗余片。

2. **存储分片**：
   - 每个片段被存储在不同的节点上，以确保冗余和高可用性。

3. **数据恢复**：
   - 当一个或多个节点故障时，MinIO 可以使用剩余的片段（数据片和冗余片）重建丢失的数据片，保证数据的可用性。

### 示例代码（Java，使用 Reed-Solomon 库）

以下是使用 Java 和 Reed-Solomon 库实现数据分片和恢复的示例代码：

```java
import java.util.Arrays;
import com.backblaze.erasure.ReedSolomon;

public class ErasureCodingExample {
    public static void main(String[] args) {
        int dataShards = 2;
        int parityShards = 2;
        int totalShards = dataShards + parityShards;
        int shardSize = 1024;

        byte[][] shards = new byte[totalShards][shardSize];
        byte[] data = new byte[shardSize * dataShards];

        // Fill data with example data
        for (int i = 0; i < data.length; i++) {
            data[i] = (byte) i;
        }

        // Split the data into shards
        for (int i = 0; i < dataShards; i++) {
            System.arraycopy(data, i * shardSize, shards[i], 0, shardSize);
        }

        // Encode the data shards into parity shards
        ReedSolomon reedSolomon = ReedSolomon.create(dataShards, parityShards);
        reedSolomon.encodeParity(shards, 0, shardSize);

        // Simulate data loss by clearing one shard
        Arrays.fill(shards[0], (byte) 0);

        // Decode the data shards
        reedSolomon.decodeMissing(shards, new boolean[] { true, false, false, false }, 0, shardSize);

        // Verify the recovery
        for (int i = 0; i < dataShards; i++) {
            System.arraycopy(shards[i], 0, data, i * shardSize, shardSize);
        }

        for (byte b : data) {
            System.out.print(b + " ");
        }
    }
}
```

### 总结

MinIO 使用 erasure coding 技术将数据分成数据片和冗余片，并分布存储在不同的节点上。根据节点数量的不同，配置 (2, 2) 和 (2, 1) 可以提供不同程度的冗余和容错能力。

- **(2, 2) 配置**：需要 4 个节点，容错能力较高，最多可容忍 2 个节点故障。
- **(2, 1) 配置**：需要 3 个节点，容错能力有限，最多可容忍 1 个节点故障。

这种设计确保了数据的高可用性和可靠性，即使在部分节点故障的情况下，系统仍能正常运行。