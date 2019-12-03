/*
 * 这里再深入研究下 实例的隐式原型究竟是什么.
 *
 * 结论:
 * 实例的隐式原型是实例内部的[[prototype]]属性。
 * __proto__只是Object.prototype 提供的一个修改实例的[[prototype]]属性的访问器入口罢了。
 */
console.log("---------------引子---------------");
(function(){
    function Foo(){

    }

    function Goo(){

    }

    var foo=new Foo();

    //首先，我们可以非常清楚地看出来，  实例本身是没有 __proto__这个实例属性的。
    console.log(Object.getOwnPropertyNames(foo).some(function(item,index,array){
        return item==="__proto__";
    }) === false);


    //__proto__属性是在 Object.prototype 上定义的。因此，所有的实例访问其__proto__属性，其实是访问的Object.prototype的__proto__.
    console.log(Object.getOwnPropertyNames(Object.prototype).some(function(item,index,array){
        return item==="__proto__";
    }) === true);

    // 这也能证明 __proto__并不是实例属性。
    console.log(foo.hasOwnProperty("__proto__")===false);

    //当然 令人吃惊的在这里，我们似乎在为foo添加一个名字叫__proto__实例属性
    foo.__proto__=Goo.prototype;
    //然而 添加完成后，依旧在实例上依旧没有这个属性，这是怎么回事呢?
    console.log(foo.hasOwnProperty("__proto__")===false);

}());

console.log("---------------研究过程1开始---------------");
/*
因为 __proto__并不是 数据类型的属性，而是 访问器属性。 对 访问器属性的 访问具有比 数据类型 更高的优先级。
也就是说， 我们对实例的 属性 进行赋值的时候，后台进行的操作是：
1. 这个 被访问的属性，在原型链上 具有同名的访问器属性吗？ 如果有，那么进行 访问器属性的 set方法调用。
2. 如果不是访问器属性，那么就是数据类型属性，才在实例对象上 进行 属性的添加或者修改。

下面我们来证明这一点。

当然，只是在这里正确的，这个结论是不精准的。 精准的参看研究过程3
 */
(function(){
    var aPrototype={};
    var bPrototype={};
    Object.defineProperty(aPrototype,"_name_",{
        set:function(){
            console.log("调用了aPrototype的访问器属性set");
        }
        ,
        get:function(){
            return "调用了aPrototype的访问器属性get";
        }
    });
    Object.defineProperty(bPrototype,"_age_",{
        set:function(){
            console.log("调用了bPrototype的访问器属性set");
        }
        ,
        get:function(){
            return "调用了bPrototype的访问器属性get";
        }

    });

    bPrototype.__proto__=aPrototype;

    function Foo(){

    }
    Foo.prototype=bPrototype;

    var foo=new Foo();
    //可以看到，访问器属性具有极高的优先级。普通的赋值是无法为对象添加 在原型链上与访问器属性同名的数据类型 属性的。
    console.log(foo._name_);
    foo._name_="something";
    console.log(foo._age_);
    foo._age_=23;
    console.log(Object.getOwnPropertyNames(foo).length==0); //因此实例上根本就没添加属性。

    delete foo._name_; //因此根本没用，本身实例上就不具备这个属性， 也不可能通过实例删除其隐式原型对象中的访问器属性
    console.log(foo._name_);

    //普通的赋值是不可能改变其访问器属性的，唯一能让实例上添加 访问器同名属性的方式就是使用 定义属性。

    Object.defineProperty(foo,"_name_",{
            configurable:true,
            value:"只有定义的方式才能新增 与 访问器属性同名的数据属性",
            writable:true
        }
    );

    //可以看到，这里果然就是新增属性了
    console.log(foo._name_);
    console.log(foo.hasOwnProperty("_name_")); //true
    foo._name_="此时就可以通过赋值的方式修改实例的数据属性了";
    console.log(foo._name_);
    delete foo._name_;//此时就能删除其数据属性了

    //删除实例的该数据属性后，又会按照原型链，访问其 访问器属性了。
    console.log(foo._name_)
}());

console.log("---------------研究过程1结束---------------");


//从这里我们就能看出来， __proto__本质上是 Object.prototype上的 访问器属性。

console.log(Object.getOwnPropertyNames(Object.prototype).some(function(item,index,array){
    return item==="__proto__";
})===true);

