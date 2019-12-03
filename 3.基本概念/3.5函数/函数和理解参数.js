
//普通的函数声明

function sayHello(name){
    console.log(name+"说: hello world!");
}

//调用
sayHello("reveur");


//直接使用 arguments对象获取参数
function sayHello2(){
    console.log(arguments[0]+"说: hello world!");
}

//效果一样
sayHello2("reveur");


//arguments对象的一些测试
function add(num1,num2){
    console.log("实际传入函数的参数长度是:"+arguments.length);

    switch (arguments.length){
        case 0:
            console.log("传入参数的长度是:"+arguments.length);
            console.log("此时命名参数值分别是:"+num1+","+num2);
            console.log("此时通过arguments对象下标0，1的元素值是:"+arguments[0]+","+arguments[1]);
            arguments[0]=222;
            console.log("手动修改arguments[0]的值为："+arguments[0]);
            console.log("此时命名参数的第一个的值是否会发生同步呢？"+(arguments[0]===num1));
            num1=22;
            console.log("手动修改命名参数num1的值为："+num1);
            console.log("此时arguments对象的第一个的值是否会发生同步呢？"+(arguments[0]===num1));
            console.log("此时num1:"+num1+",arguments[0]:"+arguments[0]);
            return 0;
        case 1:
            console.log("通过arguments对象获取传入的参数是:"+arguments[0]+",通过命名参数获取的传入的参数是:"+num1);
            console.log("两者的值是否全等?:"+(arguments[0]===num1));
            arguments[0]=null;
            console.log("使用arguments对象对参数进行修改,修改后参数是:"+arguments[0]+",此时，命名参数是:"+num1);
            console.log("两者的值是否全等?:"+(arguments[0]===num1));
            num1=321;
            console.log("使用命名参数对参数进行修改,修改后参数是:"+num1+",此时，arguments对象的参数是:"+arguments[0]);
            console.log("两者的值是否全等?:"+(arguments[0]===num1));
            console.log("此时num1:"+num1+",arguments[0]:"+arguments[0]);
            return ++arguments[0];

        case 2:
            console.log("此时num1:"+num1+",arguments[1]:"+arguments[1]);
            return arguments[1]+num1;

        default:
            console.log("传入的参数大于2个");
            return null;
    }
}

console.log(add());
console.log(add(1));
console.log(add(1,2));
console.log(add(1,2,3));


// 通过arguments对象获取参数列表，因此可以实现任意个数的累加
function noLimitAdd() {
    var sum=0;
    for(var i = 0;i<arguments.length;i++){
        sum+=arguments[i];
    }
    return sum;
}

console.log(noLimitAdd());
console.log(noLimitAdd(1));
console.log(noLimitAdd(1,2,3,4));
console.log(noLimitAdd(1,5,2,3,21));


//没有重载

function addSomeNumber(num1,num2) {
    return num1+1;
}

console.log(addSomeNumber(1,2));  //101 。这里很容易认为是等于2.因为这句语句似乎在下面的声明的上面。
                                  //然而对于 函数声明来说，是在所有代码执行之前就会进行 函数声明提升 这个过程。
                                  //读取并将所有的函数声明放到源代码的顶部。


function addSomeNumber() {
    return (arguments[0]==undefined?0:arguments[0]) +100;
}

console.log(addSomeNumber(1,2));  //101





//然而赋值这种的函数改变 就和上面的函数声明不一样了
function addSomeNumber2(num1,num2) {
    return num1+1;
}

console.log(addSomeNumber2(1,2));  //2

//代码执行到了这里 这个函数才会改变
addSomeNumber2=function () {
    return (arguments[0]==undefined?0:arguments[0]) +100;
}

console.log(addSomeNumber2(1,2));  //101


