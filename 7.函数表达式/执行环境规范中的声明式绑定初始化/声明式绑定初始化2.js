/**
 * 测试3：函数声明的 声明式绑定初始化。
 *
 */

//1.对于全局代码段，首先创建了 foo的标识符，由于全局环境目前没有foo的绑定，因此创建的是一个 CreateMutableBindings("foo",false)的不可删除的可变标识符绑定。
function foo(){
    console.log(1);
}

//2.又扫描到了 foo的标识符， 这里由于已经存在了foo的绑定了，并且是在全局环境中， 因此会获取当前绑定的属性的属性描述符。并据此做出相应的选择。
//而在这里从结果看，显然是调用了 global.SetMutableBinding("foo",新的这个foo函数声明对象,false)方法重新设置了foo的标识符绑定，进行了函数声明覆盖。
function foo() {
    console.log(2)
}

//3.为了更好的讲述这个过程，我们hack一下，以便观察和证实整个规范的流程的正确性。 参看 声明式绑定初始化3
foo();

//这里证明了是不可删除的
console.log(delete foo);

foo();