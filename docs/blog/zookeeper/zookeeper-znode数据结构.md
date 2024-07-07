---
date: 2021-07-07
category:
  - Zookeeper 
tag:
  - 分布式管理
sticky: true
excerpt: <p> Zookeeper 客户端命令操作 </p>
---
### ZNode 学习指南

#### 1. ZNode 基本概念

- **什么是 ZNode**：ZNode 是 Zookeeper 中的数据节点。它类似于文件系统中的文件和目录，ZNode 既可以保存数据又可以作为其他 ZNode 的父节点。
- **ZNode 的路径**：每个 ZNode 在 Zookeeper 命名空间中都有一个唯一的路径，如 `/app1/config`。

#### 2. ZNode 类型

- **持久节点 (Persistent ZNode)**：当创建持久节点时，即使客户端断开连接或会话结束，节点也会一直存在，直到被明确删除。
- **临时节点 (Ephemeral ZNode)**：临时节点在创建客户端会话断开或会话过期时自动删除。
- **顺序节点 (Sequential ZNode)**：当创建顺序节点时，Zookeeper 会在节点名称末尾附加一个递增的数字，确保节点名称的唯一性。
- **持久顺序节点和临时顺序节点**：持久顺序节点和临时顺序节点分别是持久节点和临时节点的顺序变体。

#### 3. ZNode 的操作

- **创建 ZNode**：使用 `create` 命令可以创建 ZNode，可以指定节点类型（持久、临时、顺序）。
- **读取 ZNode 数据**：使用 `get` 命令可以读取 ZNode 的数据和状态。
- **更新 ZNode 数据**：使用 `set` 命令可以更新 ZNode 的数据。
- **删除 ZNode**：使用 `delete` 命令可以删除指定的 ZNode。

#### 4. ZNode 版本控制

- **数据版本**：每个 ZNode 都有一个版本号，每次更新节点数据时，版本号递增。
- **条件更新**：可以使用版本号确保数据的一致性，只有在当前版本号与指定版本号匹配时，更新才会成功。

#### 5. Watcher 机制

- **Watcher 简介**：Watcher 是一种触发器，可以在 ZNode 的数据或状态变化时通知客户端。Watchers 是一次性的，一旦触发，必须重新设置。
- **设置 Watcher**：在读取或获取 ZNode 数据时，可以设置 Watcher。例如，使用 `getData` 命令时可以设置 Watcher。
- **Watcher 通知**：当 ZNode 数据或状态发生变化时，Zookeeper 会向设置了 Watcher 的客户端发送通知。

#### 6. ZNode 的 ACL（访问控制列表）

- **ACL 概述**：ZNode 可以通过 ACL 进行访问控制，ACL 由一组权限组成，如读取、写入、创建、删除、管理。
- **设置 ACL**：在创建 ZNode 时可以设置 ACL，也可以通过 `setACL` 命令修改 ACL。
- **检查 ACL**：通过 `getACL` 命令可以查看 ZNode 的 ACL 配置。

### 示例操作

#### 创建持久节点

```java
import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.ZooDefs.Ids;

public class CreateZNode {
    private static ZooKeeper zk;
    private static ZookeeperConnection conn;

    public static void create(String path, byte[] data) throws Exception {
        zk.create(path, data, Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
    }

    public static void main(String[] args) throws Exception {
        String path = "/sampleZNode";
        byte[] data = "Sample Data".getBytes();
        
        conn = new ZookeeperConnection();
        zk = conn.connect("localhost");
        create(path, data);
        conn.close();
    }
}
```

#### 获取 ZNode 数据

```java
import org.apache.zookeeper.ZooKeeper;

public class GetZNodeData {
    private static ZooKeeper zk;
    private static ZookeeperConnection conn;

    public static byte[] getData(String path) throws Exception {
        return zk.getData(path, false, null);
    }

    public static void main(String[] args) throws Exception {
        String path = "/sampleZNode";

        conn = new ZookeeperConnection();
        zk = conn.connect("localhost");
        byte[] data = getData(path);
        System.out.println(new String(data));
        conn.close();
    }
}
```

