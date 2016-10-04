var express = require('express');

var app = express();

var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var discription = require('./lib/discription.js');

app.set('port', process.env.PORT || 3000);

// 加入static中间件
app.use(express.static(__dirname + '/public'));

// 查询字符串中包含test=1时，加载包含测试的页面
app.use(function(req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.get('/', function(req, res) {
    res.render('home');
});
app.get('/about', function(req, res) {
    res.render('about', {
        discription: discription.getDisc(),
        pageTestScript: '/qa/tests-about.js'
    });
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