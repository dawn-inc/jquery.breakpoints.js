# jquery.breakpoints.js

ブレイクポイントを管理するjQueryプラグイン

## 使用方法

```js
// 基本形

$.breakpoints({
    sp: {
        min: 0,
        max: 750
    },
    pc: {
        min: 751,
        max: Infinity
    }
});
```

```js
// 登録した情報の取得

$.breakpoints.get('sp');
/*
{
    min: 0,
    max: 750,
    media: MediaQueryListにインスタンス,
    isMatched: function() {...}
}
*/

$.breakpoints.get('sp', 'max'); // => 750
```

```js
// コールバック関数の登録

$.breakpoints.on('sp', function(e, obj) {
    console.log(e); // => イベントオブジェクト または null
    console.log(obj); // => $.breakpoints.get('sp') の返り値
});

```

```js
// コールバック関数の解除

var callback = function() {
    console.log('Hello, Breakpoints!');
}

$.breakpoints.on('sp', callback);

$.breakpoints.off('sp', callback); // => 解除
```

## オプション設定

### breakpoints (object)

ブレイクポイントの設定オブジェクトで下記のプロパティのどちらか、または両方を必要とする

### min

レイアウトの最小値

### max

レイアウトの最大値

## 取得できる情報

### min

レイアウトの最小値

### max

レイアウトの最大値

### media

[MediaQueryList](https://developer.mozilla.org/ja/docs/Web/API/MediaQueryList)のインスタンス

### isMatched

レイアウトに合致しているかをtrue/falseで返す関数

## 静的メソッド

### $.breakpoints.get(key, info)

登録した情報を取得する

#### オブション設定

##### key
情報を取得するブレイクポイントの名前

##### info
取得する情報の名前 指定されていない場合はを

#### 返り値
特定の情報またはすべての情報をもつオブジェクトまたはnull

### $.breakpoints.on(key, fn)

コールバック関数を登録する

#### オブション設定

##### key
コールバック関数を登録するブレイクポイントの名前

##### fn
登録するコールバック関数

### $.breakpoints.off(key, fn)

コールバック関数を解除する

#### オブション設定

##### key
コールバック関数を解除するブレイクポイントの名前

##### fn
解除するコールバック関数

## ライセンス

[MIT License](https://raw.githubusercontent.com/bhargavrpatel/gulp-prettier/master/LICENSE)
