/*
 * 这里我们 假设要继承一个父类Human，Human类的属性如下:
 *  name 姓名 string基本类型
 *  age  年龄 number基本类型
 *  friends 朋友 Array类型
 *  info 自我介绍 function类型
 *
 *  而我们想要的子类是 Asian ，其额外的属性如下:
 *  country 国家 string基本类型
 *  sayHello 问好 function类型
 */

function Human(name,age,friends){
    this.name=name;
    this.age=age;
    this.friends=friends;
}

Human.prototype.info=function(){
    return "姓名:"+this.name+",年龄:"+this.age;
};


/*
 * 原型链模式：本质是使用 父类的实例作为 子类构造函数的原型对象
 */
(function(){

    function Asian(country){
        //为子类添加自己的实例化属性。
        this.country=country;
    }
    //子类原型对象指向父类实例
    Asian.prototype=new Human("没有名字",0,[]);
    //同时对该原型对象的constructor属性进行添加。
    //因为该原型对象原本是父类的实例，其constructor属性是通过原型链访问到父类的原型对象的constructor属性，该属性指向的是父类的构造函数
    console.log(Asian.prototype.hasOwnProperty("constructor")); //false，本身不具备这个属性，所以下面的行为是添加constructor为子类原型对象的实例属性。
    //此时我们应该人为地添加进行修正。将其指向子类。
    Asian.prototype.constructor=Asian;

    //为子类添加自己的方法， 在原型对象上添加。 需要注意的是，此时的原型对象已经是父类的实例了。
    Asian.prototype.sayHello=function () {
        console.log("你好,我是"+this.country+"人");
    };

    var chinese=new Asian("china");
    //能继承父类的方法和属性。
    console.log(chinese.info());
    chinese.sayHello();
    chinese.name="reveur";
    chinese.age=23;
    console.log(chinese.info());

    //能进行 类型识别
    console.log(chinese instanceof Asian);
    console.log(chinese instanceof Human);

    //那么我们现在来说一下缺陷。

    //1.很明显的缺陷:子类属性的共享化。
    //和 原型模式创建对象一样，原型模式的继承实际上也把 本该 子类对象实例化的父类属性放在了子类的原型对象(也就是父类的实例)上，因此会遇到和原型模式一样的问题.
    //当子类的原型对象中存在 引用类型的属性时, 子类实例通过访问 该引用类型可以创建属性或者修改该引用类型实例的属性，导致所有的子类实例都会受到影响。

    //2.不能向父类构造函数创建参数。 由于在搭建子类原型对象和父类实例的关系时，父类实例已经被确定了，因此父类模板的属性值也就全都确定了，
    //导致了子类构造函数是无法随时创建不一样的父类属性的子类实例的，只能在创建了子类实例后，再为子类实例添加实例属性，阻止其对原型对象的属性的访问。


    console.log(chinese.friends);
    chinese.friends.push("中国人的朋友"); //对引用类型的属性 调用方法修改 引用类型值本身。
    console.log(chinese.friends);
    var japanese=new Asian("japan");
    console.log(japanese.friends); //共享了friends
    chinese.friends.newProperty="中国人为原型对象添加的属性"; //直接对引用类型值 添加属性。
    console.log(japanese.friends.newProperty);//依旧共享

    //因此实际上我们基本不会单纯使用 原型链模式 来实现继承。正如我们不会单独使用原型模式来创建一个引用类型的对象一样。
    //原型链模式的继承中 只是将 原型模式创建对象过程中的 构造函数原型 替换为了 另一个引用类型的实例罢了，本质是丝毫没有改变的。

    //因此 原型链模式 完美的 继承了 原型模式的缺陷。

    //同时也放大了 原型模式中不能为构造函数传参的缺陷：这在使用原型模式创建对象时还显得不那么重要，只是不够优雅，对于原型模式创建对象来说，只是需要在创建好的对象上添加对应的实例属性罢了，至少功能是能够达到的。
    //但是在继承的过程中，这却是一个缺陷了。

    //由此 就又出现了 一个解决方案：借用父类构造函数 实现继承。
}());

console.log("-----------分割线-----------");

/*
 *借用(父类)构造函数模式：在子类的构造函数中调用父类的构造函数。
 */
