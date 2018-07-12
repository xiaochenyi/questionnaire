require('babel-core/register');

const Koa = require('koa');
const app = new Koa();

var init = require('./db/init');
var koaTransaction = require('koa-mysql-transaction');

init.init();
app.use(koaTransaction(init.mysql, init.conf, 'single'));


app.use(async (ctx) => {
    ctx.body = "koa2"
});

app.listen(3001);