var querystring = require('querystring');
var fs = require('fs');

function start(response) {
    console.log('request handle "start" was called');
    
    var body = '<html>' +
                '<head>' +
                '<meta http-equiv="Content-Type" content="text/html: charset=UTF-8">' +
                '<head>' +
                '<body>' +
                '<form action="/upload" method="post">' +
                '<textarea name="text" rows="20" cols="30"></textarea>' +
                '<input type="submit" value="submit text">' +
                '</form>' +
                '</body>' +
                '</html>';
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(body);
    response.end();
}
function upload(response, postData) {
    console.log('request handle "upload" was called');
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('You have sent:' +  querystring.parse(postData).text);
    response.end();
}

exports.start = start;
exports.upload = upload;