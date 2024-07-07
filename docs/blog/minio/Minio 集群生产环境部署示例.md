---
date: 2021-07-07
category:
  - Minio 
tag:
  - 对象存储
sticky: true
excerpt: <p> Minio 上传请求负载分析 </p>
---
# Minio 集群生产环境部署示例

在生产环境中部署 MinIO 集群，需要进行以下步骤：安装必要的依赖项、配置 MinIO 服务器、
设置网络和存储、启动 MinIO 服务、并进行验证。下面是一个完整的 MinIO 集群生产环境部署
配置示例。

### 1. 环境准备

确保所有节点都已经安装了以下软件：
- 操作系统：Linux（例如 CentOS, Ubuntu）
- 必要的工具：wget, tar, ssh
- MinIO 服务器

### 2. MinIO 安装

在每个节点上执行以下步骤：

#### 2.1 下载并安装 MinIO

```bash
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
sudo mv minio /usr/local/bin/
```

#### 2.2 创建配置和数据目录

```bash
sudo mkdir -p /etc/minio
sudo mkdir -p /mnt/data
```

### 3. MinIO 配置

在每个节点上创建 MinIO 配置文件 `/etc/minio/minio.conf`。

#### 3.1 配置文件示例

假设有四个节点，IP 地址分别为 `192.168.1.1`, `192.168.1.2`, `192.168.1.3`, `192.168.1.4`，
每个节点的数据目录为 `/mnt/data`.

在每个节点的 `/etc/minio/minio.conf` 中配置如下内容：

```bash
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key

MINIO_VOLUMES="http://192.168.1.1/mnt/data http://192.168.1.2/mnt/data 
http://192.168.1.3/mnt/data http://192.168.1.4/mnt/data"

MINIO_OPTS="--address :9000 --console-address :9001"
```

### 4. Systemd 服务配置

为了让 MinIO 作为系统服务运行，可以创建一个 Systemd 服务文件。

#### 4.1 创建 Systemd 服务文件

在每个节点上创建 `/etc/systemd/system/minio.service` 文件，内容如下：

