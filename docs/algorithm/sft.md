<!--
 * @Author: tf
 * @Date: 2021-03-25 14:13:46
 * @LastEditTime: 2021-03-25 17:59:03
 * @Description: 这是一段描述
-->

## 1.合并两个数组

给你两个有序整数数组 nums1 和 nums2，请你将 num2 合并到 nums1 中，使 nums1 成为一个有序数组。

> 示例：nums1 = [1,2,3,0,0,0], m = 3, num2 = [2,5,6], n = 3 输出: [1,2,2,3,5,6]

### 代码

```js
//双指针
const mergeArray = function(num1, m, num2, n) {
  let i = m - 1,
    j = n - 1,
    k = m + n - 1;
  while (i >= 0 && j >= 0) {
    if (num2[j] > num1[i]) {
      num1[k] = num2[j];
      k--;
      j--;
    } else {
      num1[k] = num1[i];
      i--;
      k--;
    }
  }
  while (j > 0) {
    num1[k] = num2[j];
    j--;
    k--;
  }
  return num1;
};

console.log(mergeArray([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3));

console.log(mergeArray([1, 0, 0], 1, [2, 5, 6], 3));
```
## 2.两数求和问题

给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那两个整数，并返回他们的数组下标

> 示例： 给定 nums=[2,7,9,11],target=9,因为 nums[0]+nums[1]=target，所以返回[0,1]

### 代码

```js
//第一种常见解法 for循环遍历查找
const addNums = function(arr, target) {
  const obj = {};
  for (let i = 0; i < arr.length; i++) {
    if (obj[target - arr[i]] !== undefined) {
      return [obj[target - arr[i]], i];
    }
    obj[arr[i]] = i;
  }
};

console.log(addNums([2, 7, 9, 11], 9));

//第二种 空间换时间
const addNums = function(arr, target) {
  const obj = new Map();
  for (let i = 0; i < arr.length; i++) {
    if (obj.has(target - arr[i])) {
      return [obj.get(target - arr[i]), i];
    }
    obj.set(arr[i], i);
  }
};

console.log(addNums([2, 7, 9, 11], 9));

//双指针解法
const addNums = function(arr, target) {
  let i = 0;
  let j = nums.length - 1;
  while (i < j) {
    if (nums[i] + nums[j] > target) {
      j--;
    } else if (nums[i] + nums[j] < target) {
      i++;
    } else {
      return [i, j];
    }
  }
};

console.log(addNums([2, 7, 9, 11], 9));
```
## 3.三数求和问题

真题描述：给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有满足条件且不重复的三元组。
注意：答案中不可以包含重复的三元组。

> 示例： 给定数组 nums = [-1, 0, 1, 2, -1, -4]， 满足要求的三元组集合为： [ [-1, 0, 1], [-1, -1, 2] ]

```js
const threeSum = function(nums) {
  // 用于存放结果数组
  let res = [];
  // 给 nums 排序
  nums = nums.sort((a, b) => {
    return a - b;
  });
  console.log(nums);
  // 缓存数组长度
  const len = nums.length;
  // 注意我们遍历到倒数第三个数就足够了，因为左右指针会遍历后面两个数
  for (let i = 0; i < len - 2; i++) {
    // 左指针 j
    let j = i + 1;
    // 右指针k
    let k = len - 1;
    // 如果遇到重复的数字，则跳过
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }
    while (j < k) {
      // 三数之和小于0，左指针前进
      if (nums[i] + nums[j] + nums[k] < 0) {
        j++;
        // 处理左指针元素重复的情况
        while (j < k && nums[j] === nums[j - 1]) {
          j++;
        }
      } else if (nums[i] + nums[j] + nums[k] > 0) {
        // 三数之和大于0，右指针后退
        k--;

        // 处理右指针元素重复的情况
        while (j < k && nums[k] === nums[k + 1]) {
          k--;
        }
      } else {
        // 得到目标数字组合，推入结果数组
        res.push([nums[i], nums[j], nums[k]]);

        // 左右指针一起前进
        j++;
        k--;

        // 若左指针元素重复，跳过
        while (j < k && nums[j] === nums[j - 1]) {
          j++;
        }

        // 若右指针元素重复，跳过
        while (j < k && nums[k] === nums[k + 1]) {
          k--;
        }
      }
    }
  }

  // 返回结果数组
  return res;
};
console.log(threeSum([-1, 0, 1, 2, -1, -4]));
```

在上面这道题中，左右指针一起从两边往中间位置相互迫近，这样的特殊双指针形态，被称为“对撞指针”。

什么时候你需要联想到对撞指针？
这里我给大家两个关键字——“有序”和“数组”。
没错，见到这两个关键字，立刻把双指针法调度进你的大脑内存。普通双指针走不通，立刻想对撞指针！

即便数组题目中并没有直接给出“有序”这个关键条件，我们在发觉普通思路走不下去的时候，也应该及时地尝试手动对其进行排序试试看有没有新的切入点——没有条件，创造条件也要上。

对撞指针可以帮助我们缩小问题的范围，这一点在“三数求和”问题中体现得淋漓尽致：因为数组有序，所以我们可以用两个指针“画地为牢”圈出一个范围，这个范围以外的值不是太大就是太小、直接被排除在我们的判断逻辑之外，这样我们就可以把时间花在真正有意义的计算和对比上。如此一来，不仅节省了计算的时间，更降低了问题本身的复杂度，我们做题的速度也会大大加快。


## 4、判断一个字符串是否是回文字符串

比如这种就是回文字符串 `yessey`,同时可以利用对称的特性来判断是不是回文字符串

```js
function isPalindrome(str) {
  // 先反转字符串
  const reversedStr = str
    .split('')
    .reverse()
    .join('');
  // 判断反转前后是否相等
  return reversedStr === str;
}
```

### 回文字符串的衍生问题

> 真题描述：给定一个非空字符串 s，最多删除一个字符。判断是否能成为回文字符串。

> 示例 1: 输入: "aba"
> 输出: True
> 示例 2:
> 输入: "abca"
> 输出: True
> 解释: 你可以删除 c 字符。
> 注意: 字符串只包含从 a-z 的小写字母。字符串的最大长度是 50000。

```js
const validPalindrome = function(s) {
  // 缓存字符串的长度
  const len = s.length;

  // i、j分别为左右指针
  let i = 0,
    j = len - 1;

  // 当左右指针均满足对称时，一起向中间前进
  while (i < j && s[i] === s[j]) {
    i++;
    j--;
  }

  // 尝试判断跳过左指针元素后字符串是否回文
  if (isPalindrome(i + 1, j)) {
    console.log('zhix');
    return true;
  }
  // 尝试判断跳过右指针元素后字符串是否回文
  if (isPalindrome(i, j - 1)) {
    console.log('mzhix');
    return true;
  }

  // 工具方法，用于判断字符串是否回文
  function isPalindrome(st, ed) {
    while (st < ed) {
      if (s[st] !== s[ed]) {
        return false;
      }
      st++;
      ed--;
    }
    return true;
  }

  // 默认返回 false
  return false;
};
console.log(validPalindrome('abcbac'));
```
