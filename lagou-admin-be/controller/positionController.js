const posModel = require("../model/positionModel");


class positionController {
    async add(req, res) {
        req.body.createTime = new Date().toLocaleDateString();
        try {

            let rs = await posModel.save(req.body);
            if (rs) {
                res.json({
                    code: 1,
                    message: "添加职位信息成功"
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                code: -1,
                message: "添加职位信息失败"
            });
        }

    }
    async list(req, res) {
        // 关键字，分页大小，页号，排序，正序
        let { keyword, pagesize, pageno, sortname, sort } = req.query;
        let data = await posModel.query(req.query);
        let total = await posModel.count(keyword);

        res.json({
            code: 1,
            data,
            total
        });
    }

    async findOne(req, res) {
        let id = req.params.id;
        let data = await posModel.findOne(id);
        res.send({
            code: 1,
            data
        });
    }

    async update(req, res) {
        let _id = req.body.id;
        delete req.body.id;
        let rs = await posModel.update(_id, req.body);
        if (rs.nModified) {
            res.send({
                code: 1,
                message: "更新职位成功"
            });
        } else {
            res.send({
                code: -1,
                message: "更新职位失败"
            });
        }
    }

    async del(req, res) {
        let id = req.params.id;
        let rs = await posModel.remove(id);
        if (rs.deletedCount) {
            res.json({
                code: 1,
                message: "删除数据成功"
            });
        } else {
            res.json({
                code: -1,
                message: "删除数据失败"
            });
        }
    }


}

module.exports = new positionController();