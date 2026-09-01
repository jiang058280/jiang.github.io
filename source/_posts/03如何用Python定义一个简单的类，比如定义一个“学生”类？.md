---
title: 03如何用Python定义一个简单的类，比如定义一个“学生”类？
date: 2026-08-31 09:02:00
categories:
  - 面向对象编程
tags:
  - 面试题
---

## <font color="red">问题: 如何用 Python 定义一个简单的类，比如定义一个 “学生” 类？</font>

<details>
<summary><b style="font-size: 1.5rem; color: #2c6b8f;">👇 点击展开/折叠 面试背诵模板（建议先背这个）</b></summary>
	<mymark>
使用 class 关键字定义类，类名采用大驼峰命名法（如 Student）。通过 __init__ 方法初始化实例属性，该方法在对象创建时自动调用，第一个参数必须为 self，指向当前实例对象。所有实例方法（如 study）的首个参数同样必须是 self，通过 self.属性名 访问实例数据。示例：class Student: def __init__(self, name, age): self.name = name; self.age = age; def study(self, subject): print(f"{self.name}正在学习{subject}")。
    </mymark>
</details>
---

### 类的标准语法结构与命名规范

Python 类通过 `class ClassName:` 声明，继承自 `object`（Python 3 中默认隐式继承）。类体包含属性和方法，实例属性通常在 `__init__` 中定义，方法则通过 `def` 定义在类体内部。类名必须遵循大驼峰命名法（CapWords），如 `StudentInfo`，模块内部私有类可前置单下划线 `_`。

```python
# 基础定义（无任何装饰器或继承）
class Student:
    """学生类：记录基本信息与学习行为"""
    pass   # 空类定义，用于占位或后续扩展
```

### __init__ 构造方法与 self 的实质绑定

`__init__` 不是构造器（构造器是 `__new__`），而是初始化器。它在对象内存分配（`__new__`）完成后执行，负责填充数据。`self` 参数是实例方法的约定占位符，解释器自动传入调用对象，若忘记写 `self`，实例调用会抛出 `TypeError`。

```python
class Student:
    def __init__(self, name, age, grade=1):  # 支持默认参数
        self.name = name           # 公开实例属性
        self._age = age            # 约定私有（仅供内部使用）
        self.grade = grade

    def study(self, subject):
        print(f"{self.name} 正在学习 {subject}")
```

### 对象实例化与属性访问机制

实例化过程相当于调用类对象：`stu = Student("张三", 18)`。Python 自动执行 `Student.__new__(cls)` 分配内存，再执行 `Student.__init__(self, "张三", 18)` 初始化。实例属性可通过点号运算符访问（`stu.name`），也可通过 `getattr()` / `setattr()` 动态操作。若尝试访问不存在的属性，将抛出 `AttributeError`。

```python
# 创建多个独立对象（内存隔离）
stu1 = Student("张三", 18)
stu2 = Student("李四", 19)

print(stu1.name)          # 张三
print(stu2.name)          # 李四
stu1.study("Python")      # 张三正在学习 Python
stu2.study("数学")        # 李四正在学习数学
```

### 常见扩展：\_\_str\_\_ 与类型注解（提升可读性）

为便于调试和展示，可重写 `__str__` 或 `__repr__` 方法。同时，为增强代码可维护性，推荐为参数和属性添加类型注解（Type Hints），虽然运行时无效，但 IDE 和静态检查工具（如 mypy）可帮助提前发现类型错误。

```python
class Student:
    school: str = "北京大学"      # 类属性（带类型注解）

    def __init__(self, name: str, age: int) -> None:
        self.name = name
        self.age = age

    def __str__(self) -> str:
        return f"学生({self.name}, {self.age}岁)"

    def study(self, subject: str) -> None:
        print(f"{self.name} 正在学习 {subject}")

print(Student("王五", 20))   # 调用 __str__，输出：学生(王五, 20岁)
```