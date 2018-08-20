var express = require('express');
var router = express.Router();

var pool = require("../modules/db.js");
var md5 = require("md5");

router.get('/login', function(req, res, next) {
  res.render('login', {
    title: "登录"
  })
});

router.post("/login", function(req, res, next){
  var loginName = req.body.loginName;
  var password = req.body.password;
  var type = req.body.type;
  var remember = req.body.remember;
  console.log(loginName);
  console.log(password);
  if (!loginName || !password) {
    res.json({ code: 201, message: '账号或密码不能为空！' });
    return;
  }

  pool.query("SELECT * FROM `users` WHERE loginName=? AND password=? AND type=?", [loginName, md5(password),type], function(err, result){
    if(err){
      res.json({
        code: 202,
        message: "数据库操作失败！"
      });
      return;
    }

    if(result.length == 0){
      res.json({
        code: 203,
        message: "您的账号或密码或类型有误！"
      });
      return;
    }

    if(result.length > 1){
      res.json({
        code: 204,
        message: "你的账号异常！"
      });
      return;
    }

    var user = result[0];
    if(user.status != 0){
      res.json({
        code: 205,
        message: "你的账号被禁用或删除！"
      });
      return;
    }

    delete user.password;
    req.session.user = user;
    req.session.save();
    res.cookie("user", user);
    // console.log(user);
    res.json({
      code: 200,
      message: "登陆成功！"
    });
  })
  // console.log(type);
  // console.log(remember);
})

router.post("/logout", function(req, res, next){
  // 清空session和cookie
  req.session.user = null;
  res.clearCookie("user");
  // 向客户端相应数据，客户端在根据获取到的数据进行跳转，我们称之为“客户端跳转（渲染）”（推荐），客户端渲染可以把接口和视图分成两个独立的项目，有利于业务逻辑和视图分离。
  res.json({code:200, message: "注销成功！"});
  // 以下两种方式都是“服务器端跳转（渲染）”
  // 方式一：直接跳转到login.ejs视图，缺点是代码和"/login"接口重复，并且浏览器上显示的是logout接口
  // res.render("login", {title: "登录"});
  // 方式二：解决了方式一的两个缺点，推荐使用。
  // res.redirect("/login");
})
module.exports = router;