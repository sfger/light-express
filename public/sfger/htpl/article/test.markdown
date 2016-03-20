
Hello.
===
test
---


# 这是 H1

## 这是 H2

###### 这是 H6

* This is markdown.
* It is fun.
* Love it or leave it.

1.  Bird
1.  McHale
1.  Parish

I get 10 times more traffic from [Google][1] than from [Yahoo][2] or [MSN][3].

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

<div style="color:red;">test</div>

水的化学符号：H<sub>2</sub>O
2<sup>3</sup>=8

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

[1]: http://google.com/ "Google"
[2]: http://search.yahoo.com/ "Yahoo Search"
[3]: http://search.msn.com/ "MSN Search"
