


//使用 for-in语句进行精准迭代
function showProperty(obj) {
    if(obj==null||obj==undefined){
        console.error("不能对null或者undefined使用 for-in语句进行枚举");
        return ;
    }

    var name=null;
    console.log("开始展示"+obj+"中的属性键值对");

    for( name in obj){
        console.log("属性名:"+name+",属性值:"+obj[name]);
    }

    console.log("结束展示");
}



//枚举对象的属性
showProperty(this);

//枚举字符串的每个字符
var message="hello";
showProperty(message);


//枚举数组的每一项
var array=[{},
        "two",
            3,
        {
            toString:function () {
                return "four";
            }
        }];

showProperty(array);


//不能对 null 和 undefined 进行枚举。
showProperty(null);

showProperty(undefined);