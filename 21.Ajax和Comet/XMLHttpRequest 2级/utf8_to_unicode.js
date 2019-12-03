;(function () {
    /**
     * 分别对应以下编码前缀;
     * 0xxxxxxx
     * 110xxxxx
     * 1110xxxx
     * 11110xxx
     * 111110xx
     * 1111110x
     */
    var FIRST_BYTE_PATTERN=[0x00,0xc0,0xe0,0xf0,0xf8,0xfc];
    var REVERSE_FIRST_BYTE_PATTERN=[0xfc,0xf8,0xf0,0xe0,0xc0,0x00];
    var FIRST_BYTE_PATTERN_STR=["0","110","1110","11110","111110","1111110"];
    //后续UTF的编码模式是 10xxxxxx
    var NORMAL_BYTE_PATTERN=0x80;

    //32个0的序列
    var ZERO_BYTE_STRING="00000000000000000000000000000000";

    //UNICODE转换为UTF8长度时，补位的位数X的总长度
    var COVER_LENGTH=[7,11,16,21,26,31];

    /**
     * 根据UTF8编码的第一个字节数据判断UTF8编码的字节长度。
     * @param firstByteData
     * @returns {number}
     */
    function getUTF8ByteLengthByUTF8FirstByte(firstByteData) {
        //这里从最长的开始匹配。
        var index=REVERSE_FIRST_BYTE_PATTERN.findIndex((code)=>{
            return (code&firstByteData)===code;
        });
        return 6-index;
    }

    /**
     * 根据unicode码值来获取转码后的UTF8字节长度。
     * @param unicode
     * @returns {number}
     */
    function getUTF8ByteLengthByUnicode(unicode) {
        if(unicode<=0x7f){
            return 1;
        }else if(unicode>=0x80&&unicode<=0x7ff){
            return 2;
        }else if(unicode>=0x800&&unicode<=0xffff){
            return 3;
        }else if(unicode>=0x10000 && unicode<=0x1fffff){
            return 4;
        }else if(unicode>=0x200000&& unicode<=0x3ffffff){
            return 5;
        }else if(unicode>=0x4000000&unicode<=0x7fffffff){
            return 6;
        }else{
            throw new Error("unicode码值不在范围内");
        }
    }

    /**
     * 为二进制字符串添加前导0
     * @param data
     * @param n 补全为n位
     * @returns {string}
     */
    function addPreZero(data,n) {
        var zero=ZERO_BYTE_STRING.slice(-n);
        return (zero+data).slice(-n);
    }

    /**
     * 根据字符的utf8编码字节的数组，返回该字符的Unicode编码。
     * @param utf8Array
     * @returns {string}
     */
    function UTF8ByteArrayToUnicode(utf8Array) {
        /**
         * 当只有一个字节时，说明是ASCII码。直接返回即可。
         * 因为ASCII码是Unicode的子集。
         */
        if(utf8Array.length===1){
            return utf8Array[0];
        }

        var subBinaryArray=[];
        for(var i=0;i<utf8Array.length;i++){
            if(i===0){
                //第一个字节按照对应模式截取后续的二进制数据
                //使用异或操作提高性能
                subBinaryArray.push(FIRST_BYTE_PATTERN[utf8Array.length-1]^utf8Array[i]);
            }else{
                //后续字节统一按照 10XX XXXX 的模式 截取 6位数据
                subBinaryArray.push(NORMAL_BYTE_PATTERN^utf8Array[i])
            }
        }

        //将这些二进制数字 转化为 字符串。
        var subBinaryStringArray=subBinaryArray.map((subBin)=>{
            return subBin.toString(2)
        });

        //补全前置0
        subBinaryStringArray=subBinaryStringArray.map((value,index)=>{
            if(index===0){
                //第一个字节中的二进制字符串被截取XXX的长度和整个UTF-8编码的长度的关系是 7-UTF8编码长度=第一个字节中X的个数。
                return addPreZero(value,7-utf8Array.length);
            }else{
                //后续字节中，被截取的XXX的长度都是固定为6
                return addPreZero(value,6);
            }
        });

        subBinaryStringArray=subBinaryStringArray.join(""); //将整个字符串连接起来。
        var result=parseInt(subBinaryStringArray,2); //将二进制的字符串序列转化为Unicode编码。
        return result;
    }

    /**
     * 将UTF8编码的数组转化为Unicode编码的数组
     * @param utf8Array
     * @returns {Array}
     */
    function UTF8ByteStreamToUnicodeArray(utf8Array) {
        var result=[];
        for(var i=0;i<utf8Array.length;){
            var length=getUTF8ByteLengthByUTF8FirstByte(utf8Array[i]);
            var temp=[];
            for(var j=i;j<i+length;j++){
                temp.push(utf8Array[j]);
            }
            result.push(UTF8ByteArrayToUnicode(temp));
            i+=length;
        }
        return result;
    }

    /**
     * 将UTF8码值转为Unicode码值
     * @param utf8Code
     */
    function UTF8CodeToUnicode(utf8Code){
        var binStr=utf8Code.toString(2);
        var result=[];
        for(var i=binStr.length;i>0;){
            if(i-8>0){
                result.unshift(binStr.substr(i-8,8));
            }else{
                result.unshift(binStr.substr(0,i));
            }
            i=i-8;
        }
        result=result.map((bin)=>{
            return parseInt(bin,2);
        });
        return UTF8ByteArrayToUnicode(result);
    }


    /**
     * 将一个Unicode码值转换为 UTF8编码的字节数组
     * @param unicode
     * @returns {number[]}
     * @constructor
     */
    function UnicodeToUTF8ByteArray(unicode){
        var utf8Length=getUTF8ByteLengthByUnicode(unicode);
        var binStr=unicode.toString(2);

        //将unicode补前导0到需要补位的长度。
        binStr=addPreZero(binStr,COVER_LENGTH[utf8Length-1]);
        var resultBinStr=[];

        //将二进制字符串按照UTF8编码每一个字节所需要的补位位数进行分割。
        var index=0;
        for(var i=0;i<utf8Length;i++){
            var pre;
            var last;
            if(i===0){
                pre=FIRST_BYTE_PATTERN_STR[utf8Length-1];
                last=binStr.substr(index,8-pre.length);
                index=8-pre.length;
            }else{
                pre="10";
                last=binStr.substr(index,6);
                index+=6;
            }
            resultBinStr.push(pre+last);
        }

        //再讲补位完成的每个8位字符串 转换为字节。
        var resultBinArray=resultBinStr.map((binStr)=>{
            return parseInt(binStr,2);
        });
        return resultBinArray;
    }

    /**
     * 将Unicode码值转换为UTF8的码值
     * @param unicode
     * @returns {number}
     * @constructor
     */
    function UnicodeToUTF8Code(unicode){
        var binArray=UnicodeToUTF8ByteArray(unicode);
        var result=binArray.reduce((prev,current,index)=>{
           return prev+(current<<(8*(binArray.length-index-1)));
        },0);
        return result;
    }

    /**
     * 将Unicode码值的数组转换为UTF8编码的字节数组。
     * @param unicodeArray
     * @returns {Array}
     * @constructor
     */
    function UnicodeArrayToUTF8ByteStream(unicodeArray){
        var resultArray=[];
        for(var i=0;i<unicodeArray.length;i++){
            Array.prototype.push.apply(resultArray,UnicodeToUTF8ByteArray(unicodeArray[i]));
        }
        return resultArray;
    }

    if(typeof window ==="object"){
        window.CodeUtil={

            UTF8CodeToUnicode:UTF8CodeToUnicode,
            UTF8ByteArrayToUnicode:UTF8ByteArrayToUnicode,
            UTF8ByteStreamToUnicodeArray:UTF8ByteStreamToUnicodeArray,

            UnicodeToUTF8Code:UnicodeToUTF8Code,
            UnicodeToUTF8ByteArray:UnicodeToUTF8ByteArray,
            UnicodeArrayToUTF8ByteStream:UnicodeArrayToUTF8ByteStream
        }
    }else if(typeof module ==="object"){
        module.exports={
            UTF8CodeToUnicode:UTF8CodeToUnicode,
            UTF8ByteArrayToUnicode:UTF8ByteArrayToUnicode,
            UTF8ByteStreamToUnicodeArray:UTF8ByteStreamToUnicodeArray,

            UnicodeToUTF8Code:UnicodeToUTF8Code,
            UnicodeToUTF8ByteArray:UnicodeToUTF8ByteArray,
            UnicodeArrayToUTF8ByteStream:UnicodeArrayToUTF8ByteStream
        }
    }else{
        console.log("宿主环境不支持")
    }

    /**
     * 测试代码
     */
    // var srcStr="";
    // var startTime=new Date();
    // for(var i=0;i<0x1FFFFF;i++){
    //     srcStr+=String.fromCharCode(i);
    // }
    // var unicodeArray=srcStr.split("").map((code)=>{
    //     return code.charCodeAt(0);
    // })
    // var utf8Array=UnicodeArrayToUTF8ByteStream(unicodeArray);
    // unicodeArray=UTF8ByteStreamToUnicodeArray(utf8Array);
    // var origin=unicodeArray.map((code)=>{
    //     return String.fromCharCode(code);
    // }).join("");
    // console.log("测试字符集长度",srcStr.length)
    // console.log("测试是否通过",origin===srcStr)
    // console.log("测试时间:",Date.now()-startTime.getTime(),"ms")
}());