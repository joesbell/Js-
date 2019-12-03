/**
 * 测试1：如果是访问器属性，当且仅当set方法不为null，那么[[CanPut]]规范方法返回true.
 */
(function () {
    "use strict";
    var obj=Object.create(null);
    var localVar="localVar";
    Object.defineProperty(obj,"prop",{
        configurable:true,
        enumerable:true,
        set:undefined,
        get:function () {
            return localVar;
        }
    });

    try{
        obj.prop=123;
    }catch (e){
        console.log("属性set特性为undefined时赋值抛出TypeError异常:",e.message)
    }

    Object.defineProperty(obj,"prop",{
        configurable:false,
        enumerable:false,
        set:function (w) {
            localVar=w;
        }
    });

    obj.prop="属性set特性不为undefined时赋值正常";
    console.log(obj.prop)

}());

console.log("-------------------------------");

/**
 * 测试2：如果是数据属性，当且仅当writable为true，那么[[CanPut]]规范方法返回true.
 */
(function () {
    "use strict";
    var obj=Object.create(null);
    Object.defineProperty(obj,"prop",{
        configurable:true,
        enumerable:true,
        writable:false,
        value:"原本值"
    });

    try{
        obj.prop="新值";
    }catch (e){
        console.log("configurable为true而writable为false时，赋值操作失败,抛出TypeError异常:",e.message)
    }

    Object.defineProperty(obj,"prop",{
        configurable:false,
        enumerable:false,
        writable:true
    });
    obj.prop="configurable为false而writable为true时，赋值操作成功";
    console.log(obj.prop)

}());


console.log("-------------------------------");

/**
 * 测试3：如果该 包含对象自身属性的原型链上没有该属性，当且仅当extensible为true，那么[[CanPut]]规范方法返回true.
 */
(function () {
    "use strict";
    var obj=Object.create(null);
    console.log("此时Extensible属性值:",Object.isExtensible(obj));
    obj.prop="当Extensible属性值为true时，可以添加属性";
    console.log(obj.prop);
    Object.preventExtensions(obj);//设置Extensible属性值为false
    console.log("此时Extensible属性值:",Object.isExtensible(obj));
    try{
        obj.prop2="当Extensible属性值为false时，不能添加属性";
        console.log(obj.prop2);
    }catch (e){
        console.log("当Extensible属性值为false时，不能添加属性并抛出TypeError异常:",e.message)
    }
    obj.prop="但是此时修改原有属性是没问题的，其原因是因为，默认的赋值操作新添加的属性，所有特性值都是true";
    console.log(obj.prop);
    console.log(Object.getOwnPropertyDescriptor(obj,"prop"))

}());




