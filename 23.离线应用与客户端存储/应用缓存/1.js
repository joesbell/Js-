console.log("当前是否是在线状态:",navigator.onLine);


var button1=document.getElementById("button1");
var button2=document.getElementById("button2");
var button3=document.getElementById("button3");

button1.addEventListener("click",function () {
   var xhr=new XMLHttpRequest();
   xhr.open("GET","/rest/modify_manifest");
   xhr.onreadystatechange=function(){
       if(xhr.readyState===4){
           if(xhr.status>=200&&xhr.status<300 || xhr.status===304){
               switch (xhr.response) {
                   case "true":
                       console.log("当前网站可以离线访问");
                       break;
                   case "false":
                       console.log("当前网站无法离线访问");
                       break;
                   default:
                       console.log("修改manifest文件出错")
               }
               console.log("刷新网页后，新的manifest文件生效");
           }
       }
   };
   xhr.send();
});


/**
 * applicationCache对象具有update方法，用于主动请求服务器上的manifest文件。
 */
button2.addEventListener("click",function () {
    applicationCache.update();
});

/**
 * 当请求更新manifest文件后，如果的确有更新，那么会自动下载更新，此时status值会变为4。
 * 此时调用applicationCache的swapCache方法可以应用新的离线缓存。 但是也是得刷新页面后才会生效。
 */
button3.addEventListener("click",function () {
    if(applicationCache.status===4){
        applicationCache.swapCache();
        console.log("当前页面有新的缓存并且新的缓存已经被装载，刷新页面后新的缓存就会生效")
    }else{
        console.log("当前页面无可用缓存更新");
    }
});

/**
 * applicationCache有许多事件，都是跟 manifest更新有关系的。
 */
applicationCache.addEventListener("checking",function (event) {
    //下载manifest文件并检查是否有更新时，status值为2.
    console.log(event.type,applicationCache.status===2);
});

applicationCache.addEventListener("error",function (event) {
    console.log(event.type,applicationCache.status);
});

applicationCache.addEventListener("noupdate",function (event) {
    //如果检查manifest文件更新后，发现manifest文件没有变动，那么status值会变为1
    console.log(event.type,applicationCache.status===1);
});

applicationCache.addEventListener("downloading",function (event) {
    //表示开始下载manifest文件中的离线内容，此时status为3.
    console.log(event.type,applicationCache.status===3);
});

applicationCache.addEventListener("progress",function (event) {
    //表示正在下载manifest文件中的离线内容的过程，此时status也是3
    console.log(event.type,applicationCache.status===3);
});

applicationCache.addEventListener("updateready",function (event) {
    //表示manifest文件中新更新的离线内容已经下载完毕，可以正式替换当前离线内容了。
    console.log(event.type,applicationCache.status===4);
});

applicationCache.addEventListener("cached",function (event) {
    console.log(event.type,applicationCache.status);
});



