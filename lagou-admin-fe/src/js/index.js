import menuTpl from "../views/menu.html";
import "../router/index";
import "../controller/userController";
import router from "../router";

class Index {
    constructor() {
        this._inintEvent();
        this.render();
    }
    render() {
        $("#menu-container").html(menuTpl);
    }

    // 通过$.ajaxsetup的回调方法，全局获取ajax状态码
    _inintEvent() {
        $.ajaxSetup({
            beforeSend(xhr, setting) {

                let token = localStorage.getItem("token");

                xhr.setRequestHeader("x-access-token", token);
            },
            complete(xhr, setting) {
                console.log(xhr, setting);
                if (xhr.responseJSON.code === 401) {
                    alert(xhr.responseJSON.message);
                    router.go("/index");
                }
            }
        })
    }
}

new Index();