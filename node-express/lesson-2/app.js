var http = require('http');
var fs = require('fs');

function serverStaticFile(response, pathname, contentType, responseCode) {
    responseCode || (responseCode = 200);
    fs.readFile(__dirname + pathname, function(error, data) {
        if(error) {
            response.writeHead(500, {'Content-Type': 'text/plain'});
            response.end('500 - Internal Error');
        } else {
            response.writeHead(responseCode, {'Content-Type': contentType});
            response.end(data);
        }
    });
}

http.createServer(function(request, response) {
    var pathname = request.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
    switch(pathname) {
        case '':
            serverStaticFile(response, '/public/home.html', 'text/html');
            break;
        case '/about':
            serverStaticFile(response, '/public/about.html', 'text/html');
            break;
        case '/img/logo.png':
            serverStaticFile(response, '/public/img/logo.png', 'image/png');
            break;
        default:
            serverStaticFile(response, '/public/404.html', 'text/html', 404);
    }
}).listen(8888);

console.log('Server started on localhost:8888...');
