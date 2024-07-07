---
date: 2021-07-07
category:
  - Kafka
tag:
  - 消息队列
sticky: true
excerpt: <p>Kafka 集群原理设计分析</p>
---
# kafka 的单机、集群部署安装

Kafka 的部署可以分为单机部署和集群部署。以下是详细的单机和集群部署步骤。

### 单机部署 Kafka

单机部署 Kafka 通常用于开发和测试环境。下文中涉及相关端口，若开启防火墙则需要开放对应的端口，
以下是详细步骤：

#### 1. 安装 Java
Kafka 依赖于 Java 环境，因此需要先安装 Java。

```sh
# 安装 Java
sudo apt update
sudo apt install default-jdk
```

#### 2. 下载 Kafka

从 [Apache Kafka 官方网站](https://kafka.apache.org/downloads) 下载 Kafka 二进制文件。

```sh
wget https://dlcdn.apache.org/kafka/3.7.0/kafka_2.13-3.7.0.tgz
tar -xzf kafka_2.13-3.7.0.tgz
cd kafka_2.13-3.7.0
```

#### 3. 启动 ZooKeeper

Kafka 依赖于 ZooKeeper 进行协调，因此需要先启动 ZooKeeper。Kafka 提供了一个内置的 
ZooKeeper 脚本。

```sh
# 启动 ZooKeeper ，该安装步骤可参考之前的文章 zookeeper 安装教程
bin/zookeeper-server-start.sh config/zookeeper.properties
```

#### 4. 启动 Kafka Broker

在启动 ZooKeeper 后，启动 Kafka Broker。

```sh
# 启动 Kafka Broker
bin/kafka-server-start.sh config/server.properties
```

#### 5. 创建 Topic

启动 Kafka 后，可以创建一个 Topic。

```sh
# 创建一个名为 "test" 的 Topic
bin/kafka-topics.sh --create --topic test --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
```

#### 6. 生产者发送消息

启动一个 Kafka 生产者并发送消息。

```sh
# 启动 Kafka 生产者
bin/kafka-console-producer.sh --topic test --bootstrap-server localhost:9092
# 在生产者控制台输入消息并按回车发送
```

#### 7. 消费者消费消息

启动一个 Kafka 消费者并接收消息。

```sh
# 启动 Kafka 消费者
bin/kafka-console-consumer.sh --topic test --from-beginning --bootstrap-server localhost:9092
```

### 集群部署 Kafka

集群部署 Kafka 通常用于生产环境，以实现高可用性和高吞吐量。以下是详细步骤：

#### 1. 准备环境

假设我们有三台机器：`kafka1`, `kafka2`, `kafka3`。

#### 2. 安装 Java

在每台机器上安装 Java。

```sh
# 安装 Java
sudo apt update
sudo apt install default-jdk
```

#### 3. 下载 Kafka

在每台机器上下载 Kafka 二进制文件。

```sh
wget https://dlcdn.apache.org/kafka/3.7.0/kafka_2.13-3.7.0.tgz
tar -xzf kafka_2.13-3.7.0.tgz
cd kafka_2.13-3.7.0
```

#### 4. 配置 ZooKeeper

在每台机器上编辑 `config/zookeeper.properties` 文件，确保每个 ZooKeeper 节点都有唯一的 ID。

**kafka1** 的 `zookeeper.properties`：

```properties
tickTime=2000
dataDir=/var/lib/zookeeper
clientPort=2181
initLimit=5
syncLimit=2
server.1=kafka1:2888:3888
server.2=kafka2:2888:3888
server.3=kafka3:2888:3888
```

在 `dataDir` 目录下创建一个 `myid` 文件，文件内容为该节点的 ID，例如 `kafka1` 的 `myid` 文件内容为 `1`。

```sh
echo "1" > /var/lib/zookeeper/myid
```

**kafka2** 和 **kafka3** 的 `zookeeper.properties` 文件类似，`myid` 文件内容分别为 `2` 和 `3`，kafka1、kafka2、kafka3为对应的部署机器ip地址或域名

#### 5. 启动 ZooKeeper 集群

在每台机器上启动 ZooKeeper。

```sh
# 启动 ZooKeeper
bin/zookeeper-server-start.sh config/zookeeper.properties
```

#### 6. 配置 Kafka Broker

在每台机器上编辑 `config/server.properties` 文件，配置 Kafka Broker。

**kafka1** 的 `server.properties`：

```properties
broker.id=1
listeners=PLAINTEXT://kafka1:9092
log.dirs=/var/lib/kafka
zookeeper.connect=kafka1:2181,kafka2:2181,kafka3:2181
```

**kafka2** 和 **kafka3** 的 `server.properties` 文件类似，`broker.id` 分别为 `2` 和 `3`。

#### 7. 启动 Kafka Broker 集群

在每台机器上启动 Kafka Broker。

```sh
# 启动 Kafka Broker
bin/kafka-server-start.sh config/server.properties
```

#### 8. 创建 Topic

在任意一台机器上创建一个 Topic。

```sh
# 创建一个名为 "test" 的 Topic
bin/kafka-topics.sh --create --topic test --bootstrap-server kafka1:9092 --partitions 3 --replication-factor 3
```

#### 9. 生产者发送消息

启动一个 Kafka 生产者并发送消息。

```sh
# 启动 Kafka 生产者
bin/kafka-console-producer.sh --topic test --bootstrap-server kafka1:9092
# 在生产者控制台输入消息并按回车发送
```

#### 10. 消费者消费消息

启动一个 Kafka 消费者并接收消息。

```sh
# 启动 Kafka 消费者
bin/kafka-console-consumer.sh --topic test --from-beginning --bootstrap-server kafka1:9092
```

### 总结

通过上述步骤，可以完成 Kafka 的单机和集群部署。单机部署适用于开发和测试环境，而集群部署适用于生产环境，能够提供高可用性和高吞吐量。作为架构师，掌握这些基本部署和配置步骤，对于设计和维护 Kafka 系统至关重要。