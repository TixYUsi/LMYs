/*
华辉拉肠签到
Author: Curtin
date 2022.1.17


关注公众号：huahuilachang
获取cookie：关注公众号-华辉会员-个人中心

必须变量： HuaHui_Cookie，多账号用&隔开 (ma_h5=ma_user:abc111，只取abc111)
格式: abc111&abc222

定时每天一次即可:
10 9 * * *

V2P/圈叉：
[task_local]
#华辉拉肠
10 8 * * * https://gitee.com/curtinlv/Curtin/raw/master/HuaHui/huahuiSign.js, tag=华辉拉肠, enabled=true

[rewrite_remote]
#华辉拉肠获取cookie重写
https://gitee.com/curtinlv/Curtin/raw/master/HuaHui/huahui.conf, tag=华辉获取Cookie, update-interval=172800, opt-parser=false, enabled=true

BoxJS 订阅：
https://gitee.com/curtinlv/Curtin/raw/master/Boxjs/curtin.boxjs.json
*/
const $ = Env("华辉拉肠");
$.idx = ($.idx = ($.getval('HuaHuiSuffix') || '1') - 1) > 0 ? ($.idx + 1 + '') : ''; // 账号扩展字符
const notify = $.isNode() ? require("./sendNotify") : ``;
const COOKIE = ``;
const logs = 0; // 0为关闭日志，1为开启
const notifyInterval = 1; // 0为关闭通知，1为所有通知，
const notifyttt = 1 // 0为关闭外部推送，1为所有通知
$.message = '', COOKIES_SPLIT = '';
const HuaHuitokenArr = [];
let HuaHuitokenVal = ``;
let middleHuaHuiTOKEN = [];
getCJDetail_Label = 1

if ($.isNode() && process.env.HuaHui_Cookie) {
    COOKIES_SPLIT = "&";
    console.log(
        `============ cookies分隔符为：${JSON.stringify(
      COOKIES_SPLIT
    )} =============\n`
    );
    if (
        process.env.HuaHui_Cookie &&
        process.env.HuaHui_Cookie.indexOf(COOKIES_SPLIT) > -1
    ) {
        middleHuaHuiTOKEN = process.env.HuaHui_Cookie.split(COOKIES_SPLIT);
    } else {
        middleHuaHuiTOKEN = process.env.HuaHui_Cookie.split();
    }
}
if (COOKIE.HuaHuitokenVal) {
    HuaHui_COOKIES = {
        "HuaHuitokenVal": COOKIE.HuaHuitokenVal.split('\n'),
    }
    Length = HuaHui_COOKIES.HuaHuitokenVal.length;
}
if (!COOKIE.HuaHuitokenVal) {
    if ($.isNode()) {
        Object.keys(middleHuaHuiTOKEN).forEach((item) => {
            if (middleHuaHuiTOKEN[item]) {
                HuaHuitokenArr.push(middleHuaHuiTOKEN[item]);
            }
        });
    } else {
        HuaHuitokenArr.push($.getdata("huahuitoken"));
        // 根据boxjs中设置的额外账号数，添加存在的账号数据进行任务处理
        let HuaHuiCount = ($.getval('HuaHuiCount') || '1') - 0;
        for (let i = 2; i <= HuaHuiCount; i++) {
            if ($.getdata(`huahuitoken${i}`)) {
                HuaHuitokenArr.push($.getdata(`huahuitoken${i}`));
            }
        }
    }
    if (HuaHuitokenArr == '') {
        Length = 0
    } else Length = HuaHuitokenArr.length
}

