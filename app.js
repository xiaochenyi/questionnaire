require('babel-core/register');

const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();

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
    console.log('starting on port 3001');
});