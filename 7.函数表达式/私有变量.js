/**
 * ECMAScript中本来是没有私有变量的概念的，但是我们可以通过 函数作用域来实现私有变量，通过闭包来访问私有变量。
 *
 * 这里的私有变量特指 外部通过特权方法来访问 函数内部作用域中的变量。对此，往往有两种实现方式用于实现自定义类型的具有特权方法的对象:
 * 1. 立即执行函数中 创建带有特权方法的构造函数。 一一 这种方式 每个对象的访问到的私有属性是同一个。
 * 2. 构造函数中 定义特权方法。 一一这种方式 每个对象的可访问到的私有属性互不影响。
 */


/**
 *  立即执行函数返回带有特权方法的对象。这也叫做模块模式创建具有特权方法的单例。
 *  在这里我们并不需要一个自定义类型了，而仅仅只是需要获取一个单例对象。
 */
//一个简单的 私有变量访问的例子。
var obj=(function () {
    //a b c都是私有变量。
    var a=1;
    var b=2;
    var c=3;

    //返回一个对象，该对象具有公有方法用于访问该函数中的私有变量。这些方法也叫做特权方法。
    //而此时，一个闭包就形成了。
    return {
        // 特权方法，用于访问私有变量。
        valueOf:function () {
            return ""+a+b+c;
        },
        getA:function () {
            return a;
        },
        setA:function (value) {
            a=value;
        }
    };
}()); //执行完毕后，这个立即函数的执行环境并没有销毁，因为obj的方法中，引用到了该执行环境中的变量。 这就是闭包。

//对象是无法直接访问到私有变量的。
console.log(obj.a==undefined);

//但是对象可以通过公开的属性或者方法访问到私有变量。
console.log(obj==123);
console.log(obj.getA()==1);
//利用特权方法改变私有变量的值
obj.setA("01");
console.log(obj=="0123");

console.log("---------------");

/**
 * 构造函数中 定义特权方法。
 * 这种方式的好处在于 每个对象都是在访问各自的私有变量，并不共享。
 */
function Person(name) {

    //特权方法每次都会被实例化。 私有属性每次也都各自有一份。
    this.getName=function () {
        return name;
    };
    this.setName=function (value) {
        name=value;
    }
}
var person1=new Person("reveur");
console.log(person1.getName()=="reveur");
person1.setName("reveur000");
console.log(person1.getName()=="reveur000");
var person2=new Person("mike");

//各自的特权方法是独立的
console.log(person2.getName!=person1.getName);


/**
 * 立即执行函数中 创建带有特权方法的构造函数
 * 这种方式的好处在于 每个对象都在访问同一份私有变量，特权方法只有一份，在原型链上，高度共享。
 */
(function () {
    //准备被共享的私有变量
    var name;

    //这里使用函数表达式，目的是在全局对象上声明Person变量而不是在立即执行函数的作用域内声明Person变量。
    Person=function (value) {
        name=value;
    };

    //利用原型链 复用特权方法的函数对象
    Person.prototype.getName=function () {
        return name;
    };

    Person.prototype.setName=function (value) {
        name=value;
    }
}());

person2=new Person("reveur");
console.log(person2.getName()=="reveur");
person2.setName("reveur000");
console.log(person2.getName()=="reveur000");

//这里新建对象，修改了私有变量。
person1=new Person("mike");

//引起了旧对象私有变量的改变。 因为他们一起共享同一份私有变量。
console.log(person2.getName()=="mike");

//各自的特权方法是共享的
console.log(person2.getName===person1.getName);
console.log("---------------");

/**
 * 增强模块模式和普通模块模式的本质区别在于：
 * 普通模块模式返回的对象原本是个{},再在{}的基础上增加特权方法，类型信息只有Object类型，不具体。
 * 增强模块模式返回的对象在一个特殊类型对象的基础上添加特权方法后返回的，因此类型信息更加丰富。
 */
person=(function () {
    var sex="man";


    var returnObj=new Person("reveur");

    returnObj.getSex=function () {
        return sex;
    };
    return returnObj;
}());

//可以看到，此时已经从单纯的Object类型单例变成了具有具体类型信息的单例对象了。
console.log(person instanceof Person);
//而且这个单例对象还增强过，具有自己独有的特权方法
console.log(person.getSex()=="man");