function GetCookie() {
    if ($request && $request.url.indexOf("getUserInfo") >= 0) {
        modifiedHeaders = $request.headers;
        // console.log(JSON.stringify(modifiedHeaders));
        // console.log(JSON.stringify(modifiedHeaders.Cookie));
        const huahuiCookie = JSON.stringify(modifiedHeaders);
//        const HuaHuitokenVal = huahuiCookie.match(/(ma_h5=.+?);/)[1];
        const HuaHuitokenVal = huahuiCookie.match(/ma_h5=ma_user:([0-9a-z]{32})/)[1];
        if (HuaHuitokenVal) $.setdata(HuaHuitokenVal, "huahuitoken" + $.idx);
        $.log(
            `[${$.name + $.idx}] 获取HuaHuitokenVal✅: 成功,HuaHuitokenVal: ${HuaHuitokenVal}`
        );
        $.msg($.name + $.idx, `获取华辉cookie: 成功🎉`, `cookie：${HuaHuitokenVal}`);

        // $done({
        //     headers: modifiedHeaders
        // });
        $done();
    }
     if ($request && $request.url.indexOf("queryPromotionEventDetail") >= 0) {
//        if ($response.statusCode == 200){
           $.getCJDetail = JSON.parse($response.body);
            if ($.getCJDetail.code == '000') {
                        giftList = $.getCJDetail.data.giftList
                        cj_eventID = $.getCJDetail.data.eventID
                        giftListAllNum = giftList.length
                        console.log("奖品详情获取：")
                        $.message += "🎉🎉🎉 奖品详情 🎉🎉🎉\n"
                        for (let i = 0; i < giftListAllNum; i++) {
                            giftLevelName = giftList[i].giftLevelName
                            giftName = giftList[i].giftName
                            totalCount = giftList[i].totalCount
                            sendCount = giftList[i].sendCount
                            if (sendCount < totalCount ){
                             console.log(`${giftLevelName}: ${giftName}   已领/总量 ${sendCount}/${totalCount}  🚩` )
                             $.message += `${giftLevelName}: ${giftName}   已领/总量 ${sendCount}/${totalCount}  🚩\n`
                            } else{
                             console.log(`${giftLevelName}: ${giftName}   已领/总量 ${sendCount}/${totalCount}` )
                             $.message += `${giftLevelName}: ${giftName}   已领/总量 ${sendCount}/${totalCount}\n`
                            }

                     }
                     $.msg($.name, `获取华辉抽奖详情: 成功🎉`, `${$.message}`);
                     $.msg($.name, `获取华辉抽奖ID: 成功🎉`, `${cj_eventID}`);
                    } else{
                        console.log("获取抽奖信息失败！")
                      }
//        }

    $done();
   }


}

console.log(
    `================== 脚本执行 - 北京时间(UTC+8)：${new Date(
    new Date().getTime() +
    new Date().getTimezoneOffset() * 60 * 1000 +
    8 * 60 * 60 * 1000
  ).toLocaleString()} =====================\n`
);
console.log(
    `============ 共 ${Length} 个${$.name}账号=============\n`
);


let isGetCookie = typeof $request !== 'undefined'

if (isGetCookie) {
    GetCookie()
    $.done();
} else {

    !(async () => {
//        await signget();
        await geteventID() // 获取最新抽奖id
        await all();
        $.message += `\nCurtin: 继续坚持🚩，能不能吃肠粉靠你啦~\n`;
        await msgShow();



    })()
    .catch((e) => {
            $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
        })
        .finally(() => {
            $.done();
        })
}


async function all() {
    if (!Length) {
        $.msg(
            $.name,
            '提示：⚠️华辉拉肠 公众号：huahuilachang\n' + '获取cookie：关注公众号-华辉会员-个人中心\n'
        );
        return;
    }
    for (let i = 0; i < Length; i++) {
        if (COOKIE.HuaHuitokenVal) {
            HuaHuitokenVal = HuaHui_COOKIES.HuaHuitokenVal[i];
        }
        if (!COOKIE.HuaHuitokenVal) {
            HuaHuitokenVal = HuaHuitokenArr[i];
        }
        header = {
                    "Host": "m.hualala.com" ,
                    "Cookie": "ma_h5=ma_user:" + HuaHuitokenVal + "; HUALALA_ONLINE_RESTAURANT_MPID=HfUFrRhyUV9f9568; SESSION_CB=; T-cookie=" ,
                    "content-type": "application/json;charset=UTF-8" ,
                    "accept": "*/*" ,
                    "accept-language": "zh-CN,zh-Hans;q=0.9" ,
                    "origin": "https://m.hualala.com" ,
                    "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.16(0x18001042) NetType/WIFI Language/zh_CN" ,
                    "auth-type": "10" ,
                    "referer": "https://m.hualala.com/newm/",
            };

        O = (`${$.name + (i + 1)}🔔`);
        await queryPromotionEventDetail() //查询抽奖详情
        await console.log(`-------------------------\n\n🔔开始运行【${$.name + (i + 1)}】`)
        $.message += `\n\n🔔开始运行【${$.name + (i + 1)}】, 您好！\n`;
        await queryCard() //查询积分
        await signget() //签到
        await choujiang() //抽奖
        await queryCard(label=1) //查询积分

    }
}
//获取最新抽奖
async function geteventID(timeout = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {

            let url = {
                url: `https://gitee.com/curtinlv/Curtin/raw/master/HuaHui/config.json`,
                headers: {
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                        "Accept-Encoding": "gzip, deflate, br",
                        "Accept-Language": "zh-CN,zh;q=0.9",
                        "Connection": "keep-alive",
                        "Host": "gitee.com",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
                      }
            };
            // console.log(JSON.stringify(url));
            $.get(url, async (err, resp, data) => {
                try {
                    if (logs) $.log(`${O}, 获取最新抽奖🚩: ${data}`);
                    $.geteventID = JSON.parse(data);
                    // console.log(JSON.stringify($.signget));
                    if ($.geteventID.cj_eventID != '') {
                                cj_eventID = $.geteventID.cj_eventID
                                sgin_eventID = $.geteventID.sgin_eventID
                           console.log(`成功获取最新抽奖id：${cj_eventID}`)
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve()
                }
            })
        }, timeout)
    })
}

