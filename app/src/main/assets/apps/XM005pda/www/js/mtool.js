/**
 * 此js未使用jquery，如需使用jquery请单独引入
 */
var LL=window.localStorage||{},WN=window,CONTEXT,M={}, // 因为localStorage太长了所以这样写 .CONTEXT:用来触发系统声音用的全局有且只有这一个对象
	NETWORK = {},ABCD=false;//NETWORK 保存的是网络状态。
	//ABCD如果为true, 则会加载测试js
/**
   * M是封装关于移动端操作的工具集合
   * 前提是得要先引入mui.js
   * CONTEXT:内部调用
   */
/**
    * a :要判断的参数类型
    */
   function checkType(a){
   	var q = {} ;
   	return q.toString.call(a).replace(/\[|\]/gi,'').replace(/[a-zA-Z]+\s+/gi,'').toLowerCase() ;
   };
   /**
     * 获取随机数
     * min：随机数的最大值
     * max：随机数的最小值
     * num : 保留多少未数字
     */
    function getRound(min,max,num){
        var range = max - min , rand = Math.random() ;
        if(!num) num = 0 ;
        return Number(parseInt( min) + Number( Math.abs(rand * range))).toFixed(num) ;
    };
  /**
   * @date	2017-07-26
   * @param  type [type:string] => *  aa:获取小写字母 ；
								   *  AA:获取大写字母；  
								   *  Aa:获取大小写字母 ；
								   *  am:获取字母+数字 ；
								   *  HH:获取中文；
								   *  DD:获取日期
								   *  MM : 全数字的字符串
   * @param MIN [type:number] ;获取最小值 ，如果type为DD获取日期类型的话，MIN为日期类型。* 1 :代表yyyy年/MM月/dd日 HH时mm分ss秒
   																				      * 2：代表 'yyyy/MM/dd HH:mm:ss' ;
																				      * 3： 代表'HH:mm:ss' ;
																				      * 4：代表 'HH时mm分ss秒';
   * @param MAX [type:number] ; 获取最大值
   * 
   * @demo getRand('AA',3,9) ; 意思：随机获取全大写字母3到9个   返回为： 'OUDMID'
   * 	   getRand('DD',3) ; 意思：获取随机日期，日期格式为  HH:mm:ss   返回为：'23:22:20' ;
   * 随机获取一个随机数
   *
   */
	function getRand(type,MIN,MAX){
			    function getR(str,min,max,who){//随机获取  (min到max )个字母,who==1获取随机字母+数字
			    	who == 1 ? str += Math.random().toString(35).substr(2) : str += Math.random().toString(35).substr(2).replace(/\d+/gi,'') ;
			        if(str.length <min ){
			            return getR(str,min,max) ;
					}else{
			            return str.substring(0,getRound(min,max));
					}
				 };
				 function getM(str,min,max,who){//随机获取  (min到max )个数字
				       str += (Math.random()+'').replace(/0\.+/gi,'') ;
				        if(str.length <min ){
				            return getR(str,min,max) ;
						}else{
				            return str.substring(0,getRound(min,max));
						}
					 };
			    if(type=='aa'){//随机获取小写字母
					return  getR('',MIN,MAX) ;
				}else if(type=='AA'){//随机获取大写字母
		          return  getR('',MIN,MAX).toLocaleUpperCase() ;
				}else if(type=='Aa'){//获取随机大小写字母
					var num = getRound(MIN,MAX) ,// 先获取随机小写字母
						tag = getR('',num,num/2) + getR('',num/2).toLocaleUpperCase(),res='' ;//获取随机大写字母
						for(var a = 0 ,le = tag.length ; a<le; a++){
						    res += tag[getRound(0,num-1)] ;
						}
						return  res;
				}else if(type=='am'){//获取随机数字+字母
		          return getR('',MIN,MAX,1);//1 :获取随机数字+字母
				}else if(type == 'HH'){//获取随机中文，目前只支持部分中文
					var arr = ['供','了','四','基','本','据','类','型','和','两','种','特','殊','用','来','处','理','据','和','文','而','变','量','提','供','存','放','信','地','方','表','达','式','则','可','以','完','成','较','复','杂','信','息','处','理'],
						str = '' ;
						le = arr.length,
						num = getRound(MIN,MAX);
					for(var a = 0 ; a<num ; a++){
					    str += arr[getRound(0,le-1)] ;
					}
					return str ;
				}else if(type=='DD'){//随机获取本年的日期
					var str = 'yyyy/MM/dd HH:mm:ss' ;
					if(MIN == 1){
					    str = 'yyyy年/MM月/dd日 HH时mm分ss秒' ;
					}else if(MIN ==2){
					    str = 'yyyy/MM/dd HH:mm:ss' ;
					}else if(MIN == 3){
					    str = 'HH:mm:ss' ;
					}else if(MIN == 4){
					    str = 'HH时mm分ss秒';
					}
				    return new Date(new Date().getFullYear(),getRound(1,12),getRound(1,31),getRound(1,24),getRound(1,60),getRound(1,60)).format(str) ;
				}else if(type=='MM'){//如果是获取全数字的字符串
				     return getM('',MIN,MAX) ;	
				}
	};
	/**
	 * @date	2017-07-26
	 * 获取测试数据 。随机获取一个数组的json
     * @param obj [type:JSON] ; 固定格式：{
     * 										obj:{
     * 												user:'HH9-12' ,//key:user不会变。value会变 。'HH9-12'意思： 中文9到12个 。注意：前2个字母必须为字母且必须是指定的特定的字母。并且必须有 '-' 分割的数量。这里的user ,key不会变，只是value会变
     * 												'Aa3-5':'aa9-10'//'Aa3-5'意思是：key也为随机大小写字母3到5个。value:'aa9-10'。全小写字母9到10个。
     * 											},
     * 										size:[number]
     * 									 }
	 * HH全中文    OK
	 * Aa全字母,包括大小写 OK
	 * AA全字母大写  OK
	 * aa全字母小写  OK
	 * DD:日期类型 ： 2016/07/02 23:23:23
	 * @demo : 
	    	getTestData({
	    	       obj:{
	    	       	  'aa3-4' : 'HH3-9',
	    	       	  'AA3-4' : 'am8-8',
	    	       	  'Aa3-4' : 'DD3-3',	
	    	       },
	    	       size:8
	    	     });
	    	  返回结果：
	    	  [{UKF:"i7s1hgja",qwm:"完则和用而据理据",xqqt:"07:04:24"}] ; length=8 ;
	    	
	 * }
     */
	function getTestData(obj){
		function getoneObj(){
                  var object = obj.obj ,objOne = {};
                  function getV(str){
                      if(str.length>2 && str.indexOf('-')!=-1){ // 如果是随机的一个key
                          var arr  = str.match(/\d+/gi) ;
                          return getRand(str.substring(0,2),arr[0],arr.length==1?arr[0]:arr[1]) ;
                      }else{
                          return str ;
					  }
				  };
                  for(var key in object){
                      objOne[getV(key)]=getV(object[key]) ;
                  }
                  return  objOne ;
			  }
          if(obj.size){//如果传递过来的有数量
			  // 获取一个数据
			  var arr = [] ;
              for(var a = 0,si=obj.size ; a<si ;a++){
                  arr.push( getoneObj() ) ;
			  }
			  return arr ;
		  }
	};
	/**
	 * 获取一个选择器或一个数组对象中包含name的测试数据
	 * @param tag
	 * tag: 选择器 | 原生js获取的对象数组
	 */
	function getTestDataByPre(tag){
		var arr = [],obj = {} ; 
		if(checkType(tag)==='string'){
			arr = document.querySelectorAll(tag) ;
		}else{
			arr = tag ;
		}
		for(var a = 0,d;d=arr[a] ;a++){
			 var n =d.getAttribute('name'); 
			if(n){
				obj[n]=getRand('MM',3,4);  
			}
		}
		return obj ; 
	};
	
  /***
   * @date 2017/08/04 
   * 去掉首位空格 
   * a[string] 字符串
   */
  function trim(a){
  	return null == a ? "" : (a + "").replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  } ;
  /**
 * @date 2017 /08 / 04
 * 移动端上滑动或者下滑动的事件
 * @param {Object} upFn  上滑事件
 * @param {Object} downFn  下滑事件
 */
