/*
 *  假设我们 想要创建一个 Person的类型，
 *  其所有实例都具有以下属性:
 *  name 姓名 string基本类型
 *  age  年龄 number基本类型
 *  friends 朋友 Array引用类型
 *  info 自我介绍 function类型
 */

/*
 * 普通的创建该对象的方法
 */
(function(){
    //首先创建一个 object类型的对象。可以通过构造函数 也可以通过 对象字面量
    var person=new Object();
    //var person={};

    //其次添加属性
    person.name="reveur";
    person.age=23;
    person.friends=["mike"];
    person.info=function(){
        return "姓名:"+this.name+",年龄:"+this.age;
    }

    console.log(person.info());

    //但是如果要创建多个相似的对象，那么过程就太麻烦了,每次都要书写相似的代码。
    //因此 就有了  工厂模式
}());


console.log("-----------分割线-----------");

/*
 * 工厂模式 将创建对象的过程封装到一个函数中进行。形成了对代码的封装。
 */
(function(){

    //工厂方法，封装普通的创建对象的过程
    function createPerson(name,age,friends){
        var person=new Object();
        person.name=name;
        person.age=age;
        person.friends=friends;
        person.info=function(){
            return "姓名:"+this.name+",年龄:"+this.age;
        };
        return person;
    }

    //可以看到，创建对象本身已经非常简单了。
    var person1=createPerson("reveur",23,["mike"]);
    var person2=createPerson("mike",18,["reveur"]);

    console.log(person1.info());
    console.log(person2.info());

    //但是，这种方式创建的对象是无法分辨其具体引用类型的，我们只能知道这是Object类型，但是更准确的类型我们却不知道了。
    console.log(person1 instanceof Object);
    console.log(person2 instanceof Object);


    //为了解决 对象的类型识别问题 就有了构造函数模式。
}());


console.log("-----------分割线-----------");

/*
 * 构造函数模式，对工厂模式稍作改变。
 */
(function(){

    //构造函数方法，封装普通的创建对象的过程
    //可以看到 构造函数模式和 工厂模式的区别极小。
    function Person(name,age,friends){

        //这里的this指向的是将要创建出的对象
        this.name=name;
        this.age=age;
        this.friends=friends;
        this.info=function(){
            return "姓名:"+this.name+",年龄:"+this.age;
        };

    }

    //创建对象需要使用 new 构造函数名() 的方式创建了
    var person1=new Person("reveur",23,["mike"]);
    var person2=new Person("mike",18,["reveur"]);

    console.log(person1.info());
    console.log(person2.info());


    //这时我们 就解决了对象类型识别的问题了
    console.log(person1 instanceof Object);
    console.log(person2 instanceof Object);
    console.log(person1 instanceof Person);
    console.log(person2 instanceof Person);

    //但是 这种方式也会出现 作为属性的函数无法被复用的情况。 一切都因为 构造函数模式中，属性被过度实例化了。

    console.log(person1.info===person2.info); //false 不是指向同一个函数对象

    //当然构造函数模式本身也可以解决这个问题，只是不具备封装性。

    function Person2(name,age,friends){
        this.name=name;
        this.age=age;
        this.friends=friends;
        /*
         * 将 函数在外部定义并在属性值中引用。这样就保证了函数的复用
         */
        this.info=info;
    }
    //被引用的函数
    function info(){
        return "姓名:"+this.name+",年龄:"+this.age;
    }

    person1=new Person2("reveur",23,["mike"]);
    person2=new Person2("mike",18,["reveur"]);

    console.log(person1.info());
    console.log(person2.info());
    console.log(person1.info===person2.info); //true 指向同一个函数对象

    //但是很显然的，这种方法非常不优雅。


    //为了优雅地解决 属性的过度实例化问题 就有了原型模式。

}());

console.log("-----------分割线-----------");
/*
 * 原型模式，是将对象的属性均放在构造函数的原型对象上。
 * 实例通过访问原型对象上的属性，显得似乎自己拥有这些属性。
 */
