var express = require('express');
var formidable = require('formidable');
var credentials = require('./credentials.js');

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

// 引入body-parser中间件，解析URL编码体
app.use(require('body-parser')());

// 引入cookie-parser和express-session中间件
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
}));

// 创建中间件，给res.locals.flash对象添加数据，显示一次之后删除req.session.flash
app.use(function(req, res, next) {
    res.locals.flash = {
        type: 'default',
        info: 'Original info',
        message: 'This is original message'
    };
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

// 表单处理
app.get('/news-letter', function(req, res) {
    res.render('news-letter', {
        csrf: 'CSRF token goes here'
    });
});
app.get('/thank-you', function(req, res) {
    res.render('thank-you');
});

app.post('/process', function(req, res) {
    console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (frmo visible form field): ' + req.body.email);
    if (req.xhr || req.accepts(['json', 'html']) === 'json') {
        res.send({success: true});
    } else {
        res.redirect(303, '/thank-you');
    }
});

// 文件上传
app.get('/contest/vacation-photo', function(req, res) {
    var now = new Date();
    res.render('contest/vacation-photo', {
        year: now.getFullYear(),
        month: now.getMonth()
    });
});
app.post('/contest/vacation-photo/:year/:month', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(error, fields, files) {
        if (error) {
            return res.redirect(303, '/500');
        }
        console.log('received fields: ');
        console.log(fields);
        console.log('received files: ');
        console.log(files);
        res.redirect(303, '/thank-you');
    });
});

// flash（即现）消息
app.get('/flash', function(req, res) {
    res.render('flash');
});
function NewsletterSignup(){}
NewsletterSignup.prototype.save = function(cb){
	cb();
};
app.post('/flash', function(error, req, res) {
    var name = req.body.name || '';
    var email = req.body.email || '';
    var reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    
    // 输入验证
    if (!(reg.test(email))) {
        if (req.xhr) return res.json({error: 'Invalid email address'});
        req.session.flash = {
            type: 'danger',
            info: 'Validation error',
            message: 'The email address you input was not correct'
        };
        return res.redirect(303, '/flash/archive');
    };

    // 数据库验证
    new FlashSignup({name: name, email: email}).save(function(err) {
        if (err) {
            if (req.xhr) return res.json({error: 'Database error'});
            req.session.flash = {
                type: 'danger',
                info: 'Database error',
                message: 'There is a database error; Please try again later'
            };
            return res.redirect(303, '/flash/archive');
        }

        if (req.xhr) return res.json({success: true});
        req.session.flash = {
            type: 'success',
            info: 'Thank you',
            message: 'You have signed up for the flash'
        };
        return res.redirect(303, '/flash/archive');
    });
});


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