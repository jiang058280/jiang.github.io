---
title: 03什么是多进程，Python中创建简单多进程用哪个模块？
date: 2026-06-26 09:00:00
categories:
  - 多线程、多进程、多协程
tags:
  - 面试题
---
## <font color="red">问题: 什么是多进程，Python 中创建简单多进程用哪个模块？</font>

<details>
<summary><b style="font-size: 1.5rem; color: #2c6b8f;">👇 点击展开/折叠 面试背诵模板（建议先背这个）</b></summary>
	<mymark>
多进程是操作系统同时运行多个独立进程的并发执行方式，每个进程拥有独立的内存空间、数据副本和系统资源。Python 使用内置的 multiprocessing 模块创建多进程，该模块的 Process 类与 threading.Thread 用法高度相似，通过 start() 启动、join() 等待。多进程可绕过 GIL 限制，利用多核 CPU 实现真正的并行计算，但进程间不共享内存，通信需借助 IPC 机制（如 Queue、Pipe），创建和切换开销大于线程。
    </mymark>
</details>
---

### 基础创建方式（函数式与继承式）

```python
from multiprocessing import Process
import os, time

# 方式一：函数式（最常用）
def worker(name):
    print(f"子进程 {name}，PID: {os.getpid()}")
    time.sleep(1)

if __name__ == "__main__":
    p = Process(target=worker, args=("A",))
    p.start()
    p.join()
    print("主进程结束")

# 方式二：继承式（需重写 run）
class MyProcess(Process):
    def __init__(self, name):
        super().__init__()
        self.name = name
    def run(self):
        print(f"进程 {self.name} 执行中")

if __name__ == "__main__":
    p = MyProcess("B")
    p.start()
    p.join()
```

### multiprocessing 核心方法速览

| 方法 / 属性                    | 说明                                     |
| ------------------------------ | ---------------------------------------- |
| `start()`                      | 启动子进程，自动调用 `run()`             |
| `join([timeout])`              | 阻塞主进程，等待子进程结束               |
| `is_alive()`                   | 判断子进程是否存活                       |
| `terminate()`                  | 强制终止子进程（慎用，可能造成资源泄漏） |
| `pid`                          | 获取子进程的进程 ID                      |
| `os.getpid()` / `os.getppid()` | 获取当前进程 PID 和父进程 PID            |

### 进程间通信（IPC）基础

进程间内存隔离，需使用 `Queue` 或 `Pipe` 进行数据交换。

```python
from multiprocessing import Process, Queue

def producer(q):
    q.put("数据")

def consumer(q):
    data = q.get()
    print(f"收到: {data}")

if __name__ == "__main__":
    q = Queue()
    p1 = Process(target=producer, args=(q,))
    p2 = Process(target=consumer, args=(q,))
    p1.start(); p2.start()
    p1.join(); p2.join()
```

### 多进程与多线程的选型对比（拓展）

| 对比维度 | 多进程（multiprocessing） | 多线程（threading）            |
| -------- | ------------------------- | ------------------------------ |
| GIL 影响 | 不受影响，真正并行        | 受影响，CPU 密集型无法利用多核 |
| 内存     | 独立空间，数据隔离安全    | 共享空间，需加锁               |
| 通信开销 | 大（需序列化 / IPC）      | 小（直接读写共享变量）         |
| 适用场景 | CPU 密集型计算            | I/O 密集型任务                 |