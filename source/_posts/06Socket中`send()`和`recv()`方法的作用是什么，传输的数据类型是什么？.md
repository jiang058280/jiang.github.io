---
title: 06Socket中`send()`和`recv()`方法的作用是什么，传输的数据类型是什么？
date: 2026-06-26 09:00:00
categories:
  - Socket网络编程
tags:
  - 面试题
---
## <font color="red">问题: Socket 中`send()`和`recv()`方法的作用是什么，传输的数据类型是什么？</font>

<details>
<summary><b style="font-size: 1.5rem; color: #2c6b8f;">👇 点击展开/折叠 面试背诵模板（建议先背这个）</b></summary>
	<mymark>
send() 将应用层数据写入操作系统发送缓冲区，由内核协议栈封装后发出，返回实际写入的字节数（可能小于待发送长度）；recv() 从接收缓冲区读取已到达的数据，返回读取到的字节数据（bytes 类型）。两者默认均为阻塞调用。传输数据类型必须是 bytes（字节串），字符串需通过 encode() 编码后发送，接收后通过 decode() 解码还原。TCP 流式传输无消息边界，send 与 recv 不保证一一对应。
    </mymark>
</details>
---

### send() 与 recv() 的阻塞行为与返回值边界

- **send()**：将数据拷贝至内核发送缓冲区即返回，不代表数据已送达对端。若缓冲区满，`send()` 会阻塞直至缓冲腾出空间。返回值 `n` 表示实际拷贝进缓冲区的字节数，若 `n < len(data)`，需循环重发剩余部分。
- **recv(bufsize)**：阻塞等待数据到达，最多读取 `bufsize` 字节。返回 `b''`（空字节串）表示对端已正常关闭连接（FIN 包到达），此时应关闭本端套接字。若接收缓冲区无数据且连接正常，线程挂起等待。

### TCP 流式特性：粘包问题与 recv 的不确定性

由于 TCP 是流式协议，内核不保留应用层消息边界，两次 `send()` 发送的数据可能被合并到一次 `recv()` 中返回（粘包），也可能一次 `send()` 的大数据被拆分成多次 `recv()` 接收（拆包）。解决方案：应用层协议必须定义边界，常见方案有固定长度头（记录载荷长度）、特殊分隔符（如 `\r\n\r\n`）或 JSON/Protobuf 等自描述协议。

```python
# 粘包示例：两次发送被一次接收
sock.send(b'Hello')
sock.send(b'World')
data = sock.recv(1024)   # 可能得到 b'HelloWorld'（粘在一起）
```

### send() 与 sendall() 的关键区别（高频面试题）

| 方法            | 返回值                                     | 是否保证全部发送               | 推荐场景                 |
| --------------- | ------------------------------------------ | ------------------------------ | ------------------------ |
| `send(data)`    | 返回实际发送的字节数（可能小于 len(data)） | ❌ 否，需循环重发               | 精确控制流量的高性能场景 |
| `sendall(data)` | 返回 None，失败抛出异常                    | ✅ 是（内部循环直到发完或出错） | 日常业务开发（简单可靠） |

```python
# sendall 底层等价于循环调用 send
def sendall(sock, data):
    while data:
        n = sock.send(data)
        data = data[n:]
```

### 编解码实战示例

```python
import socket
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect(('127.0.0.1', 8080))

# 发送：字符串 -> bytes (UTF-8 编码)
sock.sendall('你好世界'.encode('utf-8'))

# 接收：bytes -> 字符串 (UTF-8 解码)
raw = sock.recv(1024)
message = raw.decode('utf-8')
print(message)   # 恢复为原始字符串
```

### 数据收发的高频陷阱

- `recv(1024)` 不保证恰好返回 1024 字节，实际长度取决于接收缓冲区可用数据量，必须根据返回值处理。
- 对端关闭连接时，`recv()` 立即返回 `b''`，务必据此判断退出读写循环，避免死循环。
- Windows 与 Linux 下 `send()` 的缓冲区大小行为一致，但默认套接字缓冲区大小不同（可通过 `sock.setsockopt` 调整）。