var express = require("express");

var router = express.Router();

router.get("/add", function(req, res, next){
    res.render("teachers/add", {title: "教师添加"});
})

router.post("/add", function(req, res, next){
    
    res.json({code:200, message: "添加成功！"});
})

router.get("/list", function(req, res, next){
    res.render("teachers/list", {title: "教师列表"});
})

module.exports = router;