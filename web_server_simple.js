//wasmがmimetypeに対応していないので専用簡易サーバー
const http = require('http');
const path = require('path');
const fs = require('fs');

const port = process.argv[2] || 8888,
    mimes = {
      "html": "text/html",
      "jpeg": "image/jpeg",
      "jpg": "image/jpeg",
      "png": "image/png",
      "js": "text/javascript",
      "css": "text/css",
      "wasm": "application/wasm"
    };
 
const dir = __dirname;
const server = http.createServer();


server.on('request', (req, res) => {
    const file = path.join(dir, req.url); 
    // ファイルの状態
    fs.stat(file, (err, stat) => {
        if (err) return resError(404, err);

        // ディレクトリの場合
        if (stat.isDirectory()) {
            // URLが'/'で終わっていない時はリダイレクトさせる
            if (!req.url.endsWith('/'))
                return resRedirect(301, req.url + '/');

            // index.html check
            const file2 = path.join(file, 'index.html');
            fs.stat(file2, (err, stat) => {
                //ディレクトリ一覧
                if (err) resDir(file);
                //あればファイルを応答
                else resFile(file2);
            });
        }
        // ファイルの場合ファイル
        else resFile(file);
    });

    //ファイル応答
    const resFile = filename => {
      fs.readFile(filename, "binary", (err, file) => {
        if(err) {        
          res.writeHead(500, {"Content-Type": "text/plain"});
          res.write(err + "\n");
          res.end();
          return;
        }
        
        let mimeType = mimes[filename.split('.').pop()];
        
        if (!mimeType) {
          mimeType = 'text/plain';
        }
        
        res.writeHead(200, { "Content-Type": mimeType });
        res.write(file, "binary");
        res.end();
      });
    }

    // ディレクトリリスト
    const resDir = dir => { 
        fs.readdir(dir, (err, names) => {
            if (err) return resError(500, err);

            res.writeHead(200, {'content-type': 'text/html'});
            res.end('<pre>' + names.map(x =>
                    '<a href="' + x + '">' + x + '</a>')
                    .join('\n') + '</pre>');
        });
    }

    // リダイレクト
    const resRedirect = (code, loc) => {
        res.writeHead(code, {location: loc});
        res.end(code + ' ' + http.STATUS_CODES[code] + '\n' + loc);
    }

    // エラー応答
    const resError = (code, err) => {
        if (code instanceof Error) err = code, code = 500;
        res.writeHead(code, {'content-type': 'text/plain'});
        res.end(code + ' ' + http.STATUS_CODES[code] + '\n' +
            (err + '').replace(dir, '*'));
    }

})

server.listen(port, error => {
    if (error) {
      return console.error(error)
    }
  
    console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
})