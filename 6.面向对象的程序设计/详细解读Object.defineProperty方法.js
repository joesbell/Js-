/**
 * 测试1：为对象定义 新增属性时，属性描述符可以为空对象，此时默认是添加数据类型属性，同时属性描述符字段值未定义的情况下均使用默认值。
 */
(function () {
    var obj={};

    try{
        Object.defineProperty(obj,"prop",undefined);
    }catch(e){
        console.log("实际的Object.defineProperty实现会检测属性描述符是否是Object类型，如果不是会抛出typeError")
    }

    Object.defineProperty(obj,"prop",{});

    //可以看到，默认的当一个属性描述符既不是 数据类型描述也不是访问器类型描述，那么就是一个通用的GenericDescriptor描述符
    //而通用的描述符在添加属性时，是会被当做数据属性来添加的。
    console.log(Object.getOwnPropertyDescriptor(obj,"prop"));

    //enumerable和configurable都是通用属性描述
    Object.defineProperty(obj,"prop2",{configurable:true,enumerable:true});
    console.log(Object.getOwnPropertyDescriptor(obj,"prop2"));
})();


console.log("---------------------------");

/**
 * 测试2：为对象定义 修改属性时，属性描述符可以为空对象或者完全与原本属性描述符对象相同，此时永远返回true。
 *
 */
(function () {
    var obj={};


    Object.defineProperty(obj,"prop",{configurable:false,enumerable:true});
    console.log(Object.getOwnPropertyDescriptor(obj,"prop"));

    //修改属性描述符并使用空对象，表示不修改 ，永远返回true
    Object.defineProperty(obj,"prop",{});
    console.log(Object.getOwnPropertyDescriptor(obj,"prop"));

    //修改属性描述符并使用原本已存在的属性值，表示不修改，永远返回true
    Object.defineProperty(obj,"prop",{configurable:false,enumerable:true});
    console.log(Object.getOwnPropertyDescriptor(obj,"prop"));

    try{
        Object.defineProperty(obj,"prop",{configurable:false,enumerable:false});
        console.log(Object.getOwnPropertyDescriptor(obj,"prop"));
    }catch (e){
        console.log("无法重定义");
    }

})();


console.log("---------------------------");

/**
 * 测试3：为对象定义 修改通用特性字段时，如果描述符不是空对象或者与现有的冲突。
 * 那么当原本属性描述符configurable为false，那么表示不可重定义。此时任何修改通用特性字段的属性描述符的操作都会失败。
 */
(function () {
    var obj={};


    Object.defineProperty(obj,"prop",{configurable:false,enumerable:true});
    console.log(Object.getOwnPropertyDescriptor(obj,"prop"));

    try{
        Object.defineProperty(obj,"prop",{configurable:true});
        console.log(Object.getOwnPropertyDescriptor(obj,"prop"));
    }catch (e){
        console.log("第一种无法重定义");
    }
    try{
        Object.defineProperty(obj,"prop",{configurable:false,enumerable:false});
        console.log(Object.getOwnPropertyDescriptor(obj,"prop"));
    }catch (e){
        console.log("第二种无法重定义");
    }


})();


console.log("---------------------------");

/**
 * 测试4：为对象定义 **修改私有特性字段**时，如果描述符不是空对象或者与现有的冲突。那么当原本属性描述符configurable为true，那么表示可以重定义。
 * 在涉及属性类型转化时:
 * 对于通用特性字段，新的属性描述符中没有提及，那么就会采用原有值，提及了就会进行覆盖。
 * 对于私有特性字段，在属性类型转化时，如果没有提及，采用该特性字段默认值，如果提及了，那么就会采用该值。
 */
(function () {
    var obj={};


    Object.defineProperty(obj,"prop",{configurable:true,enumerable:true});
    console.log(Object.getOwnPropertyDescriptor(obj,"prop"));

    //我们可以修改 数据属性为访问器属性。 对于公共特性字段，如果没有提及，则采用原有值。 对于属性私有字段，如果没有提及，则采用默认值。
    Object.defineProperty(obj,"prop",{configurable:true,set:undefined});  //因此这里enumerable为true，get为undefined
    console.log(Object.getOwnPropertyDescriptor(obj,"prop"));

    //如果对于公共字段进行了修改，那么是会覆盖的。 这就是 通用特性字段的 覆盖原则。
    Object.defineProperty(obj,"prop",{configurable:true,enumerable:false,value:"this is value"}); //因此这里enumerable覆盖为false，writable默认为false
    console.log(Object.getOwnPropertyDescriptor(obj,"prop"));

    //而对于私有字段，如果没有提及，那么采用默认值，提及了就采用该值。
    Object.defineProperty(obj,"prop",{configurable:true,set:function(){}}); //因此这里get是undefined，enumerable是采用原本的false
    console.log(Object.getOwnPropertyDescriptor(obj,"prop"));


})();


console.log("---------------------------");
/**
 * 测试5：为对象定义 修改私有特性字段时，如果描述符不是空对象或者与现有的冲突。
 * 在不涉及属性类型转化时:
 * 宗旨是:原本的configurable为true时可以进行任意修改，为false时，不允许任何修改。
 * 特殊的，对于数据属性来说，如果原本**configurable为false,writable为true,那么此时value是可以修改，并且仅有value可以修改**的，这是非常特殊的。
 */
(function () {
    var obj={};

    Object.defineProperty(obj,"prop",{configurable:false,enumerable:true,writable:true});
    console.log(Object.getOwnPropertyDescriptor(obj,"prop"));


    //对于数据属性来说，如果原本configurable为false,writable为true,那么value是可以修改的
    Object.defineProperty(obj,"prop",{configurable:false,enumerable:true,writable:false,value:"this is value"});
    console.log(Object.getOwnPropertyDescriptor(obj,"prop"));

    try{
        Object.defineProperty(obj,"prop",{configurable:false,enumerable:true,writable:false,value:"this is value2"});
        console.log(Object.getOwnPropertyDescriptor(obj,"prop"));
    }catch (e){
        console.log("但是当configurable和writable均为false后，value也不能修改了")
    }


})();

console.log("---------------------------");

/**
 * 测试6：补充测试5，数据属性的writable特性随时都可以从true改为false！！！
 * 可以说， writable同时还扮演了数据属性私有字段writable,value的 类似于configurable特性的角色。
 */
(function () {
    var obj={};

    Object.defineProperty(obj,"prop",{configurable:false,writable:true});
    console.log(Object.getOwnPropertyDescriptor(obj,"prop"));

    Object.defineProperty(obj,"prop",{value:1,writable:false});
    console.log(Object.getOwnPropertyDescriptor(obj,"prop"));

})();