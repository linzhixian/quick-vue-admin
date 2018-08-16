var utility = require('utility');

const KEY = "F0d$$8338fSk8MLk#4";

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
    console.log("rc4Decode:",data)
    console.log("rc4DecodeKey:",KEY)
    var des = utility.base64decode(rc4(decodeHex(data), KEY));
     console.log("result:",des)
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


/*let query = {
    "appinfo": {
        "apkm5": "e1bef82222114f84d52fb0c63175c658",
        "appid": "20180614001",
        "appkg": "cn.m4399.adsample",
        "appnm": "SGJTZGs=",
        "appph": "L2RhdGEvYXBwL2NuLm00Mzk5LmFkc2FtcGxlLTEuYXBr",
        "appsnm5": "8e0871a4e699510903e17f0fa396bf87",
        "appvc": "1",
        "appvn": "1.1",
        "issysap": "false"
    },
    "chnlinfo": {
        "cnid": "1",
        "cpid": "2",
        "gnid": "1000",
        "scnid": "1"
    },
    "eventid": "ccecc5898ffd4e9d9d396dd81a162d5c",
    "loc_info": {
        "is_update_location_info": "y",
        "locationInfo": ""
    },
    "ph_detailinfo": {
        "ph_brand": "Z29vZ2xl",
        "ph_build_id": "KTU84P",
        "ph_cpu_abi": "armeabi-v7a",
        "ph_cpuhardware": "hammerhead",
        "ph_desity": "480",
        "ph_manufact": "LGE",
        "ph_model": "TmV4dXMgNQ==",
        "ph_oritantion": "v",
        "ph_platform": "msm8974",
        "ph_product": "hammerhead",
        "ph_release_ver": "4.4.4",
        "ph_rom_id": "KTU84P",
        "ph_scrnsize": "1080X1776",
        "ph_sysvc": "19"
    },
    "ph_netinfo": {
        "ph_availmem": "867MB",
        "ph_country": "CN",
        "ph_date": "2018-06-23 07:15:10",
        "ph_language": "zh",
        "ph_latitude": "uk",
        "ph_longitude": "uk",
        "ph_runtime": "364326846",
        "ph_time_zone": "中国标准时间",
        "ph_totalmem": "1855MB",
        "ph_wifi_mac": "d4:ee:07:2d:b7:c0",
        "ph_wifi_name": "Ik1hcnMtWXl6eCI=",
        "ph_wifi_pip": "218.17.161.70",
        "ph_wifi_pmac": "00:90:4c:f6:c3:3a"
    },
    "phsiminfo": {
        "androidid": "234",
        "imei": "358240058093147",
        "imsi": "error_absent",
        "mcc": "uk",
        "mnc": "uk",
        "simcn": "uk",
        "simformat": "uk",
        "simoprt": "error_absent",
        "simoprtnm": "uk",
        "snwcn": "uk",
        "snwoprt": "error_absent",
        "snwoprtnm": "uk"
    },
    "sign_info": "5904d2e016450da505619cc7d500caed",
    "ssdkinfo": {
        "sdks": [
            {
                "midsn": "20180604",
                "midvc": "1.0",
                "sdknm": "Gdt",
                "sdkvc": "4.15.559"
            },
            {
                "midsn": "20180604",
                "midvc": "1.0",
                "sdknm": "Baidu",
                "sdkvc": "4.6"
            },
            {
                "midsn": "20180620",
                "midvc": "1.0",
                "sdknm": "Sisanjiujiu",
                "sdkvc": "1.0.3"
            },
            {
                "midsn": "20180620",
                "midvc": "1.0",
                "sdknm": "Chance",
                "sdkvc": "5.3.9"
            },
            {
                "midsn": "20180620",
                "midvc": "1.0",
                "sdknm": "Youmi",
                "sdkvc": "7.5.1"
            },
            {
                "midsn": "20180621",
                "midvc": "1.0",
                "sdknm": "Oppo",
                "sdkvc": "249"
            }
        ],
        "shellsn": "20180604",
        "shellvc": "1.0"
    }
}
<<<<<<< .mine



let ss=rc4Encrypt(JSON.stringify(query))
console.log("test--------------")
console.log(ss)
console.log("dss",rc4Decode(ss))

let s2="e5775f68138abfc9f69041b107061fc8f8c0a9904ec13489c0559092519547c8fadbc217fb187976b993d3c48e37c3b2c47577634ba27aa1a6337c0bf10743697ac52782deb4050228ef64f52316d4ad88cdf8fc8a"
console.log(s2)
console.log(ss)

console.log(s2==22)

console.log(rc4Decode(s2))


||||||| .r337

console.log(rc4Encrypt(JSON.stringify(query)))=======
*/
//console.log("rc4Encrypt:"+rc4Encrypt(JSON.stringify(query)))>>>>>>> .r347
