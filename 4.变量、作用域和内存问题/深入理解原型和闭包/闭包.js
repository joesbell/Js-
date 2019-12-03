
//简单的闭包运用。
(function(){
    function fn(x){
        var max=x;
        return function bar(y){
            if(y>max)
            {
                console.log("超出");
            }else {
                console.log("没有超出");
            }
        }
    }

    var mybar=fn(10);
    var max=100;
    mybar(15); //打印 超出

    var mybar2=fn(16);
    mybar2(15);

}());

console.log("--------------------");
//闭包的副作用
(function(){
    var array=[];
    var i;
    for(i=0;i<10;i++){
        array[i]=function(){
            return i;
        }
    }

    var j;
    for(j=0;j<10;j++){
        console.log(array[j]());
    }
}());


console.log("--------------------");
//直接使用值，避免副作用
(function(){
    var array=[];
    var i;
    for(i=0;i<10;i++){
        array[i]=i;
    }

    var j;
    for(j=0;j<10;j++){
        console.log(array[j]);
    }
}());


console.log("--------------------");
//运用 立即执行表达式。 本质还是使用的是值。
(function(){
    var array=[];
    var i;
    for(i=0;i<10;i++){
        array[i]=function(x){
            return x;
        }(i);
    }

    var j;
    for(j=0;j<10;j++){
        console.log(array[j]);
    }
}());


console.log("--------------------");

//另一种方式， 再创建一个闭包用来保存过程中的每一个值
(function(){
    var array=[];
    var i;
    for(i=0;i<10;i++){
        array[i]=function(x){
            var value=x;
            return function(){
                return value;
            }
        }(i);
    }

    for(i=0;i<10;i++){
        console.log(array[i]());
    }

}());