(function(){

    //在子类的构造函数中，调用 父类的构造函数
    function Asian(name,age,friends,country) {

        //可以看到这里使用父类构造函数的 apply方法将 我们将要创建的子类实例作为其this对象，
        //普通调用构造函数和调用普通函数一样，没有任何差别，
        //因此，原本在父类构造方法中为父类实例添加属性的过程成了为我们传入的这个子类实例对象添加属性的过程。
        //经过这一步，子类对象就实例化了父类的 构造函数中 所规定的属性。
        //由于不涉及对父类原型对象的访问，因此 原型上的属性(方法)是不会被继承的。
        Human.apply(this, Array.prototype.slice.apply(arguments, [0, 3]));


        //开始实例化子类本身的属性。
        this.country = country;
    }

    //在子类原型上添加 子类公有的方法。
    Asian.prototype.sayHello=function () {
        console.log("你好,我是"+this.country+"人");
    };


    //使用子类。

    //可以看到，通过 借用构造函数模式，完美地实现了 自由的向父类构造函数传参。
    var chinese=new Asian("reveur",23,["reveur的朋友"],"China");
    var japanese=new Asian("mike",18,["mike的朋友"],"Japan");



    chinese.sayHello();
    japanese.sayHello();
    //父类的实例化属性也达到了互不干扰的目的。
    console.log(chinese.friends);
    console.log(japanese.friends);
    console.log(chinese.name);
    console.log((japanese.name));
    console.log(chinese.age);
    console.log((japanese.age));

    //但是问题就来了。 下面就是缺陷了。
    // 1.由于过程中不涉及父类原型，因此父类原型上的 父类共享方法，子类实例是访问不到的，由此导致了继承过程中，子类实例中父类方法的丢失。
    console.log(typeof chinese.info); //undefined
    console.log(typeof japanese.info); //undefined

    // 2.同时 也带来了类型识别的问题，子类对象能正确地识别 子类，但是却无法识别其父类。
    console.log(chinese instanceof Asian); //true
    console.log(chinese instanceof Human); //false


    //其中,第1个缺陷还是可以解决的， 正如 构造函数式创建对象的方式那般，将 父类的所有属性都变为实例属性，架空原型。
    //但是这会带来 函数对象 无法被复用的问题，而函数对象本该是复用的一一通过原型对象。 因此，不优雅，解决一个缺陷的同时又带来另一个缺陷。

    //但是，第二个缺陷，类型的识别问题，是无法解决的。
    //要想让子类实例 同时 识别子类本身和父类，只能通过原型链的方式。而 借用构造函数模式，恰好就是不使用原型链模式。

    //因此，正如 组合模式 融合了 构造函数模式和原型模式一样， 组合继承 也融合了 原型链和借用构造函数继承，从而实现正确的实现。
}());

console.log("-----------分割线-----------");

/*
 * 组合继承：
 * 使用借用构造函数模式完成 对所有实例的 实例属性的实例化，
 * 使用原型链模式完成 所有实例 对 所有公有属性方法的 共享。
 */
(function(){

    //使用借用构造函数模式
    function Asian(name,age,friends,country){
        Human.apply(this,Array.prototype.slice.apply(arguments,[0,3]));
        this.country=country;
        //实例属性 实例化完毕
    }

    //开始操作原型对象，完成对公有属性方法的共享以及类型识别。
    Asian.prototype=new Human();
    //修正子类原型对象的 constructor属性。
    Asian.prototype.constructor=Human;

    //添加子类自身的公有方法和属性
    Asian.prototype.sayHello=function () {
        console.log("你好,我是"+this.country+"人");
    };


    //由于使用了 借用构造函数模式，因此能完美地向父类构造函数传参。
    var chinese=new Asian("reveur",23,["reveur的朋友"],"China");
    var japanese=new Asian("mike",18,["mike的朋友"],"Japan");

    //可以看到，所有在构造函数中规定的实例属性都实例化了
    console.log(chinese.friends);
    console.log(japanese.friends);
    console.log(chinese.name);
    console.log((japanese.name));
    console.log(chinese.age);
    console.log((japanese.age));

    //而所有在原型对象上的共享属性和方法都 共享化了
    chinese.sayHello();
    japanese.sayHello();
    console.log(chinese.info());
    console.log(japanese.info());

    //同时，也能正确的进行类型识别。
    console.log(chinese instanceof Asian); //true
    console.log(chinese instanceof Human); //true

    //可以看到，组合继承已经全面地实现了我们想要的继承效果，因此，组合继承可以说是 比较标准的ECMAScript继承模式。
    //但是并非没有缺陷:
    //1.正如组合模式的小缺陷一样，普通的组合继承也有着 构造函数和原型操作分开的问题，显得封装性不够，因此可以通过同样的方式进行 动态组合继承。
    //但是这还不是组合继承主要的缺陷，组合继承的最大缺陷在于第二点。
    //2.可以看出，组合继承中存在着重复存储父类实例属性的问题，即 父类的实例属性具有两份: 第一份在子类的原型对象上，第二份在子类实例上。
    //当然，这是具有解决办法的。
}());


