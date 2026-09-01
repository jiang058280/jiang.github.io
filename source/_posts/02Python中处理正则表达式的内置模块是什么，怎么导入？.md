---
title: 02Python中处理正则表达式的内置模块是什么，怎么导入？
date: 2026-06-26 09:00:00
categories:
  - 正则表达式
tags:
  - 面试题
---
## <font color="red">问题: Python 中处理正则表达式的内置模块是什么，怎么导入？</font>

<details>
<summary><b style="font-size: 1.5rem; color: #2c6b8f;">👇 点击展开/折叠 面试背诵模板（建议先背这个）</b></summary>
	<mymark>
Python 处理正则表达式的内置模块是 re（Regular Expression 的缩写）。导入方式为标准库导入：import re。该模块提供 match、search、findall、sub、split 等核心函数，支持字符串匹配、提取、替换和分割操作。使用时必须预先导入，推荐 import re 方式导入整个模块以保持命名空间清晰，也可使用 from re import match, search 按需导入特定函数。
    </mymark>
</details>
---

### re 模块的核心函数速览

| 函数                            | 语法                         | 作用                                             |
| ------------------------------- | ---------------------------- | ------------------------------------------------ |
| `re.match(pattern, string)`     | 从字符串开头匹配             | 匹配成功返回 Match 对象，否则返回 None           |
| `re.search(pattern, string)`    | 扫描整个字符串查找第一个匹配 | 返回第一个匹配对象，不限定开头                   |
| `re.findall(pattern, string)`   | 查找所有非重叠匹配           | 返回字符串列表（无分组时）或元组列表（有分组时） |
| `re.finditer(pattern, string)`  | 查找所有匹配，返回迭代器     | 每个元素为 Match 对象，适合大数据量场景          |
| `re.sub(pattern, repl, string)` | 替换匹配内容                 | 返回替换后的新字符串                             |
| `re.split(pattern, string)`     | 按匹配规则分割               | 返回分割后的字符串列表                           |

### 常用导入方式对比与选择

| 导入方式               | 代码示例                       | 适用场景                                        |
| ---------------------- | ------------------------------ | ----------------------------------------------- |
| 导入整个模块（推荐）   | `import re`                    | 通用场景，函数调用需加 `re.` 前缀，命名空间清晰 |
| 导入特定函数           | `from re import match, search` | 频繁使用少数函数，减少前缀书写                  |
| 导入所有函数（不推荐） | `from re import *`             | 污染命名空间，可能覆盖同名函数，可读性差        |

```python
# 三种导入方式的使用对比
import re
result = re.match(r'\d+', '123abc')      # 推荐

from re import match
result = match(r'\d+', '123abc')         # 可接受

from re import *                         # 不推荐
result = match(r'\d+', '123abc')         # 来源不明，易冲突
```

### 预编译模式的导入与使用

对于频繁使用的正则，建议用 `re.compile()` 预编译生成 Pattern 对象，再用该对象的 `match`、`search` 等方法。Pattern 对象的方法与 `re` 模块函数一一对应，但支持更多参数（如 `pos`、`endpos` 指定搜索范围）。预编译既提升性能，也便于将正则定义集中管理。

```python
import re
pattern = re.compile(r'\d{3}-\d{8}')   # 预编译

# 调用 Pattern 对象的方法
phone = pattern.search('电话: 010-12345678')
phones = pattern.findall('010-12345678, 020-87654321')
```

### Python 正则的核心匹配对象（Match）

`re.match()` 和 `re.search()` 返回 `re.Match` 对象，支持以下常用方法：

- `group()`：返回匹配的完整字符串
- `group(n)`：返回第 n 个捕获组的内容
- `groups()`：返回所有捕获组的元组
- `start()` / `end()`：返回匹配的起始/结束位置
- `span()`：返回 (start, end) 元组