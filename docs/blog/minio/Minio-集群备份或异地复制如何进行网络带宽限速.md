---
date: 2021-07-07
category:
  - Minio 
tag:
  - 对象存储
sticky: true
excerpt: <p> Minio 上传请求负载分析 </p>
---
# Minio 集群备份或异地复制如何进行网络带宽限速？

在 MinIO 集群的备份和异地复制过程中，控制网络占用以不影响业务的正常使用是一个关键问题。
以下是几种策略和方法，可以帮助你实现这一目标：

### 1. 限制带宽

#### 使用 `mc` 命令行工具限制带宽

`mc` 命令行工具支持限制带宽，可以在备份和复制过程中使用 `--bandwidth` 参数限制网络带宽。

```bash
mc mirror --watch --bandwidth "10MB/s" sourceMinIO/ targetMinIO/
```

#### 使用 Linux tc 命令限制带宽

Linux 提供了 `tc`（traffic control）命令，可以用来限制网络接口的带宽。

```bash
# 为网络接口 eth0 设置带宽限制
sudo tc qdisc add dev eth0 root tbf rate 10mbit burst 32kbit latency 400ms
```

### 2. 分批次备份

将大规模的数据备份和复制分批次进行，以减少对网络的瞬时压力。

#### 分批次备份脚本

```bash
#!/bin/bash

# 获取所有 bucket 列表
buckets=$(mc ls sourceMinIO | awk '{print $5}')

# 分批次备份每个 bucket
for bucket in $buckets; do
    echo "Starting backup for bucket: $bucket"
    mc mirror --watch --bandwidth "10MB/s" sourceMinIO/$bucket targetMinIO/$bucket
    echo "Backup completed for bucket: $bucket"
    sleep 10 # 等待时间，减少瞬时网络负载
done
```

### 3. 备份和复制的时间窗口

设置备份和复制的时间窗口，在业务低峰期进行，避免对高峰期的业务造成影响。

#### 使用 cron 定时任务设置时间窗口

```bash
crontab -e

# 添加以下行以在每天凌晨 2 点进行备份
0 2 * * * /path/to/backup_script.sh >> /path/to/backup_log.txt 2>&1
```

### 4. 使用异步复制

在异地复制中，使用异步复制以减少对实时业务的影响。异步复制不会在数据写入主存储时阻塞操作，而是在后台进行复制。

#### 配置异步复制

MinIO 默认支持异步复制，可以在配置中直接使用异步复制。

```bash
mc replicate add --priority 1 --schedule "0 2 * * *" sourceMinIO/my-bucket --remote-bucket 
my-bucket --remote-target targetMinIO
```

### 5. 网络质量监控和调整

监控网络的使用情况，并根据业务流量动态调整备份和复制的带宽限制。

#### 使用 `nload` 监控网络流量

`nload` 是一个实时网络流量监控工具，可以帮助你监控网络使用情况。

```bash
sudo apt-get install nload
nload
```

#### 动态调整带宽限制脚本

```bash
#!/bin/bash

current_bandwidth="10MB/s"

while true; do
    # 获取当前网络使用情况
    network_usage=$(nload -m eth0 -t 1000 | grep "Curr:" | awk '{print $2}')
    
    # 根据网络使用情况动态调整带宽限制
    if [[ $network_usage -gt 80 ]]; then
        current_bandwidth="5MB/s"
    else
        current_bandwidth="10MB/s"
    fi

    # 更新 mc 的带宽限制
    mc mirror --watch --bandwidth $current_bandwidth sourceMinIO/ targetMinIO/
    
    # 休眠一段时间再检查
    sleep 60
done
```

### 6. 使用 Quality of Service (QoS)

配置网络设备和操作系统的 QoS 策略，保证关键业务流量的优先级。

#### 配置 Linux tc 和 iptables 进行 QoS

```bash
# 定义流量控制规则
sudo tc qdisc add dev eth0 root handle 1: htb default 12
sudo tc class add dev eth0 parent 1:1 classid 1:12 htb rate 100mbit

# 定义业务流量优先级
sudo iptables -t mangle -A POSTROUTING -p tcp --sport 9000 -j CLASSIFY --set-class 1:10
```

### 7. 异地复制策略调整

调整异地复制策略，例如只在业务低峰期进行数据复制，或者在复制时进行批量处理。

#### 设置定时异地复制

```bash
mc replicate add --schedule "0 2 * * *" sourceMinIO/my-bucket --remote-bucket my-bucket 
--remote-target targetMinIO
```

### 8. 多路径传输

在网络硬件和配置支持的情况下，使用多路径传输（Multipath TCP），提高网络利用率并减少单路径的负载。

### 总结

通过限制带宽、分批次备份、设置时间窗口、使用异步复制、网络质量监控和动态调整、配置 QoS 等方法，可以有效地控制
 MinIO 集群备份和异地复制过程中对网络的占用，从而保证业务的正常运行。这些方法可以根据具体业务需求和网络环境进
 行组合使用，以达到最佳效果。