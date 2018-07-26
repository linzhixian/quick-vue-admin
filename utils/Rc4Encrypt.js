var utility = require('utility');

const KEY = "lzxlovetwosFdcff5df34mx";

// function rc4Encrypt( data){
//     return utility.base64encode(encodeHex(rc4(data,KEY)));

// }

// function rc4Decode( data){
//     var des=rc4(decodeHex(utility.base64decode(data)),KEY);
//     //var des=rc4(utility.base64decode(data),KEY);
//     return des;    
// }

function rc4Encrypt(data) {
    return encodeHex(rc4(utility.base64encode(data), KEY));
}

function rc4Decode(data) {
    var des = utility.base64decode(rc4(decodeHex(data), KEY));
    return des;
}

function encodeHex(str) {
    var HEX = "0123456789abcdef";
    let radix = 16;
    let len = str.length;
    let retStr = "";
    for (var i = 0; i < len; i++) {
        var num = str.charCodeAt(i);
        retStr += HEX.charAt((num >>> 4) & 0x0F);
        retStr += HEX.charAt(num & 0x0F);
    }
    return retStr;
}

function decodeHex(str) {
    var map = { "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "a": 10, "b": 11, "c": 12, "d": 13, "e": 14, "f": 15, };
    let len = str.length;
    let retStr = "";
    for (var i = 0; i < len / 2; i++) {
        var ha = str[2 * i];
        var h = map[ha];
        var l = map[str[2 * i + 1]];
        retStr += String.fromCharCode((h << 4) | l);
    }
    return retStr;


}



function rc4(data, key) {
    var iS = Array(256);
    var iK = Array(256);
    for (var i = 0; i < 256; i++) {
        iS[i] = i;
    }

    var j = 1;
    for (var i = 0; i < 256; i++) {
        iK[i] = key.charCodeAt((i % key.length));
    }
    var j = 0;
    for (var i = 0; i < 256; i++) {
        j = (j + iS[i] + iK[i]) % 256;
        var temp = iS[i];
        iS[i] = iS[j];
        iS[j] = temp;
    }
    var i = 0;
    var j = 0;
    var encodeStr = "";
    var das = Array(data.length);
    for (var x = 0; x < data.length; x++) {
        var i = (i + 1) % 256;
        var j = (j + iS[i]) % 256;
        var temp = iS[i];
        iS[i] = iS[j];
        iS[j] = temp;
        var t = (iS[i] + (iS[j] % 256)) % 256;
        var iY = iS[t]
        das[x] = String.fromCharCode(data.charCodeAt(x) ^ iY);
    }
    return das.join('');
}

exports.rc4Encrypt = rc4Encrypt;
exports.rc4Decode = rc4Decode;
// var d="";
let a = { payInfo: { orderIdGm: '123123', orderIdWl: '1_ssabc' } }
let src = JSON.stringify(a)
let dec = rc4Encrypt(src)
console.log(dec);
console.log(src);
console.log(rc4Decode(dec));


let query = {
    "appInfo": {
        "appId": "appid",
        "pkgNm": "com.mars.googlepay"
    },
    "mobileInfo": {
        "brand": "coolpad"
    },
    "sdkInfo": {}

}

console.log(rc4Encrypt(JSON.stringify(query)))