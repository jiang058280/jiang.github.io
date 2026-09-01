---
title: 09cls关键字在类中的作用是什么，必须写吗？
date: 2026-08-31 09:08:00
categories:
  - 面向对象编程
tags:
  - 面试题
---

## <font color="red">问题: cls 关键字在类中的作用是什么，必须写吗？</font>

<details>
<summary><b style="font-size: 1.5rem; color: #2c6b8f;">👇 点击展开/折叠 面试背诵模板（建议先背这个）</b></summary>
	<mymark>
cls 代表当前类本身，专门用于类方法（@classmethod）。在类方法定义中，第一个参数位置必须预留以接收类对象，变量名约定为 cls（PEP 8），可改名但不推荐。其核心作用包括：访问/修改类属性（cls.count）、实现工厂方法（return cls() 支持多态）、调用其他类方法。与静态方法的关键区别在于 cls 在继承时动态绑定调用者的子类，从而支持多态，而硬编码类名则破坏多态。
    </mymark>
</details>
---

### 类方法 vs 静态方法：继承多态的关键差异

在继承体系中，类方法的 `cls` 参数会自动绑定到调用者（子类或父类），而静态方法完全无视调用者的类型。这是面试中区分两者的核心考点：当子类调用父类的类方法时，`cls` 指向子类；若用硬编码类名，则永远指向父类，导致工厂方法失效。

```python
class Parent:
    @classmethod
    def create(cls):
        return cls()          # 返回调用者的实例

    @staticmethod
    def create_static():
        return Parent()       # 永远返回父类实例

class Child(Parent):
    pass

print(type(Child.create()))        # <class '__main__.Child'> ✅
print(type(Child.create_static())) # <class '__main__.Parent'> ❌
```

### cls() 与硬编码类名的本质区别

在类方法内部，`cls()` 调用由解释器动态解析，其具体指向取决于调用时传入的第一个参数（自动传入）。硬编码类名则在函数定义阶段就已绑定，无法被继承重写。因此，设计可扩展的工厂方法时，必须使用 `cls()` 而非固定类名。

### 在类方法中修改类属性的正确方式

类方法通过 `cls.attr` 修改类属性，效果与 `ClassName.attr` 完全一致，但 `cls` 在继承中具有更好的扩展性。若在子类中未重写该属性，修改会直接影响父类及所有其他子类；若子类重写了该属性，修改仅影响该子类及其后续子类。

```python
class A:
    count = 0
    @classmethod
    def inc(cls):
        cls.count += 1

class B(A):
    count = 100

A.inc()
print(A.count)   # 1
B.inc()
print(B.count)   # 101（独立于父类的副本）
print(A.count)   # 1（父类未受影响）
```

### 常见误区：通过实例调用类方法时 cls 指向谁？

类方法可通过实例调用（如 `obj.class_method()`），但 `cls` 传入的依然是该实例所属的**类**，而非实例对象。这意味着在类方法内部无法访问 `self`，若误用 `self` 会引发 `NameError`。此设计强调类方法与实例状态无关，仅与类状态绑定。