```ini
[Unit]
Description=MinIO
Documentation=https://docs.min.io
Wants=network-online.target
After=network-online.target

[Service]
User=root
Group=root
EnvironmentFile=/etc/minio/minio.conf
ExecStart=/usr/local/bin/minio server $MINIO_OPTS $MINIO_VOLUMES
Restart=always
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

#### 4.2 启动 MinIO 服务

在每个节点上执行以下命令：

```bash
sudo systemctl daemon-reload
sudo systemctl enable minio
sudo systemctl start minio
```

### 5. 验证集群状态

使用 MinIO 客户端 mc 来验证 MinIO 集群状态。

#### 5.1 下载并安装 MinIO 客户端 mc

```bash
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/
```

#### 5.2 配置 mc 客户端

```bash
mc alias set myminio http://192.168.1.1:9000 your-access-key your-secret-key
```

#### 5.3 检查 MinIO 集群状态

```bash
mc admin info myminio
```

### 6. 设置反向代理和负载均衡

在生产环境中，通常会在 MinIO 集群前面设置反向代理和负载均衡，以提高可用性和性能。

#### 6.1 使用 Nginx 作为反向代理

安装 Nginx：

```bash
sudo apt-get install nginx
```

配置 Nginx：

```nginx
server {
    listen 80;

    location / {
        proxy_pass http://minio_cluster;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

upstream minio_cluster {
    server 192.168.1.1:9000;
    server 192.168.1.2:9000;
    server 192.168.1.3:9000;
    server 192.168.1.4:9000;
}
```

启动 Nginx：

```bash
sudo systemctl restart nginx
```

### 7. 安全配置

#### 7.1 使用 HTTPS

生成 SSL 证书：

```bash
sudo apt-get install certbot
sudo certbot certonly --standalone -d your-domain.com
```

配置 MinIO 使用 HTTPS：

在每个节点的 `/etc/minio/minio.conf` 文件中添加：

```bash
MINIO_CERT_FILE=/etc/letsencrypt/live/your-domain.com/fullchain.pem
MINIO_KEY_FILE=/etc/letsencrypt/live/your-domain.com/privkey.pem
```

#### 7.2 配置防火墙

确保只有需要的端口开放（例如：9000, 9001, 443）：

```bash
sudo ufw allow 9000
sudo ufw allow 9001
sudo ufw allow 443
sudo ufw enable
```

### 8. 监控和日志

使用 MinIO 控制台和日志来监控集群状态。

#### 8.1 启用 MinIO 控制台

通过配置文件 `/etc/minio/minio.conf` 中的 `MINIO_OPTS` 启用 MinIO 控制台：

```bash
MINIO_OPTS="--address :9000 --console-address :9001"
```

#### 8.2 日志监控

可以使用系统日志工具（如 `journalctl`）查看 MinIO 日志：

```bash
journalctl -u minio.service
```

### 总结

上述步骤详细描述了如何在生产环境中部署和配置 MinIO 集群，包括安装、配置、启动、验证和安全配置等方面。
通过这些步骤，你可以搭建一个高性能、高可用的分布式对象存储系统。

### 常见问题

集群节点启动 `Permission denied`
```
systemd[7955]: minio.service: Failed to execute command: Permission denied
systemd[7955]: minio.service: Failed at step EXEC spawning /usr/local/bin/minio: Permission denied
systemd[1]: minio.service: Main process exited, code=exited, status=203/EXEC

```
这个错误表明 MinIO 可执行文件在 `/usr/local/bin/minio` 没有足够的权限来执行。要解决这个问题，
可以按照以下步骤检查和修复权限问题：

### 1. 检查和设置 MinIO 可执行文件权限

首先，确保 MinIO 可执行文件具有执行权限：

```bash
sudo chmod +x /usr/local/bin/minio
```

### 2. 确保 MinIO 可执行文件的所有权

确保 MinIO 可执行文件的所有权是正确的：

```bash
sudo chown root:root /usr/local/bin/minio
```

### 3. 检查和设置配置文件和数据目录权限

确保 MinIO 配置文件和数据目录具有正确的权限：

```bash
sudo chown -R root:root /etc/minio
sudo chown -R root:root /mnt/data
sudo chmod -R 755 /etc/minio
sudo chmod -R 755 /mnt/data
```
设置
```bash
sudo setenforce 0
```
如果这解决了问题，可以调整 SELinux 设置或者永久禁用：
```bash
sudo vi /etc/selinux/config
# 将 SELINUX=enforcing 改为 SELINUX=permissive
```

### 确认文件系统挂载选项
某些文件系统挂载选项可能会阻止执行二进制文件。检查挂载选项：

```bash
mount | grep /usr/local
```
确保没有 noexec 选项。如果存在，需要重新挂载文件系统：
```bash
sudo mount -o remount,exec /usr/local
```
### 4. 检查 Systemd 服务文件

确保 Systemd 服务文件配置正确，特别是 `ExecStart` 语句的路径是否正确，
并且 /usr/local/bin/minio 确实存在且可执行。服务文件本身具有正确的权限：

```bash
sudo chown root:root /etc/systemd/system/minio.service
sudo chmod 644 /etc/systemd/system/minio.service
```

### 5. 重载 Systemd 配置并重启 MinIO 服务

执行以下命令重载 Systemd 配置并重启 MinIO 服务：

```bash
sudo systemctl daemon-reload
sudo systemctl restart minio
```

### 6. 查看服务状态

检查 MinIO 服务状态以确认是否成功启动：

```bash
sudo systemctl status minio
```

如果服务仍然无法启动，请检查系统日志以获取更多信息：

```bash
journalctl -xe
```

###  无法找到存储目录 `drive not found`
```bash
Unable to use the drive http://192.168.0.200:9000/opt/minio/data: drive not found
```
根据日志信息，MinIO 无法连接到其他节点的存储路径。以下是可能的原因和解决方案：

### 1. 确认节点是否在运行 MinIO

确保所有节点上的 MinIO 服务都在运行并监听正确的端口。

在每个节点上执行：

```bash
sudo systemctl status minio
```

如果 MinIO 服务未启动，请启动服务：

```bash
sudo systemctl start minio
```

### 2. 确认网络连接

确保所有节点之间的网络连接是正常的。可以使用 `curl` 或 `ping` 检查连接：

```bash
curl http://192.168.0.200:9000
curl http://192.168.0.201:9000
curl http://192.168.0.202:9000
curl http://192.168.0.203:9000
```

如果任何一个节点无法访问，检查防火墙和网络配置。

### 3. 确认数据目录存在并可访问

确保每个节点上的数据目录 `/opt/minio/data` 存在并且 MinIO 用户有权限访问：

```bash
ssh user@192.168.0.200
ls -ld /opt/minio/data
```

如果目录不存在，请创建目录并设置适当的权限：

```bash
sudo mkdir -p /opt/minio/data
sudo chown -R minio-user:minio-group /opt/minio/data
sudo chmod -R 755 /opt/minio/data
```

### 4. 确认 MinIO 配置正确

在每个节点的 `/etc/minio/minio.conf` 文件中，确保 MINIO_VOLUMES 配置正确：

```bash
MINIO_VOLUMES="http://192.168.0.200:9000/opt/minio/data http://192.168.0.201:9000/opt/minio/data 
http://192.168.0.202:9000/opt/minio/data http://192.168.0.203:9000/opt/minio/data"
```

### 5. 确认防火墙设置

确保防火墙允许 MinIO 使用的端口（默认 9000 和 9001）。

在每个节点上执行：

```bash
sudo firewall-cmd --zone=public --add-port=9000/tcp --permanent
sudo firewall-cmd --zone=public --add-port=9001/tcp --permanent
sudo firewall-cmd --reload
```

### 6. 检查 SELinux 设置

如果你的系统启用了 SELinux，可能会阻止 MinIO 的操作。你可以临时禁用 SELinux 来测试：

```bash
sudo setenforce 0
```

如果这解决了问题，可以调整 SELinux 设置或者永久禁用：

```bash
sudo vi /etc/selinux/config
# 将 SELINUX=enforcing 改为 SELINUX=permissive
```

### 7. 确认 MinIO 服务日志

检查其他节点的 MinIO 服务日志，查看是否有相关错误信息：

```bash
journalctl -u minio
```

### 重新启动 MinIO 服务

确认以上步骤后，重新启动所有节点上的 MinIO 服务：

```bash
sudo systemctl restart minio
```

### 验证 MinIO 集群状态

使用 MinIO 客户端 `mc` 验证集群状态：

```bash
mc alias set myminio http://192.168.0.200:9000 your-access-key your-secret-key
mc admin info myminio
```

### ` minor: 0: drive is part of root drive, will not be used` 问题
根据错误日志，MinIO 检测到驱动器（存储路径）是系统根驱动器的一部分，并因此将其标记为不可用。
MinIO 不允许将存储路径设置在根分区，以避免潜在的数据丢失和系统稳定性问题。

### 解决方案

要解决这个问题，您需要确保 MinIO 的数据目录位于一个独立的分区或挂载点，而不是系统根分区的一部分。
以下是步骤：

### 1. 创建独立分区或挂载点

#### 1.1 创建新分区

如果您有未分配的磁盘空间，可以创建一个新分区。这里是一个简单的示例，使用 `fdisk` 和 `mkfs.ext4` 
创建新分区：

```bash
sudo fdisk /dev/sdX  # 选择磁盘并创建新分区
sudo mkfs.ext4 /dev/sdX1  # 格式化新分区
```

#### 1.2 挂载新分区

创建并挂载新分区：

```bash
sudo mkdir -p /mnt/minio-data
sudo mount /dev/sdX1 /mnt/minio-data
sudo chown -R minio-user:minio-group /mnt/minio-data
sudo chmod -R 755 /mnt/minio-data
```

#### 1.3 配置自动挂载

编辑 `/etc/fstab`，添加新分区的自动挂载配置：

```bash
/dev/sdX1 /mnt/minio-data ext4 defaults 0 2
```

### 2. 更新 MinIO 配置

在每个节点的 `/etc/minio/minio.conf` 文件中，更新 MINIO_VOLUMES 配置，将数据路径指向新分区：

```bash
MINIO_VOLUMES="http://192.168.0.200:9000/mnt/minio-data http://192.168.0.201:9000/mnt/minio-data 
http://192.168.0.202:9000/mnt/minio-data http://192.168.0.203:9000/mnt/minio-data"
```

### 3. 重启 MinIO 服务

确认配置正确后，重启 MinIO 服务：

```bash
sudo systemctl restart minio
```

### 4. 验证 MinIO 集群状态

使用 MinIO 客户端 `mc` 验证集群状态：

```bash
mc alias set myminio http://192.168.0.200:9000 your-access-key your-secret-key
mc admin info myminio
```

### 其他注意事项

- 确保所有节点上的新数据目录具有相同的路径和权限设置。
- 如果没有额外的磁盘空间，您可能需要重新分配现有分区或使用逻辑卷管理器（LVM）创建新的逻辑卷。

通过这些步骤，您可以确保 MinIO 的数据存储在独立的分区上，避免将数据存储在系统根分区，
确保系统的稳定性和数据的安全性。

### `Unable to connect to http://192.168.0.201:9000/opt/minio/data` 问题

根据错误日志，MinIO 集群中的节点无法连接到其他节点，原因是没有到主机的路由 (`no route to host`)。
这通常是由网络配置问题引起的。以下是可能的原因和解决方案：

### 可能的原因和解决方案

#### 1. 确认 MinIO 服务运行

确保所有节点上的 MinIO 服务都在运行并监听正确的端口。

在每个节点上执行：

```bash
sudo systemctl status minio
```

如果 MinIO 服务未启动，请启动服务：

```bash
sudo systemctl start minio
```

#### 2. 检查网络连接

确保所有节点之间的网络连接是正常的。可以使用 `ping` 或 `curl` 检查连接：

```bash
ping 192.168.0.201
ping 192.168.0.202
ping 192.168.0.203

curl http://192.168.0.201:9000/minio/health/live
curl http://192.168.0.202:9000/minio/health/live
curl http://192.168.0.203:9000/minio/health/live
```

#### 3. 检查防火墙设置

确保防火墙允许 MinIO 使用的端口（默认 9000 和 9001）。

在每个节点上执行以下命令以开放必要的端口：

```bash
sudo firewall-cmd --zone=public --add-port=9000/tcp --permanent
sudo firewall-cmd --zone=public --add-port=9001/tcp --permanent
sudo firewall-cmd --reload
```

如果使用的是 `iptables`，请执行：

```bash
sudo iptables -A INPUT -p tcp --dport 9000 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 9001 -j ACCEPT
sudo iptables-save > /etc/iptables/rules.v4
```

#### 4. 检查 SELinux 设置

如果您的系统启用了 SELinux，可能会阻止 MinIO 的操作。可以临时禁用 SELinux 来测试：

```bash
sudo setenforce 0
```

如果这解决了问题，可以调整 SELinux 设置或者永久禁用：

编辑 `/etc/selinux/config` 文件，将 `SELINUX=enforcing` 改为 `SELINUX=permissive`，然后重启系统。

#### 5. 确认网络配置

检查所有节点的网络配置，确保它们在同一个子网中，且没有网络隔离问题。

查看和编辑网络配置文件（如 `/etc/network/interfaces` 或 `/etc/sysconfig/network-scripts/ifcfg-eth0`），
确保配置正确。

#### 6. 确认 MinIO 配置

确保每个节点的 MinIO 配置正确。在每个节点的 `/etc/minio/minio.conf` 文件中，确保 MINIO_VOLUMES 配置正确：

```bash
MINIO_VOLUMES="http://192.168.0.200:9000/mnt/minio-data http://192.168.0.201:9000/mnt/minio-data 
http://192.168.0.202:9000/mnt/minio-data http://192.168.0.203:9000/mnt/minio-data"
```

### 重新启动 MinIO 服务

确认以上步骤后，重新启动所有节点上的 MinIO 服务：

```bash
sudo systemctl restart minio
```

### 验证 MinIO 集群状态

使用 MinIO 客户端 `mc` 验证集群状态：

```bash
mc alias set myminio http://192.168.0.200:9000 your-access-key your-secret-key
mc admin info myminio
```

### 总结

通过这些步骤，您应该能够解决 MinIO 集群启动时节点无法连接的问题。确保每个节点的服务运行、网络连接正常、
防火墙设置正确，并确认配置文件中的路径和权限设置正确，是保证 MinIO 集群正常运行的关键。如果问题仍然存在，
请检查最新的错误日志，并提供更多详细信息以便进一步诊断。