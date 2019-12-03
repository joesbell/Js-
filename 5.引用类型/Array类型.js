/*
*创建数组的方式有2种 ： 数组字面量 和 构造函数式
*/

(function(){
    var colors=["red","blue","white"]; //数组字面量创建数组
    console.log(colors);

    colors=new Array("red","blue","white"); //构造函数创建数组
    console.log(colors);

    colors=Array("red","blue","white"); //构造函数创建数组时，可以省略new操作符。
    console.log(colors);

    colors=Array(3); //如果构造函数的参数只有单个数字，那么表示的是创建 该数字值个项的数组。 这里就表示的是创建了一个3项的数组。
    colors[0]="red";
    colors[1]="blue";
    colors[2]="white";
    console.log(colors);


//对length属性的修改会影响数组本身。
    colors.length=2; //这会删除第三项及其以后的所有项数。也就是说只保留 array[0],array[1]
    console.log(colors);


//可以使用方括号表示法添加项数，因此会改变数组长度，但是必须是纯数字的 字符串
    colors["5"]="black";  // 此时数组长度为 6 ,等同于 colors[5]="black"
    console.log(colors);


//使用非纯数字的字符串为数组添加属性并不会改变数组的长度。
    colors["100s"]="非纯属性的属性名只会被当作普通的属性添加，而不是作为数组项数";

    console.log(colors);
}());

/*
 * 转换方法测试
 */

(function(){
    var persons=[
        {
            toString:function(){
                return "toString方法";
            },

            toLocalString:function () {
                return "toLocalString方法";
            }
        }
        ,
        null,undefined,"null或者undefined会被转化为空字符串"
    ]

    console.log(persons.valueOf()===persons);
    console.log(persons.toString());
    console.log(persons.toLocaleString());
    console.log(persons.join("\t%join方法调用的是每一项的toString方法%\t"));
}());

/*
 *  栈方法测试
 */

(function(){
    var stack=[];
    stack.push(0);
    stack.push(1);
    stack.push(2);
    console.log(stack)
    while(stack.length!=0){
        console.log(stack.pop())
    }
}());

/*
 * 队列方法测试
 */

(function(){
    var queue=[];
    queue.push(0);
    queue.push(1);
    queue.push(2);
    console.log(queue);
    while(queue.length!=0){
        console.log(queue.shift())
    }
}());

/*
 * 反向队列方法测试
 */

(function(){
    var deque=[];
    deque.unshift(0);
    deque.unshift(1);
    deque.unshift(2);
    console.log(deque);
    while(deque.length!=0){
        console.log(deque.pop())
    }
}());


/*
 * 排序方法测试
 */

(function () {
    var array=[5,20,undefined,false,undefined,"undefined1",true,32,31,"1",null];
    console.log(array);
    array.reverse();
    console.log(array);
    //默认是对 每一项元素调用 String(元素) 方法转化为字符串的结果 使用 ASCII编码升序排序。
    //特别注意一点，对于undefined ,sort排序时永远是排在最后面的。
    array.sort();
    console.log(array);

    function myCmp(value1,value2){
        //如果是 null那么就排在最前面


        if(value2==null&&value1==null){
            return 0;
        }
        if(value1==null)
        {
            return -1;
        }
        if(value2==null){
            return 1;
        }


        //正式比较:我们的规则是 1.数字大于字符串 2.布尔当作数字 3. 数字按照大小排序 4.字符串按照ASCII编码排序

        if(typeof value1 =="boolean"){
            value1=Number(value1);
        }
        if(typeof value2 =="boolean"){
            value2=Number(value2);
        }

        if(typeof value1=="string" && typeof value2=="number" )
        {
            return -1;
        }
        if(typeof value2=="string" && typeof value1=="number")
        {
            return 1;
        }

        if(typeof value2=="string" && typeof value1=="string")
        {
            if(value2==value1)
            {
                return 0;
            }else if(value1 >value2){
                return 1;
            }
            return -1;
        }


        if(typeof value2=="number" && typeof value1=="number")
        {
            if(value2==value1)
            {
                return 0;
            }else if(value1 >value2){
                return 1;
            }
            return -1;
        }


    }

    //sort方法可以传入自定义的排序规则
    array.sort(myCmp);
    console.log(array);
}());


/*
* 操作方法
 */

