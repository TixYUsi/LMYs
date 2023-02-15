
var url = $request.url;
const path1 = "api.openai.com/v1/completions";

if (url.indexOf(path1) != -1) {

  if(typeof $response !== "undefined"){
    let obj = JSON.parse($response.body);
    var text= obj.choices[0].text
    obj.choices[0].text = text + "\n\n[来自ChatGPT答复][愉快]" ;
	console.log(obj.choices[0].text);
  var body = JSON.stringify(obj);
	// console.log(`${JSON.stringify(obj, null, '\t')}`);
  $done({body});
 }

  if(typeof $request.body !== "undefined"){
   let obj = JSON.parse($request.body);
   var prompt = obj.prompt;
// console.log("替换前:"+prompt);
   var p = prompt.substr(prompt.lastIndexOf("Human:")+6);
   obj.prompt=p;
   console.log("替换后:"+p);
    // $notify("AI接收消息:"+p)
   var body = JSON.stringify(obj);
	//console.log(`${JSON.stringify(obj, null, '\t')}`);
   $done({body});

  }
   

}
