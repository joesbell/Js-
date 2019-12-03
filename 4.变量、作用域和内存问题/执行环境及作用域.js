
//try-catch 语句 延长作用域的形式
(function(){
    try{
        console.log(a);


        /*
         * 可以看到，尽管当前作用域中根本没有 myError这个变量，
         * 但是，myError竟然可以正常使用。
         * 因此，可以说catch语句本身就创建了一个新的作用域，而传入这个作用域的参数就是myError变量。
         * 这个变量又是如何获取的呢? 是由于 try块代码执行发生异常，catch块因此就截获了这个异常获取的。
         */
    } catch(myError){
        var b=10;
        console.log("捕捉到异常:"+myError.name+",其信息是:"+myError.message);
    }

    console.log(b);
}());



var person={
    name:"reveur",
    age:23
};


/*
*与 try-catch块有所不同的是，with语句其实更多的是一种语法糖。
*  with语句本身并不新建一个变量，with所引用的对象本身就是该作用域能访问到的变量(自由变量).
*  使用with语句更多的只是为了方便书写。
*
*/
(function(){
    var name="mike";
    var age=18;

    var message;

    // message="我叫:"+person.name+",我今年:"+person.age;

    /*
     * 可以看到，由于使用了with语句
     * 我们可以不再显式地写出 person.name person.age就可以让代码自动地先在person对象上寻找
     * 在with作用域下的自由变量的取值。
     * 这一切都是因为，with语句将 person对象 添加到了作用域链的最前端。而自由变量的寻找就是从作用域链的最前端开始的。
     */
    with(person){
        message="我叫:"+name+",我今年:"+age;
    }

    console.log(message);

}());