(function(){
    var colors=["red","green","blue"];
    // concat 方法测试
    console.log(colors.concat("concat方法示范","concat方法可以添加一系列元素到数组的末尾"));
    console.log(colors.concat(["而且还可以接受数组为参数","但是concat会自动对其进行拆分，并逐项添加"],"而且我们还应当知道","concat方法并不对原数组进行任何修改，仅仅是返回一个原数组的副本修改后的数组"));

    // slice 方法测试
    console.log(colors.slice(1)); //返回 [1,length)索引的项数所组成的数组
    console.log(colors.slice(0,2)); // 返回 [0,2) 索引的项数所组成的数组

    // splice 方法测试

    //测试删除
    colors.splice(1,1); //删除索引为1的项
    console.log(colors);  // ["red,"blue"]
    colors.splice(0,1); //删除索引为0的项
    console.log(colors); //["blue"]

    //测试插入
    colors.splice(0,0,"red","green"); //在索引为0的位置插入两项
    console.log(colors); //["red","green","blue"]
    colors.splice(1,0,"在索引为1的地方插入1项");
    console.log(colors);

    //测试替换
    colors.splice(1,1,"替换原本索引为1的项");
    console.log(colors);
    colors.splice(1,1,"将原本索引为1的项替换为两项，这是第一项","将原本索引为1的项替换为两项，这是第二项");
    console.log(colors);

}());

/*
* 位置方法
 */
(function(){
    var array=[1,3,5,2,4,6,7,8,5,4,2,1];
    console.log(array.indexOf(5)); //2
    console.log(array.indexOf(5,3)); //8
    console.log(array.lastIndexOf(2)); //10
    console.log(array.lastIndexOf(2,9)); //3
    console.log(array.indexOf("1")); // -1 因为是使用全等判断，所以找不到
}());

/*
* 迭代方法
 */
(function(){
    var result=null;
    var array=[1,2,3,4,5,6,7,8,9,10];

    //测试every()
    result=array.every(function (item, index, array) {
        if(item>0){
            return true;
        }
        return false;
    });

    console.log(result); //true
    result=array.concat(0).every(function (item, index, array) {
        if(item>0){
            return true;
        }
        return false;
    });
    console.log(result); //false

    //测试 filter()
    result=array.filter(function(item,index,array){
        if(item%3==0){
            return true;
        }
        return false;
    });
    console.log(result.toString());
    result=array.filter(function(item,index,array){
        if(index%2==0){
            return true;
        }
        return false;
    });
    console.log(result.toString());


    //测试 forEach
    array.forEach(function (item,index,array) {
        if(index==0){
            console.log("开始获取数组"+array.toString()+"的详细信息");
        }
        console.log("当前索引:"+index,"当前项:"+item);
        if(index==(array.length-1)){
            console.log("详细信息输出完毕");
        }
    })

    //测试 map
    result=array.map(function (item,index,array) {
        if (item < 5&&item>0){
            return "(0,5)";
        }else if(item>=5 &&item <10){
            return "[5,10)";
        }else {
            return "[10,+Infinity) || (-Infinity,0]";
        }
    })
    console.log(result);

    //测试 some
    result=array.some(function (item,index,array) {
        if(item>9)
        {
            return true;
        }
        return false;
    });
    console.log(result);  //true



    //  迭代方法一律不会改变原本数组。 除非在函数中 显式地对array2进行了更改
    array.forEach(function (item,index,array2) {
        // console.log(array===array2); //true
        item=2; //基本类型的更改不会更新到array上，因为是值传参。
        // array2[index]=2; //这样才会影响到原本的数组.
    });
    console.log(array);

    //构建引用类型对象组成的数组
    result=array.map(function (item,index,array) {
        return [].concat(item);
    });
    console.log(result);

    //这里对item的调用方法会影响到原本数组。
    result.forEach( function(item,index,array){
       item.push("引用类型无法重新赋值，但是可以调用方法修改，或者添加属性等操作");
    });
    console.log(result);


    //我们可以总结一下， 这个传入迭代方法的函数的参数，可以认为 item 是每次从 array中根据index依次生成的参数，是值传递进去的。
    //所以在 item 上重新赋值是不会影响到 原本数组的(引用类型的数组却可以通过对item调用方法或者添加属性等操作进行影响)。 只有对 array进行操作才会影响到原数组。
}());


/*
* 测试归并方法
 */

(function(){
    var array=[1,2,3,4,5,6];
    var result=null;

    result=array.reduce(function (prev, cur, index,array) {
        if(cur%2==0)
        {
            return cur+prev+1;
        }
        return cur*2+prev;
    },7);
    console.log(result);

    //使用归并来完成阶乘
    function factorial(num){
        var array=new Array();
        for(var i=0;i<=num;i++){
            array[i]=i;
        }

        var result=array.reduce(function (prev,cur,index,array) {
            if(cur==0)
            {
                return prev;
            }
            return prev*cur;
        },1);
        return result;
    }
    console.log(factorial(5));
}());