(function(){

    //仅仅是为了创建该引用类型罢了。
    function Person(){
    }
    //此时系统已经自动帮我们创建了默认的原型对象,我们可以使用该原型对象并添加属性。
    Person.prototype.name="reveur";
    Person.prototype.age=23;
    Person.prototype.friends=["kitty"];
    Person.prototype.info=function(){
        return "姓名:"+this.name+",年龄:"+this.age;
    };
    //也可以自己重新定义原型对象，但是需要注意的是 别忘了 原型对象默认的 constructor属性.
    // Person.prototype={
    //     constructor:Person,  //别遗漏了.如果要更细致一点，还需要明白constructor属性默认的enumerable特性是false，而这种方式创建的默认特性是true。
    //     name:undefined,
    //     age:undefined,
    //     friends:["kitty"],
    //     info:function(){
    //         return "姓名:"+this.name+",年龄:"+this.age;
    //     }
    // };
    //
    // 这种是对以上不完美的解决方式
    // Person.prototype={
    //     name:undefined,
    //     age:undefined,
    //     friends:["kitty"],
    //     info:function(){
    //         return "姓名:"+this.name+",年龄:"+this.age;
    //     }
    // };
    // Object.defineProperty(Person.prototype,"constructor",{
    //     value:Person,
    //     enumerable:false
    // });



    var person1=new Person();
    var person2=new Person();

    // 函数 得到了 复用。
    console.log(person1.info===person2.info);//true

    console.log(person2.info()); //实例的默认形式

    //这里本质是为实例添加属性，从而阻止对原型属性的访问。
    person1.name="mike";
    console.log(person1.info()); //实例得到修改后的形式。



    //但是我们需要注意的一点是 属性也是被共享复用的。
    //因此会造成以下问题
    //当原型对象上 属性值为引用类型的属性，可以被实例 利用 其指向引用类型对象的 指针调用方法修改自身的属性，从而导致该引用类型的对象本身的属性值被修改。

    person1.friends.push("reveur的朋友"); //friends是指向引用类型对象的指针，我们利用其Array引用类型自带的方法，修改了 friends指针所指向的对象本身的属性。
    console.log(person1.friends);
    console.log(person2.friends); //可以看到，其他实例所访问到的引用类型属性被影响了

    person1.friends.newProperty="甚至可以直接为该引用类型实例添加属性";
    console.log(person1.friends.newProperty);
    console.log(person2.friends.newProperty); //可以看到，其他实例所访问到的引用类型属性被影响了

    //当然，当属性值为基本类型时，是没有问题的。因为：
    //1.基本类型本身是不具有属性的
    //2.基本类型的访问是按值传递的，访问的只是原本值的一个副本罢了，因此也无法通过实例的属性而修改原型对象属性
    //3.实例 添加或修改 属性，只会阻止我们访问原型对象中的同名属性，并不是为原型对象添加或修改同名属性。

    console.log(person1.name); //访问的是实例属性
    console.log("name" in person1); //true 对象能访问到该属性
    console.log(person1.hasOwnProperty("name")); //false 实例具备这个属性
    console.log(Object.getOwnPropertyNames(person1)); // 对象拥有的所有实例属性名
    delete person1.name; //删除的是对象的实例属性 而不是 对象的原型属性。
    console.log(person1.name); //访问的是原型属性
    console.log("name" in person1); //true 对象能访问到该属性
    console.log(person1.hasOwnProperty("name")); //false 实例不具备这个属性
    console.log(Object.getOwnPropertyNames(person1)); //对象拥有的所有实例属性名

    //这里还要辨析一点 。  访问到属性 和 拥有属性 是两个概念。
    // 能访问到属性只是因为实例可以通过原型链能找到该属性。但是这个属性并不一定是属于该实例的。
    // 而拥有属性。则说明的是该实例本身就有这个属性。
    // in 操作符            能判断    对象是否 能访问 到某个属性
    // hasOwnProperty方法   能判断    对象是否 拥有   某个属性


    //为了解决 引用类型属性值 被过度共享的问题，因此有了 组合模式


}());

console.log("-----------分割线-----------");

/*
 * 所谓组合模式，是 组合了构造函数模式和原型模式的使用。
 * 利用 构造函数模式 实例化 属性。
 * 利用 原型模式 复用 同一个函数对象。
 */
