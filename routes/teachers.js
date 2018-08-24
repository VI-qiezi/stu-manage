var express = require("express");

var router = express.Router();

var pool = require("../modules/db.js");
var md5 = require("md5");
var checkLogin = require("../modules/checkLogin.js");

router.get("/add", checkLogin, function (req, res, next) {
    var sql = `
    SELECT * FROM majors WHERE status = 0;
    SELECT * FROM classes WHERE status = 0;
    SELECT * FROM departments WHERE status = 0;
    `;
    pool.query(sql, function (err, result) {
        if (err) {
            res.json({ code: 201, message: "数据库操作异常！" });
            return;
        }
        res.render("teachers/add", { title: "教师添加", majors: result[0], classes: result[1], departs: result[2] });
    })
})

router.post("/add", checkLogin, function (req, res, next) {
    var tno = req.body.tno;
    var name = req.body.name;
    var sex = req.body.sex;
    var birthday = req.body.birthday;
    var card = req.body.card;
    var majorId = req.body.majorId;
    var classId = req.body.classId;
    var departId = req.body.departId;
    var nativePlace = req.body.nativePlace;
    var address = req.body.address;
    var qq = req.body.qq;
    var phone = req.body.phone;
    var email = req.body.email;
    // 服务器端判断
    if (!tno || !name || !sex || !birthday || !card || majorId == -1 || classId == -1 || departId == -1) {
        res.json({ code: 201, message: "教师编号，姓名，性别，生日，身份证号，所学专业，所属班级，所属院系不能为空！" });
        return;
    }

    // 数据库操作
    // 判断教师表中是否存在tno
    pool.query(`SELECT * FROM teachers WHERE tno=?`, [tno], function (err, result) {
        if (err) {
            res.json({ code: 202, message: "数据库操作异常！" });
            return;
        }
        if (result.length > 0) {
            res.json({ code: 203, message: "你添加的教师已存在！" });
            return;
        }

        // 向教师表和用户表中添加数据
        var sql = `INSERT INTO teachers(tno, name, sex, birthday, card, majorId, classId, departId, nativePlace, address, qq, phone, email, status, createTime, createUserId) VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        var data = [tno, name, sex, birthday, card, majorId, classId, departId, nativePlace, address, qq, phone, email, 0, new Date(), req.session.user.id];
        pool.query(sql, data, function (err, result1) {
            if (err) {
                res.json({ code: 204, message: "数据库操作异常！" });
                return;
            }
            pool.query(`INSERT INTO users(loginName, password, type, status) VALUE(?,?,?,?)`, [tno, md5("123456"), 1, 0], function (err, result2) {
                if (err) {
                    res.json({ code: 205, message: "数据库操作异常！" });
                    return;
                }
                res.json({ code: 200, message: "添加成功！" });
            })
        })

    })

})

router.get("/list", checkLogin, function (req, res, next) {
    var sql = `
    SELECT * FROM majors WHERE status = 0;
    SELECT * FROM classes WHERE status = 0;
    SELECT * FROM departments WHERE status = 0;
    SELECT t.id, t.tno, t.name, t.sex, t.birthday, t.card, t.majorId, t.classId, t.departId, t.nativePlace, t.address, t.qq, t.phone, t.email, t.status, t.createTime, t.createUserId, t.updateTime, t.updateUserId, d.name AS departName ,m.name AS majorName, c.name AS className, u1.loginName AS createUserName, u2.loginName AS updateUserName FROM teachers t 
    LEFT JOIN departments d ON t.departId = d.id 
    LEFT JOIN majors m ON t.majorId = m.id 
    LEFT JOIN classes c ON t.classId = c.id 
    LEFT JOIN users u1 ON t.createUserId = u1.id
    LEFT JOIN users u2 ON t.updateUserId = u2.id
    WHERE (1=1)
    `;
    var tno = req.query.tno;
    var name = req.query.name;
    var sex = req.query.sex;
    var majorId = req.query.majorId;
    var classId = req.query.classId;
    var departId = req.query.departId;
    var status = req.query.status;
    var birthdayBegin = req.query.birthdayBegin;
    var birthdayEnd = req.query.birthdayEnd;
    var card = req.query.card;

    if (tno) {
        sql += ` AND t.tno LIKE '%${tno}%'`;
    }
    if (name) {
        sql += ` AND t.name LIKE '%${name}%'`;
    }
    if (sex && sex != -1) {
        sql += ` AND t.sex = '${sex}'`;
    }
    if (majorId && majorId != -1) {
        sql += ` AND t.majorId = '${majorId}'`;
    }
    if (classId && classId != -1) {
        sql += ` AND t.classId = '${classId}'`;
    }
    if (departId && departId != -1) {
        sql += ` AND t.departId = '${departId}'`;
    }
    if (status && status != -1) {
        sql += ` AND t.status = '${status}'`;
    }
    if (birthdayBegin && birthdayEnd) {
        try {
            var begin = new Date(birthdayBegin);
            var end = new Date(birthdayEnd);
            if (begin >= end) {
                sql += ` AND t.birthday >= '${birthdayEnd}' AND t.birthday <= '${birthdayBegin}'`;
            } else {
                sql += ` AND t.birthday >= '${birthdayBegin}' AND t.birthday <= '${birthdayEnd}'`;
            }
        } catch (error) {
            res.json({ code: 201, message: "日期输入错误！" });
            return;
        }
    } else {
        if (birthdayBegin) {
            sql += ` AND t.birthday >= '${birthdayBegin}'`;
        }
        if (birthdayEnd) {
            sql += ` AND t.birthday <= '${birthdayEnd}'`;
        }
    }
    if (card) {
        sql += ` AND t.card LIKE '%${card}%'`;
    }
    sql += 'ORDER BY t.id';
    pool.query(sql, function (err, result) {
        if (err) {
            res.json({ code: 202, message: "数据库操作异常！" });
            return;
        }
        res.render("teachers/list", { title: "教师列表", teachers: result[3], majors: result[0], classes: result[1], departs: result[2] });
    })
})
router.get("/edit/:id", checkLogin, function(req, res, next){
    var id = req.params.id;
    if(!id){
        res.json({code: 201, message: "参数id必填！"});
        return;
    }
    var sql = `
    SELECT * FROM teachers WHERE id=?;
    SELECT * FROM majors WHERE status = 0;
    SELECT * FROM classes WHERE status = 0;
    SELECT * FROM departments WHERE status = 0;
    `;
    pool.query(sql, [id], function(err, result){
        if(err){
            res.json({code: 202, message: "数据库操作异常！"});
            return;
        }
        res.render("teachers/edit", {title: "编辑教师", teacher: result[0][0], majors: result[1], classes: result[2], departs: result[3]});
    })
    
})

router.post("/edit", checkLogin, function(req, res, next){
    var id = req.body.id;
    var tno = req.body.tno;
    var name = req.body.name;
    var sex = req.body.sex;
    var birthday = req.body.birthday;
    var card = req.body.card;
    var departId = req.body.departId - 0;
    var majorId = req.body.majorId - 0;
    var classId = req.body.classId - 0;
    var nativePlace = req.body.nativePlace;
    var address = req.body.address;
    var qq = req.body.qq;
    var phone = req.body.phone;
    var email = req.body.email;
    
    if(!id || !tno || !name || !sex || !birthday || departId == -1 || majorId == -1 || classId == -1){
        res.json({code: 201, message: "教师编号，姓名，性别，出生日期，身份证号，所属院系，所属专业，所属班级不能为空！"});
        return;
    }

    pool.query(`SELECT * FROM teachers WHERE id=?`, [id], function(err, result){
        if(err){
            res.json({code: 202, message: "数据库操作异常！"});
            return;
        }
        if(result[0].length > 1 || result[0].length < 1){
            res.json({code: 203, message: "你编辑的教师不存在！"});
            return;
        }

        var sql = `
        UPDATE teachers SET tno=?,name=?,sex=?,birthday=?,card=?,majorId=?,classId=?,departId=?,nativePlace=?,address=?,qq=?,phone=?,email=?,updateTime=?,updateUserId=? WHERE id=?`;
        var data = [tno, name, sex, birthday, card, majorId, classId, departId, nativePlace, address, qq, phone, email, new Date(), req.session.user.id, id];
        pool.query(sql, data, function(err, result1){
            if(err){
                res.json({code: 204, message: "数据库操作异常！"});
                return;
            }
            res.json({code:200, message: "修改成功！"});
        })
    })
    
})
module.exports = router;