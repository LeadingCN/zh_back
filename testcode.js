const md5 = require('md5')
// function guid(t, q) {
//   let now = new Date().getTime();
//   let str = t + `xxxxxxxxx${now}y` + q.toString().padStart(3, '0');
//   return str.replace(/[xy]/g, function (c) {
//     var r = Math.random() * 16 | 0;
//     var v = c == 'x' ? r : (r & 0x3 | 0x8);
//     return v.toString(16)
//   })
// }
// console.log(`MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx/giFlhu4Ndmsm3AV5ArLzVlH3DzIj9nbEBM9/pXihTVa56cn7FJBv6RLfn7qy98kGB8xDwO32gWezxCaPhIwyT34Af0eZMQBUAxCrw2n88GKfo2Le381Mx5WB31X3pp93xnJzDuqdxZQBTJiCYcxFQltNts3WyJ6sYINDPEDmyse/OcuTZ0R9N1DvKfAXHRarP5VAKBYhlSTOX3JVLen56am5NE2qkmBayazVnB50D/E0ZijfnDetiryzMkJAf18ZFsYw2Plkz6HHHtjMwJaUBD+hiPE27pG3tjyVfWap//xlpdFxEyMLKt76xFWYOv5+PbDgfJRPpi/BUZ+XwlvQIDAQAB`.length);
// console.log(guid());
// console.log('67b06c41-cfcd-1667121807812-bb9b'.length, 'ACB6DCF78B5C1B6AF270288D0F51D303'.length);
// for (let i = 0; i < 5; i++) {
//   let str = `xxxxxxxxxxxxyxxx`;
//   console.log(str.replace(/[xy]/g, function (c) {
//     var r = Math.random() * 16 | 0;
//     var v = c == 'x' ? r : (r & 0x3 | 0x8);
//     return v.toString(16)
//   }).toLocaleUpperCase());
// }

// function ascesign(obj, yan) {
//   let newData2 = {}, signData2 = []
//   Object.keys(obj).sort().map(key => {
//     newData2[key] = obj[key]
//     if (key != 'sign') {
//       signData2.push(`${key}=${obj[key]}`);
//     }
//   })
//   let sign = md5(signData2.join('&') + yan).toLocaleUpperCase();
//   // Logger.log(`${signData2.join('&')} 加密签名 ${sign}`)
//   // obj['sign'] = sign;
//   return sign
// }

// let testobj = {
//   merId: 17,
//   orderId: 1,
//   orderAmt: 1,
//   channel: 1,
//   desc: 1,
//   attch: 1,
//   smstyle: 1,
//   userId: 1,
//   ip: 1,
//   notifyUrl: 1,
//   returnUrl: 1,
//   nonceStr: 1,
//   // sign: 1,
// }
let testobj = {
  channel: "1",
  desc: "shoping",
  ip: "211.94.116.218",
  merId: "6",
  nonceStr: "1668351008037",
  notifyUrl: "http://94.74.101.22:3020/notify/liji/notify_res.htm",
  orderAmt: "100.00",
  orderId: "P01202211132250079084057",
  returnUrl: "http://www.baidu.com",
  sign: "DFD2E28C63A581FB1959DDAA32DF099A"
}
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// 生成 rsa 非对称密钥对
// 返回 {publicKey, privateKey}
function getKeyPair(passphrase) {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // 模数的位数，即密钥的位数，2048 或以上一般是安全的
    publicExponent: 0x10001, // 指数值，必须为奇数，默认值为 0x10001，即 65537
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8', // 用于存储私钥信息的标准语法标准
      format: 'pem', // base64 编码的 DER 证书格式
      cipher: 'aes-256-cbc', // 加密算法和操作模式
      passphrase
    }
  });
}

// 生成 rsa 非对称密钥对文件到指定路径，名称分别为 private.pem 和 public.pem
function createKeyPairFile(filePath, passphrase) {
  const { publicKey, privateKey } = getKeyPair(passphrase);
  try {
    fs.writeFileSync(path.join(filePath, 'private.pem'), privateKey, 'utf8');
    fs.writeFileSync(path.join(filePath, 'public.pem'), publicKey, 'utf8');
  } catch (err) {
    console.error(err);
  }
}

