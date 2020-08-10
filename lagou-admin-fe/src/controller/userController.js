import userTpl from "../views/user.html";
import handlebars from "handlebars";
import {get, post } from "../model/https";

class userController {
    constructor() {
        this.user = {
            // 是否显示登录/登出
            islogin: false,
            // 用户名
            username: "王景志",
            // 登录/注册， true：登录 false：注册
            shwologin: true
        }
        this._initEvent();
        this._islogin();
        this.render();
    }

    render() {
        const template = handlebars.compile(userTpl);
        let html = template(this.user);
        $("#user-container").html(html);
    }

    // 不允许在外部访问
    _initEvent() {
        let $userContainer = $("#user-container");

        // 登录点击事件
        $userContainer.on("click", "#login", () => this._setInfo("登录", true));
        // 注册点击事件
        $userContainer.on("click", "#signin", () => this._setInfo("注册", false));

        // 登录、注册
        $userContainer.on("click", "#btn_submit", () => this._submit());
        // 登出
        $userContainer.on("click", "#btn_logout", () => this._logout());
    }

    // 设置标题
    _setInfo(title, shwologin) {
        $(".box-title").html(title);
        this.user.shwologin = shwologin;
    }

    // 登录和注册
    async _submit() {
        let url = "/api/user/singin";
        if (this.user.shwologin) {
            url = "/api/user/login";
        }
        // 使用jquery序列化方法发送数据, key为input的name,value为input的value
        let params = $("#user-form").serialize();
        let rs = await post(url, params);
        if (rs.code === 1) {
            console.log(rs);
            let token = rs.xhr.getResponseHeader("x-access-token");
            if (token) {
                localStorage.setItem("token", token);
            }
            this.user.username = rs.username;
            this.user.islogin = true;
            this.render();
        }
        alert(rs.message);
    }

    // 登出
    async _logout() {
        let url = "/api/user/logout";
        let res = await get(url);
        if (res.code === 1) {
            this.user.username = "";
            this.user.islogin = false;
            this.render();
        } else {
            alert(res.message);
        }
    }

    // 判断用户是否登录
    async _islogin() {
        let result = await get("/api/user/islogin");
        if (result.code === 1) {
            this.user.username = result.username;
            this.user.islogin = true;
            this.render();
        } else {
            console.log(result);
        }
    }

}

export default new userController();