
//闭包的静态性 分析
function foo(){
    console.log("普通的foo")
}

function outer(){
    //foo是在全局中定义的函数，因此其作用域链只有其本身的活动对象和全局变量对象。
    //虽然在函数内部调用，但是，其本身并不会引用到外部函数的作用域。因此，本身不消耗过多内存。
    foo();

    //分析此时的执行上下文
    // 1. 全局执行上下文。
    // 2. outer的执行上下文: 其作用域链包含 outer活动对象，全局活动对象。
    // 3. foo的执行上下文: 其作用域链包含 foo活动对象，全局活动对象。
}



function outer2(){
    function foo2(){
        console.log("闭包的foo2")
    }


    //而此时就不一样了。
    //天然地，foo2就会在其执行上下文的作用域链中添加外部函数的活动对象，尽管此时是在外部函数中调用的，
    //依然会占用更多的内存。
    foo2();
    //分析此时的执行上下文
    // 1. 全局执行上下文。
    // 2. outer的执行上下文: 其作用域链包含 outer活动对象，全局活动对象。
    // 3. foo的执行上下文: 其作用域链包含 foo活动对象，outer活动对象，全局活动对象。
    //可以看到这里outer函数的活动对象出现了两次。
    //这就是闭包更占用内存的静态原因。 由其函数创建时的行为 所天然决定。
}
outer();
outer2();


//闭包的动态性分析
(function(){

    function outer() {
        var count=0;
        return function(){
            return count++;
        }
        //当外部函数执行完毕时，由于返回了一个闭包函数。
        //而外部又有引用指向这个闭包函数。
        //造成了闭包函数不会被销毁。
        //而闭包函数本身其作用域链上就会携带外部函数的活动对象。
        //造成了本该销毁的外部函数活动对象不能销毁。
        //由此，返回一个闭包返回也会占用更大的内存：因为本该销毁的活动对象没有被销毁。
    }


    var count=outer();

    //可以看出 outer函数活动对象里的 count变量一直存在。 虽然outer已经执行完毕了，但是其活动对象依旧存在。
    console.log(count());
    console.log(count());
}());