//查询积分
async function queryCard(label = 0, timeout = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let url = {
                url: `https://m.hualala.com/or/card/queryCardSimpleList?groupID=237937&queryCardCode=true`,
                headers: header,
            };
            // console.log(JSON.stringify(url));
            $.get(url, async (err, resp, data) => {
                try {
                    if (logs) $.log(`${O}, 查询积分🚩: ${data}`);
                    $.queryCard = JSON.parse(data);
                    if ($.queryCard.code == '000') {
                       if ($.queryCard.msg == '执行成功') {
                            cardNum = $.queryCard.data.cardInfoList[0].cardNO
                            jifen = $.queryCard.data.cardInfoList[0].pointBalance
                            cardID = $.queryCard.data.cardInfoList[0].cardID
                            cardTypeID = $.queryCard.data.cardInfoList[0].cardTypeID
                            if (label) {
                                        $.message += `【当前积分】：${jifen}\n`;
                                     if (parseInt(jifen) > 300) {
                                        $.message += `🎉🎉🎉积分可兑换肠粉啦~\n`;
                                    }
                                } else {
                                        console.log(`【会员卡号】：NO.${cardNum}\n`);
                                        console.log(`【积分】：${jifen}\n`);
                                        $.message += `【会员卡号】：NO.${cardNum}\n`;

                                }


                        } else {
                                console.log(`【会员卡号】：${$.queryCard.msg}\n`);
                                $.message += `【会员卡号】：${$.queryCard.msg}\n`;
                        }

                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve()
                }
            })
        }, timeout)
    })
}
//每日签到
async function signget(timeout = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {

            let url = {
                url: `https://m.hualala.com/orh5/promotionEvent/joinEvent?groupID=237937`,
                headers: header,
                body: `groupID=237937&eventID=6914540268045730161&`,
            };
            // console.log(JSON.stringify(url));
            $.post(url, async (err, resp, data) => {
                try {
                    if (logs) $.log(`${O}, 每日签到🚩: ${data}`);
                    $.signget = JSON.parse(data);
                    // console.log(JSON.stringify($.signget));
                    if ($.signget.message === "用户未登录"){
                          console.log(`【每日签到】：${$.signget.message}\n`);
                         $.message += `【每日签到】：${$.signget.message},cookie已过期！\n`;

                    }else{

                                if ($.signget.rc == '000') {
                                if ($.signget.message == '执行成功') {
                                        console.log(`【每日签到】：领取${$.signget.data.obtainGiftList[0].giftName}\n`);
                                        $.message += `【每日签到】：领取${$.signget.data.obtainGiftList[0].giftName}\n`;
                                } else {
                                        console.log(`【每日签到】：${$.signget.message}\n`);
                                        $.message += `【每日签到】：${$.signget.message}\n`;
                                }

                            }
                        }


                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve()
                }
            })
        }, timeout)
    })
}

