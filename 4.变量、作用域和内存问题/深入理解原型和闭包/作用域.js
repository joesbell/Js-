//使用匿名立即执行函数模拟全局环境


//函数可以创建作用域，同时作用域内部可以嵌套另一个作用域。
//内部作用域可以访问父级作用域。反之，则不行。
(function(){
    var global="全局作用域下的变量";

    function fn(){
        var local="fn函数作用域的变量";

        function goo(){
            var gooLocal="fn作用域下的goo函数作用域的变量";
            console.log("goo",gooLocal);
            console.log("goo",local);
            console.log("goo",global);
        }
        console.log("fn",goo);
        goo();
        console.log("fn",local);
        console.log("fn",global);
    }


    console.log("全局",fn);
    fn();

    console.log("全局",global);
    console.log("--------------");
// console.log("全局",local);//报错
}());



//ECMAScript没有块级作用域
(function(){
    console.log(i);
    for(var i=0;i<10;i++){
        ;
    }
    console.log(i);

}());