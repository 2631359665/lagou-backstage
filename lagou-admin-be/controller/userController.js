const UserModel = require("../model/userModel");
// 字段加密插件
const bcrypt = require("bcrypt");
// 加密密钥
const saltRounds = 10;
// token
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const log = require("../utils/log");


class UserController {


    // 获取token
    _createJWT(username) {
        // 对称加密
        // let toke = jwt.sign(username,"lagouadmin");
        // 非对称加密
        let privateKey = fs.readFileSync(path.resolve(__dirname, "../key/rsa_private_key.pem"))
        let token = jwt.sign(username, privateKey, { algorithm: "RS256" });
        console.log("token", token);
        return token;
    }

    // 加密密码
    _createHashPwd(password) {
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(password, salt);
    }

    // 检测密码正确性
    _comparePwd(pwd, hash) {
        return bcrypt.compareSync(pwd, hash);
    }

    async singin(req, res) {

        let { username, password } = req.body;
        console.log(req.body);
        // 用户名长度验证,用户名长度：6~10
        if (!/^\w{5,10}$/.test(username)) {
            res.json({
                code: -1,
                message: "用户名长度：6~10"
            });
            return;
        }


        // 验证用户名唯一性
        let user = await UserModel.findOne({ username });
        if (user) {
            res.send({
                code: -1,
                message: "用户名重复"
            });
            return;
        }

        password = this._createHashPwd(password);

        // 数据入库
        let result = await UserModel.save({ username, password });
        // console.log(result);

        if (result) {
            // 使用了cookie-session插件后，可以通过req.session获取session
            req.session.username = username;
            res.json({
                code: 1,
                message: "用户注册成功",
                username: result.username
            });
        } else {
            res.json({
                code: -1,
                message: "用户注册失败",
            });
        }

    }

    // 登录
    async login(req, res) {
        let { username, password } = req.body;
        let user = await UserModel.findOne({ username });
        if (!user) {
            res.json({
                code: -1,
                message: "用户不存在"
            });
            return;
        }

        // 判断用户传过来的密码是否正确
        let rs = this._comparePwd(password, user.password);
        if (rs) {
            log.debug(user.username + "登录成功")
                // 添加token,向header里面添加一个自定义字段
            let token = this._createJWT(user.username);
            res.set("X-ACCESS-TOKEN", token);
            // 使用了cookie-session插件，并配置后，可以通过req.session获取session
            req.session.username = user.username;
            res.json({
                code: 1,
                username: user.username,
                message: "用户登录成功"
            });
        } else {
            res.json({
                code: -1,
                message: "用户登录失败"
            });
            log.debug(user.username + "登录失败");
        }
    }

    // 登出
    logout(req, res) {
        try {
            req.session.username = null;
            res.json({
                code: 1,
                message: "用户退出成功"
            });
        } catch (error) {
            console.log(error);
        }

    }

    // 判断是否登录
    islogin(req, res) {
        if (req.session.username) {
            res.json({
                code: 1,
                username: req.session.username,
                message: "用户已登录"
            });
        } else {
            res.json({
                code: -1,
                message: "用户未登录"
            });
        }
    }
}


module.exports = new UserController();