// 使用公钥加密数据
function publicEncrypt(data, publicKey, encoding) {
  const msg = JSON.stringify(data);
  const encryptBuffer = crypto.publicEncrypt({
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_PADDING // 填充方式，需与解密一致
  }, Buffer.from(msg, 'utf8'));
  if (encoding) {
    return encryptBuffer.toString(encoding);
  } else {
    return encryptBuffer;
  }
}

// 使用私钥解密数据
function privateDecrypt(privateKey, passphrase, encryptBuffer) {
  const msgBuffer = crypto.privateDecrypt({
    key: privateKey,
    passphrase,
    padding: crypto.constants.RSA_PKCS1_PADDING
  }, encryptBuffer);

  return JSON.parse(msgBuffer.toString('utf8'));
}

// 使用私钥签名数据
function privateSign(privateKey, passphrase, encryptBuffer, encoding) {
  const sign = crypto.createSign('SHA256');
  sign.update(encryptBuffer);
  sign.end();
  const signatureBuffer = sign.sign({
    key: privateKey,
    passphrase
  });
  if (encoding) {
    return signatureBuffer.toString(encoding);
  } else {
    return signatureBuffer;
  }
}

// 使用公钥验证签名
function publicVerify(publicKey, encryptBuffer, signatureBuffer) {
  const verify = crypto.createVerify('SHA256');
  verify.write(encryptBuffer);
  verify.end();
  return verify.verify(publicKey, signatureBuffer);
}

