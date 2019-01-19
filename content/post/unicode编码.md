---
title: "Unicode编码"
date: 2019-01-19T20:25:29+08:00
draft: false
---

Unicode（统一码、万国码、单一码）是计算机科学领域里的一项业界标准，包括字符集、编码方案等。Unicode 是为了解决传统的字符编码方案的局限而产生的，它为每种语言中的每个字符设定了统一并且唯一的二进制编码，以满足跨语言、跨平台进行文本转换、处理的要求。

在平常的生活中，我一般不会直接接触到Unicode编码，而是使用常见的 Unicode 实现 UTF-8，它最为显著地特点就是可变长度字符编码，通过可变长度进行编码，可以使用更小的空间存储那些常见的字符，节约磁盘空间与传输消耗。

最近同学遇到了这样一个问题，将一个 PDF 文件转换成为 TXT 文件，我使用了几个PDF文件转换工具，最终得到了需要的TXT文件。这个时候，有趣的事情发生了，转换结果文件中有许多汉字有所重复，这些汉字看起来有着明显的不同，但是他们总是紧紧相连。


```
⼗十⽉月⾰革命给中国送来了了⻢马克思列列宁主义
帮助中国的先进分⼦子开始⽤用⽆无产阶级的世界观作为观察国家命运的⼯工具
中国⾰革命从此有了了科学的指导思想
```
<br>

## 排除了编码问题

在得到这个文本以后，我开始开始以为是由于编码方式问题带来的异常，我尝试使用VSCode对文本进行编码的转换工作，但是在不同的编码之间反复转换之后，我发现每个相邻的重字都是独立的个体。

我需要删去文本中的异常汉字，得到与原文的PDF相一致的内容，而不是夹杂着重复汉字影响阅读的句子。

## 查询不同汉字的编码

由于我没有办法通过打字的方式直接打出不同外观的两个汉字，我使用了复制粘贴的方式，将连续的改观略微不同的汉字进行了搜索，这个时候，我注意到了尽管看起来是相同的汉字，但是他们的UTF-8编码是不同的。

在搜索引擎中搜索 *⼗十⽉月* ,在搜索完成的页面中，就可以看到地址栏中的汉字编码了。
（如果显示的依然是汉字，将网址复制后再粘贴就可以了）
或者也可使用一编码转换网站，通过汉字转换成为编码。


    https://www.baidu.com/s?ie=UTF-8&wd=%E2%BC%97%E5%8D%81%E2%BD%89%E6%9C%88


对于字符的搜索，会转换对应的编码，这里的编码方式是UTF-8，可以看到相同的汉字对应的是不同的编码内容。

|汉字|UTF-8编码|Unicode编码|
|:--:|:--:|:---:|
|⼗|%E2%BC%97|U+2F17|
|十|%E5%8D%81|U+5341|
|⽉|%E2%BD%89|U+2F49|
|月|%E6%9C%88|U+6708|
|⻢|%E2%BB%A2|U+2EE2|
|马|%E9%A9%AC|U+9A6C|
|金|%EF%A4%8A|U+F90A|
|金|%E9%87%91|U+91D1|


<br>

---

## 为什么会发生此现象

