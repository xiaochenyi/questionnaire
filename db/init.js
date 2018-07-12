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
            question_id INT UNSIGNED AUTO_INCREMENT,
            question_title VARCHAR(100) NOT NULL,
            question_answer VARCHAR(40) NOT NULL,
            question_type INT NOT NULL,
            PRIMARY KEY ( question_id )
    )ENGINE=InnoDB DEFAULT CHARSET=utf8`;
    query(createQuesSql);

    var tbl = "user_tbl";
    var createUserSql = `CREATE TABLE IF NOT EXISTS ${tbl}(
            user_id INT UNSIGNED AUTO_INCREMENT,
            user_name VARCHAR(100) NOT NULL,
            user_phone VARCHAR(40) NOT NULL,
            question_id INT NOT NULL,
            question_result VARCHAR(100),
            submission_date DATE,
            PRIMARY KEY ( user_id )
    )ENGINE=InnoDB DEFAULT CHARSET=utf8`;
    query(createUserSql);

    console.log("初始化完成");
}

export {init,mysql,conf}




