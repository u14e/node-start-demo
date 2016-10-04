var express = require('express');

var app = express();

var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var discription = [
    'this is the first discription',
    'this is the second discription',
    'this is the third discription',
    'this is the fouth discription',
    'this is the fifth discription',
];

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('home');
});
app.get('/about', function(req, res) {
    var randomDisc = discription[Math.floor(Math.random() * discription.length)]
    res.render('about', {discription: randomDisc});
})

app.use(function(req, res, next) {
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
})

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port'));
})