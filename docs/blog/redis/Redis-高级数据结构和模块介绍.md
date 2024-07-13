---
date: 2024-07-13
category:
  - Redis 
tag:
  - 缓存中间件
sticky: true
excerpt: <p> Redis 高级数据结构介绍</p>
---
# Redis 高级数据结构和模块介绍

Redis 不仅支持基本的数据结构（如字符串、哈希、列表、集合和有序集合），还提供了一些高级数据结构和模块，
扩展了它的功能，能够满足更多复杂的应用需求。以下是 Redis 的一些高级数据结构和模块：

### 高级数据结构

#### 1. HyperLogLog
- **用途**：用于基数统计，例如计算唯一用户数、唯一 IP 数等。
- **特点**：占用内存固定且小（通常为 12KB），适用于近似基数统计，允许少量误差。
- **常用命令**：
    - `PFADD key element [element ...]`：添加元素到 HyperLogLog。
      ```sh
      PFADD myhll "foo" "bar" "zap"
      ```
    - `PFCOUNT key [key ...]`：返回 HyperLogLog 中唯一元素的近似基数。
      ```sh
      PFCOUNT myhll
      ```
    - `PFMERGE destkey sourcekey [sourcekey ...]`：将多个 HyperLogLog 合并为一个。
      ```sh
      PFMERGE myhll2 myhll1 myhll
      ```

#### 2. Bitmaps
- **用途**：用于处理位级别的数据操作，例如用户活跃状态、签到系统等。
- **特点**：可以将字符串看作二进制位数组，进行位操作。
- **常用命令**：
    - `SETBIT key offset value`：设置字符串 key 的 offset 处的位值。
      ```sh
      SETBIT mykey 7 1
      ```
    - `GETBIT key offset`：获取字符串 key 的 offset 处的位值。
      ```sh
      GETBIT mykey 7
      ```
    - `BITCOUNT key [start end]`：计算字符串中值为 1 的位的数量。
      ```sh
      BITCOUNT mykey
      ```

#### 3. Geospatial
- **用途**：用于存储和操作地理空间数据，例如位置存储、距离计算、附近查询等。
- **特点**：提供专门的命令来处理经纬度信息。
- **常用命令**：
    - `GEOADD key longitude latitude member [longitude latitude member ...]`：
     添加地理空间元素。
      ```sh
      GEOADD mygeo 13.361389 38.115556 "Palermo"
      ```
    - `GEODIST key member1 member2 [unit]`：计算两个地理空间元素之间的距离。
      ```sh
      GEODIST mygeo "Palermo" "Catania"
      ```
      - `GEORADIUS key longitude latitude radius unit [WITHCOORD] [WITHDIST] 
      [WITHHASH] [COUNT count] [ASC|DESC] [STORE key] [STOREDIST key]`：查询指定范围
      内的地理空间元素。
        ```sh
        GEORADIUS mygeo 15 37 200 km
        ```

### 模块

Redis 模块是扩展 Redis 功能的一种方式，允许用户根据需要添加新的数据类型和命令。以下是一些常见
的 Redis 模块：

#### 1. RedisJSON
- **用途**：用于存储和操作 JSON 数据。
- **特点**：支持对 JSON 文档的部分更新和查询，提供丰富的命令集。
- **常用命令**：
    - `JSON.SET key path value`：设置 JSON 文档的某个路径的值。
      ```sh
      JSON.SET myjson . '{"name":"John", "age":30}'
      ```
    - `JSON.GET key [path]`：获取 JSON 文档或其某个路径的值。
      ```sh
      JSON.GET myjson .name
      ```

#### 2. RedisSearch
- **用途**：提供全文搜索和二次过滤功能。
- **特点**：支持索引文本字段、数字字段和地理位置字段，提供全文搜索、高亮、自动完成等功能。
- **常用命令**：
    - `FT.CREATE index [ON HASH|JSON] SCHEMA field1 type1 [OPTIONS] field2
  type2 [OPTIONS] ...`：创建索引。
      ```sh
      FT.CREATE myindex ON HASH SCHEMA title TEXT WEIGHT 5.0 body TEXT url TEXT
      ```
    - `FT.SEARCH index query [NOCONTENT] [VERBATIM] [NOSTOPWORDS] [WITHSCORES] 
  [WITHPAYLOADS] [WITHSORTKEYS] [FILTER field min max] [GEOFILTER field lon 
  lat radius m|km|mi|ft] [INKEYS num key ...] [INFIELDS num field ...] 
  [RETURN num field ...] [SUMMARIZE [FIELDS field ...] [FRAGS num] [LEN num]
  [SEPARATOR sep]] [HIGHLIGHT [FIELDS field ...] [TAGS open close]] [SLOP slop] 
  [INORDER] [LANGUAGE lang] [EXPANDER expander] [SCORER scorer] [EXPLAINSCORE] 
  [PAYLOAD payload] [SORTBY field [ASC|DESC]] [LIMIT offset num]`：搜索索引。
      ```sh
      FT.SEARCH myindex "hello world"
      ```

#### 3. RedisGraph
- **用途**：提供图数据库功能。
- **特点**：使用 Cypher 查询语言，支持高效的图遍历和路径查询。
- **常用命令**：
    - `GRAPH.QUERY graph query [timeout]`：执行图查询。
      ```sh
      GRAPH.QUERY social "MATCH (a:person)-[:friend]->(b:person) RETURN a.name, b.name"
      ```

#### 4. RedisTimeSeries
- **用途**：用于存储和操作时间序列数据。
- **特点**：支持时间序列数据的插入、查询、聚合和压缩。
- **常用命令**：
    - `TS.CREATE key [RETENTION retention] [LABELS label value ...]`：创建时间序列。
      ```sh
      TS.CREATE temperature:3:11 RETENTION 3600 LABELS sensor_id 3 area_id 11
      ```
    - `TS.ADD key timestamp value [RETENTION retention] [LABELS label value ...]`：
    添加数据点到时间序列。
      ```sh
      TS.ADD temperature:3:11 1609459200000 23.1
      ```
    - `TS.RANGE key fromTimestamp toTimestamp [FILTER_BY_TS timestamp ...] 
  [FILTER_BY_VALUE min max] [COUNT count] [ALIGN timestamp] [AGGREGATION aggregationType 
   timeBucket]`：查询时间范围内的数据点。
      ```sh
      TS.RANGE temperature:3:11 1609459200000 1609545600000
      ```

### 结论

通过掌握 Redis 的高级数据结构和模块，架构师可以利用 Redis 实现更复杂的数据操作和应用场景。例如，使用 
HyperLogLog 进行基数统计，使用 Bitmaps 实现用户行为记录，使用 Geospatial 进行地理位置计算，使用 
RedisJSON 存储和操作 JSON 数据，使用 RedisSearch 实现全文搜索，使用 RedisGraph 构建图数据库，
使用 RedisTimeSeries 处理时间序列数据。通过这些高级功能，Redis 可以满足更多复杂的应用需求，提升系统
的性能和可靠性。