在一个名为CodePoints的网站，我找到了答案，[**这个链接**](https://codepoints.net/basic_multilingual_plane)给出了Unicode修订时划分的基本类别，不同的类别分别对应了不同的国家文字，标点符号，特殊符号等。<br>
（CodePoints有一个非常好用的功能，对于每一个字符，详情页都有 Related Characters 部分，给出了容易混淆的字符，这正是此问题的原因所在。）


由于亚洲文化的交融，中日韩三国的文字有着许多的相同之处，因此在设计Unicode编码时，对与相同的汉字进行了编码合并，形成了中日韩统一表意文字（CJK），但是由于汉字的种类复杂，又对于CJK这个集合划分成为了多个小类，在CodePoints的基本类别表中，我们可以看到以下几个分类。

|类名|用途|编码范围|
|:---:|:---:|:---:|
|CJK Radicals Supplement |部首补充| (U+2E80 to U+2EFF)|
|CJK Symbols and Punctuation |符号标点| (U+3000 to U+303F)|
|CJK Strokes |文字比划| (U+31C0 to U+31EF)|
|Enclosed CJK Letters and Months |圈形状字母及月份| (U+3200 to U+32FF)|
|CJK Compatibility |兼容字符| (U+3300 to U+33FF)|
|CJK Unified Ideographs Extension A |统一表意文字扩展A| (U+3400 to U+4DBF)|
|CJK Unified Ideographs |统一表意文字| (U+4E00 to U+9FFF)|
|CJK Compatibility Ideographs |兼容表意文字| (U+F900 to U+FAFF)|
|CJK Compatibility Forms |兼容形式| (U+FE30 to U+FE4F)|

除了这些CJK小类以外，还有一个特别的部分<br>

|类名|用途|编码范围|
|:---:|:---:|:---:|
|[康熙部首(Kangxi Radicals)](https://codepoints.net/kangxi_radicals)|旧时汉字的部首部分 |(U+2F00 to U+2FDF)|


我们日常使用的大部分汉字，都属于两个子集，分别是 **统一表意文字**（CJK Unified Ideographs） 和 **统一表意文字扩展A**（CJK Unified Ideographs Extension A），但是还有一部分汉字，在其他的子集中有着几乎一样的外观，但是起着不同的作用。现在就让我们把之前的汉字编码表补充完整。


|汉字|UTF-8编码|Unicode编码|所属集|
|:--:|:--:|:---:|:---:|
|⼗|%E2%BC%97|U+2F17|康熙部首|
|十|%E5%8D%81|U+5341|统一表意文字|
|⽉|%E2%BD%89|U+2F49|康熙部首|
|月|%E6%9C%88|U+6708|统一表意文字|
|⻢|%E2%BB%A2|U+2EE2|部首补充|
|马|%E9%A9%AC|U+9A6C|统一表意文字|
|金|%EF%A4%8A|U+F90A|兼容表意文字|
|金|%E9%87%91|U+91D1|统一表意文字|



但是在文档转换的过程中，基于 OCR 原理的转换工具并不能很好地判断出字符的 Unicode 编码，出于保留完整信息的目的，生成的 TXT 文件中就同时囊括了各种相符合的情况了，最终生成的文本内容就包含了许多“同样的”汉字了。


## 如何去除重复汉字

引起汉字重复的三个主要子集是 **康熙部首** &nbsp; **CJK部首补充** &nbsp; **兼容表意文字**

这里使用函数来判断字符是否属于某一类别，函数实现非常简单。

```python
# 参见https://codepoints.net/kangxi_radicals
def is_Kangxi_Radicals(ch):
    if type(ch) != type(''):
        return False
    if len(ch) != 1:
        return False
    # uni 格式为b'\\uF900'
    uni = ch.encode('Unicode-escape') 
    if len(uni) < 6:
        return False
    # 去除首部的b'\\ 和 尾部的' 
    # 再添加 0x 开头代表16进制
    uni_hex = '0x' + str(uni)[-5:-1]
    if 0x2F00 <= int(uni_hex, 16) <= 0x2FDF:
        return True
    else:
        return False


# 参见https://codepoints.net/cjk_radicals_supplement
def is_CJK_Radicals_Supplement(ch):
    if type(ch) != type(''):
        return False
    if len(ch) != 1:
        return False
    # uni 格式为b'\\uF900'
    uni = ch.encode('Unicode-escape') 
    if len(uni) < 6:
        return False
    # 去除首部的b'\\ 和 尾部的' 
    # 再添加 0x 开头代表16进制
    uni_hex = '0x' + str(uni)[-5:-1]
    if 0x2E80 <= int(uni_hex, 16) <= 0x2EFF:
        return True
    else:
        return False


# 参见https://codepoints.net/cjk_compatibility_ideographs
def is_CJK_Compatibility_Ideographs(ch):
    if type(ch) != type(''):
        return False
    if len(ch) != 1:
        return False
    # uni 格式为b'\\uF900'
    uni = ch.encode('Unicode-escape') 
    if len(uni) < 6:
        return False
    # 去除首部的b'\\ 和 尾部的' 
    # 再添加 0x 开头代表16进制
    uni_hex = '0x' + str(uni)[-5:-1]
    if 0xF900 <= int(uni_hex, 16) <= 0xFAFF:
        return True
    else:
        return False
```


有了这三个函数之后，再通过一个主函数进行调用，如果不属于这些分类，就写入到新的文件中。

```python
def main(filename=None):
    if filename==None:
        return
    with open(filename, 'r', encoding='utf8') as fr:
        content = fr.read()
    with open('new_' + filename, 'w', encoding='utf8') as fw:
        for ch in content:
            if  not is_Kangxi_Radicals(ch) \
                and not is_CJK_Compatibility_Ideographs(ch) \
                and not is_CJK_Radicals_Supplement(ch):
                    fw.write(ch) 
```