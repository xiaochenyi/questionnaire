import mysql from 'mysql'
import {conf} from './config.js'

var connection = mysql.createConnection(conf);

var query = function (sql) {
    connection.query(sql, function (error) {
        if (error) throw error; //链接失败，或其它错误
    });
}

var init = function () {
    var createQuesSql = `CREATE TABLE IF NOT EXISTS question_tbl(
            id INT UNSIGNED AUTO_INCREMENT,
            question_title VARCHAR(100) NOT NULL,
            question_answer VARCHAR(40) NOT NULL,
            question_type INT NOT NULL,
            PRIMARY KEY ( id )
    )ENGINE=InnoDB DEFAULT CHARSET=utf8`;
    query(createQuesSql);

    var tbl = "user_tbl";
    var createUserSql = `CREATE TABLE IF NOT EXISTS ${tbl}(
            id INT UNSIGNED AUTO_INCREMENT,
            user_name VARCHAR(20) NOT NULL,
            user_sex VARCHAR(10) NOT NULL,
            user_age INT NOT NULL,
            user_phone VARCHAR(11) NOT NULL,
            user_industry VARCHAR(40) NOT NULL,
            question_result VARCHAR(100),
            submission_date timestamp default current_timestamp,
            PRIMARY KEY ( id ),
            UNIQUE KEY uniq_phone ( user_phone )
    )ENGINE=InnoDB DEFAULT CHARSET=utf8`;
    query(createUserSql);

    console.log("初始化完成");
}

export {init,mysql,conf}




