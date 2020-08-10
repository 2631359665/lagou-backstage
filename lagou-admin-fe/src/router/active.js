export default function Active(req) {
    let url = req.url;
    // 当前需要选中的
    // console.log(req.url);
    let li = $("#menu-container li").find(`a[href='#${url}']`).parent();
    li.addClass("active").siblings().removeClass("active");

}