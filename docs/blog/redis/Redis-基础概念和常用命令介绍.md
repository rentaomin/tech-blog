---
date: 2024-07-13
category:
  - Redis 
tag:
  - 缓存中间件
sticky: true
excerpt: <p> Redis 基础概念和常用命令介绍 </p>
---
# Redis 基础概念和常用命令介绍

Redis 是一个开源的高性能键值数据库，支持多种数据结构，常用于缓存、消息队列、会话存储等场景。
下面是 Redis 的一些基础概念和常用命令。

### 基础概念

1. **键值对存储（Key-Value Store）**：
    - Redis 以键值对的形式存储数据，每个键值对可以是字符串、哈希、列表、集合、有序集合等
      数据结构。

2. **数据结构**：
    - **字符串（String）**：二进制安全的字符串，可以存储任何类型的数据。
    - **哈希（Hash）**：用于存储键值对集合，适合存储对象。
    - **列表（List）**：双向链表，可以存储多个有序的字符串。
    - **集合（Set）**：无序集合，存储唯一的字符串。
    - **有序集合（Sorted Set）**：类似集合，但每个元素都会关联一个评分，用于排序。

3. **持久化**：
    - **RDB（Redis Database File）**：将数据定期快照保存到磁盘。
    - **AOF（Append Only File）**：记录每个写操作日志，可以通过重放日志恢复数据。

4. **复制**：
    - 支持主从复制（Master-Slave Replication），实现数据冗余和读写分离。

5. **哨兵（Sentinel）**：
    - 用于监控 Redis 实例，自动执行故障转移，实现高可用。

6. **集群（Cluster）**：
    - 实现数据分片和水平扩展，支持大规模数据存储和高并发访问。

### 常用命令

#### 字符串（String）

- **SET key value**：设置键的值。
  ```sh
  SET mykey "Hello"
  ```

- **GET key**：获取键的值。
  ```sh
  GET mykey
  ```

- **INCR key**：将键的值增一。
  ```sh
  INCR mycounter
  ```

- **DECR key**：将键的值减一。
  ```sh
  DECR mycounter
  ```

- **MSET key value [key value ...]**：批量设置多个键值对。
  ```sh
  MSET key1 "Hello" key2 "World"
  ```

- **MGET key [key ...]**：批量获取多个键的值。
  ```sh
  MGET key1 key2
  ```

#### 哈希（Hash）

- **HSET key field value**：设置哈希表中的字段值。
  ```sh
  HSET myhash field1 "Hello"
  ```

- **HGET key field**：获取哈希表中的字段值。
  ```sh
  HGET myhash field1
  ```

- **HGETALL key**：获取哈希表中的所有字段和值。
  ```sh
  HGETALL myhash
  ```

- **HMSET key field value [field value ...]**：批量设置哈希表中的多个字段值。
  ```sh
  HMSET myhash field1 "Hello" field2 "World"
  ```

- **HMGET key field [field ...]**：批量获取哈希表中的多个字段值。
  ```sh
  HMGET myhash field1 field2
  ```

#### 列表（List）

- **LPUSH key value [value ...]**：将一个或多个值插入列表头部。
  ```sh
  LPUSH mylist "World"
  LPUSH mylist "Hello"
  ```

- **RPUSH key value [value ...]**：将一个或多个值插入列表尾部。
  ```sh
  RPUSH mylist "Hello"
  RPUSH mylist "World"
  ```

- **LPOP key**：移除并返回列表头部的元素。
  ```sh
  LPOP mylist
  ```

- **RPOP key**：移除并返回列表尾部的元素。
  ```sh
  RPOP mylist
  ```

- **LRANGE key start stop**：获取列表中指定范围的元素。
  ```sh
  LRANGE mylist 0 -1
  ```

#### 集合（Set）

- **SADD key member [member ...]**：向集合添加一个或多个成员。
  ```sh
  SADD myset "Hello"
  SADD myset "World"
  ```

- **SMEMBERS key**：获取集合中的所有成员。
  ```sh
  SMEMBERS myset
  ```

- **SISMEMBER key member**：判断成员是否存在于集合中。
  ```sh
  SISMEMBER myset "Hello"
  ```

- **SREM key member [member ...]**：移除集合中的一个或多个成员。
  ```sh
  SREM myset "Hello"
  ```

#### 有序集合（Sorted Set）

- **ZADD key score member [score member ...]**：向有序集合添加一个或多个成员，或者更新
    已存在成员的分数。
  ```sh
  ZADD myzset 1 "one"
  ZADD myzset 2 "two"
  ```

- **ZRANGE key start stop [WITHSCORES]**：返回有序集合中指定区间内的成员，通过索引，分数从 
    低到高。
  ```sh
  ZRANGE myzset 0 -1 WITHSCORES
  ```

- **ZRANK key member**：返回有序集合中成员的索引，分数从低到高。
  ```sh
  ZRANK myzset "one"
  ```

- **ZREM key member [member ...]**：移除有序集合中的一个或多个成员。
  ```sh
  ZREM myzset "one"
  ```

### 连接和配置命令

- **PING**：测试连接是否成功。
  ```sh
  PING
  ```

- **AUTH password**：密码认证。
  ```sh
  AUTH mypassword
  ```

- **SELECT index**：切换到指定的数据库。
  ```sh
  SELECT 1
  ```

- **FLUSHDB**：清空当前数据库中的所有键。
  ```sh
  FLUSHDB
  ```

- **FLUSHALL**：清空所有数据库中的所有键。
  ```sh
  FLUSHALL
  ```

- **CONFIG GET parameter**：获取配置参数的值。
  ```sh
  CONFIG GET maxmemory
  ```

- **CONFIG SET parameter value**：设置配置参数的值。
  ```sh
  CONFIG SET maxmemory 128mb
  ```

### 监控和调试命令

- **INFO**：获取 Redis 服务器的信息和统计数据。
  ```sh
  INFO
  ```

- **MONITOR**：实时监控 Redis 服务器接收到的命令。
  ```sh
  MONITOR
  ```

- **SLOWLOG**：查看慢查询日志。
  ```sh
  SLOWLOG GET
  ```

### 总结

以上介绍了 Redis 的基础概念和常用命令。通过掌握这些内容，可以高效地使用 Redis 进行各种数据操作。
随着对 Redis 的深入了解，还可以进一步学习其高级特性和优化技巧，以充分发挥 Redis 的性能优势。