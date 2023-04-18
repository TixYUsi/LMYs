
/**

hostname = promotion.waimai.meituan.com

#58秒点击qiang300次
romotion.waimai.meituan.com/lottery/limitcouponcomponent/fetchcoupon url script-request-body https://gitee.com/curtinlv/qx/raw/master/mt.js


 */


var url = $request.url;
const path1 = "romotion.waimai.meituan.com/lottery/limitcouponcomponent/fetchcoupon";

if (url.indexOf(path1) != -1) {

  if(typeof $request.body !== "undefined"){

   let r_body = JSON.parse($request.body);
   let r_header = JSON.parse($request.headers);

   const myRequest = {
    url: url,
    method: method,
    headers: r_header,
    body: r_body
        };
  
  $notify("开始抢券",'1',"")

for(let i=0; i<=300;i++){

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);

}, reason => {
    console.log(reason.error);

});
}

    $notify("结束抢券",'1',"")



  }
   

}

