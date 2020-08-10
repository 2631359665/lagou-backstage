import SMERouter from "sme-router";
import active from "./active";
import positionController from "../controller/PositionController";

// 第一个参数是dom id ,第二个参数路由的类型： hash, html5，默认是hash
var router = new SMERouter("main-container");

router.use(active);


router.route("/index", (req, res) => {

    res.render("index page");
})

router.route("/position/index", positionController.render.bind(positionController));

router.route("/position/add", positionController.addRender.bind(positionController))

router.route("/position/edit/:id", positionController.editRender.bind(positionController))

router.route("*", (req, res) => {

    res.redirect("/index");
});

export default router;