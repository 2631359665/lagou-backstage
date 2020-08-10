import posTpl from "../views/positon.html";
import posAddTpl from "../views/positionAdd.html";
import posEditTpl from "../views/positionEdit.html"
// 引入scss文件不需要做处理，webpack打包编译时自动处理scss文件
import "../style/positino.scss";
import router from "../router";
import handlebars, { compile } from "handlebars";
import {get, post } from "../model/https";

class PositionController {

    constructor() {
        this.keyword = "";
        this.pagesize = 5;
        this.pageno = 1;
        this.sortname = "salary";
        this.sort = "asc";
        this._initEvent();
    }
    async render(req, res) {
        if (req.query) {
            this.keyword = req.query.keyword;
            this.pagesize = req.query.pagesize;
            this.pageno = req.query.pageno;
            this.sortname = req.query.sortname;
            this.sort = req.query.sort;
        }
        // 将res存储起来
        this.res = res;
        // 获取列表数据
        let dataset = await this._queryList();
        // 生成html
        let html = this._createListHtml(dataset);
        res.render(html);
    }

    addRender(req, res) {
        res.render(posAddTpl);
    }

    async editRender(req, res) {
        let dataset = await get(`/api/position/findOne/${req.params.id}`);
        let html = handlebars.compile(posEditTpl)(dataset.data);
        res.render(html);
    }



    _initEvent() {
        let self = this;

        let $container = $("#main-container");

        // 新增职位
        $container.on("click", "#position-add", () => router.go("/position/add"));
        // 搜索
        $container.on("click", "#position-search", () => this._searhHandler());
        // 新增职位提交
        $container.on("click", "#btn-submit", () => this._addSubmit());
        // 新增职位返回
        $container.on("click", "#btn-back", () => router.go("/position/index"));

        // 编辑数据页面的返回按钮事件
        $container.on("click", "#posback", () => router.go("/position/index"));

        // 编辑数据页面的提交按钮事件
        $container.on("click", "#btn-update", () => this._updateSubmit());

        // 编辑
        $container.on("click", ".edit", function() {
            let id = $(this).attr("data-id");
            router.go(`/position/edit/${id}`);
        });

        // 数据删除
        $container.on("click", ".del", function() {
            let id = $(this).attr("data-id");
            self._delHandler(id);
        });

    }

    // 添加职位列表
    _addSubmit() {
        $("#position-add-from").ajaxSubmit({
            success: (result) => {
                alert(result.message);
                if (result.code === 1) {
                    router.go("/position/index");
                }
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    // 更新职位列表
    _updateSubmit() {
        $("#position-update-form").ajaxSubmit({
            success: (result) => {
                alert(result.message);
                if (result.code === 1) {
                    router.go("/position/index");
                }
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    async _delHandler(id) {
        let rs = await get(`/api/position/del/${id}`);
        alert(rs.message)
        if (rs.code === 1) {
            // 当前页面hash值和跳转的hash一致，导致页面不会跟新
            // router.go("/position/index");
            // 解决办法: 手动重新渲染页面
            let dataset = await this._queryList();
            let html = this._createListHtml(dataset);
            this.res.render(html);
        }
    }

    // 搜索
    async _searhHandler() {
        this.keyword = $("#search-txt").value;
        this.pageno = 1;
        let dataset = await this._queryList();
        let html = this._createListHtml(dataset);
        this.res.render(html);
    }

    // 查询职位列表
    _queryList() {
        let params = {
            keyword: this.keyword,
            pagesize: this.pagesize,
            pageno: this.pageno,
            sortname: this.sortname,
            sort: this.sort
        }
        return get("/api/position/list", params);
    }


    // 根据传入的数据，动态生成html
    _createListHtml(dataset) {
        // console.log(dataset);
        let total = dataset.total;
        let pages = [];
        let len = Math.ceil(total / this.pagesize);
        for (let i = 1; i <= len; i++) {
            pages.push(i);
        }
        let html = handlebars.compile(posTpl)({
            list: dataset.data,
            pages,
            pagesize: this.pagesize,
            pageno: this.pageno,
            keyword: this.keyword,
            sortname: this.sortname,
            sort: this.sort
        });

        // 给页码添加active样式
        let timer = setTimeout(() => {
            $(".pagination").find("li[data-id=" + this.pageno + "]")
                .addClass("active").siblings().removeClass("active");
            clearTimeout(timer);
        }, 0);
        return html;
    }
}


export default new PositionController();