function touchstartFn(upFn,downFn){
		var startX, startY;  
		  document.addEventListener('touchstart',function (ev) {  
		      startX = ev.touches[0].pageX;  
		      startY = ev.touches[0].pageY;    
		  }, false);  
		  document.addEventListener('touchend',function (ev) {  
		      var endX, endY ,direction;  
		      endX = ev.changedTouches[0].pageX;  
		      endY = ev.changedTouches[0].pageY;  
		      direction = startY - endY >0?1:2;//dy>0向上滑动dy<0向下滑动  ;
		      if(direction==1){// 向上
		      	upFn && upFn() ;  
		      }else if(direction==2){ // 向下
		      	downFn && downFn() ;
		      }
		  }, false); 
};
   /**
    * 
    * @param {Object} url
    * @param {Object} DATA
    * @param {function} fn
    * @param {Object} ifload  是否去掉加载中， 如果为true 去掉加载中， false不去掉加载中
    * @param {opt} ajax发送配置参数
    */
	function sendAjax(url,DATA,fn,ifload,opt){
		var ip ,port,consoleDate;
		opt=opt||{};
		if(sendAjax.stopAjax){return;}//如果当前为阻止ajax状态则不做ajax操作
		LL.ip&&(ip = LL.ip) ; 
		LL.port&&(port = LL.port) ;
		if(ip && port){
			url=url.substring(0,4)=='http'?url:('http://'+ip+':'+port+url);
			if(LL.ABC){//如果启动了打印ajax发送日志
				consoleDate = new Date().format();
				console.log(consoleDate+'---@1---发送的ajax地址为--》'+url);
				console.log(consoleDate+'---@2---发送的ajax参数--》'+JSON.stringify(DATA));
				console.log(consoleDate+'---------开始打印ajax发送结果--------');
			}
			if(window.plus){
				if(!M.netWork().re){
					mui.toast('网络连接不可用，请稍候重试',{type:'div'});
					return ;
				}
			}
		 	 mui.ajax(url,{
					data:DATA,
					dataType:opt.dataType||'jsonp',//服务器返回json格式数据
					type:opt.type||'post',//HTTP请求类型
					async:checkType(opt.async)==='boolean'?opt.async:true,//默认发送异步请求
					timeout:15000,//超时时间设置为5秒；
					success:function(data){//服务器返回响应，根据响应结果，分析是否登录成功；
					function goLogin(){
						//**********  Begin停止发送ajax功能  ************************
						sendAjax.stopAjax = true ;// 立即停止发送ajax,目的是为了防止多个ajax发送的时候弹出多次提示
						LL.removeItem('loginInfo');
						mui.later(function(){
							delete sendAjax.stopAjax;//在4秒内恢复ajax功能
						},4000);
						//**********  停止发送ajax功能   End************************
						plus.webview.getLaunchWebview().evalJS('goLogin()');
					};
					function tipGoOut(){//提示并退出到登录页
						mui.plusReady(function(){
								mui.alert('当前账号已在其它地方登录,你已被踢下线,如果非本人操作请尽快修改密码！','被踢出！','确定',goLogin);
							});
					};
					if(sendAjax.stopAjax){return;}//如果当前为阻止ajax状态则不做ajax操作
					window.plus &&　plus.nativeUI&& plus.nativeUI.closeWaiting();
					if(checkType(data)=='string'){
						var re = data.match(/<title\s*.*>\s*.*<\/title>/gi) ;
						if(re && re.length==1){
							if(~re[0].replace(/\w+|\<+|\>+|\/+/gi,'').indexOf('沈阳上发生产信息化系统')&&!~data.indexOf('蒲公英')){
								mui.plusReady(function(){
									var arrs = plus.webview.getDisplayWebview();
										 for(var a = 0,d;d=arrs[a]; a++){
										 	if(!~d.getURL().indexOf('login.html')){
										 		mui.toast('你已被踢下线!请重新登录!');
										 		break ;
										 	}
										 }
									goLogin();																
								});		
								return ;
							}else if(~re[0].replace(/\w+|\<+|\>+|\/+/gi,'').indexOf('被踢出')){
								tipGoOut();
								return ;
							}
						}else if(~data.indexOf('user_status')){
							tipGoOut();
							return ;
						}
					}else if(~((data.message+'').indexOf('重新登录'))){
						tipGoOut();
						return ;
					}
					if(~(data+'').indexOf('登出成功')&&~(data+'').indexOf('success')){//如果是退出登录
						goLogin();
						return ;
					}
					if(LL.ABC){//如果启动了打印ajax发送日志
							var conso = data ;
							checkType(data)!=='string' && (conso = JSON.stringify(data));
							console.log(consoleDate+'---@3---ajax返回结果--》'+conso);
						}
						if(checkType(data)!='string' || (checkType(data)==='string'&&!~data.search(/\[+|\{+/gi))){
							fn && fn(data,DATA) ;	
						}else{
							fn && fn(JSON.parse(data),DATA) ;
						}
					},
					beforeSend : function(){
						!ifload && window.plus && plus.nativeUI && plus.nativeUI.showWaiting();
					},
					error:function(xhr,type,errorThrown){//异常处理；
						window.plus && plus.nativeUI && plus.nativeUI.closeWaiting();
						switch(type){
							case 'timeout' :
							mui.toast('数据加载失败！',{type:'div'}) ;	
							break ;
							case 'error':
							mui .toast('系统遇到错误!',{type:'div'}) ;
							break ; 
							case 'abort':
							mui.toast('连接服务器失败!',{type:'div'}) ;
							break ;
							case 'null':
							mui.toast('返回结果为null',{type:'div'}) ;
							break ;
							default:
							mui.toast('程序出现错误:错误描述'+type,{type:'div'}) ;
						}
					}
				});		
		 }else{
		 window.plus&&plus.webview.getLaunchWebview().evalJS('goLogin()');
		 }
	};
  (function(M,$,W,D){
  	 $.extend(M,{
  	 	/**
	 	 *默认为设置选择器的值 
	 	 *此方法默认为设置值,如果需要获取值, 请添加,getVal: true ; 
	 	 *****赋值特点: 如果是取值,支持连续取值. 比如name=obj[0][user][name]等等
	 	 * demo: <span name="obj[0].user.name"></span> .  js->  var obj = [{user:{name:'张三'}}]  结果<span name="obj[0].user.name">张三</span>
	 	 * @param prev {string || domobject}  选择器 || dome的object对象
	 	 * @param opt {Object}  配置参数
	 	 * @param tb {string} : 增加默认值。在获取值的情况中，当获取到某一个值为空的时候用什么代替，默认为 ''; 
	 	 * opt.data = {} ; 要赋值的json数据
	 	 * opt.getVal = true , 获取值 , 默认为false ,设置值
	 	 * opt.name ={string}, 标签中的某个属性为作为key，可逗号隔开。opt.name='name,id,class' ;
	 	 * opt.type = 1, 只是赋值文本标签
	 	 * opt.type = 2 , 只是赋值input标签
	 	 * opt.type = 3 , 既可以赋值文本标签又可以赋值input标签 ， 默认为 3 。
	 	 */
	 	setV:function(prev,opt,tb){
		var arr = checkType(prev) === 'string'?$(prev):prev,key,ifI,ifT,data,reobj ;
		if(!opt.getVal&&!opt.data)console.warn('当前调用为设置值,请给第二位参数添加key为data值为要赋的值,否则将不会成功');
			opt = $.extend({name:'name',type:3,data:{}},opt);
			    key = opt.name ;
				ifI=~(opt.type+'').indexOf([3,2]) ;
				ifT=~(opt.type+'').indexOf([1,3]);
				data = opt.data;
				reobj={} ;
			function setV(d,v){
					(ifI || ifI==0) && checkType(d.value)==='string' ?d.value = v:d.innerText = v  ;//如果是input//如果是文本标签
				}
			function getV(d,t){
			return d[(ifI || ifI==0) && checkType(d.value)==='string'?'value':'innerText'] || t;
			}
	 			for(var a = 0,d,attr,getVal=opt.getVal,ks;d=arr[a] ; a++){
	 				  	 ks = key.split(','); 
	 				  	 for(var  i = 0,k ;k=ks[i] ; i++){
	 				  	 	attr=d.getAttribute(k); 
	 				  	 	if(getVal){
	 				  	 		attr&&(reobj[attr] = getV(d,tb||''));
	 				  	 	}else{
	 				  	 		(function(){//解析语法为:   arr[0][username][id],这种取值.
	                                var od = data ;
	 				  	 			attr=attr.replace(/\./gi,'[').split(/\[/gi);
	 				  	 			if(attr.length==1){
	 				  	 				k=od?od[attr[0]]:null;
	 				  	 			}else{
	 				  	 				for(var j =0,c;c=attr[j];j++){
	 				  	 					c=c.replace(/\]/gi,'');
	 				  	 					if(c!=''){
	 				  	 						k=od[c];
	                                            od=k;
	 				  	 						if(!k)break;
	 				  	 					}
	 				  	 				}
	 				  	 			}
 				  	 			})();
	 				  	 		setV(d,k==0?k:k|| tb || '');
 				  	 			if(k || k==0)break;
	 				  	 	}
	 				  	 }
	 			}
	 			return reobj ; 
	 	},
		/**
	 * 获取选择器的值
	 * @param {string} prev : 选择器,或者原生对象
	 * @param {Object} opt : 配置参数json格式，具体通M.setV中的opt参数配置一样。
	 * @param {string} tb
	 */
	 	getV:function(prev,opt,tb){
	 		return M.setV(prev,$.extend(opt,{getVal:true}),tb) ;
	 	},
  	 	/**
	 	 * opt.type = 1, 只是赋值文本标签
	 	 * opt.type = 2 , 只是赋值input标签
	 	 * opt.type = 3 , 既可以赋值文本标签又可以赋值input标签 ， 默认为 3 。
	 	 * @param {Object} prev 选择器
	 	 * @param {Object} opt 配置参数
	 	 */
	 	reset:function(prev,opt){
	 		M.setV(prev,$.extend(opt,{data:{}}));
	 	},
  	 	/**
  	 	 * 验证选择器的值是否合法,默认验证是否为空 
  	 	 * 如果验证失败需要添加提示的,请给标签添加属性 data-ts="你需要提示的key,比如,零件号:"
  	 	 * @param {Object || string } pre 可以是选择器也可以是原生js对象
  	 	 * @param {Object} opt
  	 	 * opt.type = 1, 只是赋值文本标签
  	 	 * opt.type = 2 , 只是赋值input标签
  	 	 * opt.type = 3 , 既可以赋值文本标签又可以赋值input标签 ， 默认为 3 。
  	 	 * opt.nocheck=[{key:'name',value:'张三'}]
  	 	 * opt.get = [true] ; 如果配置为true , 当在匹配都成功的时候,获取值.
  	 	 *  简单的理解就是当标签的某个属性为某一个值的时候不做验证,这里是数组,value可以用逗号隔开,就是当某个属性为某个值或某一个值的时候不验证
  	 	 *  改方法会首先验证有没有nocheck,如果有就立即不验证了
  	 	 */
  	 	checkPre:function(pre,opt){
  	 		var arr,type,obj={},re=true,info='',nocheck;//obj最终返回的结果
  	 		opt = opt||{} ;
  	 		type = opt.type || 3 ; 
  	 		nocheck = opt.nocheck || [] ;
  	 		checkType(pre)=='string' && (arr = $(pre));//如果不是选择器,就是一个对象,如果为string默认就为一个选择器
  	 	   	for(var a = 0,d;d=arr[a]; a++){//如果没有验证规则,默认验证只是判断不能为空.默认 validate = kk ;
  	 	   		var validate = d.getAttribute('data-validate') || 'fk',vl='value',cck;//获取验证规则
  	 	   		 if(nocheck.length){//如果有不需要验证的标签
  	 	   		 	 for(var o=0,j;j=nocheck[o];o++){
  	 	   		 	 	 if(~(j.val+'').indexOf(d.attr(j.key))){//如果符合不需要验证的标签
  	 	   		 	 	 	cck=true ;
  	 	   		 	 	 	break ;
  	 	   		 	 	 }
  	 	   		 	 }
  	 	   		 	 if(cck){//如果有不需要验证的标签,跳过本次循环
  	 	   		 	 	continue ;
  	 	   		 	 }
  	 	   		 }
  	 	   		 	if(checkType(d.value)!=='string' && ~[1,3].indexOf(type)){//如果验证的是文本框
  	 	   		 		vl = 'innerText'; 
  	 	   		 	}
  	 	   		 	var o =(d[vl]+'').validate(validate),t=d.parentNode.innerText.trim();
  	 	   		 		if(!o.re){//如果验证失败
  	 	   		 			if(d.attr('data-ts')){//如果有配置提示
  	 	   		 				t = d.attr('data-ts') ;
  	 	   		 			}
  	 	   		 			if(t=='')t=d.parentNode.parentNode.innerText.trim();
  	 	   		 			info = t+o.info ;
  	 	   		 			re = false ;
  	 	   		 			break ;
  	 	   		 		}
  	 	   	}
  	 	   	obj.re =re ; 
  	 	   	obj.info = info ; 
  	 	   	obj.re && opt.get && (obj.obj = M.getV(arr));//如果都验证成功,获取验证的值,并且配置了获取值
  	 	   	return obj ;
  	 	},
	/**
	 * 支持IE9及以上
	 * @param {Object} wrap 图片要存放的容器的选择器。 
	 * @param {Object} pre  图片的选择器 || 或图片对象。图片的地址为data-src
	 * fn:执行成功后的回调 。
	 * demo: M.sizeImg('#line11','#line11 img',function(){});
	 */
	sizeImg:function(wrap,pre,fn){//设置图片等比例缩放。
				var H = mui(wrap)[0].offsetHeight,W=mui(wrap)[0].offsetWidth; 
				function setSize(){//原理： 最大的要放到最小的里边去。
					var d=this,si,w,h,o = {
							h:d.naturalHeight ,
							w:d.naturalWidth ,
					};
					o[d.naturalHeight] = 'h' ; 
					o[d.naturalWidth] = 'w' ;
					si=Number(Math.min((W/o.w),H/o.h).toFixed(3));
					w=Number((o.w*si).toFixed(3));
					h=Number((o.h*si).toFixed(3));
					d.attr('width',w+'px');
					d.attr('height',h+'px');
					fn&&fn.call(this,wrap,w,h); 
				};
				for(var a = 0,d,arr=checkType(pre)==='string'?mui(pre):pre;d=arr[a];a++){
					d.attr('src',d.attr('data-src'));
					d.onload=setSize;
				}
	},
	/**
	 * @param {Object} wrap 图片要存放的容器的选择器。 
	 * @param {Object} pre  图片的选择器 || 或图片对象。图片的地址为data-src
	 *  obj: 参数配置： h:高数字类型。 w宽，数字类型
	 *  demo:  M.sizeDiv('body>div.content','body>div.content>ul',{w:1632,h:834}) ;
	 */
	sizeDiv:function(wrap,pre,obj){//设置容器等比例缩放。
		var H = $(wrap).height(),W=$(wrap).width(); 
		function setSize(o){//原理： 最大的要放到最小的里边去。
			var d=this,si,w,h;
			o[o.h] = 'h' ; 
			o[o.w] = 'w' ;
			si=Number(Math.min((W/o.w),H/o.h).toFixed(3));
			w=Number((o.w*si).toFixed(3));
			h=Number((o.h*si).toFixed(3));
			$(d).css('width',w+'px').css('height',h+'px');
		};
		for(var a = 0,d,arr=$.type(pre)==='string'?$(pre):pre;d=arr[a];a++){
			setSize.call(d,obj);
		}
	},
  	 /**
	 * 将json转换为str
	 * jTs 是缩写形式， 全民jsonToStr 
	 * demo:var obj = {aa:'asdfaf',bb:'afaf'}  ;  M.jTs(); 得到的结果为：aa:'asdfaf',bb:'afaf' 
	 */
	jTs:function(obj){
		var h = '' ;
		try {
			for(var a in obj ){
				if(checkType(obj[a])==='function'){//如果是方法
					h+=(a+':'+obj[a].getFnName()+',');	
				}else{//如果不是方法
					h+=(a+':'+'"'+obj[a]+'",');
				}
			}
			h.length &&(h=h.substring(0,h.lastIndexOf(',')));　
			return h ; 	
		} catch (e) {
			throw new Error('json转换字符串出错') ;
			return h ; 
		}
	},
	/**
	 * 获取元素的offset, 来源JQ 
	 * @param {Object} str  string|object
	 */
	offset:function(str) {
            var b, c, d = {
                top: 0,
                left: 0
            }, e = checkType(str)==='string'?document.querySelector(str):str, f = e && e.ownerDocument;
        b = f.documentElement; 
  "undefined" != typeof e.getBoundingClientRect && (d = e.getBoundingClientRect()) ;
        c =checkType(f) ? f : 9 === f.nodeType ? f.defaultView || f.parentWindow : !1 ;
        return  {
                    top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
                    left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
                };
        },
	/**
	 * jRe : json-remove-empty : 意思是json去除空字符串。简写后为jRe，方便调用
	 * 2017 / 12 /29 15:51 add
	 * 去掉json中，值为空的数据，主要是查询的时候调用了， 如果有值为空的数据， 就查询不出来了，所以增加了这个方法
	 */
	jRe:function(obj){
		try {
			for(var a in obj){
				checkType(obj[a])==='string' && obj[a].trim()==='' &&(delete obj[a]);
			}
		}catch (e) {
			throw new Error('去掉json中，值为空的数据,报错了');
		}
		return obj ;
	},
		/**
		 *打开原生标签页面  , 使用这个方法的引用场景, 1:公共的页面,但是标题不确定,2:带有原生的点击时候的声音。返回当前创建的webview
		 * @param {string} url 要打开页面的url
		 * @param {string} title 要打开页面的标题
		 * @param {Object} data 给要打开的页面传递的参数
		 * @param {object} styles 需要添加的样式,如果不需要传递,请传入false或者不传递
		 * @param {object} btns 需要给右上角添加的按钮 , btns.text 必须传递, 可以是字符,iconfont的字符格式为: \ue456,fn:就是点击事件,可以传可不
		 *                 btns == 1 ,默认添加查询按钮
		 */
  	 	goT:function(url,title,data,styles,btns){
  	 		var style ,view,buttons=[];//创建的webview 
		  	if(checkType(url) !== 'string'){//如果是string
		  		mui.alert('打开窗口参数传递错误！') ;
		  		return ;
		  	}else if(!data){
		  		data = {};
		  	}
		  	styles = styles || {} ;
		  	buttons.push({//第一个(左边)按钮返回按钮:
							      	color:'#2C9BEB',
							      	colorPressed:'#364BC0',
							      	float:'left',
							      	onclick:function(){
							      		reshAllNum() ;
							      		plus.webview.getWebviewById(url).evalJS('mui.back()');
							      },
							      fontSrc:'_www/fonts/iconfont.ttf',
							      text:'\ue60c',
							      fontSize:'20px'
							      },{//第一个(右边)按钮返回主页按钮:
							      	color:'#2C9BEB',
							      	colorPressed:'#364BC0',
							      	float:'right',
							      	onclick:function(){
							      		M.go('index.html');
										for(var a = 0,alls = plus.webview.all(),d;d=alls[a] ;a++){
											var u =d.getURL(); 
											!~['main.html','index.html','operation.html','news.html','my.html'].indexOf(u.substring(u.search(/\/www\//gi)+5))&&d.close();
										}
							      },
							      fontSrc:'_www/fonts/iconfont.ttf',
							      text:'\ue6f3',
							      fontSize:'20px'
							      }) ;
			if(btns){//如果有增加按钮
				if(btns==1)btns={text:'\ue60e'} ;
				buttons.push({// color:文字颜色 , colorPressed:按下时候的颜色 , float:按钮显示的位置
							      	color:'#2C9BEB',
							      	colorPressed:'#364BC0',
							      	float:'right',
							      	onclick:btns.fn || function(){},
							      fontSrc:'_www/fonts/iconfont.ttf',
							      text:btns.text || '\ue60c',
							      fontSize:btns.size || '20px'
							      }) ;
			}
		  	style = { // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
							    titleNView: {                       // 窗口的标题栏控件
							      titleText:title,                // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
							      titleColor:"#000000",             // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
							      titleSize:"17px",                 // 字体大小,默认17px
							      backgroundColor:"#F7F7F7",        // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
//							      progress:{                        // 标题栏控件的进度条样式
//							        color:"#00A0F4",                // 进度条颜色,默认值为"#00FF00"  
//							        height:"1px"                    // 进度条高度,默认值为"2px"         
//							      },
							      splitLine:{                       // 标题栏控件的底部分割线，类似borderBottom
							        color:"#CCCCCC",                // 分割线颜色,默认值为"#CCCCCC"  
							        height:"1px"                    // 分割线高度,默认值为"2px"
							      },
//							      type:'transparent',//是否透明化标题栏
//							      autoBackButton:true,//左侧显示返回按钮
							      buttons:buttons
							   },
							   background:"transparent",
							   popGesture: "close"
							  } ;
				  	mui.extend(true,style,styles);
							view = mui.openWindow({
							  url: url,
							  id: url,
							  extras:data,
							  styles:style,
							show: {
								aniShow: 'pop-in',
								duration: 300
							}
							});
				reshAllNum(); //为了刷新未读数据.							
				return view  ;
  	 	},
  	 	/**
  	 	 * 打开一个页面, 不带有标题 
  	 	 * @param {string} url:要打开页面的URL
  	 	 * @param {Object} data :给要打开页面传递的参数
  	 	 */
  	 	go:function(url,data,styles,id){
  	 		var styles ;
	  		if(checkType(url) !== 'string'){//如果是string
		  		alert('打开窗口参数传递错误！') ;
		  		return ;
		  	}else if(!data){
		  		data = {};
		  	}
		  	styles = styles || {} ;
		  	styles = {popGesture: "close",statusbar: {background: "#f7f7f7"}};
		  	mui.extend(styles,styles,true);
			mui.openWindow({
						url: url,
						extras:data,
						id:id || url,
						styles:styles ,
						show: {
							aniShow: 'pop-in',
							duration: 300
						}
					});
			reshAllNum(); //为了刷新未读数据.
  	 	},
  	 	/**
  	 	 *获取用户名 
  	 	 */
  	 	getUser:function(){
  	 		return plus.storage.getItem('userName') ;
  	 	},
  	 	/**
  	 	 *关闭当前页面并且上一个页面执行刷新操作
  	 	 * cAndR closeAndReload 的缩写. 
  	 	 * @param {number} key : 如果等于2 则关闭2层并且刷新
  	 	 */
  	 	cAndR:function(key){
  	 		if(key == 2){//
  	 			if(plus.webview.currentWebview().opener().opener()){
		  	 		plus.webview.currentWebview().opener().opener().reload(); 
		  	 		plus.webview.currentWebview().opener().close();	
	  	 		}else{
	  	 			plus.webview.currentWebview().close();
	  	 		}
  	 		}else{//默认关闭一层,上一个页面并刷新
				if(plus.webview.currentWebview().opener()){
		  	 		plus.webview.currentWebview().opener().reload(); 
		  	 		plus.webview.currentWebview().close();	
	  	 		}else{
	  	 			plus.webview.currentWebview().close();
	  	 		}  	 			
  	 		}
  	 	},
  	 	/**
  	 	 *设置本地存储 ,请确保在plus加载成功后再调用
  	 	 * @param {string} k , key
  	 	 * @param {string} v , 保存本地的value
  	 	 */
  	 	setSto:function(k,v){
			plus.storage.setItem(k,v);  	 		
  	 	},
  	 	/**
  	 	 *获取本地存储 
  	 	 * @param {string} k
  	 	 */
  	 	getSto:function(k){
  	 		return plus.storage.getItem(k);
  	 	},
  	 	/**
  	 	 * 播放声音并且震动
  	 	 * @param {number}n  震动的响应时间,默认震动200毫秒
  	 	 */
  	 	play:function(n){
  	 		n = n|| 200 ; 
  	 		if(window.plus){
				plus.device.vibrate(n);
				plus.device.beep();  	 			
  	 		}
  	 	},
  	 	/**
  	 	 * 2017/11/20  
  	 	 *播放系统提示音,因为比较常用,所以这里名字就叫p,因为这样比较简洁. 
  	 	 */
  	 	p:function(){
  	 		CONTEXT && M.p.RingtoneManager.playSoundEffect(1);  	 			
  	 	},
  	 	/**
  	 	 * 创建一个webview对象并返回 
  	 	 * @param {string} url   打开页面的地址
  	 	 * @param {Object} data 给改页面传递的参数
  	 	 */
  	 	newW:function(url,data){
  	 		var w = plus.webview.create(url, url, {
								popGesture: "none",
								statusbar: {
									background: "#f7f7f7"
								}
							}, data );
			return 	w ;			
  	 	},
  	 	/**
  	 	 * @ date 2017/10/20
  	 	 * @param {string} str :要提示的字符串
  	 	 * @param {Object} obj :提示的位置和配置参数, 默认提示的位置为上边, obj可以是一个对象也可以是一个字符串, 比如, top, left, center; 
  	 	 */
  	 	toast:function(str,obj){
  	 		if(window.plus && plus.nativeUI){
  	 			obj=obj||'top' ;
  	 			 if(checkType(obj)==='string'){
  	 				plus.nativeUI.toast(str,{verticalAlign:obj});	
  	 			}else{
  	 				plus.nativeUI.toast(str,obj);
  	 			}
  	 		}
  	 	},
  	 	/**
  	 	 * 关闭自动消失的提示框 
  	 	 */
  	 	ct:function(){
			WN.plus&&plus.nativeUI.closeToast();  	 		
  	 	},
  	 	/**
  	 	 * 获取去请求数据的绝对地址.
  	 	 * @param {string} url :url地址.
  	 	 */
  	 	http:function(url){
  	 		return 'http://'+LL.ip+':'+LL.port+url;
  	 	},
  	 	ws:'webview还未加载请在plusRead之后在调用,M.ws是一个对象',
  	 	wsp:'当前窗口的父窗口,请在plusRead之后在调用',
  	 	dt:false,//DtPicker日期组件,默认没有加载,这样写的目的是为了全局有且只有一个日期选择控件
  	 	/**
  	 	 *影藏一个窗口 
  	 	 * @param {Object} ws , 如果不传将隐藏当前窗口,默认为当前窗口
  	 	 *
  	 	 */
  	 	hideW:function(ws){
  	 		reshAllNum() ;
  	 		window.plus && plus.webview.hide(ws?ws:M.ws,'slide-out-right');
  	 	},
  	 	/*
  	 	 * 显示一个窗口
  	 	 * show:显示, w ; webview对象 ;
  	 	 */
  	 	showW:function(wl){
  	 		reshAllNum() ;
  	 		window.plus &&  plus.webview.show(wl,'slide-in-right');
  	 	},
  	 	/**
  	 	 * 获取网络状态
  	 	 * 返回 {info:'网络状态',type:[number]} 
  	 	 */
  	 	netWork:function(){
  	 		if(window.plus){
  	 			var o = {},n=plus.networkinfo.getCurrentType(),re=true;//re:是否已连接到网络
  	 			o.info = NETWORK[n] ;
  	 			o.type =n;
  	 			(n==0||n==1) && (re=false);
  	 			o.re=re ;
  	 			return o ; 
  	 		}
  	 	},
  	 	/**
  	 	 * 选择图片操作
  	 	 * @param {Object} opt
  	 	  * opt.url  上传图片的接口
  	 	 * opt.fn [function]  长传图片成功后的回调函数
  	 	 * opt.key   上传图片给后台的命名参数
  	 	 */
  	 	checkImg:function(opt){
  	 			plus.nativeUI.actionSheet( {
					title:"请选择",
					cancel:"取消",
					buttons:[{title:"拍照"},{title:"选择图片"}]
				}, function(e){
					switch (e.index){
						case 1://拍照
						plus.camera.getCamera().captureImage(function(p){
							  plus.io.resolveLocalFileSystemURL(p, function(entry) { 
				                    opt.path = entry.toLocalURL();
				                    LL.ABC&&console.log(opt.path) ;//如果测试模式打开则输出
				                    M.upImg(opt) ;
			                }, function(e) { 
			                	M.toast('读取拍照文件错误:'+p); 
			                }); 
						});
							break;
						case 2://选择图片
						plus.gallery.pick(function(p){
							 plus.io.resolveLocalFileSystemURL(p, function(entry) { 
				                    opt.path = entry.toLocalURL();
				                    LL.ABC&&console.log(opt.path) ;//如果测试模式打开则输出
				                    M.upImg(opt) ;
			                }, function(e) { 
			                	M.toast('读取拍照文件错误:'+p); 
			                }); 
					    });
						break;
					}
				});
  	 	},
  	 	/**
  	 	 * 上传图片操作 
  	 	 * @param {Object} opt
  	 	 * opt.url  上传图片的接口
  	 	 * opt.fn [function]  长传图片成功后的回调函数
  	 	 * opt.path  上传图片的路径
  	 	 * opt.key   上传图片给后台的命名参数
  	 	 * 
  	 	 */
  	 	upImg:function(opt){
  	 		plus.nativeUI.showWaiting('图片上传中');
  	 		LL.ABC&&console.log('图片上传url为: =>'+"http://"+LL.ip+':'+LL.port+opt.url) ;//如果测试模式已打开
  	 		var task =plus.uploader.createUpload("http://"+LL.ip+':'+LL.port+opt.url,
				{method:"POST"},
				function(t,status){ //上传完成
					if(status==200){
						var o =JSON.parse(t.responseText) ;
						o.lopath = opt.path ;
						if(o.fail){
							M.toast(o.fail,'center');
						}else{
							M.toast('图片上传成功!','center');
							opt.fn(o) ;	
						}
						LL.ABC && console.log('图片上传成功,后台返回的结果为'+t.responseText) ;
					}else{
						M.toast("上传失败："+status,'center');
					}
					plus.nativeUI.closeWaiting();
				}
			);
			task.addFile(opt.path,{key:opt.key});
			task.start();
  	 	},
  	 });
  	 /**
  	  *初始化声明M.ws为当前webview窗口对象 
  	  */
  	 mui.plusReady(function(){
  	 	M.ws = plus.webview.currentWebview();
  	 	M.wsp = M.ws.opener();
	 	if(CONTEXT == null){
	 		if(!mui.os.ios){
	 		 plus.android.importClass("android.media.AudioManager");
		        CONTEXT = plus.android.importClass("android.content.Context");
		        //加载系统提示音对象
			    M.p.RingtoneManager =plus.android.runtimeMainActivity().getSystemService(CONTEXT.AUDIO_SERVICE);
	 		}
		  	NETWORK[plus.networkinfo.CONNECTION_UNKNOW] = "未知";
		    NETWORK[plus.networkinfo.CONNECTION_NONE] = "未连接网络";
		    NETWORK[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络";
		    NETWORK[plus.networkinfo.CONNECTION_WIFI] = "WiFi网络";
		    NETWORK[plus.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
		    NETWORK[plus.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
		    NETWORK[plus.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
	     }
	 	if(!mui.os.ios){//添加安卓侧滑关闭功能
	 		var u =M.ws.getURL();
	 			if(!~u.indexOf('mui.indexedlist.html')&&!~['pull/reportFormInfo.html','pull/doAllNumber.html','production/reportMonth.html','production/reportMonth2.html','production/reportDay.html','login.html','main.html','index.html','indexedlist.html','operation.html','news.html','my.html'].indexOf(u.substring(u.search(/\/www\//gi)+5))){
					M.ws.drag({//监听当前侧滑窗口的右滑
			                    direction: 'right',
			                    moveMode: 'followFinger'
			                }, {
			                    view: plus.runtime.appid,
			                    moveMode: 'silent'
			                }, function(e) {
			                    if(e.type == 'end' && e.result) {//滑动到end执行mui.back()事件
								 M.wsp.evalJS('loadNumber(1)') ;
								 M.wsp.evalJS('reshAllNum()') ;
			                     M.ws.close(); 
			                    }
			                });		
					}
	 	}
	 	 M.ws.addEventListener( "popGesture", function(e){
	        if(e.type=="start"){
	         M.wsp.evalJS('loadNumber(1)') ;
			 M.wsp.evalJS('reshAllNum()') ;
	        }
   		 }, false );
  	 });
  })(M,mui,window,document);

// *******  Begin  原形扩展api  ********
	/**
	  * @date 2017/09/26 
	  * 讲dome元素转换为一个真正数组 。  
	  * demo : document.querySelectorAll('div') ; 返回一个全部都是div元素的数组,
	  * 应用场景, 有时候我们需要对获取到的元素进行添加元素然后进行遍历或其他使用,但是因为不是真正的数组所以不能直接push或其他数组的操作
	  */
  	 NodeList.prototype.toArray=function(){
  	 	return [].slice.call(this) ;
  	 };
  	 /**
  	  *@ date 2017/09/25 
   	  * 判断一个元素的标签类型 
  	  * @param {Object} str
  	  * demo :document.querySelectorAll('div')[0].is('div') ; 返回结果:true ;
  	  */
  	 HTMLElement.prototype.is = function(str){
		  	return this.tagName.toLocaleLowerCase()===(str+'').trim() ;
  	 };
  	 /**
  	  * 设置或者获取原生标签的属性 ,如果是设置返回自己,如果是获取返回获取的值
  	  * @param {Object} key
  	  * @param {Object} val
  	  */
  	  HTMLElement.prototype.attr = function(key,val){
		  	if(val){//如果是设置属性
		  		this.setAttribute(key,val) ;
		  		return this ;
		  	}else{//如果是获取属性
		  		return this.getAttribute(key);
		  	}
  	 };
  	 /**
  	  *  原形扩展节点数组的attr 
  	  * 设置或者获取原生标签的属性 ,如果是设置返回自己,如果是获取返回节点数组的值
  	  * @param {Object} key
  	  * @param {Object} val
  	  */
  	 NodeList.prototype.attr = function(key,val){
  	 	   var arr = this ; 
		  	if(val){//如果是设置属性
		  		for(var a = 0,d;d=arr[a];a++){
		  			d.attr(key,val);
		  		}
		  		return arr ;
		  	}else{//如果是获取属性
		  		return arr[0].getAttribute(key);
		  	}
  	 };
  	 /**
	 * 如果一个字符串为 8 ， 返回'08';
	 * demo: var a = '8' ; a.toO() ;返回 '08' ;
	 */
	String.prototype.toO=function(){
		var a = Number(this) ; 
		if(a<10){
			return '0'+a ;
		}else{
			return a ;
		}
	};
	/**
	 * 如果一个数字为 8 ， 返回'08';
	 * demo: var a = 8 ; a.toO() ;返回 '08' ;
	 */
	Number.prototype.toO=function(){
		return (Number(this)+'').toO() ;
	};
	/**
	  *  @date 2017/08/04
	  *  获取标签本身和子元素的 
	  * Demo
      *   <div id="abc"><a></a></div>
	  *   document.querySelector('#abc').html() ; 返回的结果为:<div id="abc"><a></a></div> ; 
	  *   
	  */
	 HTMLElement.prototype.html = function(){
	 	var a = document.createElement('span') ;
	   	   a.appendChild(this);
	   	   return a.innerHTML ;
	 };
	  /**
	   * 2017 / 11 / 27  
	   * 删除dom元素
	   * demo : <div id="abc"><span>adf</span></div> mui('#abc')[0].remove() ;会将这个div和子标签都删除了
	   */
	  HTMLElement.prototype.remove = function(){
	  	this.parentNode.removeChild(this) ;
	 };
	 /**
	 * 将日期转换为指定格式的字符串
	 * str="yyyy/MM/dd HH:mm:ss"
	 * 不传递参数默认格式为： str="yyyy/MM/dd HH:mm:ss"
	 *传递1表示 str =  "yyyy/MM/dd "
	 *传递2表示 str="HH:mm:ss"
	 */
	Date.prototype.format=function(str){
		if(!arguments.length) str = 'yyyy/MM/dd HH:mm:ss' ; 
		if(arguments.length && checkType(str) === 'number' && str === 1 )str ="yyyy/MM/dd" ;
		if(arguments.length && checkType(str) === 'number' && str === 2 )str ="HH:mm:ss" ;
		var y = this.getFullYear(), M = this.getMonth()+1, d = this.getDate(), H = this.getHours(), m = this.getMinutes() , s = this.getSeconds() ;
return str.replace('yyyy',y).replace('MM',M.toO()).replace('dd',d.toO()).replace('HH',H.toO()).replace('mm',m.toO()).replace('ss',s.toO()) ;
	};
	/**
	 * @date	2017-07-26
	 * @param  obj:[type:json]普通的json  ： {user:'adfaf',pw:'weasdfa'}
	 * @param	当没有需要替换的时候用什么代替，默认代替为''; 
	 * 替换字符串中固定格式的值。将字符串中的 {user} 替换为 json中的key为user的值
	 * demo ： var a = "<span>{user}</span>" ; a.rep({user:'aaa'}) ;返回过来的是  "<span>aaa</span>"
	 * 如果 tip为obj对象,就说明有for循环替换的东西
	 */
	String.prototype.rep=function(obj,tip){
		var h =this ,ck=function(s,o,t){//s:string str 要替换的字符串, o:object obj 被替换的对象 ,t:tip 如果没有需要被替换的字符; 
			return s.replace(/{\w+}/gi,function(str){
				var l=o[str.replace(/{|}/gi,'')];
				 if(l===0)return '0';
	       		 return l || t || '';
			});
		};
		try{
			if(checkType(tip)==='object' && tip.obj){//如果是个json对象,说明有for循环替换的内容
			var obj2 = tip.obj ;
			checkType(tip.obj)==='string' && (obj2 = obj[tip.obj]);
				h=h.replace(/\{\{#[^#]+}}/gi,function(str){//第一步先替换for循环的内容
					 var w = str.replace(/\{\{#|\}\}/gi,''),h2='';
					 for(var a =0,d;d=obj2[a];a++){
					 	h2 += ck(w,d,obj2.tip) ;
					 }
			        return h2;
				}); 
				h = ck(h,obj,obj2.tip) ;
			}else{
				h=ck(h,obj,tip);
			}
		}catch(e){
			throw new Error('字符串正则替换出错了');
			return '';
		}
	    return h;
	};
	/**
	 * @date	2017-09-14
	 * @param {number} le: 获取假数据的长度。le可以传可以不传 。
	 * @param	 
	 * 此方法和rep相反 ， 是将字符串中的{name}格式转换为一个json.
	 * demo 不传le ==> var a = '<span name="vender" class="mui-ellipsis">{vender}</span> ' ; 返回结果： {vender:''}
	 * demo  传入le = 4  var a = '<span name="vender" class="mui-ellipsis">{vender}</span> ' ; 返回结果： {vender:'4568'}
	 */
	String.prototype.getRep=function(le){
		var obj = {},arr=this.match(/{\w+}/gi);
		for(var a = 0,d;d=arr[a] ;a++){
			key = '' ; 
			le&&(key = getRand('MM',le,le));
			obj[d.replace(/{|}/gi,'')]=key;
		}
		return obj ; 
	};
	 /**
     * datapre:'header>table input',dgpre:'#dg' 转换结果为 = {datapre:'header>table input',dgpre:'#dg'}的一个对象
     * 将字符串转换为json， 引用场景， 
     *           比如某个标签的属性为  <input  data-opt="datapre:'header>table input',dgpre:'#dg'"/>
     *           如果将data-opt的字符串转换为json对象 ==》
     *           							    $('input').attr('data-opt').tojson()  结果为    ={datapre:'header>table input',dgpre:'#dg'}
     * 如果解析失败将返回空json。
     * @date    2017-10-29  
     */	
	String.prototype.tojson = function(){
		var str = '',d=this;
		try {
			str = eval("({"+d+"})");			
		} catch (e) {
			str = {} ; 
		}
		return str ;
	};
/**
 * @date 2017/11/22 add
 * 解析字符串是否合法,验证成功返回{re:true,info:''},验证失败返回{re:false,info'描述'}
 * @param {Object} type ,要验证的类型
 ll30-40 ; 验证字符串是否为数字并且比30大并且比40小
 le4-9 ;仅仅验证长度是否到达4-9为的长度
 el ; 验证字符串是否为邮箱格式
 wz ; 验证字符串是否为网址的格式
 rq ; 验证字符串是否为日期格式, 日期指定格式有    2017/11/11 或者  2017-11-11目前仅支持这2中验证格式,能判断闰年 .
 sj: 验证是否为手机格式
 dh: 验证是否为电话格式
 fk: 验证是否为空字符
 如果有多个规则用 ","逗号拼接起来就可以了,只要有一个不符合规则立即停止验证，暂时用不上，后续需要用上了在写。。。
 */
String.prototype.validate=function(type){
    var str = this.replace(/^\s+|\s+$/g,''),as = (type+'').split(','),obj={},le=str.length,info='',re=true,R={
		el:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
		els:'不是邮箱格式',
		sj:/^1[34578]\d{9}$/,
		sjs:'不是手机格式',
		dh:/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
		dhs:'不是电话格式',
		wz:/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
		wzs:'不是网址格式',
		rq:/((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/,
		rqs:'不是日期格式',
		fk:/\S{1,}/gi,
		fks:'不能为空',
		ll:function(ar,m1,m2){//不做任何判断只是验证长度是否合格
		 str = Number(str) ;
         if(checkAr(ar) && str && (m1||m1===0) && m2){
         	(str<m1 || str>m2)&&(as=[],info="值不能"+(str<m1?'小':'大')+"于"+((str<m1?m1:m2)));
         }else{
             info=!str?'非数字':"传递参数错误";
         }
		},
		le:function(ar,m1,m2){
			checkAr(ar)&&(le<m1 || le>m2)&&(as=[],info="长度"+(le<m1?'不足':'超出')+((le<m1?m1:m2))+'位');
		}
};
    // 验证数组的长度是否为2位,如果不是,则结束这个循环,并返回失败信息
    function checkAr(ar){
        if(ar.length!=2){
            info = '参数传递错误' ;
            as=[] ;//用于判断结束for循环
        }else{
            return true ;
        }
    };
    for(var ar,m1,m2,sw,i = 0,k; k=as[i];i++){
        ar = k.substring(2,k.length).split('-');//这个数组存储的是长度,比如,3-4,长度为3到4个
        m1 = Number(ar[0]);
        m2=Number(ar[1]) ;
        sw=k.substring(0,2) ;
        if(R[sw]){
        	if(R[sw].test){//如果是正则
        		 if(!R[sw].test(str)){
                     info=R[sw+'s']
                     as=[] ;
                 }
        	}else{//如果是方法
        		R[sw](ar,m1,m2) ;
        	}
        }else{
        	console.error('无法识别验证规则【'+sw+'】');
        }
        !as.length&&(re=false);
    }
    obj.re=re ;
    obj.info = info;
    return obj ;
};
	/**
	 * 将一段字符串转换为dom标签, 
	 * 通过原生js创建标签,并替换标签里边带有{}的内容
 	 * @param {Object} obj,这个可以传递也可以不传递,只是一个json对象,替换标签里边带有{}的内容,可传可不传
 	 * demo : var a = "<li><span></span></li>" ; a.toDom('li'); 
	 */
	String.prototype.toDom=function(obj){
	   try{
			var div = document.createElement('div');
			   obj = obj || {} ;
			   div.innerHTML = this.rep(obj,'') ;
			   return div.querySelector('div>'+this.trim().match(/\<\w+|\s|\>/)[0].replace(/\<|\>/gi,'')) ;	   	
	   }catch(e){
		   throw new Error('创建标签失败!');
	   	   return false ; 
	   }
	};
// **************   Begin  一些比较通用的封装初始化,只是适用本套系统结合mui的,不是特别的通用 ******************
/**
 *初始化显示日期控件,给需要显示日期的input输入框添加date-time,即可. 默认配置是能够选择所有范围的日期.
 *如果需要配置显示指定范围,请给标签添加属性data-options='具体配置json格式'即可.
 * demo : <input data-options="beginDate:new Date()"  class="date-time"/>// 只能选择大于当前日期的时间,更多配置请看mui官网文档
 */
mui('.date-time').length&&mui('body').on('tap','.date-time',function(){
	var input = this;
	M.p();
	if(!M.dt){//如果没有加载过日期控件
		var o = input.attr('data-options') || '' ;
		M.dt = new mui.DtPicker(o.tojson()); 
	}
	M.dt.show(function (v) {
		input.value=v.text;
    });
});

/**
 * 初始化显示数据控件 
 * 如果需要配置显示指定范围,请给标签添加属性data-options='具体配置json格式'即可. 有
 * data-options="{
 	url:'加载数据的URL',
 	data:[{text:''},{text:''}],//如果不是加载数据而是直接写的数据
 	fn:function(v){//选中成功的回调;v:选中的值}
 }"
 */
mui('.picker-data').length&&mui('body').on('tap','.picker-data',function(){
	var input = this,key = 'SDINTPICKER'+input.attr('name'),o = input.attr('data-options').tojson() || {};
	M.p();
	if(!input.SDINTPICKER){//如果当前元素没有加载过picker ;
		window[key]  = new mui.PopPicker() ;
		input.SDINTPICKER = true;
		if(!o.data && o.url){
			sendAjax(o.url,'',function(data){
				if(o.text){
					for(var t=o.text, a = 0,d;d=data[a];a++){
						d['text']=d[t] ;
					}
				}
				window[key].setData(data); 		
			});
		}else if(o.data){
			window[key].setData(o.data);
		}
	}
	window[key].show(function (v) {
		input.value=v[0][o.text || 'text'] || '';
		input.dispatchEvent(new Event('input'));
		o.fn&&o.fn.call(input,input.value,v);
    });
});
/**
 * 初始化加载清空事件 
 */
mui('.sd-reset-click').length&&mui('body').on('tap','.sd-reset-click',function(){
	M.p(); 
	var t = this,o=t.attr('data-options').tojson() || {};
	M.reset(o.pre||'');
});
/**
 * 初始化加载查询事件,
 * data-options="url:'打开页面的url',title:'标题'";
 */
mui('.sd-search-click').length&&mui('body').on('tap','.sd-search-click',function(){
	M.p(); 
	var h='', o=this.attr('data-options').tojson() || {},ws=plus.webview.getWebviewById(o.url),D=M.getV(o.pre||'');
	if(mui('#listAPP').length){//如果当前这个页面为单页面查询加列表页面.执行viewApi的后退
		mui.extend(SEARCHDATA,D);
		NOREFRESH=false ;//可以执行刷新
		o.fn&&o.fn(D);
		mui.trigger(mui('#refreshTable')[0],'tap',{search:true});
		viewApi && viewApi.back();
	}else{
		if(ws){
			for(var a in D){
				h+='SEARCHDATA.'+a+'="'+D[a]+'";' ;
			}
			h&&(h+='mui.trigger(mui("#refreshTable")[0],"tap",{search:true})',ws.evalJS(h));
			plus.webview.show(ws,"slide-in-right",600) ;
		}else{
			M.goT(o.url,o.title || mui('title')[0].innerText.trim(),{searchData:D,dataurl:o.dataurl});
		}
	}
});

/**
 * 加载未读数量
 * type==1,刷新列表数据(就是有上拉加载下拉刷新的列表的数据)
 */
function loadNumber(type){
	function ld(el,url,Da,fn){//Da:发送ajax发送的参数,fn:ajax请求成功后的回调
		   if(el.length){
		   		sendAjax(url,Da||'',function(data){
					for(var a =0,d;d=el[a];a++){
						var span = d.querySelector('span.mui-badge-red');
						!span &&(span='<span data-num="-1" class="mui-badge mui-badge-red"></span>'.toDom(),d.appendChild(span)) ;//如果没有该标签
						checkType(data)!='string'&&(data.total?span.innerText = data.total:span.remove());//如果是string类型的就说明是版本更新的ajax
						fn&&fn(data,span);
					}
					if(!WN.plus)return ;
						var arr = mui("span.mui-badge.mui-badge-red") ;
						if(mui('body[number-html]').length){
							var str  =mui('body[number-html]')[0].attr('number-html'),num=0;
					 		for(var a = 0,d;d=arr[a];a++){
					 			num+= parseInt(d.innerText||d.attr('data-num'));
					 		}
							plus.webview.getWebviewById("index.html").evalJS('loadNumberInfo("'+str+'",'+num+')') ;
						}
				},1);
		   }
	}
		type==1 && mui('#refreshTable').length && mui.trigger(mui('#refreshTable')[0],'tap');//刷新下拉列表. 
		ld(mui('.d-w-s-p'),'/oALight/waitForMyApprovalCount.do');//加载待我审批的数量
		ld(mui('.d-w-m-d'),'/oALight/waitForOALightOff.do');//加载待我审批的数量
		ld(mui('.d-w-c-z'),'/oALight/waitForOALightOffCount.do') ;//加载带我操作的数量
		ld(mui('.tpm-d-w-q-r'),'/tpm/selectUnreadPage.do') ;//加载TPM带我确认的数量
		ld(mui('.r-w-t-j'),'/stopAlarm/stopDetailNow.do?stationNo='+LL.DETANOS)//加载人为停机数量
		ld(mui('.s-b-t-j'),'/stopAlarm/stopSignalStatu.do?stationNo='+LL.DETANOS)//加载设备停机数量
		!mui.os.ios&&ld(mui('.b-b-g-x'),'/msgCent/get.do',{key:mui.os.ios?'iosupdate':'appupdate'},function(d,span){
		 //d={id:2};d=JSON.stringify(d);//测试.
			if(d!=''){
				LL.appupdateInfo = d; 
				d=JSON.parse(d);
				if(parseInt(d.id)<=parseInt(LL.appid) && !(d.test&&LL.userName=='sdint3')){//如果有test就说明是测试使用的
					span.remove();
				}else{//如果有新版本.则提示
					if(LL.appprompt && parseInt(LL.appprompt)!=parseInt(d.id)){//如果还没有提示,则提示,用户更新
						plus.push.createMessage( d.releaseDate+'发布了新版本', "LocalMSG", {cover:false} );
						mui.confirm(d.releaseDate+'发布了新版本,是否立即更新','发现新版本啦',['确定更新','下次更新吧'],function (e) {
							if(!e.index){
								plus.webview.getWebviewById('my.html').evalJS('mui.trigger(mui("#edition2")[0],"tap",{type:1})');
							}
						});
					}
					LL.appprompt=d.id ;
				}
			//更新时注意:更新的a标签必须添加 data-appid="6"  属性 . 发布的时候日期也一起改掉.
			// edition:版本号 ,describe : 更新说明 , releaseDate :发布日期,force : 是否强制更新,id : 发布的版本id ,test:'true'添加的是测试信息.配合以上代码调试使用;
			}else{
				span.remove();
			}
		}) ;//加载app版本更新
		mui('#USER').length&&(mui('#USER')[0].innerText=LL.userName);//加载用户名
//		console.log('刷新数据的时候我被调用了') ;
};
/**
 * 刷新未读数据
 */
function reshNum(){
	if(window.plus){
		mui.later(function(){
			var arr = plus.webview.getDisplayWebview();
			 for(var a = 0,d;d=arr[a]; a++){
			 	d.evalJS('loadNumber()');
			 }			  
		},400);
	}
};
/**
 * 重新定义mui 返回 ,主要是执行刷新操作加在了返回上
 */
mui.back=function(){
	if(window.plus){
		reshAllNum() ;
		M.wsp.evalJS('loadNumber(1)') ;
		plus.webview.close(M.ws);
	}
};
/**
 * 刷新所有的未读数据的数量 
 */
function reshAllNum(){
	if(window.plus){
		var w = plus.webview.getWebviewById('main.html') ;
			w&&w.evalJS('reshNum()'); 
	}
}
function fmtwhc(obj){
	obj.whc=({1:'原材料仓库',2:'标准件仓库',3:'半成品仓库内部',4:'半成品仓库外协件',5:'成品仓库',6:'在制品虚拟库',7:'隔离仓库',8:'外协分供方仓库'})[obj.whc];
	return obj;
}
!mui('input[name="password"]').length&&sendAjax('/users/getUser.do','',function(q){
		LL.douserName=q.crspd ;
	});
//解决数字输入框在点击按钮的时候没有触发input事件导致不能结合vue使用	
mui('body').on('tap','button.mui-numbox-btn-minus,button.mui-numbox-btn-plus',function(){
		this.parentNode.querySelector('input').dispatchEvent(new Event('input'));
});
document.addEventListener("resume",function(){
	if(!M.netWork().re){
		mui.toast('网络连接不可用，请稍候重试',{type:'div'});
	}
}, false );
// **************   一些比较通用的封装初始化,只是适用本套系统结合mui的,不是特别的通用  End******************
