const fs = require("fs");
const fileName = process.argv[2];

//バイナリなのでエンコーディング指定しない
fs.readFile(fileName, (err, data) => {
  if (err) throw err;
  //bufferをUint8Arrayに変換
  let buf = new Uint8Array(data.buffer);
  //ファイルを書き込む
  const headStr = "(function(exports){exports.wasmArray = new Uint8Array(";
  const footStr = ");}(typeof exports === 'undefined' ? this.wasm_buffer = {} : exports));";
  
  fs.writeFileSync( "wasm_buffer.js" ,headStr + JSON.stringify(Array.from(buf)) + footStr);
});
