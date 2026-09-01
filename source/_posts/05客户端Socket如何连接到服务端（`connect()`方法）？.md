---
title: 05客户端Socket如何连接到服务端（`connect()`方法）？
date: 2026-06-26 09:00:00
categories:
  - Socket网络编程
tags:
  - 面试题
---
## <font color="red">问题: 客户端 Socket 如何连接到服务端（`connect()`方法）？</font>

<details>
<summary><b style="font-size: 1.5rem; color: #2c6b8f;">👇 点击展开/折叠 面试背诵模板（建议先背这个）</b></summary>
	<mymark>
客户端调用 `connect((host, port))` 向服务端发起 TCP 三次握手，建立端到端的可靠连接。该方法默认阻塞，连接成功返回 None，失败抛出异常（如 ConnectionRefusedError、TimeoutError）。参数为地址元组，IPv4 使用 `(ip, port)`，域名会自动解析。UDP 也可调用 connect 绑定远端地址，但仅用于设置默认目标，不发送握手包。
    </mymark>
</details>
---

### 基础使用与异常处理

```python
import socket

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    # 连接本地服务端，端口需与服务端 bind 一致
    client.connect(('127.0.0.1', 8080))
    print("连接成功")
except ConnectionRefusedError:
    print("服务端未启动或端口不可达")
except TimeoutError:
    print("连接超时（默认超时时间较长，需单独设置）")
except OSError as e:
    print(f"其他网络错误: {e}")
finally:
    client.close()
```

### 超时设置与域名自动解析

- **超时控制**：`connect()` 默认超时时间由系统决定（通常很长），可通过 `socket.settimeout(seconds)` 在连接前设置超时，避免程序长时间挂起。
- **域名解析**：`connect()` 自动调用 `getaddrinfo` 将域名解析为 IP 地址，无需手动解析（如 `socket.gethostbyname`）。

```python
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.settimeout(3.0)          # 设置连接超时为 3 秒
try:
    client.connect(('www.baidu.com', 80))   # 自动解析域名
    print("连接百度成功")
except socket.timeout:
    print("连接超时")
```

### 连接成功后 Socket 状态变化

- 连接成功后，客户端套接字进入 `ESTABLISHED` 状态，可立即调用 `send()` 和 `recv()` 收发数据。
- 系统为客户端分配一个临时端口（由内核自动选择），无需调用 `bind()`，该端口在 `close()` 后释放。
- 若连接失败，该套接字对象不可复用，必须关闭后重新创建。

### TCP connect 与 UDP connect 的核心差异

| 协议 | 调用 connect 后的效果            | 是否发送网络包 |
| ---- | -------------------------------- | -------------- |
| TCP  | 发起三次握手，建立连接           | ✅ 发送 SYN 包  |
| UDP  | 仅在内核记录远端地址，不发送数据 | ❌ 不发送任何包 |

```python
# UDP 的 connect 用法（仅绑定默认目标，减少 sendto 参数）
udp_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
udp_sock.connect(('8.8.8.8', 53))   # 不发送握手包
udp_sock.send(b'hello')             # 等价于 sendto(b'hello', ('8.8.8.8', 53))
```