let pkey = `MIIEowIBAAKCAQEAsav5xjLT+F9IstuNdFVmYnVsDh39R42pfLbFU4QlKqJ9VXnb
M/m3QeZdAdr66t4DnC/6o7sETaDsuS1E9D523Co3O3bmrA85t3Fg2rlKOtWM3IYJ
7sotHXQ6aHM90pc2/Ud7GY9rAI55FFryAeycH57WLmQ09kGzJjtVqVCxJEoZf7Nz
/sfc2PpmbK96tnp0BoUjfb0vTAbplaesx1oh6F3Cwpa+5CV4whRUWMJnwZLrcqXB
SEwgh+CgsGgs0b2ZDOvq7Trwxh9/0amIJwrLKkAeN4g20+1Pkw/bJIDFhhNoDq8a
5MjU8UCCsO4NXcg4axsuB2oI33D7Jn4RY2fQuQIDAQABAoIBAQCF18Hvlvar0kvX
wSFMk9DvNvnRoLHep08Yji8UfSXqekHklEmXW/S7hihmb2o6aElb7aDomsfhGut5
jCq3vB6aOIsnFqkq0MVv9c86tf6/V4Qn1CnDYzadS6N8b+QQsq1QG/sWBD5dSvbX
aLOK043BHEzI4eAr6s5kbKpZRFpNtOsJBc9IhrH9crnGbXqUe+mIOJiRKtMEvpoZ
eO/OzKjoeH8eQYAlBA5JuT0d/QGCE8b0ju5k3vEXBQsVhuPzwBIBI2/2RIRej0IC
gb8rrvQZ99pka6O3QDsIVp0kFcIK6Ui9vBF1sq4nCdnN9z0pKvdkK2g71mliTK6w
cmKqcowhAoGBANwW0rSoNI4LPSW7lRB0Tluz+uGaYGAJZADcW6tz044YqXuC7uas
PTNUofzhByJCvBNrqutJyt4n7e67kp8elJXiInD0817dWHBxMA3YWFWFiWM8tLLi
u48jQ+fzlFoAOsvhiUrGQqQlP14bKwNHI6Jm6rjcF3E+znLG3zihi64NAoGBAM6p
XmWZWi75r7u+hC4pH+DWsV8X2gYs3CPzSMicRgV/x9GcOJYCZMOrvD/DrOEsond0
Lv7VuxtpkkH7Nlh+tzIOmjjSpFURwQghBITeIhnWY7i/qVEB1uyE/FzqnbdhfXQj
6eKR4wTuL6lPTvmzX8tgwPXk1xeObxwbtTCSYG5dAoGALlxMZCuubmFlrwYVf1LQ
kraV2WH4fSJdQ2UnljUe0ibVxKOvCT4s4hwoxyjrpMbj8T9T0J5JsoQ8tXYji4sY
h34L/TlL7qa3k2/0TGZPLSyk5ReLhMcH9T3bdwezL0YvHHVUw0CCFyuVbpBQfi9F
DVeah/gso/kz6a+Eo9w7nR0CgYA0+5Mp9RD77iOxvHxi4UQ8/o3m1VSeNK4TwXGt
jPMewc3W3XhcbSysRcEzj9UovarBeVX7G4ym0IAgzmj2czZAbSH443giHzUgAmcI
MXMIsMBMQ0cDb7dMWCPjJntc4m+pcPOrlL9hKjep7p1Ow0ASAjI2WH8UmP2/dRMU
6tIyOQKBgDnHnFkIVDBPgjA0oqGBCpGgZFKy7/FaNo31qQ439i+M80tRfQuVGK0v
KhFlRfRDn5gv/LDoKefMZGZJil4OyF6ORYQOyL8usBtbvBRs9fym1En4pSen5HP5
EQeWpZkN4CYWOGjeREP8ljpu6TlI0sEyoEJgUma54EtzOoVazk0x`
let pkey2 = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtQ1A155Lgd5xvo4DG5yN
RzWnSFVsBNn5cL1by8LH5cFu/tjtKNm9cAFZTA6R/uvAYtqFdZvTBDgoRn631zMQ
aiLzf2OBTBpiS/RYKevaz/A0kyOFqUIn0bKJJC5SQybwEe59wico8dMasBds8zPa
zBKFHtLjCETfLNmgR7vJC7mCfq6iSitwk1m2U6zC45T0Muxrlu3FDvyBMenscVAS
2yWYV21pwoLgkblqaJjWoHDuM0Z+IiycWYiFHOA51MIdP2wIZoNrxEkRDDlAy75m
HTr+z7uWLB6z/ZengeEP485CBUB7Zeyc9QjCXJAXrI886Qc4WPghIXR+VdRBO2Im
bQIDAQAB`
let k = `MIICWwIBAAKBgQC6XLmW1Baz2aVDNVjUja/4cVWHFS5iQFhTC0YMZDFwElafjHc0
1Rp0XEcU3LcBj9ioijm+CZ793DJoV2ZOjv3Tg2fYKWpvx2Rn4d5RhwcUEiMMdSkZ
D7tHDCAVYapGYbgqybws3nvrU8LX/xO5mlSXe8PqyXjg+NbHuzNnajsXXQIDAQAB
AoGAOQmMG6eJ0z23oNxA9bzvsKAvRwqqiZOb9L6sj7pSjzRtoqNBEMBwOlDLyIzM
zgOSkfLMPWeAa73rB5hITZ7h/EanPs067NDIKr6m51bi7oIiMR/JU+FTHrN7SeRr
vuModtcMVfGxLuZBEG67D81vyZgr0nX/0YBk96cHEJngcZkCQQDUHQUxAfULAkVj
ny0gAuX+jf4O6AMcLRd79e0RJp00iOBsYKyxw+pRUT+MaorCNmUVC63uda61C665
CY8IxH5TAkEA4Ou/LoBLahm/xhTLcnLROZTcjCeQZCNB1QIkB6RrZGFSSLEgroED
cRLip46hEQvOFa6hwxDIVE172Fe+5M59jwJAVQb5EMcnEm2roR6quR1QUvVadWE9
9eqBcniHuotPE0MXK3qpX20YndZC8ie3Tdj+NiyDYYadLQfs11Hkm3Ag7wJAQTX4
iwnlU5C9mjeDON5zLMetHfGGmpHiT1i8i36vKD5TNgIs4ItFLS51inD+38tVZ9Hm
0oB2JIMGihX+oaYAnwJAS+wfpzgXLY8twclGg+GlGlIeIoO8gcsbP6jnkivUKryM
XVUHCw49CV8+2/mwTo3Rv9Os+sc+wQe+ufH1RDWebg==`
var privatekey = fs.readFileSync(`D:\\0git\\0myJob\\feng_zh_handler\\zh_handler_back\\keys\\6\\private.pem`, 'utf8').toString()
var publickey = fs.readFileSync(`D:\\0git\\0myJob\\feng_zh_handler\\zh_handler_back\\keys\\6\\public.pem`, 'utf8').toString()
function ascesign(obj, yan) {
  let newData2 = {}, signData2 = [], signData3 = []
  // Object.keys(obj).sort().map(key => {
  //   newData2[key] = obj[key]
  //   if (key != 'sign') {
  //     signData2.push(`${key}=${obj[key]}`);
  //   }
  // })

  // console.log(sorter(obj));
  Object.keys(obj).map(key => {
    if (key != 'sign') {
      signData2.push(`${key}=${obj[key]}`);
    }
  })
  console.log(k.length);
  let tt = pkey.replace(/\n/g, "")
  // tt = tt.replace(/ /g, "")
  // console.log("私钥:", tt, "长度:", tt.length);
  // let t2 = md5(tt).toLocaleUpperCase()
  // console.log("私钥md5:", t2);
  signData3 = `merId=6&orderId=P01202211152148221241930&orderAmt=100.00&channel=1&desc=shoping&ip=211.94.116.218&notifyUrl=http://94.74.101.22:3020/notify/liji/notify_res.htm&returnUrl=http://www.baidu.com&nonceStr=1668520102144&smstyle=1`
  let t = signData2.join('&') + `&key=${tt}`
  //channel=1&desc=shoping&ip=211.94.116.218&merId=6&nonceStr=1668517296168&notifyUrl=http://94.74.101.22:3020/notify/liji/notify_res.htm&orderAmt=100.00&orderId=P01202211152101361471163&returnUrl=http://www.baidu.com&smstyle=1&key=0800A46C752DA5E689AF1CFFF4A50BD5
  // console.log("等待签名字符串:", `merId=6&orderId=P01202211152148221241930&orderAmt=100.00&channel=1&desc=shoping&ip=211.94.116.218&notifyUrl=http://94.74.101.22:3020/notify/liji/notify_res.htm&returnUrl=http://www.baidu.com&nonceStr=1668520102144&smstyle=1`);
  console.log("等待签名字符串:", t);
  console.log("等待签名字符串:", `channel=1&desc=shoping&ip=211.94.116.218&merId=6&nonceStr=1668517296168&notifyUrl=http://94.74.101.22:3020/notify/liji/notify_res.htm&orderAmt=100.00&orderId=P01202211152101361471163&returnUrl=http://www.baidu.com&smstyle=1&key=0800A46C752DA5E689AF1CFFF4A50BD5`);
  let sign = md5(t).toLocaleUpperCase();
  return sign
}
/**
 * 创建签名（使用私钥和数据）
 *
 * @param data
 * @param privateKey
 * @returns {string}
 */
