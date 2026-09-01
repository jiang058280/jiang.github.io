---
title: 04服务端Socket的`bind()`、`listen()`、`accept()`方法分别有什么作用？
date: 2026-06-26 09:00:00
categories:
  - Socket网络编程
tags:
  - 面试题
---
## <font color="red">问题: Socket的bind()、listen()、accept()方法分别有什么作用？</font>

<details>
<summary><b style="font-size: 1.5rem; color: #2c6b8f;">👇 点击展开/折叠 面试背诵模板（建议先背这个）</b></summary>
	<mymark>
bind() 将套接字绑定到指定的 IP 和端口，固定服务端对外访问入口；listen() 将主动套接字转为被动监听状态，并维护一个连接请求队列（backlog 参数限制最大等待连接数）；accept() 阻塞并从已完成三次握手的连接队列中取出第一个连接，为该客户端新建一个专用套接字，返回 (new_socket, client_addr)，原监听套接字继续接收后续连接。三者必须严格按 bind → listen → accept 顺序依次调用，是 TCP 服务端启动的标准三步。
    </mymark>
</details>
---

### 调用顺序与底层状态转换

- **bind()**：在调用 `socket()` 创建套接字后，该套接字处于未命名状态（无 IP 和端口）。`bind()` 为其分配本地地址，使内核能够将接收到的网络包（目标端口匹配）递交给该套接字。
- **listen()**：将套接字从主动连接（可发起 `connect`）切换为被动连接（可接收 `connect`），内核为该套接字维护两个队列：未完成队列（SYN_RCVD 半连接）和已完成队列（ESTABLISHED 全连接）。
- **accept()**：默认阻塞当前线程，从已完成队列中取出队首连接并返回。若队列为空，进程进入睡眠状态，直到有新连接到达。

### 代码流程与参数说明

```python
import socket

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 1. bind：绑定端口（需处理端口占用异常）
server.bind(('0.0.0.0', 8080))

# 2. listen：backlog=5 表示已完成队列最大长度
server.listen(5)

# 3. accept：阻塞等待，返回新套接字和客户端地址
while True:
    client_socket, client_addr = server.accept()
    print(f"连接来自: {client_addr}")
    client_socket.close()
```

### 三个方法的职责与约束速览

| 方法       | 前置条件      | 核心职责                           | 后续操作             |
| ---------- | ------------- | ---------------------------------- | -------------------- |
| `bind()`   | 套接字未绑定  | 注册本地地址和端口，供客户端寻址   | 必须调用 `listen()`  |
| `listen()` | 已 `bind()`   | 激活被动模式，初始化连接队列       | 必须调用 `accept()`  |
| `accept()` | 已 `listen()` | 阻塞获取客户端新连接，分配新套接字 | 使用新套接字收发数据 |

### 高频追问：accept() 返回的套接字和原套接字有何区别？

- **原监听套接字**（Server Socket）职责单一，仅负责监听和接收新连接，始终保持 `listen` 状态，不应使用它收发数据。
- **返回的新套接字**（Client Socket）专门服务于该客户端，负责该连接的 `send()` 和 `recv()` 操作，关闭后不影响监听套接字，服务端仍可继续 `accept()` 接收其他客户端。

### 常见异常场景

- **端口占用（Address already in use）**：`bind()` 指定端口已被其他进程占用，可通过 `SO_REUSEADDR` 选项重用。
- **Backlog 溢出**：`listen(backlog)` 过小，在高并发下已完成队列满，新连接可能被拒绝，需根据业务调整。
- **阻塞挂起**：`accept()` 默认阻塞，服务端无法执行其他任务，如需超时控制，可设置 `settimeout()` 或使用非阻塞模式配合 `select`/`epoll`。