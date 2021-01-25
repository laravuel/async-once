无限次调用异步函数，只执行一次，并且以promise形式返回执行结果

```js
import AsyncOnce from 'wl-async-once';

AsyncOnce.call(函数名, [函数参数1, 函数参数2, ...], 是否启用严格模式)
    .then(res => {})
    .catch(err => {})
```