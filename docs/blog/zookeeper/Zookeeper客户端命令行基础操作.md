---
date: 2021-07-07
category:
  - Zookeeper 
tag:
  - 分布式管理
sticky: true
excerpt: <p> Zookeeper 客户端命令操作 </p>
---
# Zookeeper 客户端命令行基础操作

在 Zookeeper 客户端命令行中，可以使用 `create` 
命令创建不同类型的节点。以下是如何创建临时节点、顺序节点、
临时顺序节点和持久顺序节点的示例：

### 连接到 Zookeeper 客户端

首先，连接到 Zookeeper 客户端：

```bash
cd /opt/zookeeper/bin
./zkCli.sh -server 192.168.0.200:2181
```

### 创建不同类型的节点

#### 创建持久节点（Persistent ZNode）

```bash
create /persistentNode "Persistent Node Data"
```

#### 创建临时节点（Ephemeral ZNode）

```bash
create -e /ephemeralNode "Ephemeral Node Data"
```

#### 创建顺序节点（Sequential ZNode）

```bash
create -s /sequentialNode "Sequential Node Data"
```

#### 创建临时顺序节点（Ephemeral Sequential ZNode）

```bash
create -e -s /ephemeralSequentialNode "Ephemeral Sequential Node Data"
```

#### 创建持久顺序节点（Persistent Sequential ZNode）

```bash
create -s /persistentSequentialNode "Persistent Sequential Node Data"
```

### 示例操作

#### 创建持久节点

```bash
create /persistentNode "Persistent Node Data"
```

输出：

```
Created /persistentNode
```

#### 创建临时节点

```bash
create -e /ephemeralNode "Ephemeral Node Data"
```

输出：

```
Created /ephemeralNode
```

#### 创建顺序节点

```bash
create -s /sequentialNode "Sequential Node Data"
```

输出：

```
Created /sequentialNode0000000000
```

#### 创建临时顺序节点

```bash
create -e -s /ephemeralSequentialNode "Ephemeral Sequential Node Data"
```

输出：

```
Created /ephemeralSequentialNode0000000000
```

#### 创建持久顺序节点

```bash
create -s /persistentSequentialNode "Persistent Sequential Node Data"
```

输出：

```
Created /persistentSequentialNode0000000000
```

### 说明

- `create /persistentNode "Persistent Node Data"`：创建一个持久节点 `/persistentNode`，存储数据为 `"Persistent Node Data"`。
- `create -e /ephemeralNode "Ephemeral Node Data"`：创建一个临时节点 `/ephemeralNode`，存储数据为 `"Ephemeral Node Data"`。
- `create -s /sequentialNode "Sequential Node Data"`：创建一个顺序节点 `/sequentialNode`，Zookeeper 会在节点名称末尾附加一个递增的数字，如 `/sequentialNode0000000000`。
- `create -e -s /ephemeralSequentialNode "Ephemeral Sequential Node Data"`：创建一个临时顺序节点 `/ephemeralSequentialNode`，Zookeeper 会在节点名称末尾附加一个递增的数字，如 `/ephemeralSequentialNode0000000000`。
- `create -s /persistentSequentialNode "Persistent Sequential Node Data"`：创建一个持久顺序节点 `/persistentSequentialNode`，Zookeeper 会在节点名称末尾附加一个递增的数字，如 `/persistentSequentialNode0000000000`。

通过这些命令，您可以在 Zookeeper 客户端中创建不同类型的 ZNode 以满足不同的需求。

## Zookeeper Acl 权限管控操作

在 Zookeeper 中，ACL（访问控制列表）用于控制对 ZNode 的访问权限。ACL 由身份和权限组成，权限可
以包括读取、写入、创建、删除、管理等操作。以下是如何在 Zookeeper 客户端命令行中设置 ACL 的示例：

### ACL 权限

Zookeeper 中的权限包括：

- **CREATE (c)**：创建子节点的权限。
- **READ (r)**：读取节点数据和子节点列表的权限。
- **WRITE (w)**：设置节点数据的权限。
- **DELETE (d)**：删除子节点的权限。
- **ADMIN (a)**：设置和获取 ACL 的权限。

