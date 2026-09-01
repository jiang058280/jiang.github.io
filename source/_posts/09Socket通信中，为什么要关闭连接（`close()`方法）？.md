---
title: 09Socket通信中，为什么要关闭连接（`close()`方法）？
date: 2026-06-26 09:00:00
categories:
  - Socket网络编程
tags:
  - 面试题
---
## <font color="red">问题: Socket 通信中，为什么要关闭连接（`close()`方法）？</font>

<details>
<summary><b style="font-size: 1.5rem; color: #2c6b8f;">👇 点击展开/折叠 面试背诵模板（建议先背这个）</b></summary>
	<mymark>
关闭连接的核心作用是释放套接字占用的系统文件描述符（FD）资源，并向对端发送 FIN 包触发 TCP 四次挥手，告知对端本端数据已发送完毕。若不主动关闭，FD 将泄漏直至进程耗尽句柄（报 Too many open files 错误），同时对端无法获知连接终止，会持续维护无效连接（CLOSE_WAIT 或 ESTABLISHED 状态），造成资源悬挂。必须在 finally 块或 with 上下文中确保 close 执行，避免异常跳过关闭逻辑。
    </mymark>
</details>
---

### 资源释放：文件描述符与内核缓冲区

在 Unix/Linux 中，Socket 遵循“一切皆文件”哲学，打开后占用一个非负整数（文件描述符）。每个进程的 FD 数量受系统限制（`ulimit -n`），若不调用 `close()`，FD 无法归还给内核，最终导致新连接无法创建。同时，内核为该连接分配的发送/接收缓冲区（数十 KB 至数 MB）也无法释放，长期累积将导致内存资源枯竭。

```python
# 危险代码：未关闭会导致 FD 泄漏
def bad_client():
    s = socket.socket()
    s.connect(('localhost', 8080))
    s.send(b'ping')
    # 忘记 close，函数返回后 FD 残留，直到进程退出
```

### 网络协议：触发 TCP 四次挥手

`close()` 的底层行为是向对端发送 FIN 包，启动四次挥手流程，使双方有序释放连接状态。若不调用 `close()`，服务端 `recv()` 永远收不到 `b''`（EOF），将一直挂起等待数据；客户端的连接也会被内核（或 NAT/防火墙）视为“僵尸连接”，占用端口和会话表项。对于服务端，`accept()` 返回的每个客户端套接字若不关闭，会导致大量 `CLOSE_WAIT` 堆积，最终耗尽端口资源。

### 危险场景与最佳实践

**陷阱**：代码抛出异常时，若 `close()` 写在 `try` 末尾，会被跳过执行。**解决方案**：使用 `try-finally` 或 `with` 上下文管理器（Python 3.3+ 支持 Socket 上下文协议）。

```python
# 方案一：try-finally（兼容所有版本）
sock = socket.socket()
try:
    sock.connect(('localhost', 8080))
    data = sock.recv(1024)
finally:
    sock.close()   # 无论如何都会执行

# 方案二：with 语句（Python 3.3+ 推荐）
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
    sock.connect(('localhost', 8080))
    sock.sendall(b'hello')
# 退出 with 块自动调用 close
```

**注意**：即使服务端调用了 `close()`，操作系统内核会进入 `TIME_WAIT` 状态（默认持续 2MSL，约 60 秒），确保所有延迟数据包被丢弃。若需立即重启服务，可设置 `SO_REUSEADDR` 选项允许端口复用，但这并不能替代 `close()` 本身的资源释放职责。