function createSign(data, privateKey) {
  const sign = crypto.createSign('RSA-SHA1');
  sign.update(data);
  sign.end();
  return sign.sign(privateKey).toString('base64')
}

/**
 * 签名验证（使用公钥、数据、签名）
 *
 * @param data
 * @param sign
 * @param publicKey
 * @returns {boolean}
 */
function verifySign(data, sign, publicKey) {
  const verify = crypto.createVerify('RSA-SHA1');
  verify.update(data);
  verify.end();
  return verify.verify(publicKey, Buffer.from(sign, 'base64'));
}

let testobj2 = {
  channel: "1",
  desc: "shoping",
  ip: "211.94.116.218",
  merId: "6",
  nonceStr: "1668520102144",
  notifyUrl: "http://94.74.101.22:3020/notify/liji/notify_res.htm",
  orderAmt: "100.00",
  orderId: "P01202211152148221241930",
  returnUrl: "http://www.baidu.com",
  sign: "qadW1vobgp+Kv8xiset7qG6Sxj8FyCoIRxTuxHwGnJlxiRqzoZAHke9ZvtmmARN3eMY1BgCzkYGHNoZ+X3+naKnqRUx/NMYQisKNR095v3718aiZyCbhKSn4/XznCvAKBHU0+8jy+iGdApSFDQfNsxRRdChJGZf6qtuqj1fYnwZCA7X5X9AnrnQckzsStAwjloca1L+OU4jhwN/AZx9mUGyeL0Gz0SY8KLe4kE5/HdZFBlqxRoartWBuLzB0EhWN2oDPZBH8VNKo73CDg3vwEZpyfImZ6vDRaDaqcaEgVj/nCyvaaPNNSNpWDqEBvE8p77kmWavdEin0bpbp+caWbQ==",
  smstyle: "1"
}
/**
 * {
0|main  | {
0|main  |   "channel": "1",
0|main  |   "desc": "shoping",
0|main  |   "ip": "211.94.116.218",
0|main  |   "merId": "6",
0|main  |   "nonceStr": "1668520102144",
0|main  |   "notifyUrl": "http://94.74.101.22:3020/notify/liji/notify_res.htm",
0|main  |   "orderAmt": "100.00",
0|main  |   "orderId": "P01202211152148221241930",
0|main  |   "returnUrl": "http://www.baidu.com",
0|main  |   "sign": "qadW1vobgp+Kv8xiset7qG6Sxj8FyCoIRxTuxHwGnJlxiRqzoZAHke9ZvtmmARN3eMY1BgCzkYGHNoZ+X3+naKnqRUx/NMYQisKNR095v3718aiZyCbhKSn4/XznCvAKBHU0+8jy+iGdApSFDQfNsxRRdChJGZf6qtuqj1fYnwZCA7X5X9AnrnQckzsStAwjloca1L+OU4jhwN/AZx9mUGyeL0Gz0SY8KLe4kE5/HdZFBlqxRoartWBuLzB0EhWN2oDPZBH8VNKo73CDg3vwEZpyfImZ6vDRaDaqcaEgVj/nCyvaaPNNSNpWDqEBvE8p77kmWavdEin0bpbp+caWbQ==",
0|main  |   "smstyle": "1"
0|main  | }
import java.util.*;
public class Main {
  public static void main(String[] args) {
    TreeMap<String,String> map = new TreeMap();
    map.put("merId","6");
    map.put("orderId","P01202211152148221241930");
    map.put("orderAmt","100.00");
    map.put("channel","1");
    map.put("desc","shoping");
    map.put("ip","211.94.116.218");
    map.put("notifyUrl","http://94.74.101.22:3020/notify/liji/notify_res.htm");
    map.put("returnUrl","http://www.baidu.com");
    map.put("nonceStr","1668520102144");
    map.put("smstyle","1");
    StringBuilder stringBuilder = new StringBuilder();
    for(String s: map.keySet()){
        stringBuilder.append(s).append("=").append(map.get(s)).append("&");
    }
    String key = "MIIEowIBAAKCAQEAsav5xjLT+F9IstuNdFVmYnVsDh39R42pfLbFU4QlKqJ9VXnbM/m3QeZdAdr66t4DnC/6o7sETaDsuS1E9D523Co3O3bmrA85t3Fg2rlKOtWM3IYJ7sotHXQ6aHM90pc2/Ud7GY9rAI55FFryAeycH57WLmQ09kGzJjtVqVCxJEoZf7Nz/sfc2PpmbK96tnp0BoUjfb0vTAbplaesx1oh6F3Cwpa+5CV4whRUWMJnwZLrcqXBSEwgh+CgsGgs0b2ZDOvq7Trwxh9/0amIJwrLKkAeN4g20+1Pkw/bJIDFhhNoDq8a5MjU8UCCsO4NXcg4axsuB2oI33D7Jn4RY2fQuQIDAQABAoIBAQCF18Hvlvar0kvXwSFMk9DvNvnRoLHep08Yji8UfSXqekHklEmXW/S7hihmb2o6aElb7aDomsfhGut5jCq3vB6aOIsnFqkq0MVv9c86tf6/V4Qn1CnDYzadS6N8b+QQsq1QG/sWBD5dSvbXaLOK043BHEzI4eAr6s5kbKpZRFpNtOsJBc9IhrH9crnGbXqUe+mIOJiRKtMEvpoZeO/OzKjoeH8eQYAlBA5JuT0d/QGCE8b0ju5k3vEXBQsVhuPzwBIBI2/2RIRej0ICgb8rrvQZ99pka6O3QDsIVp0kFcIK6Ui9vBF1sq4nCdnN9z0pKvdkK2g71mliTK6wcmKqcowhAoGBANwW0rSoNI4LPSW7lRB0Tluz+uGaYGAJZADcW6tz044YqXuC7uasPTNUofzhByJCvBNrqutJyt4n7e67kp8elJXiInD0817dWHBxMA3YWFWFiWM8tLLiu48jQ+fzlFoAOsvhiUrGQqQlP14bKwNHI6Jm6rjcF3E+znLG3zihi64NAoGBAM6pXmWZWi75r7u+hC4pH+DWsV8X2gYs3CPzSMicRgV/x9GcOJYCZMOrvD/DrOEsond0Lv7VuxtpkkH7Nlh+tzIOmjjSpFURwQghBITeIhnWY7i/qVEB1uyE/FzqnbdhfXQj6eKR4wTuL6lPTvmzX8tgwPXk1xeObxwbtTCSYG5dAoGALlxMZCuubmFlrwYVf1LQkraV2WH4fSJdQ2UnljUe0ibVxKOvCT4s4hwoxyjrpMbj8T9T0J5JsoQ8tXYji4sYh34L/TlL7qa3k2/0TGZPLSyk5ReLhMcH9T3bdwezL0YvHHVUw0CCFyuVbpBQfi9FDVeah/gso/kz6a+Eo9w7nR0CgYA0+5Mp9RD77iOxvHxi4UQ8/o3m1VSeNK4TwXGtjPMewc3W3XhcbSysRcEzj9UovarBeVX7G4ym0IAgzmj2czZAbSH443giHzUgAmcIMXMIsMBMQ0cDb7dMWCPjJntc4m+pcPOrlL9hKjep7p1Ow0ASAjI2WH8UmP2/dRMU6tIyOQKBgDnHnFkIVDBPgjA0oqGBCpGgZFKy7/FaNo31qQ439i+M80tRfQuVGK0vKhFlRfRDn5gv/LDoKefMZGZJil4OyF6ORYQOyL8usBtbvBRs9fym1En4pSen5HP5EQeWpZkN4CYWOGjeREP8ljpu6TlI0sEyoEJgUma54EtzOoVazk0x";
    String aValue = stringBuilder.append("key=").append(key).toString();
    System.out.println(map);
    System.out.println(stringBuilder);
    System.out.println(aValue);

  }
}

 */