### 连接到 Zookeeper 客户端

首先，连接到 Zookeeper 客户端：

```bash
cd /opt/zookeeper/bin
./zkCli.sh -server 192.168.0.200:2181
```

### 创建 ZNode 并设置 ACL

#### 创建节点并设置 `world` ACL

`world` ACL 是 Zookeeper 中最常见的 ACL 模式，它不需要认证，所有客户端都可以访问。以下命令
创建一个持久节点并设置 `world` ACL，允许所有权限：

```bash
create /exampleNode "exampleData" world:anyone:cdrwa
```

#### 创建节点并设置 `auth` ACL

`auth` ACL 使用客户端的认证信息。以下命令创建一个持久节点并设置 `auth` ACL：

首先，添加认证信息：

```bash
addauth digest user1:password1
```

然后，创建节点并设置 `auth` ACL：

```bash
create /authNode "authData" auth:user1:cdrwa
```

#### 创建节点并设置 `digest` ACL

`digest` ACL 使用用户名和密码进行认证，采用 MD5 哈希。以下命令创建一个持久节点并设置 `digest` ACL：

首先，添加认证信息：

```bash
addauth digest user2:password2
```

然后，创建节点并设置 `digest` ACL：

```bash
create /digestNode "digestData" digest:user2:password2:cdrwa
```

#### 创建节点并设置 `ip` ACL

`ip` ACL 通过 IP 地址进行访问控制。以下命令创建一个持久节点并设置 `ip` ACL：

```bash
create /ipNode "ipData" ip:192.168.0.200:cdrwa
```

### 修改节点的 ACL

您可以使用 `setAcl` 命令修改现有节点的 ACL。

#### 修改节点的 `world` ACL

将 `/exampleNode` 的 ACL 修改为仅允许读取：

```bash
setAcl /exampleNode world:anyone:r
```

#### 修改节点的 `auth` ACL

将 `/authNode` 的 ACL 修改为仅允许创建和读取：

```bash
setAcl /authNode auth:user1:cr
```

### 查看节点的 ACL

使用 `getAcl` 命令查看节点的 ACL。

#### 查看 `/exampleNode` 的 ACL

```bash
getAcl /exampleNode
```

输出示例：

```
'world,'anyone
: r
```

#### 查看 `/authNode` 的 ACL

```bash
getAcl /authNode
```

输出示例：

```
'digest,'user1:************************
: cr
```

### 示例操作

#### 创建节点并设置 ACL

1. **创建具有 `world` ACL 的节点**：

   ```bash
   create /exampleNode "exampleData" world:anyone:cdrwa
   ```

2. **创建具有 `auth` ACL 的节点**：

   ```bash
   addauth digest user1:password1
   create /authNode "authData" auth:user1:cdrwa
   ```

3. **创建具有 `digest` ACL 的节点**：

   ```bash
   addauth digest user2:password2
   create /digestNode "digestData" digest:user2:password2:cdrwa
   ```

4. **创建具有 `ip` ACL 的节点**：

   ```bash
   create /ipNode "ipData" ip:192.168.0.200:cdrwa
   ```

#### 修改节点 ACL

1. **修改 `/exampleNode` 的 ACL**：

   ```bash
   setAcl /exampleNode world:anyone:r
   ```

2. **修改 `/authNode` 的 ACL**：

   ```bash
   setAcl /authNode auth:user1:cr
   ```

#### 查看节点 ACL

1. **查看 `/exampleNode` 的 ACL**：

   ```bash
   getAcl /exampleNode
   ```

2. **查看 `/authNode` 的 ACL**：

   ```bash
   getAcl /authNode
   ```

通过这些命令，您可以在 Zookeeper 中设置和管理 ZNode 的 ACL，从而控制对 ZNode 的访问权限。
这些操作对于确保数据安全和管理分布式系统中的权限至关重要。

### 设置权限后如何访问验证

要验证设置的 ACL（访问控制列表）权限，您可以通过以下步骤进行验证。
以下示例演示了如何验证不同类型的 ACL 设置。

