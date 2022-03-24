# Warning! This repository is obsolete after AssemblyScript 0.20!!

## assemblyscript-sample

Array and class handling sample for AssemblyScript with loader module

## Requirements

- AssemblyScript 0.17
- Webpack 5

## Build and run

`npm run test` automatically compile .ts file and bundle into main.js

1. `npm i`
1. `npm run test`
1. Open `src/index.html` and see developer console

## If you enconter a fetch problem that says '.wasm mimetype is not supported'

Following solutions are available.

- Run on wasm supported http-server like `web_server_simple.js`
- Change buffer loading to normal valiable declaration. `tools/convert_wasm_to_buffer.js` node.js script convert wasm file into Uint8Array declaration.
