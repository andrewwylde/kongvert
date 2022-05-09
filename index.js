const http = require('http');
const path = require('path');
const fs = require('fs');

const wl = path.resolve(__dirname, 'dict.json');


let all = fs.readFileSync(wl, 'utf8')
let dict = JSON.parse(all)

const _serverRef = http.createServer((req, res) => {
  if (req.method.match(/post/i) && req.url.match(/kongvert/)) {
    handleRequest(req, res);
  } else {
    res.statusCode = 404;
    res.write('no endpoint')
    res.end();
  }

})
function handleRequest(req, res) {
  let data = '';
  req.on('data', ch => {
    data += ch;
  });

  req.on('end', () => {
    try {
      parsedData = JSON.parse(data);
      let word  = handleKongversion(parsedData, res);
      res.statusCode = 200;
      res.write(JSON.stringify({word},null,2), () => {
        res.end();
      });
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end('invalid JSON: ', data);
    }
  });
}

function handleKongversion(data,res) {

  if (dict[data.word]) {
    return dict[data.word]
  } else {
    return data.word
  }
}


_serverRef.listen(9002)