### 1. 验证 `world` ACL

`world` ACL 允许任何人访问。

#### 创建具有 `world` ACL 的节点

```bash
create /exampleNode "exampleData" world:anyone:cdrwa
```

#### 验证 `world` ACL 的访问权限

1. **读取节点数据**（任何人都可以读取）：

    ```bash
    get /exampleNode
    ```

    输出示例：

    ```
    exampleData
    ```

2. **更新节点数据**（任何人都可以更新）：

    ```bash
    set /exampleNode "newExampleData"
    ```

3. **验证更新**：

    ```bash
    get /exampleNode
    ```

    输出示例：

    ```
    newExampleData
    ```

### 2. 验证 `auth` ACL

`auth` ACL 需要客户端进行认证。

#### 创建具有 `auth` ACL 的节点

1. 添加认证信息：

    ```bash
    addauth digest user1:password1
    ```

2. 创建节点并设置 `auth` ACL：

    ```bash
    create /authNode "authData" auth:user1:cdrwa
    ```

#### 验证 `auth` ACL 的访问权限

1. **验证未认证的访问**（未认证的客户端无法访问）：

    ```bash
    get /authNode
    ```

    输出示例：

    ```
    Authentication is not valid : /authNode
    ```

2. **验证认证后的访问**：

    - 添加认证信息：

        ```bash
        addauth digest user1:password1
        ```

    - 读取节点数据：

        ```bash
        get /authNode
        ```

        输出示例：

        ```
        authData
        ```

3. **更新节点数据**：

    ```bash
    set /authNode "newAuthData"
    ```

4. **验证更新**：

    ```bash
    get /authNode
    ```

    输出示例：

    ```
    newAuthData
    ```

### 3. 验证 `digest` ACL

`digest` ACL 使用用户名和密码进行认证。

#### 创建具有 `digest` ACL 的节点

1. 添加认证信息：

    ```bash
    addauth digest user2:password2
    ```

2. 创建节点并设置 `digest` ACL：

    ```bash
    create /digestNode "digestData" digest:user2:password2:cdrwa
    ```

#### 验证 `digest` ACL 的访问权限

1. **验证未认证的访问**（未认证的客户端无法访问）：

    ```bash
    get /digestNode
    ```

    输出示例：

    ```
    Authentication is not valid : /digestNode
    ```

2. **验证认证后的访问**：

    - 添加认证信息：

        ```bash
        addauth digest user2:password2
        ```

    - 读取节点数据：

        ```bash
        get /digestNode
        ```

        输出示例：

        ```
        digestData
        ```

3. **更新节点数据**：

    ```bash
    set /digestNode "newDigestData"
    ```

4. **验证更新**：

    ```bash
    get /digestNode
    ```

    输出示例：

    ```
    newDigestData
    ```

### 4. 验证 `ip` ACL

`ip` ACL 通过 IP 地址进行访问控制。

#### 创建具有 `ip` ACL 的节点

```bash
create /ipNode "ipData" ip:192.168.0.200:cdrwa
```

#### 验证 `ip` ACL 的访问权限

1. **在授权 IP 地址上验证访问**：

    - 在 192.168.0.200 机器上读取节点数据：

        ```bash
        get /ipNode
        ```

        输出示例：

        ```
        ipData
        ```

    - 更新节点数据：

        ```bash
        set /ipNode "newIpData"
        ```

    - 验证更新：

        ```bash
        get /ipNode
        ```

        输出示例：

        ```
        newIpData
        ```

2. **在未授权 IP 地址上验证访问**（未授权的客户端无法访问）：

    - 在非 192.168.0.200 机器上读取节点数据：

        ```bash
        get /ipNode
        ```

        输出示例：

        ```
        Authentication is not valid : /ipNode
        ```

### 总结

通过上述步骤，您可以验证 Zookeeper 中设置的 ACL 是否生效。不同类型的 ACL 有不同的认证和访问方式，
确保在实际应用中正确配置和验证 ACL，以保护 ZNode 数据的安全性。