//这里通过获取 Object.prototype的__proto__属性的特性描述符对象 更加证明了这一点， __proto__是Object.prototype的访问器属性。
console.log(typeof Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").get ==="function");
console.log(typeof Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set ==="function");


/*
 * 总结一下， 在实例中，其实有一个属性叫 [[prototype]] 指向其隐式原型对象。但是这个对于我们来说是不可见的，是ECMAScript引擎实现的一部分。
 * 但是主流浏览器都支持一个 属性叫做 __proto__用于访问 实例的隐式原型对象的原因是因为， 这些对象都按原型链可以索引到Object.prototype
 * 而在Object.prototype上就有这么一个 名字叫做 __proto__ 的访问器属性，我们平常对 实例.__proto__ 的操作 看似是在更改实例的属性，其实根本不是！
 * 因为这是一个访问器属性，访问器属性具有极高的优先级(参看研究过程1)，因此:
 * 1.当我们获取 实例.__proto__时， 实际是调用 Object.prototype的__proto__属性的 get方法，而这个get方法可以认为就是 返回Object.getPrototypeOf(实例)，
 * 当然更为本质一点的，其实是获取 实例的内部的[[prototype]]属性的值。
 * 2.当我们更改 实例.__proto__时， 实际是调用 Object.prototype的__proto__属性的 set方法，而这个set方法可以认为就是 Object.setPrototypeOf(实例,原型对象)，
 * 当然更为本质一点的，其实是将 实例的内部的[[prototype]]属性的值更改为我们赋值的原型对象。
 */

//下面我们再来证明这一点
console.log("---------------研究过程2开始---------------");


//为了证明，我们来举个反例。
(function(){

    //这里一点要非常注意: Object.create(null) 是创建一个对象，其隐式原型对象为null。
    //因此这个对象根本和Object.prototype没有任何关系，自然也就没有访问 Object.prototype的权限。
    var parent=Object.create(null);

    console.log(parent.__proto__); //undefined  null上面可没有__proto__属性,因此肯定是undefined

    // 这里是添加实例属性
    parent.__proto__={value:1};

    //这次就能访问到了。
    console.log(parent.__proto__); //{value:1}

    //可以看到，这个 parent对象由于没有访问到 Object.prototype的 __proto__访问器属性，因此 赋值就直接是添加一个实例数据属性了。
    console.log(Object.getOwnPropertyNames(parent).some(function(item,index,array){
        return item==="__proto__";
    }));//true

    var child=Object.create(parent); //我们再创建一个对象child,其隐式原型指向parent
    console.log(child.__proto__); //{value:1}。 纯粹将 parent.__proto__ 当作一个普通的原型属性来访问。

    //这里就能看出来，原型链根本不是我们想的那样从  child->parent->{value:1} 如果是这样，child.value肯定是返回1的。
    //这说明我们添加的__proto__根本没起作用，原因就在于， 这个__proto__根本不是 Object.prototype.__proto__这个访问器属性
    //因此 看似是在对 实例的隐式原型进行修改，其实只是在修改一个普通的实例属性罢了。 根本不涉及对 实例内部的[[prototype]]的操作。
    //这里真正的原型链是  child->parent->null
    console.log(child.value);//undefined

    //上面的 Object.create(null)其实可以等价于这样
    parent=new Object();
    parent.__proto__=null;

    //需要注意的是，一旦这里设置__proto__等于null以后，就切断了和 Object.prototype的联系了。
    //因此， parent实例此时的[[prototype]]等于null，再对__proto__进行操作已经不是修改隐式原型指向了，而是添加实例属性
    console.log(typeof parent.toString==="undefined"); //再也无法访问Object.prototype的方法了

    //切断联系以后就再也无法重新再这样建立关系了，因为此时的__proto__只是一个实例数据属性，不具备 操作[[prototype]]的能力。
    parent.__proto__=Object.prototype;
    console.log(Object.getPrototypeOf(parent)===null);//可以看到其真正的[[prototype]]隐式原型对象已经是null了
    console.log(typeof parent.toString==="undefined");//依旧没有联系
    console.log(Object.getOwnPropertyNames(parent)[0]==="__proto__"); //已经是实例属性了。

    //想要建立联系，只能 使用 Object.setPrototypeOf方法.
    Object.setPrototypeOf(parent,Object.prototype);
    console.log(parent.hasOwnProperty("__proto__")===true); //可以看到，建立联系后，此时又可以访问Object原型的方法了。

    //但是我们需要明白是，此时在 parent对象上有一个 __proto__数据属性。那么 parent.__proto__到底访问的是谁呢。
    //答案: 自身的实例属性。 因为这是 原型链的属性查找顺序，不可违背。 这里似乎跟我们之前说的 访问器属性优先冲突了？
    //其实不然，只是研究过程1中没有总结到罢了。 等会再具体总结。
    parent.__proto__=Array.prototype;
    console.log(Object.getPrototypeOf(parent)===Object.prototype); //true
    delete parent.__proto__;
    console.log(parent.hasOwnProperty("__proto__")===false); //删除了该实例属性
    console.log(parent.__proto__===Object.prototype); //此时，parent.__proto__就是访问 访问器属性了。

    //通过以上几步，就可以看出来，parent内部的[[prototype]]一直都是 Object.prototype


    //此时，由于再也没有 __proto__这个属性了，按照之前总结的， 访问器优先原则， 此时就是在进行 [[prototype]]修改了！
    //因此，parent的隐式原型现在就真的被修改了。
    parent.__proto__=Array.prototype;
    console.log(Object.getPrototypeOf(parent)===Array.prototype); //true


    //因此，现在一定要改变观念: 修改实例的隐式原型的本质是修改其内部的 [[prototype]]属性值。
    //而__proto__只是Object.prototype提供的一个访问器属性，用于给其子类实例提供一个方便的修改[[prototype]]属性的入口。
    //对于原型链上没有Object.prototype的对象， 修改__proto__是无法修改[[prototype]]的，只有通过Object.setPrototypeOf才能修改其隐式原型对象。
}());

console.log("---------------研究过程2结束---------------");


console.log("---------------研究过程3开始---------------");



/*
 * 关于 直接为对象添加属性(而不是通过定义属性)的操作的后台流程：
 * 1.从原型链最底层开始依次查找是否含有这个属性，找到就停止，否则继续，如果在原型链中含有这个同名属性：
 *   如果该同名属性是数据类型，那么会在实例上添加自身的实例属性。
 *   如果该同名属性是访问器类型，则是调用访问器方法而不会添加实例属性。 (这就是 研究1说的 访问器优先).
 * 2.如果整个原型链上都没有这个同名属性，那么就是直接就在实例添加同名实例属性。
 */
(function(){

    //第一种情况，找到了同名属性，并且是数据属性，那么就添加实例属性
    var parent=new Object();
    Object.defineProperty(parent,"_name_",{
        set:function(newName){
            console.log("访问器set");
        },
        get:function(){
            return "访问器get";
        },
        configurable:true,
        enumerable:true
    });

    var child=new Object();
    child._name_="数据属性";

    //连接 child和parent
    child.__proto__=parent;


    var instance=new Object();
    instance.__proto__=child;


    //可以看到，此时的原型链是 instance->child->parent
    //查找 _name_时，在 child上就找到了，而child上的_name_属性是数据类型属性，所以是作为 数据属性访问，
    console.log(instance._name_);
    //而修改(赋值 写操作)的时候就是在实例上面直接添加实例属性来 阻止对原型链上层的同名属性的访问。
    instance._name_="实例属性";
    console.log(instance._name_);


    //第二种情况，找到了同名属性，并且是访问器属性，那么就只是调用访问器方法罢了。

    parent=new Object();
    parent._name_="数据属性";

    child=new Object();
    Object.defineProperty(child,"_name_",{
        set:function(newName){
            console.log("访问器set");
        },
        get:function(){
            return "访问器get";
        },
        configurable:true,
        enumerable:true
    });
    child.__proto__=parent;

    instance=new Object();
    instance.__proto__=child;

    //可以看到，此时的原型链是 instance->child->parent
    //查找 _name_时，在 child上就找到了，而child上的_name_属性是访问器属性，所以是作为 访问器属性访问，


    //此时是调用 访问器 get方法
    console.log(instance._name_);
    //此时是调用 访问器 set方法
    instance._name_="实例属性";

    //这也就是 研究1说的 访问器优先了
    console.log(instance.hasOwnProperty("_name_")===false);


    //第三种情况，没有找到同名属性，那么就是直接给实例添加属性，最简单的了。不再叙述。


    //但是 这还不算完.上面的基础的原型链上的属性都可以修改的。或者说是 数据属性的writable属性都是true的。如果不为true，
    //那么 修改属性是不会在实例上添加实例属性的！

}());

console.log("---------------研究过程3结束---------------");




console.log("---------------研究过程4开始---------------");
/*
 * 我们这里要清楚一件事：
 * 从ECMAScript规范上来说，   对象.属性=值 这种语句实际上做了一件事:
 * 在对象的规范实现上，有个内部属性[[Put]],而对象的所有属性赋值语句其实是在调用这个[[Put]]规范属性的内部方法。
 * 而影响这个 [[Put]]方法的结果的 ，又是另一个规范属性[[CanPut]]。
 *
 * 因此，实际上，上面的总结，只是 因为  访问器属性的[[CanPut]]结果是false。
 * 因此实例的[[Put]]方法不会进行任何操作。
 *
 * 同理， 如果一个 数据属性是 不能修改(writable)的。那么，其 [[CanPut]]结果也是false。是不会为实例添加属性的。
 * 当然，上面之所以能添加实例属性，是因为我们 原型的属性是通过普通的赋值一一也就是后台[[Put]]内部方法添加的，
 * 而[[Put]]内部方法默认的其实等同于
    Object.defineProperty(实例,属性名,{
        configurable:true,
        enumerable:true,
        writable:true,
        value:值
    });
 * 因此 实例在修改属性时，[[CanPut]]发现其原型对象的该属性writable是可写的，才允许我们添加属性的。
 */
(function () {

    var parent={};
    Object.defineProperty(parent,"name",{
        writable:false,
        enumerable:true,
        configurable:true,
        value:"reveur"
    });

    var child=new Object();
    child.__proto__=parent;
    console.log(child.name=="reveur");
    //可以看到 赋值添加或修改属性根本没有任何作用。
    child.name="mike";
    console.log(child.name=="reveur");
    console.log(child.hasOwnProperty("name")===false);


    //这里证明了，这是个内部规范属性，而不是Object原型对象上存在的属性。
    parent=Object.create(null);
    Object.defineProperty(parent,"name",{
        writable:false,
        enumerable:true,
        configurable:true,
        value:"reveur"
    });

    child=new Object();
    child.__proto__=parent;
    console.log(child.name=="reveur");
    //可以看到 赋值添加或修改属性根本没有任何作用。
    child.name="mike";
    console.log(child.name=="reveur");
    console.log(Object.hasOwnProperty.call(child,"name")===false);

}());

console.log("---------------研究过程4结束---------------");




console.log("---------------研究过程5开始---------------");


/*
 * 说完了__proto__方式修改对象的[[prototype]]值的过程，我们再来说说 构造函数对其创建的实例 修改[[prototype]]指向的过程
 */
(function(){

    function Foo(){
        console.log(this.__proto__===Foo.prototype);
    };

    var myPrototype={a:1,b:2};
    Foo.prototype=myPrototype;
    new Foo(); //true;

    //通过这个例子，我们就能看出，在进入构造函数的函数体后，this代表的是创建出来的实例对象，
    //而此时,实例对象的[[prototype]]就已经被设置好了一一为构造函数的 prototype所指向的那个原型对象。

    //这一切我们可以认为是自动完成的,通过 new操作符，创建一个新的Object对象并将其[[prototype]]设置完毕。
    //我们可以 近似地 这样认为(实际上比这复杂的多)：
    // new 构造函数名() ==
    // var obj=new Object();

    // Object.setPrototypeOf(obj,构造函数名.prototype===null?Object.prototype:构造函数名.prototype);

    // 执行构造函数体内的代码
    // return obj


    //但是我们要特别注意一点，如果构造函数的prototype设置为 null，那么 创造出的实例的[[prototype]]属性是指向 Object.prototype的！
    Foo.prototype=null;
    var foo=new Foo(); //false;
    console.log(foo.__proto__===Object.prototype);//true
    console.log(Object.getPrototypeOf(foo)===Object.prototype);//true
    //这一点和直接 实例.__proto__=null  完全不同。 算是 构造函数设置[[prototype]]的特例。
    //请牢记！

}());

console.log("---------------研究过程5结束---------------");