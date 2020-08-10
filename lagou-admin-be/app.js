var createError = require('http-errors');
var express = require('express');
var path = require('path');
// 脚手架自动安装的第三方中间件，可以通过req.cookies获取cookie
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 对cookie和session配置
var cookiesession = require("cookie-session");



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var positinoRouter = require("./routes/positon");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookiesession({
    name: "lagou",
    httpOnly: true, // 默认 true,是否允许浏览器通过document.cookie获取
    // 密钥
    secret: "lagouadmin",
    // session生命周期
    maxAge: 24 * 60 * 60 * 1000, // 一天
    // cookie生命周期
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
    }
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 配置静态资源目录
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/position', positinoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;