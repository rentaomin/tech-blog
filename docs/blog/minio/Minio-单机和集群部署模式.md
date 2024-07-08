---
date: 2021-07-07
category:
  - Minio 
tag:
  - 对象存储
sticky: true
excerpt: <p> Minio 上传请求负载分析 </p>
---
# Minio 单机和集群部署模式

MinIO 是一个高性能的对象存储系统，支持单机和集群两种部署模式。以下是 MinIO 单机和集群部署模式
的详细介绍和步骤。

### 1. 单机部署模式

单机部署模式适用于开发、测试环境和小规模的生产环境。此模式下，MinIO 在一台机器上运行，不具备高可
用性和容错能力。

#### 部署步骤

1. **下载 MinIO 可执行文件**

   从 MinIO 官方网站下载最新的 MinIO 可执行文件。

   ```bash
   wget https://dl.min.io/server/minio/release/linux-amd64/minio
   chmod +x minio
   ```

2. **启动 MinIO 服务**

   使用 `minio server` 命令启动 MinIO 服务。指定数据存储路径 `/data`。

   ```bash
   ./minio server /data
   ```

3. **访问 MinIO 控制台**

   启动后，MinIO 会在默认端口 9000 上运行。可以通过浏览器访问 MinIO 控制台 `http://localhost:9000`，
   使用默认的访问密钥（Access Key）和密钥（Secret Key）登录。

### 2. 集群部署模式

集群部署模式适用于生产环境，通过多个节点提供高可用性和扩展性。至少需要 4 个节点来实现分布式部署。

#### 部署步骤

1. **准备工作**

   确保每个节点上都安装了 MinIO 可执行文件，并配置好网络连接。以下示例使用 4 个节点，每个节点的 IP 分别为 
   `192.168.1.1`、`192.168.1.2`、`192.168.1.3` 和 `192.168.1.4`。

2. **启动 MinIO 服务**

   在每个节点上使用 `minio server` 命令启动 MinIO 服务，指定每个节点的数据存储路径和其他节点的地址。

   **节点 1:**

   ```bash
   ./minio server http://192.168.1.1/data http://192.168.1.2/data http://192.168.1.3/data 
   http://192.168.1.4/data
   ```

   **节点 2:**

   ```bash
   ./minio server http://192.168.1.1/data http://192.168.1.2/data http://192.168.1.3/data 
   http://192.168.1.4/data
   ```

   **节点 3:**

   ```bash
   ./minio server http://192.168.1.1/data http://192.168.1.2/data http://192.168.1.3/data 
   http://192.168.1.4/data
   ```

   **节点 4:**

   ```bash
   ./minio server http://192.168.1.1/data http://192.168.1.2/data http://192.168.1.3/data 
   http://192.168.1.4/data
   ```

3. **访问 MinIO 控制台**

   集群启动后，可以通过任意一个节点的 IP 地址访问 MinIO 控制台。例如，访问 `http://192.168.1.1:9000`，
   使用集群的访问密钥（Access Key）和密钥（Secret Key）登录。

### 配置和管理

#### 1. 配置文件

可以使用环境变量或配置文件来配置 MinIO。例如，在 `~/.minio/config.json` 文件中定义配置参数：

```json
{
    "version": "19",
    "credential": {
        "accessKey": "YOUR-ACCESS-KEY",
        "secretKey": "YOUR-SECRET-KEY"
    },
    "region": "us-east-1",
    "browser": "on",
    "logger": {
        "console": {
            "level": "error",
            "enable": true
        },
        "file": {
            "level": "error",
            "enable": true,
            "filename": "/var/log/minio.log"
        }
    },
    "notify": {
        "webhook": {
            "1": {
                "enable": true,
                "endpoint": "http://localhost:9000/minio/webhook"
            }
        }
    }
}
```

#### 2. 用户和权限管理

使用 `mc`（MinIO Client）工具管理用户和权限。

**安装 MinIO Client**

```bash
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
./mc alias set myminio http://192.168.1.1:9000 YOUR-ACCESS-KEY YOUR-SECRET-KEY
```

**添加用户和设置策略**

```bash
./mc admin user add myminio myuser mypassword
./mc admin policy set myminio readwrite user=myuser
```

### 高可用性和容灾

#### 1. 数据冗余

MinIO 使用 erasure coding 技术，将数据分片和冗余存储在多个节点上，以确保数据的高可用性和容错能力。

#### 2. 跨数据中心复制

MinIO 支持跨数据中心复制（异地备份），可以将数据复制到远程数据中心，实现异地灾备。

```bash
./mc mirror --watch /data myminio/mybucket
```

### 总结

- **单机模式**：适用于开发和测试环境，部署简单，但没有高可用性和容错能力。
- **集群模式**：适用于生产环境，通过多个节点提供高可用性和扩展性，使用 erasure coding 技术实现数据冗余，
支持跨数据中心复制以实现异地灾备。

通过以上步骤和配置，您可以根据业务需求选择合适的 MinIO 部署模式，确保系统的高效运行和数据安全。