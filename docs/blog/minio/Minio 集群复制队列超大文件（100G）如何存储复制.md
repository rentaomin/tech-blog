---
date: 2021-07-07
category:
  - Minio 
tag:
  - 对象存储
sticky: true
excerpt: <p> Minio 上传请求负载分析 </p>
---
# Minio 集群复制队列超大文件（100G）如何存储复制？

在 MinIO 的异步复制过程中，复制队列中的消息内容主要包括对象元数据和复制操作的详细信息，
而不是实际的数据内容。对于大文件（如 100GB 或更大文件）的复制，MinIO 采用了分块上传和分
块复制的策略，以确保复制过程的稳定和高效。

### 复制队列中的消息内容示例

复制队列中的消息内容通常包括以下信息：

- 源对象的路径和名称
- 目标对象的路径和名称
- 对象的元数据（例如大小、MD5 校验和等）
- 复制策略的相关信息

#### 示例消息内容

```json
{
    "source_bucket": "my-bucket",
    "source_object": "large-file.bin",
    "target_bucket": "my-bucket",
    "target_object": "large-file.bin",
    "metadata": {
        "size": 100000000000,
        "md5sum": "9e107d9d372bb6826bd81d3542a419d6",
        "etag": "1b2cf535f27731c974343645a3985328",
        "content_type": "application/octet-stream"
    },
    "replication_status": "pending",
    "created_time": "2024-07-01T22:00:00Z"
}
```

### 分块上传和分块复制的工作原理

对于大文件，MinIO 使用了分块上传（multipart upload）机制，将文件分割成多个较小的块，每个块单独
上传和复制。这种方式不仅提高了传输的可靠性和效率，还能更好地利用网络带宽和资源。

#### 分块上传的步骤

1. **初始化分块上传**：
   客户端请求初始化分块上传，并获得一个上传 ID。

    ```bash
    mc cp --attr x-amz-meta-my-key=my-value large-file.bin sourceMinIO/my-bucket/large-file.bin
    ```

2. **上传分块**：
   客户端将文件分割成多个块，并使用上传 ID 分别上传每个块。

    ```bash
    mc cp --attr x-amz-meta-my-key=my-value large-file.bin sourceMinIO/my-bucket/large-file.bin
    ```

3. **完成分块上传**：
   客户端发送一个请求，通知服务器所有块上传完毕，服务器将这些块合并成一个完整的对象。

    ```bash
    mc cp --attr x-amz-meta-my-key=my-value large-file.bin sourceMinIO/my-bucket/large-file.bin
    ```

#### 分块复制的步骤

1. **初始化分块复制**：
   当源对象上传完成后，复制队列会记录分块复制任务，后台任务负责分块复制的执行。

2. **复制分块**：
   后台任务从复制队列中读取消息，获取分块信息，并将每个分块异步复制到目标集群。

3. **完成分块复制**：
   当所有分块都复制完成后，目标集群将这些分块合并成一个完整的对象。

### 分块复制的示例代码

假设用户上传了一个 100GB 的大文件，MinIO 会将文件分割成多个 5GB 的块进行上传和复制。以下是分块上传和
复制的过程示例：

#### 初始化分块上传

```python
import boto3

# 使用 boto3 初始化分块上传
s3_client = boto3.client('s3', endpoint_url='http://source-minio.example.com', 
aws_access_key_id='accessKey', aws_secret_access_key='secretKey')
response = s3_client.create_multipart_upload(Bucket='my-bucket', Key='large-file.bin')
upload_id = response['UploadId']
```

#### 上传分块

```python
part_number = 1
with open('large-file.bin', 'rb') as file:
    while True:
        data = file.read(5 * 1024 * 1024 * 1024)  # 读取 5GB 的数据
        if not data:
            break
        response = s3_client.upload_part(Bucket='my-bucket', Key='large-file.bin', 
        PartNumber=part_number, UploadId=upload_id, Body=data)
        part_number += 1
```

#### 完成分块上传

```python
parts = []
for i in range(1, part_number):
    parts.append({'PartNumber': i, 'ETag': s3_client.head_object(Bucket='my-bucket', 
    Key='large-file.bin')['ETag']})
s3_client.complete_multipart_upload(Bucket='my-bucket', Key='large-file.bin', 
UploadId=upload_id, MultipartUpload={'Parts': parts})
```

#### 分块复制的工作原理

MinIO 后台任务读取复制队列中的消息，根据上传 ID 和分块信息，依次复制每个分块到目标集群。完成所有
分块复制后，目标集群合并这些分块，形成完整的对象。

### 控制网络占用和资源

为了在异步复制过程中控制网络占用，可以采用以下措施：

1. **带宽限制**：
   使用带宽限制参数控制复制任务的网络使用。

    ```bash
    mc replicate set --bandwidth "10MB/s" sourceMinIO/my-bucket
    ```

2. **分批次复制**：
   分批次进行大文件的分块复制，减少瞬时网络压力。

3. **时间窗口**：
   在业务低峰期进行分块复制，避免高峰期对业务的影响。

4. **监控和调整**：
   实时监控网络使用情况，并动态调整带宽和复制策略。

### 总结

MinIO 异步复制通过分块上传和分块复制的机制，确保大文件的高效复制。复制队列存储对象的元数据和复制操作的
信息，而不是实际的数据内容。通过分块上传和分块复制，MinIO 能够在不影响业务正常运行的情况下，实现大文件
的异地复制。利用带宽限制、分批次复制和时间窗口等策略，可以有效控制网络占用，保证业务的正常使用。