//loader読み込み
const loader = require("@assemblyscript/loader")

//wasm読み込み
async function sample() {
  const imports = {};
  //fetchが使えない環境の場合はconvert_wasm_to_buffer.jsでBufferを作成し、そのモジュールを読み込む
  const myModule = await loader.instantiate(fetch("../build/optimized.wasm"), imports);

  return myModule;
};

//実行テスト
sample().then(myModule => {
  //独自定義
  const { Foo, getFoo, calcPacket, UINT8ARRAY_ID } = myModule.exports
  //定義済み
  const { __getString, __release, __retain, __newArray } = myModule.exports

  /**
   * Test1: クラスを作成し、コンストラクタで初期化される文字列を受け取る(オフィシャルのサンプル)
   */
  const fooPtr = getFoo()
  const foo = Foo.wrap(fooPtr)
  const strPtr = foo.getString()
  console.log(__getString(strPtr));
  __release(strPtr)
  __release(fooPtr)

  /**
   * Test2: Uint8Arrayを渡し、クラスを受け取りオブジェクトに直す
   */
  //Uint8Arrayを定義
  let ui8Ary = new Uint8Array(20);
  for (let i = 0 ; i < 20 ; i++) {
    ui8Ary[i] = i * 2;
  }

  //受け取るクラスのポインタ・クラスを取得
  const arrayPtr = __retain(__newArray(UINT8ARRAY_ID, ui8Ary));  
  const fooPtr2 = calcPacket(arrayPtr);
  const result = Foo.wrap(fooPtr2);
  
  //クラス→オブジェクトに変換し返す
  const rtrnObj = {
    a: result.a,
    b: result.b,
    c: result.c,
    d: result.d,
    str: __getString(result.str)
  };
  __release(arrayPtr);
  __release(fooPtr2);

  console.log(JSON.stringify(rtrnObj));
});