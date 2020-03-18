$(function () {
    /*动态轮播图*/
    banner();
    /*移动端产品区块的页签*/
    initMobileTab();
    /*初始工具提示组件*/
    $('[data-toggle="tooltip"]').tooltip();
});

var banner = function () {
    /*1.获取轮播图数据    使用ajax技术 */
    /*2.根据数据动态渲染，根据当前设备（判断屏幕宽度）选择数据 */
    /*2.1 准备数据*/
    /*2.2 把数据转换成html格式的字符串
    （三种方法：1.动态创建元素，2.字符串拼接，3.模版引擎【artTemplate，腾讯开发的，性能很好】，4.框架渲染*/
    /*2.3 把字符渲染到页面当中*/
    /*3.测试功能，页面尺寸发生改变时应该重新渲染*/
    /*4.移动端手势切换  touch*/

    /*ui框架：bootstrap,妹子UI,jqueryUI,easyUI,jqueryMobile,mui,framework7*/
    /*关于移动端的UI框架：bootstrap,jqueryMobile,mui,framework7*/
    /*模板引擎：artTemplate,handlebars,mustache,baiduTemplate,velocity,underscore*/

    //获取数据
    //注意做数据缓存，解决页面尺寸发生改变时不断ajax请求的问题
    var getData = function (callback) {
        /*如果缓存了数据，就不用进行ajax请求，直接执行callback*/
        if(window.data){
            callback && callback(window.data);
        }else {
            /*1.获取轮播图数据*/
            $.ajax({
                type:'get',
                // 这里注意路径，js文件是在html里面用的，html文件和data.json的相对路径
                url:'js/data.json',
                /*强制转换后台返回的数据为json对象*/
                /*强制转换不成功程序报错，不会执行success,而是执行error回调*/
                dataType:'json',
                data:'',
                success:function (data) {
                    console.log(data);
                    // 把第一次ajax请求的数据缓存下来
                    window.data = data;
                    callback && callback(window.data);
                }
            });
        }
    }
    // 渲染
    var render = function () {
        getData(function (data) {
            /*2.根据数据动态渲染  根据当前设备  屏幕宽度判断 */
            var isMobile = $(window).width() < 768 ? true : false;
            //console.log(isMobile);
            /*2.1 准备数据*/
            /*2.2 把数据转换成html格式的字符串*/
            /*使用模版引擎，首先确认哪些html静态内容需要动态渲染的：点容器，图片容器*/
            /*新建模版*/
            /*开始使用*/
            /*<% console.log(list); %> 模版引擎内不可使用外部变量 */
            // data是数组，不能直接当参数。template函数的第二个参数是对象，所以这里要构建一个对象
            // 返回值是html格式的字符串
            var pointHtml = template('pointTemplate',{list:data});
            console.log(pointHtml);
            var imageHtml = template('imageTemplate',{list:data,isMobile:isMobile});
            //console.log(imageHtml);
            /*2.3 把字符渲染页面当中*/
            $('.carousel-indicators').html(pointHtml);
            $('.carousel-inner').html(imageHtml);
        });
    }
    /*3.测试功能 页面尺寸发生改变事件*/
    $(window).on('resize',function () {
        render();
        /*通过js主动触发resize，就不用在外面调用render();了*/
    }).trigger('resize');

    /*4.移动端手势切换（注意不是滑动切换）*/
    // 注意和原生不太一样，这里是jquery实现
    var startX = 0;
    var distanceX = 0;
    var isMove = false;
    // 这里e是jquery封装后的事件对象e.touches[0].clientX获取不到
    /*originalEvent 代表js原生事件*/
    $('.wjs_banner').on('touchstart',function (e) {
        startX = e.originalEvent.touches[0].clientX;
    }).on('touchmove',function (e) {
        var moveX = e.originalEvent.touches[0].clientX;
        distanceX = moveX - startX;
        isMove = true;
    }).on('touchend',function (e) {
        /*距离足够 50px 一定要滑动过*/
        if(isMove && Math.abs(distanceX) > 50){
            /*手势*/
            /*左滑手势*/
            if(distanceX < 0){
                //console.log('next');
                $('.carousel').carousel('next');
            }
            /*右滑手势*/
            else {
                //console.log('prev');
                $('.carousel').carousel('prev');
            }
        }
        //重置参数
        startX = 0;
        distanceX = 0;
        isMove = false;
    });

}

// 产品模块
// 初始化移动端标签页
var initMobileTab = function () {
    /*1.解决产品标签页在移动端的换行问题*/
    // 拿到n个li的宽度之和给外面的ul
    var $navTabs = $('.wjs_product .nav-tabs'); //ul
    var width = 0;
    $navTabs.find('li').each(function (i, item) {  //遍历，求和
        var $currLi = $(this);//也可以是$(item)，两者一样;
        /*
        * width()  内容
        * innerWidth() 内容+内边距
        * outerWidth() 内容+内边距+边框
        * outerWidth(true) 内容+内边距+边框+外边距
        * */
        var liWidth = $currLi.outerWidth(true);
        width += liWidth;
    });
    console.log(width);
    $navTabs.width(width); //设置ul的宽度

    /*2.修改结构，使之符合区域滑动，父元素套着子元素，子元素的宽度要大于父元素*/
    //加 .nav-tabs 套一个父容器叫  .nav-tabs-parent
    //让父容器和设备宽度一致，溢出隐藏

    /*3.自己实现滑动效果 或者 使用iscroll */
    //第一个参数是父元素dom对象，$('.nav-tabs-parent')是jquery对象，要转换成dom对象
    new IScroll($('.nav-tabs-parent')[0],{
        scrollX:true,
        scrollY:false,
        click:true
        //点击默认被IScroll插件禁用了，这里手动把它开启，不然不能点击标签
    });
}