// console.log(pkey.replace(/\n/g, ''));
// console.log(md5(`money=2.0&outTradeNo=P12312321123&type=wechat&userId=test01&key=EWEFD123RGSRETYDFNGFGFGSHDFGH`));
// //构造请求体
// console.log("请求主体:", testobj2);

// // console.log(`请求体${JSON.stringify(testobj2)}`);
// let md5sign = ascesign(testobj2, '')
// console.log("需要签名的md5:", md5sign);
// // console.log(privatekey);
// // let encode = privateSign(privatekey, '', Buffer.from(md5sign), 'base64');
// // console.log(encode);
// // // // console.log('SHA256 : ', encode);
// // // console.log('SHA256 MD5化 : ', md5(encode).toLocaleUpperCase());
// // // console.log('请求中的 MD5 : ', testobj2.sign);
// // let verify = publicVerify(publickey, Buffer.from(md5sign), Buffer.from(testobj2.sign, 'base64'))
// // console.log("校验结果", verify);
// const NodeRSA = require("node-rsa");
// // // const crypto = require("crypto");
// // const key = new NodeRSA({ b: 2048 }); //生成2048位的密钥
// // var publicDer = key.exportKey("pkcs1-public-pem"); //公钥
// // var privateDer = key.exportKey("pkcs1-private-pem");//私钥
// // console.log("公钥:", publicDer);
// // console.log("私钥:", privateDer);
// // const text = "Hello RSA!";
// // console.log(privatekey);

