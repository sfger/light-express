# markdown语法

markdown是一种轻量级的“标记语言”，因其语法简单，文档易读，修改方法，被越来越多的程序开发者所青睐，用来书开发写文档，博客文章等内容。下面简单介绍几种常用的语法：

##### h1的写法有两种：

```md
第一种：
Hello.
===
第二种：
# 这是 H1
```
##### 效果：

Hello.
===
# 这是 H1

##### h2的写法也有两种：

```md
第一种：
test
---

第二种：
## 这是 H2
```
##### 效果：

test
---
## 这是 H2

##### h3~h6的写法：

```md
### 这是 H3
#### 这是 H4
##### 这是 H5
###### 这是 H6
```
##### 效果：

### 这是 H3
#### 这是 H4
##### 这是 H5
###### 这是 H6

##### 无序列表：

```md
* This is markdown.
* It is fun.
* Love it or leave it.
```
##### 效果：

* This is markdown.
* It is fun.
* Love it or leave it.

##### 有序列表，主意前面的数字并不会影响实际生成的数字值：

```md
1.  Bird
1.  McHale
1.  Parish
```
##### 效果：

1.  Bird
1.  McHale
1.  Parish

##### 链接使用：

```md
I get 10 times more traffic from [Google][1] than from [Yahoo][2] or [MSN][3].
```
##### 效果：

I get 10 times more traffic from [Google][1] than from [Yahoo][2] or [MSN][3].

##### 代码块：

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

##### 支持html语法：
```html
<div style="color:red;">test</div>
水的化学符号：H<sub>2</sub>O
2<sup>3</sup>=8
```
##### 效果：
<div style="color:red;">test</div>
水的化学符号：H<sub>2</sub>O
2<sup>3</sup>=8

##### 表格语法：
```md
First Header  | Second Header
------------- | -------------
Content<br /> Cell  | Content Cell
Content Cell  | Content Cell

| Name          | Description                  |
| ------------- | -----------                  |
| Help          | ~~Display the~~ help window. |
| Close         | _Closes_ a window            |

| Left-Aligned  | Center Aligned    | Right Aligned |
| :------------ | :---------------: | -----:        |
| col 3 is      | some wordy text   | $1600         |
| col 2 is      | centered          | $12           |
| zebra stripes | are neat          | $1            |
```
##### 效果：
First Header  | Second Header
------------- | -------------
Content<br /> Cell  | Content Cell
Content Cell  | Content Cell

| Name          | Description                  |
| ------------- | -----------                  |
| Help          | ~~Display the~~ help window. |
| Close         | _Closes_ a window            |

| Left-Aligned  | Center Aligned    | Right Aligned |
| :------------ | :---------------: | -----:        |
| col 3 is      | some wordy text   | $1600         |
| col 2 is      | centered          | $12           |
| zebra stripes | are neat          | $1            |

##### 上文中用到的链接语法：
```md
[1]: http://google.com/ "Google"
[2]: http://search.yahoo.com/ "Yahoo Search"
[3]: http://search.msn.com/ "MSN Search"
```
[1]: http://google.com/ "Google"
[2]: http://search.yahoo.com/ "Yahoo Search"
[3]: http://search.msn.com/ "MSN Search"