console.log("-----------分割线-----------");

/*
 * 原型式继承 ： 将 待继承对象 设置为 引用类型的原型对象，并创建该引用类型的实例返回。
 * 本质是 将 一个空对象的隐式原型设置为 待继承对象。
 * 从而实现对 该对象的属性的访问。
 */
(function(){

    //原型式继承
    function object(o){
        function F(){
        }
        //待继承对象 设置为 引用类型的原型对象
        F.prototype=o;
        //创建该引用类型的实例返回
        return new F();
    }

    //完全等价的方式
    function object2(o){
        //创建空对象
        var temp={};
        //将空对象的隐式原型指向待继承对象
        temp.__proto__=o;
        //返回该空对象
        return temp;
    }

    //可以看到，完全等同的。均访问到了 待继承对象的原型的constructor属性。
    console.log(object(new Human()).constructor);
    console.log(object2(new Human()).constructor);
    console.log(Object.create(new Human()).constructor);


    //特别得注意一点， 原型式继承 仅仅是 实例获取了 待继承对象的属性以及其原型链上属性的 访问权。 实例并没有这些实例属性！
}());


console.log("-----------分割线-----------");

/*
 * 寄生式继承 ： 对 原型式继承产生的实例 进行增强后返回。
 */
(function(){

    //寄生式继承
    function object(o){
        function F(){
        }
        //待继承对象 设置为 引用类型的原型对象
        F.prototype=o;

        //创建该引用类型的实例
        var temp=new F();

        //增强该实例

        temp.sayHello=function () {
            console.log("寄生式继承 还会增强实例");
        };

        //返回该实例
        return temp;
    }

    //完全等价的方式
    function object2(o){
        //创建空对象
        var temp={};
        //将空对象的隐式原型指向待继承对象
        temp.__proto__=o;

        //增强实例
        temp.sayHello=function () {
            console.log("寄生式继承 还会增强实例");
        };
        //返回该空对象
        return temp;
    }


    object(new Human()).sayHello();
    object2(new Human()).sayHello();

    //寄生式继承具备 构造函数模式创建对象的缺点:函数对象没有复用。
}());

console.log("-----------分割线-----------");

/*
 * 寄生组合继承模式： 直接将 子类原型对象的隐式原型指向父类原型对象，而不借助父类的实例。
 */
(function(){


    function Asian(name,age,friends,country){
        Human.apply(this,Array.prototype.slice.apply(arguments,[0,3]));
        this.country=country;
    }

    //下面我们要做的事就是要将 子类的原型对象 通过隐式原型直接指向 父类的原型对象,
    // Asian.prototype.__proto__=Human.prototype;

    //当然，我们也可以使用一种笨重的方式。也就是寄生式继承来完成这一步。
    function inherit(subtype,supertype){
        //创建一个空对象，继承自父类原型对象
        var prototype=Object.create(supertype.prototype);
        //修正这个空对象的constructor属性，使其指向子类构造函数
        prototype.constructor=subtype;
        //将这个增强后的对象 作为 子类的原型对象。
        subtype.prototype=prototype;
    }


    //使用寄生式继承。完成 这一步。
    //在这里，这种方式其实是多了一步，即创建了新的空对象。
    //因为正常来说， 函数的原型对象是自动就创建了，而且默认属性constructor默认指向构造函数自身。
    //但是这种方式也有好处，即保证了兼容性。
    // 因为有些浏览器可能不支持访问__proto__属性，比如IE，此时我们就只能使用这种标准的方式了。
    inherit(Asian,Human);



    //添加子类自身的公有方法和属性
    Asian.prototype.sayHello=function () {
        console.log("你好,我是"+this.country+"人");
    };


    //由于使用了 借用构造函数模式，因此能完美地向父类构造函数传参。
    var chinese=new Asian("reveur",23,["reveur的朋友"],"China");
    var japanese=new Asian("mike",18,["mike的朋友"],"Japan");

    //可以看到，所有在构造函数中规定的实例属性都实例化了
    console.log(chinese.friends);
    console.log(japanese.friends);
    console.log(chinese.name);
    console.log((japanese.name));
    console.log(chinese.age);
    console.log((japanese.age));

    //而所有在原型对象上的共享属性和方法都 共享化了
    chinese.sayHello();
    japanese.sayHello();
    console.log(chinese.info());
    console.log(japanese.info());

    //同时，也能正确的进行类型识别。
    console.log(chinese instanceof Asian); //true
    console.log(chinese instanceof Human); //true

    console.dir(japanese)
}());

