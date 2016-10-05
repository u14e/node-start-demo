var express = require('express');

var app = express();

var handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options) {
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// 获得元数据
var discription = require('./lib/discription.js');
var context = require('./lib/context.js');
var weather = require('./lib/weather.js');

app.set('port', process.env.PORT || 3000);

/* 
 * 中间件
 */

// 加入static中间件
app.use(express.static(__dirname + '/public'));

// 查询字符串中包含test=1时，加载包含测试的页面
app.use(function(req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

// 创建中间件，给res.locals.partials对象添加数据
app.use(function(req, res, next) {
    if(!res.locals.partials) res.locals.partials = {};
    // 将res.locals.partials.weather改为res.locals.partials.weatherData才能正常运行
    res.locals.partials.weatherContext = weather.getWeatherData();
    next();
});

/* 
 * 路由
 */

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/about', function(req, res) {
    res.render('about', {
        discription: discription.getDisc(),
        pageTestScript: '/qa/tests-about.js'
    });
});

// 模板引擎示例
app.get('/foo', function(req, res) {
    res.render('foo', {
        currency: context.getContent('currency'),
        tours: context.getContent('tours'),
        specialsUrl: context.getContent('specialsUrl'),
        currencies: context.getContent('currencies'),
        layout: null,   // 关闭布局
    });
});

app.get('/jquery-test', function(req, res) {
    res.render('jquery-test');
});

app.get('/nursery-rhyme', function(req, res) {
    res.render('nursery-rhyme');
})

app.get('/data/nursery-rhyme', function(req, res) {
    res.json({
        animal: 'squirrel',
		bodyPart: 'tail',
		adjective: 'bushy',
		noun: 'heck',
    })
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