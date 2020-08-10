var express = require('express');
var router = express.Router();
var uploadefile = require("../middleware/uploadfile");
var positionController = require("../controller/positionController");
var auth = require("../middleware/auth");

// 权限验证
router.use(auth);

// 添加职位列表   /api/position/add   uploadfile 上传图片文件
router.post("/add", uploadefile, positionController.add);

// 获取职位列表信息 /api/position/list
router.get("/list", positionController.list);

// 获取单条职位信息， /api/position/findOne/:id
router.get("/findOne/:id", positionController.findOne);

// 编辑数据的提交 /api/position/update
router.post("/update", uploadefile, positionController.update);

// 数据的删除 /api/position/del/:id
router.get("/del/:id", positionController.del);



module.exports = router;