(function(){


    // 构造函数模式 实例化 属性
    function Person(name,age,friends){
        this.name=name;
        this.age=age;
        this.friends=friends;
    }

    //原型模式 复用 同一个函数对象
    Person.prototype.info=function(){
        return "姓名:"+this.name+",年龄:"+this.age;
    };

    var person1=new Person("reveur",23,["mike"]);
    var person2=new Person("mike",18,["reveur"]);

    console.log(person1.info());
    console.log(person2.info());

    //属性得到了 实例化。
    person1.friends.push("reveur的朋友");
    person2.friends.push("mike的朋友");
    console.log(person1.friends);
    console.log(person2.friends);

    // 函数 得到了 复用。
    console.log(person1.info===person2.info);//true


    //标准的 创建引用类型对象的模式。 美中不足，原型对象的修改和构造函数的创建是分开的,封装性似乎不足。
    //由此 应运而生， 动态原型模式。
}());

console.log("-----------分割线-----------");

/*
 * 动态原型模式，将 对原型对象的修改封装进 构造函数中。
 */
(function(){

    function Person(name,age,friends){
        this.name=name;
        this.age=age;
        this.friends=friends;

        //当方法不能被访问到时
        if(typeof this.info !="function"){
            console.log("动态修改原型对象");
            Person.prototype.info=function(){
                return "姓名:"+this.name+",年龄:"+this.age;
            };
        }
    }

    var person1=new Person("reveur",23,["mike"]);
    var person2=new Person("mike",18,["reveur"]);

    console.log(person1.info());
    console.log(person2.info());

    //完美
}());


console.log("-----------特殊的创建引用类型的模式-----------");

/*
 * 寄生构造函数模式，只在某些特殊情况下 无法实现 某个引用类型时使用。
 *
 * 本质就是套用了某个引用类型名称的 工厂模式。
 */
(function(){

    //比如我们想实现一个特殊的数组，他具有统计自身数值数组项的功能。
    //但是数组本身我们是无法实现的，因此我们就借用 Array引用类型来创建一个数组对象
    //并对这个Array实例进行增强。
    //最终返回这个增强了的Array实例。
    //从外部来看，就似乎我们真的新建了一个 特殊数组的引用类型。
    //
    function MyArray(){

        //创建数组对象
        var array=new Array();
        array.push.apply(array,arguments);

        //增强数组对象。
        array.mySumNumberMethod=function () {
            var result=0;

            for(var i=0;i<array.length;i++){
                if(typeof array[i]==="number" ){
                    result+=array[i];
                }
            }
            return result;
        };
        //返回增强了的数组对象
        return array;
    }

    var myArray=new MyArray(1,2,3,4,5);

    console.log(myArray.mySumNumberMethod())

    var myArray2=new MyArray(2,3,4);
    console.log(myArray2.mySumNumberMethod());

    //致命缺陷:无法进行真正的 对象类型识别.
    console.log(myArray instanceof MyArray); //false . 如果真能进行类型识别，这里应该是返回true！
    console.log(myArray instanceof Array)    //true
}());



console.log("-----------特殊的创建引用类型的模式-----------");


/*
 * 稳妥构造函数模式，其实真正准确的称呼应该是 稳妥工厂模式。除了构造函数的名称之外，和构造函数没有任何关系。
 * 这个模式指的是 没有公开属性，只有公开的方法，并且方法不使用this的 创建对象的方法。
 *
 * 本质是利用了闭包。
 */
(function(){

    //使用稳妥构造函数模式. 可以看出来就是工厂模式的翻版，只是额外地多了 私有变量和私有函数的功能，这是利用了闭包。
    function Person(name,age,friends){

        //创建对象
        var obj=new Object();

        //定义私有方法和私有属性
        var privateVar="私有变量(函数的局部变量)";

        function privateMethod(){
            console.log("这是函数内部的私有方法");
        }

        //在对象上定义公开的方法和属性
        obj.publicMethod=function(){
            console.log("利用公开的方法调用私有的方法");
            privateMethod();
        };

        obj.publicVar="利用公开的属性，访问"+privateVar;

        obj.info=function(){
            console.log("姓名:"+name+",年龄:"+age);
        };

        return obj;
    }

    //创建对象时，不能使用 new，或者说，使不使用都是没有任何关系的。反正结果都是一致的。这就是一个工厂模式。

    var person1=Person("reveur",18,["mike"]);

    //不能访问私有属性和方法
    console.log(person1.privateVar===undefined);
    console.log(person1.privateMethod==undefined);

    //只能使用提供的公开的方法和属性
    person1.publicMethod();
    person1.info();
    console.log(person1.publicVar);

}());