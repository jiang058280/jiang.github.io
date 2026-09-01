---
title: 08self关键字在类中的作用是什么，必须写吗？
date: 2026-08-31 09:07:00
categories:
  - 面向对象编程
tags:
  - 面试题
---

## <font color="red">问题: self关键字在类中的作用是什么，必须写吗？</font>

<details>
<summary><b style="font-size: 1.5rem; color: #2c6b8f;">👇 点击展开/折叠 面试背诵模板（建议先背这个）</b></summary>
	<mymark>
self 代表当前实例对象本身，是实例方法中访问实例属性和调用其他实例方法的纽带。在实例方法的参数列表中，第一个位置必须预留用来接收实例对象，但变量名约定为 self（PEP 8 规范），可改名但不推荐。调用时解释器自动传入实例，无需手动传递。类方法第一个参数用 cls，静态方法无需特殊参数。若定义实例方法时忘记写 self，调用时将抛出 TypeError。
    </mymark>
</details>
---

### 底层传参机制：方法的等价调用形式

实例方法通过点号调用时，Python 会隐式地将调用对象作为第一个参数传入。`obj.method(arg)` 在底层等价于 `Class.method(obj, arg)`，显式演示了 `self` 如何被自动填充。理解这个等价式有助于弄清为何方法定义比普通函数多一个参数。

```python
class Demo:
    def show(self, msg):
        print(f"{self} 收到: {msg}")

d = Demo()
d.show("hello")          # 常规调用
Demo.show(d, "hello")    # 等价调用（底层实现）
```

### self 的三个核心使用场景

1.  **绑定与访问实例属性**：在 `__init__` 中用 `self.name = name` 将数据挂载到当前对象上；在普通方法中用 `self.name` 获取该对象的值。
2.  **调用其他实例方法**：在方法内部通过 `self.other_method()` 调用同对象的其他方法，确保操作的是同一份数据。
3.  **区分局部变量与实例变量**：当形参或局部变量与实例属性同名时，`self.attr` 明确指向实例属性，避免命名冲突（例如 `self.age = age` 与局部变量 `age`）。

### 常见错误陷阱

- **忘记写 self 导致 TypeError**：定义 `def bark(): print("汪")` 后，调用 `d.bark()` 会报错，因为解释器尝试将 `d` 作为无参数函数的第一个参数传入，但函数不接受任何参数。
- **忘记用 self 赋值导致属性丢失**：在 `__init__` 中写 `name = name` 时，变量仅存在于方法局部栈中，对象实例化后访问 `s.name` 会抛出 `AttributeError`，因为数据没有挂载到 `self` 上。

```python
# ❌ 错误写法
class Student:
    def __init__(self, name):
        name = name     # 局部变量，非实例属性

s = Student("张三")
print(s.name)           # AttributeError: 'Student' object has no attribute 'name'
```

### 与 Java/C++ 的显隐式对比（面试亮点）

| 维度       | Python（self）                           | Java/C++（this）             |
| ---------- | ---------------------------------------- | ---------------------------- |
| 写法位置   | 必须显式写在实例方法参数列表的首位       | 隐式存在，不在参数列表中     |
| 命名约定   | 约定为 `self`（PEP 8），非关键字，可改名 | `this` 是保留关键字，不可变  |
| 调用时机   | 解释器自动传入调用实例                   | 编译器自动注入，无需手动传参 |
| 静态上下文 | 类方法使用 `cls`，静态方法无             | 静态方法中不能使用 `this`    |