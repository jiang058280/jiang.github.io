---
title: 03Python中创建Socket对象的基础代码是什么？
date: 2026-06-26 09:00:00
categories:
  - Socket网络编程
tags:
  - 面试题
---
## <font color="red">问题: Python 中创建 Socket 对象的基础代码是什么？</font>

<details>
<summary><b style="font-size: 1.5rem; color: #2c6b8f;">👇 点击展开/折叠 面试背诵模板（建议先背这个）</b></summary>
	<mymark>
Python 使用内置 socket 模块创建 Socket 对象，核心调用为 socket.socket(family, type)。最常用的是基于 IPv4 的 TCP 套接字：socket.socket(socket.AF_INET, socket.SOCK_STREAM)；基于 IPv4 的 UDP 套接字：socket.socket(socket.AF_INET, socket.SOCK_DGRAM)。创建后返回套接字对象，支持 bind()、listen()、accept()、connect()、send()、recv() 等网络操作方法。使用完毕后需调用 close() 释放系统资源。
    </mymark>
</details>
---

### 创建 TCP 与 UDP Socket 的代码对比

```python
import socket

# TCP Socket（面向连接、可靠传输）
tcp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# UDP Socket（无连接、尽最大努力交付）
udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
```

### 创建时的参数组合速查表

| 协议类型    | 地址族（Family）  | 套接字类型（Type） | 说明                                          |
| ----------- | ----------------- | ------------------ | --------------------------------------------- |
| TCP         | `AF_INET`（IPv4） | `SOCK_STREAM`      | 最常用的面向连接通信                          |
| UDP         | `AF_INET`（IPv4） | `SOCK_DGRAM`       | 无连接，适合实时音视频、DNS查询               |
| TCP（IPv6） | `AF_INET6`        | `SOCK_STREAM`      | 支持 IPv6 网络环境                            |
| 原始套接字  | `AF_INET`         | `SOCK_RAW`         | 需管理员权限，用于构造自定义 IP 包（如 Ping） |

### 创建时的常见异常处理

```python
import socket

try:
    # 创建 TCP 套接字
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
except socket.error as e:
    print(f"套接字创建失败: {e}")
    exit(1)

# 使用完毕后务必关闭，释放文件描述符
finally:
    client.close()
```

### 创建后 Socket 对象的核心方法速览

| 方法                                       | 服务端使用 | 客户端使用 | 说明                                   |
| ------------------------------------------ | ---------- | ---------- | -------------------------------------- |
| `bind(('ip', port))`                       | ✅ 必须     | ❌ 可选     | 绑定本地地址和端口                     |
| `listen(backlog)`                          | ✅ 必须     | ❌          | 开启监听队列，backlog 为最大等待连接数 |
| `accept()`                                 | ✅ 必须     | ❌          | 阻塞等待客户端连接，返回新套接字和地址 |
| `connect(('ip', port))`                    | ❌          | ✅ 必须     | 向服务端发起 TCP 三次握手连接          |
| `send(data)` / `recv(bufsize)`             | ✅          | ✅          | 收发数据，data 需为 bytes 类型         |
| `sendto(data, addr)` / `recvfrom(bufsize)` | ✅（UDP）   | ✅（UDP）   | UDP 专用，无需建立连接                 |

### 上下文管理器（with 语句）推荐写法

Python 的 Socket 对象支持上下文管理器，可自动关闭资源，避免手动调用 `close()` 遗漏。

```python
import socket

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect(('www.baidu.com', 80))
    s.send(b'GET / HTTP/1.1\r\n\r\n')
    data = s.recv(1024)
    print(data[:100])   # 退出 with 块时自动关闭
```