#### 更新 ZNode 数据

```java
import org.apache.zookeeper.ZooKeeper;

public class UpdateZNodeData {
    private static ZooKeeper zk;
    private static ZookeeperConnection conn;

    public static void update(String path, byte[] data) throws Exception {
        zk.setData(path, data, zk.exists(path, true).getVersion());
    }

    public static void main(String[] args) throws Exception {
        String path = "/sampleZNode";
        byte[] data = "Updated Data".getBytes();

        conn = new ZookeeperConnection();
        zk = conn.connect("localhost");
        update(path, data);
        conn.close();
    }
}
```

#### 删除 ZNode

```java
import org.apache.zookeeper.ZooKeeper;

public class DeleteZNode {
    private static ZooKeeper zk;
    private static ZookeeperConnection conn;

    public static void delete(String path) throws Exception {
        zk.delete(path, zk.exists(path, true).getVersion());
    }

    public static void main(String[] args) throws Exception {
        String path = "/sampleZNode";

        conn = new ZookeeperConnection();
        zk = conn.connect("localhost");
        delete(path);
        conn.close();
    }
}
```

#### 设置 Watcher

```java
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher.Event.KeeperState;

public class ZNodeWatcher implements Watcher {
    private static ZooKeeper zk;
    private static ZookeeperConnection conn;

    public void process(WatchedEvent we) {
        if (we.getState() == KeeperState.SyncConnected) {
            System.out.println("ZNode data changed");
        }
    }

    public static void main(String[] args) throws Exception {
        String path = "/sampleZNode";
        
        conn = new ZookeeperConnection();
        zk = conn.connect("localhost");
        byte[] data = zk.getData(path, new ZNodeWatcher(), null);
        System.out.println(new String(data));
        conn.close();
    }
}
```

### ZNode 命令行操作示例和说明

以下是使用 Zookeeper 客户端命令行工具操作 ZNode 的常用命令及说明：

#### 启动 Zookeeper 客户端

在 Zookeeper 安装目录的 `bin` 目录下运行 `zkCli.sh` 来启动 Zookeeper 客户端：

```bash
cd /opt/zookeeper/bin
./zkCli.sh -server 192.168.0.200:2181
```

#### 创建 ZNode

在 Zookeeper 客户端中创建一个持久 ZNode：

```bash
create /sampleZNode "Sample Data"
```

- `/sampleZNode` 是 ZNode 的路径。
- `"Sample Data"` 是 ZNode 的初始数据。

#### 读取 ZNode 数据

获取 ZNode `/sampleZNode` 的数据：

```bash
get /sampleZNode
```

#### 更新 ZNode 数据

更新 ZNode `/sampleZNode` 的数据：

```bash
set /sampleZNode "Updated Data"
```

#### 删除 ZNode

删除 ZNode `/sampleZNode`：

```bash
delete /sampleZNode
```

#### 设置 Watcher

在读取 ZNode 数据时设置 Watcher：

```bash
get /sampleZNode true
```

当 ZNode `/sampleZNode` 的数据发生变化时，客户端会收到通知。

#### 检查 ZNode 的状态

查看 ZNode `/sampleZNode` 的状态信息：

```bash
stat /sampleZNode
```

### Java Maven 项目依赖

在 Maven 项目中使用 Zookeeper 的 Java API 需要添加相关依赖。以下是 Maven 项目的 `pom.xml` 中添加 Zookeeper 依赖的示例：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>zookeeper-example</artifactId>
    <version>1.0-SNAPSHOT</version>
    <dependencies>
        <dependency>
            <groupId>org.apache.zookeeper</groupId>
            <artifactId>zookeeper</artifactId>
            <version>3.8.0</version>
        </dependency>
        <!-- 其他依赖可以在这里添加 -->
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### Java 操作 ZNode 示例

