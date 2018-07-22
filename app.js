require('babel-core/register');

const Koa = require('koa');
const logFactory = require('corie-logger');
const router = require('koa-router')();
const app = new Koa();

logFactory.configure({
    // 日志初始化配置，可以设置文件路径或者json对象
    conf: `${__dirname}/log4js.json`,
    // 日志存放的目录
    path: `${__dirname}/logs`
});

app.use(logFactory.connectLogger('http', {
    format: `":user-agent"
  “remote-addr”: [ :remote-addr ]
  “request":     ":method  :url  HTTP/:http-version"
  "response":    “:status  :response-time ms  :content-length byte”
  "referrer":    ":referrer"`
}));

const appLogger = logFactory.getLogger('app');

var init = require('./db/init');
var koaTransaction = require('koa-mysql-transaction');

init.init();
app.use(koaTransaction(init.mysql, init.conf, 'single'));

const views= require('koa-views');
app.use(views('views',{map:{html: 'ejs'}}));

const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

var cors = require('koa2-cors');
app.use(cors());

app.use(async (ctx, next) => {
    console.log(new Date());
    await next();
});

router.get('/', async (ctx, next) => {
    let results = await ctx.execSql('select * from question_tbl');
    results.forEach(function (item) {
        item.question_answer = item.question_answer.split('/');
    })
    ctx.body = results;
});

router.get('/resultList', async (ctx, next) => {

    let results = await ctx.execSql('select * from user_tbl');
    await ctx.render('resultList', {results})

}).post('/submit', async (ctx, next) => {
    let obj = ctx.request.body;
    let name = obj.user_name;
    let sex = obj.user_sex;
    let age = obj.user_age;
    let phone = obj.user_phone;
    let industry = obj.user_industry;
    let result = obj.question_result;

    let sql = `insert into user_tbl
    (user_name,user_sex,user_age,user_phone,user_industry,question_result)
    values
    ('${name}', '${sex}', '${age}', '${phone}', '${industry}', '${result}')
    ON duplicate KEY UPDATE user_name='${name}',user_sex='${sex}',user_age='${age}',user_industry='${industry}',question_result='${result}'`;

    try{
        await ctx.execSql(sql);
        ctx.body = {
            errCode:0,
            msg:'提交成功'
        };
    }catch(e){
        ctx.body = {
            errCode:1,
            msg:'提交失败',
            err: e
        }
    }
});


app.use(router.routes());
app.use(router.allowedMethods);
app.listen(3001, ()=>{
    appLogger.info('starting on port 3001');
});