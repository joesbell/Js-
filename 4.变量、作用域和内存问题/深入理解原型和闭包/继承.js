
//可以枚举的所有属性
function allProp(obj){
    console.log(obj.toString()+"的所有属性如下:");
    for(var prop in obj){
        console.log(prop);
    }
}

//继承而来的属性
function inheritProp(obj){
    console.log(obj.toString()+"的继承属性如下:");
    for(var prop in obj){
        if(obj.hasOwnProperty(prop)===false){
            console.log(prop);
        }
    }
}

//对象自身的属性
function selfProp(obj){
    console.log(obj.toString()+"的非继承属性如下:");
    for(var prop in obj){
        if(obj.hasOwnProperty(prop)===true){
            console.log(prop);
        }
    }
}

function Foo(){

}


var foo=new Foo();

console.log(foo.a);
console.log(foo.b);
console.log("\n");

//当 foo对象实例找不到属性的时候，会自动从其 隐式原型对象__proto__上寻找该属性。这就是原型式的继承。

Foo.prototype.a=10;
Foo.prototype.b=20;


console.log(foo.a);
console.log(foo.b);
console.log("\n");

allProp(foo);

selfProp(foo);

inheritProp(foo);

foo.a=100;

console.log(foo.a);
console.log(foo.b);
console.log("\n");

allProp(foo);

selfProp(foo);

inheritProp(foo);
