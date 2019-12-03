


var i,j;

var count;  //内层循环的执行次数。
outer:for(i=0,count=0;i<10;i++){

    for(j=0;j<10;j++){
        if(i==5&&j==5){
            break outer;  //用于直接退出外层循环，并继续执行循环体外的代码。 这里使用label标签直接跳转到外层循环并结束外层循环的执行。
        }
        count++;
    }
}

console.log(count); //55



outer:for(i=0,count=0;i<10;i++){

    for(j=0;j<10;j++){
        if(i==5&&j==5){
            continue outer;   //用于退出本次循环，并继续执行下一次循环。这里直接使用label标签直接跳转到外层循环并继续执行外层循环。
        }
        count++;
    }
}

console.log(count); //95


