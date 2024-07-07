---
date: 2021-07-07
category:
  - Zookeeper 
tag:
  - 分布式管理
sticky: true
excerpt: <p> Zookeeper 客户端命令操作 </p>
---
### 环境说明
以下是 Zookeeper 3.8 在三台机器（IP 分别为 192.168.0.200、192.168.0.201、
192.168.0.202）上部署 集群模式的详细指导。操作系统为 RedHat 8.2。

### 前提条件

1. 确保所有机器上已经安装了 Java 环境（JDK 8 或以上）。
2. 确保所有机器之间的网络连接正常。

### 步骤 1：在每台机器上下载并解压 Zookeeper

1. 登录到每台机器。

2. 下载 Zookeeper 3.8 并解压：

   ```bash
   wget https://downloads.apache.org/zookeeper/stable/apache-zookeeper-3.8.0-bin.tar.gz
   tar -xzf apache-zookeeper-3.8.0-bin.tar.gz
   mv apache-zookeeper-3.8.0-bin /opt/zookeeper
   ```

### 步骤 2：配置 Zookeeper

1. 在每台机器上，进入 Zookeeper 目录并复制示例配置文件：

   ```bash
   cd /opt/zookeeper
   cp conf/zoo_sample.cfg conf/zoo.cfg
   ```

2. 编辑 `conf/zoo.cfg` 文件，确保内容如下：

   ```properties
   tickTime=2000
   initLimit=10
   syncLimit=5
   dataDir=/var/lib/zookeeper
   dataLogDir=/var/log/zookeeper
   clientPort=2181
   server.1=192.168.0.200:2888:3888
   server.2=192.168.0.201:2888:3888
   server.3=192.168.0.202:2888:3888
   4lw.commands.whitelist=*
   ```

### 步骤 3：创建数据和日志目录

1. 在每台机器上，创建数据目录和日志目录，并设置权限：

   ```bash
   mkdir -p /var/lib/zookeeper
   mkdir -p /var/log/zookeeper
   ```

### 步骤 4：配置 myid 文件

1. 在每台机器的 `dataDir` 目录中创建 `myid` 文件。根据每台机器的 IP 地址，写入对应的 ID：

   - 在 `192.168.0.200` 上：

     ```bash
     echo "1" > /var/lib/zookeeper/myid
     ```

   - 在 `192.168.0.201` 上：

     ```bash
     echo "2" > /var/lib/zookeeper/myid
     ```

   - 在 `192.168.0.202` 上：

     ```bash
     echo "3" > /var/lib/zookeeper/myid
     ```

### 步骤 5：启动 Zookeeper 服务

1. 在每台机器上启动 Zookeeper 服务：

   ```bash
   cd /opt/zookeeper
   bin/zkServer.sh start
   ```

2. 验证 Zookeeper 服务状态：

   ```bash
   bin/zkServer.sh status
   ```

### 步骤 6：防火墙配置

1. 在每台机器上，确保防火墙允许 Zookeeper 所使用的端口（2181、2888、3888）进行通信：

   ```bash
   sudo firewall-cmd --permanent --add-port=2181/tcp
   sudo firewall-cmd --permanent --add-port=2888/tcp
   sudo firewall-cmd --permanent --add-port=3888/tcp
   sudo firewall-cmd --reload
   ```

### 步骤 7：验证 Zookeeper 集群

1. 使用 Zookeeper 客户端工具连接到集群并验证集群状态。在任何一台机器上执行以下命令：

   ```bash
   cd /opt/zookeeper
   bin/zkCli.sh -server 192.168.0.200:2181
   ```

2. 在 Zookeeper CLI 中，运行以下命令查看集群状态：

   ```bash
   stat
   ```

   您应该能看到 Leader 和 Follower 的信息，表明集群已经成功启动并运行。

### 示例配置文件

以下是完整的 `zoo.cfg` 配置文件示例：

```properties
tickTime=2000
initLimit=10
syncLimit=5
dataDir=/var/lib/zookeeper
dataLogDir=/var/log/zookeeper
clientPort=2181
server.1=192.168.0.200:2888:3888
server.2=192.168.0.201:2888:3888
server.3=192.168.0.202:2888:3888
4lw.commands.whitelist=*
```

### 完成后的检查和维护

1. **日志检查**：
   - 查看 Zookeeper 日志文件，确保没有错误或警告。日志文件通常位于 `dataLogDir` 目录中，例如 `/var/log/zookeeper/zookeeper.out`。

2. **健康检查**：
   - 定期检查集群的健康状态，确保所有节点都在正常运行。

3. **配置管理**：
   - 确保所有节点上的配置文件一致。如果需要更新配置，确保同步更新所有节点。

通过上述步骤，您可以成功部署并配置一个 Zookeeper 集群，以便为分布式应用提供可靠的协调服务。