//每日抽奖
async function choujiang(timeout = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            header['Cookie'] = "ma_h5=ma_user:" + HuaHuitokenVal + "; HUALALA_ONLINE_RESTAURANT_MPID=483ebced-195d-4fa4-85f6-923c3e174ae8; SESSION_CB=; T-cookie="
            let url = {
                url: `https://m.hualala.com/orh5/promotionEvent/joinPromotionEvent?groupID=237937`,
                headers: header,
                body: `groupID=237937&eventID=${cj_eventID}&mpID=&isSingleRequest=true&cardID=${cardID}&cardTypeID=${cardTypeID}&location=&launchChannel=`,
            };
//             console.log(JSON.stringify(url));
            $.post(url, async (err, resp, data) => {
                try {
                    if (logs) $.log(`${O}, 每日抽奖🚩: ${data}`);
                    $.choujiang = JSON.parse(data);
                    // console.log(JSON.stringify($.signget));
                    if ($.choujiang.rc == '000') {
                        if ($.choujiang.message == '执行成功') {
                            if ($.choujiang.data.result.message == '执行成功') {
                                console.log(`【每日抽奖】：领取${$.choujiang.data.eventWin.giftName}\n`);
                                $.message += `【每日抽奖】：领取${$.choujiang.data.eventWin.giftName}\n`;
                            }
                        } else {
                                console.log(`【每日抽奖】：${$.choujiang.message}\n`);
                                $.message += `【每日抽奖】：${$.choujiang.message}\n`;
                        }

                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve()
                }
            })
        }, timeout)
    })
}

//获取抽奖详情
async function queryPromotionEventDetail(timeout = 0) {
    if (getCJDetail_Label){
       getCJDetail_Label = 0
    }else{
        return;
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            header['Cookie'] = "ma_h5=ma_user:" + HuaHuitokenVal + "; HUALALA_ONLINE_RESTAURANT_MPID=483ebced-195d-4fa4-85f6-923c3e174ae8; SESSION_CB=; T-cookie="
            let url = {
                url: `https://m.hualala.com/orh5/promotionEvent/queryPromotionEventDetail?groupID=237937`,
                headers: header,
                body: `groupID=237937&eventID=${cj_eventID}&mpID=&isSingleRequest=true&mpID=`,
            };
//             console.log(JSON.stringify(url));
            $.post(url, async (err, resp, data) => {
                try {
                    if (logs) $.log(`${O}, 获取抽奖详情🚩: ${data}`);
//                    $.log(`${O}, 每日抽奖🚩: ${data}`);
                    $.getCJDetail = JSON.parse(data);
                    if ($.getCJDetail.code == '000') {
                        giftList = $.getCJDetail.data.giftList
                        giftListAllNum = giftList.length
                        console.log("奖品详情获取：")
                        $.message += "🎉🎉🎉 奖品详情 🎉🎉🎉\n"
                        for (let i = 0; i < giftListAllNum; i++) {
                            giftLevelName = giftList[i].giftLevelName
                            giftName = giftList[i].giftName
                            totalCount = giftList[i].totalCount
                            sendCount = giftList[i].sendCount
                            if (sendCount < totalCount ){
                             console.log(`${giftLevelName}: ${giftName}   已领/总量 ${sendCount}/${totalCount}  🚩` )
                             $.message += `${giftLevelName}: ${giftName}   已领/总量 ${sendCount}/${totalCount}  🚩\n`
                            } else{
                             console.log(`${giftLevelName}: ${giftName}   已领/总量 ${sendCount}/${totalCount}` )
                             $.message += `${giftLevelName}: ${giftName}   已领/总量 ${sendCount}/${totalCount}\n`
                            }

                     }
                    } else{
                        console.log("获取抽奖信息失败！")
                      }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve()
                }
            })
        }, timeout)
    })
}


function msgShow() {
    return new Promise(async resolve => {
        if (notifyInterval != 1) {
            console.log($.name + '\n' + $.message);
        }
        if (notifyInterval == 1) {
            $.msg($.name, ``, $.message);
        }


        if (notifyttt == 1 && $.isNode()){
            await notify.sendNotify($.name, $.message);
        }

        resolve()
    })
}

