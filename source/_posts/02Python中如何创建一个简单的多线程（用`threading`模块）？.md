---
title: 02Python中如何创建一个简单的多线程（用`threading`模块）？
date: 2026-06-26 09:00:00
categories:
  - 多线程、多进程、多协程
tags:
  - 面试题
---
## <font color="red">问题: Python 中如何创建一个简单的多线程（用 threading 模块）？</font>

<details>
<summary><b style="font-size: 1.5rem; color: #2c6b8f;">👇 点击展开/折叠 面试背诵模板（建议先背这个）</b></summary>
	<mymark>
Python 创建多线程主要有两种方式：一是直接实例化 threading.Thread，传入 target 目标函数和 args 参数元组；二是继承 threading.Thread 类，重写 run 方法。创建后调用 start() 方法启动线程（内部自动调用 run），调用 join() 方法阻塞等待线程执行完毕。注意不要直接调用 run()，否则会在当前线程同步执行而非新建线程。通过 daemon=True 可设置守护线程，主线程退出时守护线程自动终止。
    </mymark>
</details>
---

### 方式一：函数式创建（最常用）

```python
import threading
import time

def worker(name, delay):
    print(f"线程 {name} 开始工作")
    time.sleep(delay)
    print(f"线程 {name} 完成工作")

# 创建线程实例
t1 = threading.Thread(target=worker, args=("A", 2))
t2 = threading.Thread(target=worker, args=("B", 1))

# 启动线程（自动调用 run）
t1.start()
t2.start()

# 等待线程结束（阻塞主线程）
t1.join()
t2.join()

print("所有线程执行完毕")
```

### 方式二：继承式创建（适合复杂状态管理）

```python
class MyThread(threading.Thread):
    def __init__(self, name, delay):
        super().__init__()          # 必须调用父类初始化
        self.name = name
        self.delay = delay

    def run(self):                  # 重写 run 方法
        print(f"线程 {self.name} 开始")
        time.sleep(self.delay)
        print(f"线程 {self.name} 结束")

t = MyThread("Worker", 2)
t.start()
t.join()
```

### start() vs run() 区别（高频陷阱）

| 方法      | 行为                                          | 是否新建线程     |
| --------- | --------------------------------------------- | ---------------- |
| `start()` | 调用系统 API 创建新线程，由新线程执行 `run()` | ✅ 是（并发执行） |
| `run()`   | 直接在当前线程中调用函数                      | ❌ 否（顺序执行） |

```python
# ❌ 错误：直接调用 run，不会并发，等同于普通函数调用
t.run()   # 在当前线程执行，无并发效果

# ✅ 正确：调用 start 启动新线程
t.start() # 系统创建新线程执行
```

### 守护线程（Daemon Thread）

当主线程退出时，守护线程会**自动终止**，不会阻塞程序退出。非守护线程（默认）会阻塞主线程直到自身执行完毕。

```python
def background_task():
    while True:
        print("后台运行中...")
        time.sleep(1)

t = threading.Thread(target=background_task, daemon=True)
t.start()

time.sleep(3)
print("主线程退出")   # 程序退出，后台线程随主线程消亡
```

### 常用方法速览

| 方法                         | 作用                                    |
| ---------------------------- | --------------------------------------- |
| `t.start()`                  | 启动线程，系统自动调用 `run()`          |
| `t.join([timeout])`          | 阻塞当前线程，等待 t 执行完毕（或超时） |
| `t.is_alive()`               | 判断线程是否还在运行                    |
| `threading.current_thread()` | 获取当前线程对象                        |
| `threading.active_count()`   | 获取当前活跃线程数量                    |

### 注意：Python 多线程与 GIL

由于 GIL 的存在，Python 多线程**无法并行执行 CPU 密集型任务**（同一时刻仅一个线程运行字节码），但非常适合 **I/O 密集型任务**（网络请求、文件读写、数据库查询），因为在 I/O 等待时线程会释放 GIL，实现并发效果。