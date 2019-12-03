//显示对象的所有非继承属性的特性的函数
function showObjectAllAttrsOfAllNotInheritProps(obj){
    if( !(obj instanceof Object)){
        console.log("参数必须为对象");
        return;
    }
    console.log(obj+"对象的非继承属性的特性列表如下:");

    //获取对象的一切非继承属性。
    var allNotInhertProps= Object.getOwnPropertyNames(obj);
    if(allNotInhertProps==null||allNotInhertProps.length==0) {
        console.log("该对象没有自身的属性");
        return;
    }

    var propName;
    var attrs;
    for( var i=0;i<allNotInhertProps.length;i++){
        propName=allNotInhertProps[i];

        //获取属性的特性描述对象。
        attrs=Object.getOwnPropertyDescriptor(obj,propName);

        //默认就是 数据类型,只要没有get set方法
        //但是这里的判断其实是不准确的。 并不能说 get set 为 undefined就得出是数据类型属性。
        //这里只是粗略的判断。因为一般而言，真是访问器属性是肯定会为其get set特性赋值的。
        if(attrs.get===undefined&&attrs.set===undefined){
            console.log("该属性为数据类型,其属性名是:"+propName);
        }else{
            //访问器类型
            console.log("该属性为访问器类型,其属性名是:"+propName);
        }
        temp=Object.keys(attrs);
        for(var j=0;j<temp.length;j++){
            console.log("特性名:"+temp[j],"特性值:"+attrs[temp[j]]);
        }
    }
    console.log("----------属性列表输出完毕----------");
}

var person={};
Object.defineProperty(person,"name",{

});
showObjectAllAttrsOfAllNotInheritProps(person);

person={};
showObjectAllAttrsOfAllNotInheritProps(person);

//总览介绍 数据和访问器类型 的属性
(function(){
    var person={};

    //普通的添加属性的方式。默认都是 数据类型。其默认特性都是true。特性value为所赋的值。
    person.age=23;

    //这里我们设置一个访问器类型的属性。
    Object.defineProperty(person,"_name",{
        get:function(){
            console.log("调用get方法");
            return "访问器类型属性返回的reveur";
        },
        set:function(newValue){
            console.log("调用set方法想要设置新值:"+newValue+",但是我们不一定真做什么(除了打印这句话).");
        },
        enumerable:false,
        configurable:false
    });

    delete person._name; //可以看到 无效的。
    console.log(person._name); //读取 访问器类型的属性 触发get方法
    person._name="reveur"; //写入 访问器类型的属性 触发set方法
    showObjectAllAttrsOfAllNotInheritProps(person);
}());

// 单独讲解 数据属性。
(function(){
    var person={};
    Object.defineProperty(person,"name",{
        configurable:false,
        writable:true,
        value:"reveur",
        enumerable:false
    });
    person.name="1";
    console.log(person.name); //可以改变的，因为 writable为true

    person={};
    Object.defineProperty(person,"name",{
        configurable:true,
        writable:false,
        value:"reveur",
        enumerable:false
    });

    person.name="1";
    console.log(person.name); //当writable为false时,常规赋值不能改变
    //但是只要configurable为true,我们就能通过重设特性 value的方式 改变 属性存储的值.
    Object.defineProperty(person,"name",{
        configurable:true,
        writable:false,
        value:"1",
        enumerable:false
    });
    console.log(person.name);

    //需要注意的是 configurable特性一旦设置为false以后就不能改变了。
    Object.defineProperty(person,"name",{
        configurable:false,
        writable:false,
        value:"reveur",
        enumerable:false
    });

    //configurable==false的情况下，我们是无法重新设置特性(除了value可以在writable为true时赋值更改)或者delete该属性的。
    // Object.defineProperty(person,"name",{
    //     configurable:true,
    //     writable:true,
    //     value:"1",
    //     enumerable:true
    // }); 本段代码会报错  TypeError: Cannot redefine property: name

    showObjectAllAttrsOfAllNotInheritProps(person);

    person={};
    //通过定义属性的方式,如果不指定 特性的值，那么默认就是false
    Object.defineProperty(person,"name",{
        value:"reveur"
    });
    showObjectAllAttrsOfAllNotInheritProps(person);

    person={};
    //而普通的添加属性的方式，默认就指定特性都是true， value值为所赋的值
    person.name="reveur";
    showObjectAllAttrsOfAllNotInheritProps(person);

}());


// 单独讲解 访问器属性。
(function(){
    var person1={};
    //一般而言我们会为 访问器属性 加上一个_作为开头标识用于分辨.
    Object.defineProperty(person1,"_name",{
        configurable:false,
        enumerable:false,

        //可以看到，访问器属性最大的特点就是其 set和get方法仅仅只是作为 读取和写入该属性时所触发的函数的指针罢了。
        //其函数内部做啥，可以跟这个属性甚至这个对象毫无关系。

        //访问器属性的这个效果，让我们可以实现网页中数据的双向绑定。

        //因此，我们在这里根本就没对 person1对象进行操作，反而操作的是person2对象。

        //同时我们需要注意的是，如果你真想操作本对象的属性，必须在其属性名前面加上this.属性名，才代表对本对象的属性进行操作。
        set:function(newName){
            console.log("触发set")
            person2.name=newName;
        },
        get:function () {
            return person2.name;
        }
    });

    var person2={};
    person2.name="reveur";
    console.log(person1._name); //reveur
    person1._name="mike";
    console.log(person2.name); //mike

}());


// 利用 defineProperties方法同时定义对象的多个属性的特性值.
(function() {

    var person={};
    Object.defineProperties(person, {
            name: {
                configurable: true,
                value: "Reveur",
                writable: false,
                Enumerable: true
            },
            age: {
                configurable: true,
                value: 23,
                writable: true,
                Enumerable: true
            },
            _info: {
                configurable: true,
                Enumerable: true,
                //set和get方法中，如果要访问对象自身的属性，必须加上this.属性名
                set: function (newAge) {
                    console.log("修改了年龄");
                    this.age = newAge;
                },
                get: function () {
                    return "姓名:" + this.name + ",年龄" + this.age;
                }
            }
        }
    );
    console.log(person.name);
    console.log(person.age);
    console.log(person._info);
    person._info=18;
    console.log(person._info);
}());