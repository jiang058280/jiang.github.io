---
title: 01什么是Socket，它在网络编程中的作用是什么？
date: 2026-06-26 09:00:00
categories:
  - Socket网络编程
tags:
  - 面试题
---
## <font color="red">问题: 什么是 Socket，它在网络编程中的作用是什么？</font>

<details>
<summary><b style="font-size: 1.5rem; color: #2c6b8f;">👇 点击展开/折叠 面试背诵模板（建议先背这个）</b></summary>
	<mymark>
Socket 是应用层与传输层之间的编程抽象接口，封装了 TCP/IP 协议栈。其核心作用是屏蔽底层网络细节，通过 IP 地址定位主机、端口号定位进程，提供标准 API（如 connect、send、recv、accept）实现跨网络的双向数据通信。它作为操作系统内核网络资源（文件描述符）的句柄，支持面向连接的 TCP 流式通信和无连接的 UDP 数据报通信。
    </mymark>
</details>
---

### Socket 在 TCP 通信中的标准工作流程

TCP 协议的 Socket 编程遵循严格的“服务端-客户端”模型，顺序不可颠倒。服务端依次调用 `socket()` 创建监听套接字，`bind()` 绑定端口，`listen()` 进入监听状态，`accept()` 阻塞等待客户端连接，连接成功后返回新套接字用于数据收发。客户端调用 `socket()` 后直接 `connect()` 发起三次握手，连接建立后双方通过 `send()` 和 `recv()` 交换数据，最后 `close()` 关闭连接释放资源。

```python
# 服务端流程（简化伪代码）
s = socket()      # 创建
s.bind(('0.0.0.0', 8080))
s.listen(5)
while True:
    client, addr = s.accept()   # 阻塞等待
    client.recv(1024)
    client.close()

# 客户端流程
s = socket()
s.connect(('127.0.0.1', 8080))
s.send(b'hello')
s.close()
```

### TCP Socket 与 UDP Socket 的行为差异

| 维度     | TCP Socket                        | UDP Socket                                          |
| -------- | --------------------------------- | --------------------------------------------------- |
| 连接性   | 需 `connect()` 建立连接，面向连接 | 无需 `connect()`（可调用），无连接                  |
| 可靠性   | 可靠传输（确认重传、序号机制）    | 不可靠（尽最大努力交付，可能丢包乱序）              |
| 数据边界 | 流式（无边界，需应用层处理粘包）  | 数据报模式（保留消息边界，一次 send 对应一次 recv） |
| 通信模式 | 全双工，`send`/`recv` 配对        | 全双工，`sendto`/`recvfrom` 需指定目标地址          |

### Socket 作为文件描述符的本质

在 Unix/Linux 系统中，Socket 遵循“一切皆文件”哲学，创建成功后会返回一个非负整数（文件描述符 ID），与普通文件使用相同的读写模型。操作系统内核通过该描述符管理发送/接收缓冲区、连接状态和协议控制块。`select`、`poll` 和 `epoll` 等 I/O 复用机制正是基于对 Socket 描述符的监控，实现单线程管理海量连接的高并发模型。