// prettier-ignore
function Env(t, e) {
    class s {
        constructor(t) {
            this.env = t
        }
        send(t, e = "GET") {
            t = "string" == typeof t ? {
                url: t
            } : t;
            let s = this.get;
            return "POST" === e && (s = this.post), new Promise((e, i) => {
                s.call(this, t, (t, s, r) => {
                    t ? i(t) : e(s)
                })
            })
        }
        get(t) {
            return this.send.call(this.env, t)
        }
        post(t) {
            return this.send.call(this.env, t, "POST")
        }
    }
    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log(``, `\ud83d\udd14${this.name}, \u5f00\u59cb!`)
        }
        isNode() {
            return "undefined" != typeof module && !!module.exports
        }
        isQuanX() {
            return "undefined" != typeof $task
        }
        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon
        }
        isLoon() {
            return "undefined" != typeof $loon
        }
        toObj(t, e = null) {
            try {
                return JSON.parse(t)
            } catch {
                return e
            }
        }
        toStr(t, e = null) {
            try {
                return JSON.stringify(t)
            } catch {
                return e
            }
        }
        getjson(t, e) {
            let s = e;
            const i = this.getdata(t);
            if (i) try {
                s = JSON.parse(this.getdata(t))
            } catch {}
            return s
        }
        setjson(t, e) {
            try {
                return this.setdata(JSON.stringify(t), e)
            } catch {
                return !1
            }
        }
        getScript(t) {
            return new Promise(e => {
                this.get({
                    url: t
                }, (t, s, i) => e(i))
            })
        }
        runScript(t, e) {
            return new Promise(s => {
                let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                i = i ? i.replace(/\n/g, ``).trim() : i;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
                const [o, h] = i.split("@"), a = {
                    url: `http://${h}/v1/scripting/evaluate`,
                    body: {
                        script_text: t,
                        mock_type: "cron",
                        timeout: r
                    },
                    headers: {
                        "X-Key": o,
                        Accept: "*/*"
                    }
                };
                this.post(a, (t, e, i) => s(i))
            }).catch(t => this.logErr(t))
        }
        loaddata() {
            if (!this.isNode()) return {}; {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e);
                if (!s && !i) return {}; {
                    const i = s ? t : e;
                    try {
                        return JSON.parse(this.fs.readFileSync(i))
                    } catch (t) {
                        return {}
                    }
                }
            }
        }
        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e),
                    r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
            }
        }
        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i)
                if (r = Object(r)[t], void 0 === r) return s;
            return r
        }
        lodash_set(t, e, s) {
            return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
        }
        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ``;
                if (r) try {
                    const t = JSON.parse(r);
                    e = t ? this.lodash_get(t, i, ``) : e
                } catch (t) {
                    e = ``
                }
            }
            return e
        }
        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
                } catch (e) {
                    const o = {};
                    this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
                }
            } else s = this.setval(t, e);
            return s
        }
        getval(t) {
            return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
        }
        setval(t, e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
        }
        initGotEnv(t) {
            this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
        }
        get(t, e = (() => {})) {
            t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.get(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                try {
                    if (t.headers["set-cookie"]) {
                        const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                        this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                    }
                } catch (t) {
                    this.logErr(t)
                }
            }).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => {
                const {
                    message: s,
                    response: i
                } = t;
                e(s, i, i && i.body)
            }))
        }
        post(t, e = (() => {})) {
            if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.post(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            });
            else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => e(t));
            else if (this.isNode()) {
                this.initGotEnv(t);
                const {
                    url: s,
                    ...i
                } = t;
                this.got.post(s, i).then(t => {
                    const {
                        statusCode: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    } = t;
                    e(null, {
                        status: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    }, o)
                }, t => {
                    const {
                        message: s,
                        response: i
                    } = t;
                    e(s, i, i && i.body)
                })
            }
        }
        time(t) {
            let e = {
                "M+": (new Date).getMonth() + 1,
                "d+": (new Date).getDate(),
                "H+": (new Date).getHours(),
                "m+": (new Date).getMinutes(),
                "s+": (new Date).getSeconds(),
                "q+": Math.floor(((new Date).getMonth() + 3) / 3),
                S: (new Date).getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + ``).substr(4 - RegExp.$1.length)));
            for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr((`` + e[s]).length)));
            return t
        }
        msg(e = t, s = ``, i = ``, r) {
            const o = t => {
                if (!t) return t;
                if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
                    "open-url": t
                } : this.isSurge() ? {
                    url: t
                } : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"],
                            s = t.mediaUrl || t["media-url"];
                        return {
                            openUrl: e,
                            mediaUrl: s
                        }
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl,
                            s = t["media-url"] || t.mediaUrl;
                        return {
                            "open-url": e,
                            "media-url": s
                        }
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return {
                            url: e
                        }
                    }
                }
            };
            this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r)));
            let h = [``, "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
            h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h)
        }
        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
        }
        logErr(t, e) {
            const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            s ? this.log(``, `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log(``, `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t)
        }
        wait(t) {
            return new Promise(e => setTimeout(e, t))
        }
        done(t = {}) {
            const e = (new Date).getTime(),
                s = (e - this.startTime) / 1e3;
            this.log(``, `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
        }
    }(t, e)
}
