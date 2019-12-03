;(function () {
    /**
     * 根据参数设置cookie
     * @param name
     * @param value
     * @param expires
     * @param path
     * @param domain
     * @param secure
     */
    function setCookie(name,value,expires,path,domain,secure) {
        var cookieText=encodeURIComponent(name)+"="+encodeURIComponent(value);
        if(expires instanceof  Date){
            cookieText+="; expires="+expires.toGMTString();
        }
        if(path){
            cookieText+="; path="+path;
        }
        if(domain){
            cookieText+="; domain="+domain;
        }
        if(secure){
            secure+="; Secure";
        }
        document.cookie=cookieText;
    }

    /**
     * 获取当前页面的所有cookie的键值对的对象
     * @returns {{}}
     */
    function getCookieAll() {
        var cookies=document.cookie;
        if(cookies.trim()===""){
            return {};
        }
        cookies=cookies.split(";");
        var result={};
        cookies.forEach(function (cookie) {
            var temp=cookie.split("=");
            var name=decodeURIComponent(temp[0]).trim();
            var value=decodeURIComponent(temp[1]).trim();
            result[name]=value;
        });
        return result;
    }

    /**
     * 获取名字为name的cookie的值
     * @param name
     * @returns {*}
     */
    function getCookie(name) {
        return getCookieAll()[name];
    }

    /**
     * 根据参数删除cookie
     * @param name
     * @param path
     * @param domain
     * @param secure
     */
    function deleteCookie(name,path,domain,secure){
        setCookie(name,"",new Date(0),path,domain,secure);//原理是设置过期时间。
    }

    CookieUtil={
        getCookie:getCookie,
        setCookie:setCookie,
        getCookieAll:getCookieAll,
        deleteCookie:deleteCookie
    }
}());