以下是一个完整的 Java 示例，展示了如何使用 Zookeeper 的 Java API 创建、读取、更新和删除 ZNode：

#### 连接 Zookeeper 的帮助类

```java
import org.apache.zookeeper.ZooKeeper;
import java.io.IOException;

public class ZookeeperConnection {
    private ZooKeeper zoo;

    public ZooKeeper connect(String host) throws IOException, InterruptedException {
        zoo = new ZooKeeper(host, 5000, watchedEvent -> {});
        return zoo;
    }

    public void close() throws InterruptedException {
        zoo.close();
    }
}
```

#### 创建 ZNode 的示例

```java
import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.ZooDefs.Ids;
import org.apache.zookeeper.ZooKeeper;

public class CreateZNode {
    private static ZooKeeper zk;
    private static ZookeeperConnection conn;

    public static void create(String path, byte[] data) throws Exception {
        zk.create(path, data, Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
    }

    public static void main(String[] args) throws Exception {
        String path = "/sampleZNode";
        byte[] data = "Sample Data".getBytes();
        
        conn = new ZookeeperConnection();
        zk = conn.connect("localhost");
        create(path, data);
        conn.close();
    }
}
```

#### 获取 ZNode 数据的示例

```java
import org.apache.zookeeper.ZooKeeper;

public class GetZNodeData {
    private static ZooKeeper zk;
    private static ZookeeperConnection conn;

    public static byte[] getData(String path) throws Exception {
        return zk.getData(path, false, null);
    }

    public static void main(String[] args) throws Exception {
        String path = "/sampleZNode";

        conn = new ZookeeperConnection();
        zk = conn.connect("localhost");
        byte[] data = getData(path);
        System.out.println(new String(data));
        conn.close();
    }
}
```

#### 更新 ZNode 数据的示例

```java
import org.apache.zookeeper.ZooKeeper;

public class UpdateZNodeData {
    private static ZooKeeper zk;
    private static ZookeeperConnection conn;

    public static void update(String path, byte[] data) throws Exception {
        zk.setData(path, data, zk.exists(path, true).getVersion());
    }

    public static void main(String[] args) throws Exception {
        String path = "/sampleZNode";
        byte[] data = "Updated Data".getBytes();

        conn = new ZookeeperConnection();
        zk = conn.connect("localhost");
        update(path, data);
        conn.close();
    }
}
```

#### 删除 ZNode 的示例

```java
import org.apache.zookeeper.ZooKeeper;

public class DeleteZNode {
    private static ZooKeeper zk;
    private static ZookeeperConnection conn;

    public static void delete(String path) throws Exception {
        zk.delete(path, zk.exists(path, true).getVersion());
    }

    public static void main(String[] args) throws Exception {
        String path = "/sampleZNode";

        conn = new ZookeeperConnection();
        zk = conn.connect("localhost");
        delete(path);
        conn.close();
    }
}
```

#### 设置 Watcher 的示例

```java
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher.Event.KeeperState;

public class ZNodeWatcher implements Watcher {
    private static ZooKeeper zk;
    private static ZookeeperConnection conn;

    public void process(WatchedEvent we) {
        if (we.getState() == KeeperState.SyncConnected) {
            System.out.println("ZNode data changed");
        }
    }

    public static void main(String[] args) throws Exception {
        String path = "/sampleZNode";
        
        conn = new ZookeeperConnection();
        zk = conn.connect("localhost");
        byte[] data = zk.getData(path, new ZNodeWatcher(), null);
        System.out.println(new String(data));
        conn.close();
    }
}
```

通过这些示例和 Maven 项目配置，您可以快速上手 Zookeeper 的 Java API 并进行各种操作，包括创建、读取、更新和删除 ZNode。

### 参考资源

- [Zookeeper 官方文档](https://zookeeper.apache.org/doc/current/)
- 《Zookeeper: Distributed Process Coordination》
- [Zookeeper Java API](https://zookeeper.apache.org/doc/r3.6.2/api/index.html)
