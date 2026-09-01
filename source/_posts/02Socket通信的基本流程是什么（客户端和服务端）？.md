---
title: 02Socket通信的基本流程是什么（客户端和服务端）？
date: 2026-06-26 09:00:00
categories:
  - Socket网络编程
tags:
  - 面试题
---
## <font color="red">问题: Socket 通信的基本流程是什么（客户端和服务端）？</font>

<details>
<summary><b style="font-size: 1.5rem; color: #2c6b8f;">👇 点击展开/折叠 面试背诵模板（建议先背这个）</b></summary>
	<mymark>
Socket 通信遵循客户端-服务端模型。服务端流程：socket() 创建监听套接字 → bind() 绑定 IP 和端口 → listen() 进入被动监听状态 → accept() 阻塞等待客户端连接（完成 TCP 三次握手），返回新套接字用于数据收发 → recv()/send() 交换数据 → close() 关闭连接。客户端流程：socket() 创建套接字 → connect() 向服务端发起连接请求 → send()/recv() 交换数据 → close() 关闭连接。TCP 是面向连接的可靠流式传输，UDP 无需 connect 和 listen，直接 sendto/recvfrom。
    </mymark>
</details>
---

### 服务端与客户端核心调用对照表

| 阶段       | 服务端调用          | 客户端调用          | 说明                                       |
| ---------- | ------------------- | ------------------- | ------------------------------------------ |
| 创建套接字 | `socket()`          | `socket()`          | 指定地址族（AF_INET）和协议（SOCK_STREAM） |
| 绑定地址   | `bind()`            | （可选）            | 服务端需固定端口，客户端由系统分配临时端口 |
| 监听/连接  | `listen()`          | `connect()`         | 服务端进入被动队列，客户端发起三次握手     |
| 接受连接   | `accept()`          | （阻塞等待）        | 返回新的客户端套接字 fd                    |
| 数据收发   | `recv()` / `send()` | `recv()` / `send()` | 应用层协议解析，注意粘包问题               |
| 关闭连接   | `close()`           | `close()`           | 触发四次挥手释放资源                       |

### TCP 三次握手与 accept/connect 的对应关系

- 客户端调用 `connect()` 后，内核发送 SYN 包，进入 SYN_SENT 状态。
- 服务端在 `listen()` 后，内核收到 SYN 回复 SYN+ACK，进入 SYN_RCVD 状态。
- 客户端收到 SYN+ACK 回复 ACK，进入 ESTABLISHED，`connect()` 返回。
- 服务端收到 ACK 进入 ESTABLISHED，但 `accept()` 仅在完成队列中有连接时返回（三次握手完成后）。因此 `accept()` 的返回标志着连接已可用，而非正在握手。

### Python 代码模拟（TCP 回显服务）

```python
# server.py（服务端）
import socket
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('0.0.0.0', 8080))
server.listen(5)
print("服务端监听中...")
while True:
    client, addr = server.accept()
    data = client.recv(1024)
    client.send(b'echo: ' + data)
    client.close()

# client.py（客户端）
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect(('127.0.0.1', 8080))
client.send(b'hello')
resp = client.recv(1024)
print(resp.decode())   # echo: hello
client.close()
```

### 三次握手与四次挥手的核心时序（补充）

| 阶段     | 触发动作               | 网络包                     | 状态变化             |
| -------- | ---------------------- | -------------------------- | -------------------- |
| 三次握手 | `connect()` 客户端发起 | SYN →, ← SYN+ACK, ACK →    | CLOSED → ESTABLISHED |
| 数据传输 | `send()` / `recv()`    | PSH/ACK 数据包             | ESTABLISHED          |
| 四次挥手 | 主动调用 `close()`     | FIN →, ← ACK, ← FIN, ACK → | FIN_WAIT → CLOSED    |

### 常见阻塞点与 I/O 模型选择

- `accept()`、`recv()`、`connect()` 默认均为阻塞调用，若需非阻塞，需设置 `setblocking(False)` 或使用 `select`/`poll`/`epoll` 多路复用。
- 阻塞 `recv()` 在连接断开时返回空字节串（b''），需据此检测对端关闭。
- 大并发场景下，单线程阻塞模型无法应对，建议使用多线程（每连接一线程）或异步 IO（如 asyncio）和事件驱动框架（如 Twisted、Tornado）。