// // const prikey = new NodeRSA({ b: 2048 });
// // prikey.importKey(privatekey, "pkcs1-private-pem")
// // var signedData = prikey.sign(md5sign, "base64")

// // console.log('\n使用私钥签名:', signedData);

// // const pubkey = new NodeRSA({ b: 2048 });
// // pubkey.importKey(publickey, "pkcs1-public-pem");
// // console.log('签名校验结果:', pubkey.verify(Buffer.from(md5sign), testobj2.sign, 'Buffer', "base64"));
// console.log(md5(`wffiEPNhe571f1ed7187f0b7be2b241b65e838a7`).toLocaleUpperCase());


const REQ = require('request-promise-native');

(async () => {
  try {
    let res = await REQ.get('http://119.23.215.249:8081/index.php/api/entry?method=proxyServer.generate_api_url&packid=0&fa=0&fetch_key=&groupid=0&qty=1&time=1&pro=%E5%9B%9B%E5%B7%9D%E7%9C%81&city=%E7%BB%B5%E9%98%B3%E5%B8%82&port=1&format=txt&ss=1&css=&dt=1&specialTxt=3&specialJson=&usertype=2')

    if (res && res.indexOf(":") != -1) {
      //测试代理连通状态
      let r = await REQ.get('http://www.baidu.com', { proxy: `http://${res}`, timeout: 3000 })
    }
  } catch (error) {
    console.error(error);
  }

})()