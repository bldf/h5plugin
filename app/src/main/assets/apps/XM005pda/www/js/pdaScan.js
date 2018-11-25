function  beginScan(inintObj){
	if(　beginScan.scan　){return ;}
 var type = inintObj.type ,//要扫描的类型， M,S,P,H,C,D,L,
     callFn = inintObj.callFn ,//扫描成功后的回调函数
	 otherFn = inintObj.otherFn,//扫描到其他的回调函数
	 canFn = inintObj.canFn ;//扫描不在当前范围内的回调函数
	beginScan.scan = true ; 
	mui.plusReady(function () {
	    var main = plus.android.runtimeMainActivity(), //获取activity
		//创建自定义广播实例
		   receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver',{
						onReceive : function(context,intent){ //实现onReceiver回调函数
									plus.android.importClass(intent);//通过intent实例引入intent类，方便以后的‘.’操作
									var key = intent.getExtra("barcode_string");
									console.log('扫描到的值：',key);
									analysisCode(key,{type:type,canFn:canFn,callFn:callFn,otherFn,otherFn});
						}});
		var IntentFilter = plus.android.importClass('android.content.IntentFilter'),filter = new IntentFilter();
		filter.addAction("android.intent.ACTION_DECODE_DATA");//监听自定义广播
		main.registerReceiver(receiver,filter); //注册监听
	});	
}
	/**
	 * cFn:扫描成功的方法
	 * yes:true:扫描成功， function：扫描匹配失败要执行的方法
	 * tp:用户扫描的类型
	 * 对扫描后的内容进行处理 , key 扫描到后原有的key ， 包括， 成品， 备件， 外协件， 出库单 ， 不包括库位， 外部标签
	 */
function checkCallFn(cFn,key,title,old,yes,tp){
	var arr , o ; 
	!~['l','s','p','G','L'].indexOf(tp)&&(key = key.substring(1));
	if(yes && checkType(yes)==='boolean'){ //如果是扫描成功
		if(~tp.indexOf('Q['))key=old ;
		if(cFn){
			if(tp=='['){//如果扫描到的是捷众物料二维码
				arr = key.split('');
				o={};
				 if(arr[1][0]=='P')arr.splice(1,0,'sdint2000000')//如果没有SAP零件号
				 if(arr[2]){
				 	o.partNo=arr[2].substring(1); 
				 	if(arr[4]){
				 		o.mappingTag =arr[4].substring(2);
//				 		o.orderNo=arr[1];
				 		o.tagNo =o.mappingTag ; 
				 		if(arr[3]){
				 			o.number =Number(arr[3].substring(1));	
				 			title+=('零件号:【'+o.partNo+'】,数量：【'+o.number+'】');
							cFn && cFn(o,{type:tp,typeInf:title},old); 			
				 		}else{
				 			M.toast('扫描解析物料数量错误,扫描到的值为'+key);		
				 		}
				 	}else{
				 	M.toast('扫描解析物料标签号错误,扫描到的值为'+key);	
				 	}
				 }else{
					M.toast('扫描解析物料零件号错误,扫描到的值为'+key); 	
				 }
			}else if(tp=='G'){//如果扫描到的是供应商订单号
				arr = key.split('');
				o={};
				if(arr.length==2 || arr.length==3 ){//如果是内部订单
					o.orderNo =	arr[0];
					o.supplier = arr[1] ; 
//					o.orderDate = arr[2] ; 
					cFn && cFn(o,{type:tp,typeInf:title}); 	
				}else{//如果是客户订单
					o.orderNo = key ;
					cFn && cFn(o,{type:tp,typeInf:title}); 	
				}
			}else{
				cFn && cFn(key,{type:tp,typeInf:title});				
			}
 		}else{
 			mui.closePopups();
 			M.toast('扫描成功,扫描到的值为'+key);
 		}	
	}else{
		if(tp=='Q')key=old ;
		if(checkType(yes)==='function'){
			yes(key,{type:tp,typeInf:title});
		}else{
			M.play() ;
 			mui.closePopups();
 			mui.alert('扫描不匹配==》：来源【'+title+'】扫描到的内容为：【'+key +'】请重新扫描','扫描失败','重新扫描','','div');
		}
	}
}
	/**
	 * Q:扫描客户的标签
	 * 解析扫描成功后的值
	 * @param {Object} key
	 * @param {Object} obj
	 * t,T,w,W,c,C,l,s,p,-,[,L
	 * L:隔离标签
	 */
function analysisCode(key,obj){
					var old = key, title="",TYPE = obj.type ,CANFN = obj.canFn,CALLFN = obj.callFn,OTHERFN=obj.otherFn,
					barCodeArr = key.split('') ;//barCodeArr:捷众 空格截取后的二维码
   				if(key !='' && key.length>=4){
		 			key.length != 0 && ( key = key.split(';')[0]) ;
		 			// *********** begin  捷众扫描   ******************/
		 			if(key.replace(/(.SAS|.SSD|.PMD|.PMS|.PMR|.PDR)\d{9}/,'')==''){//如果扫描来源为报表
		 				switch (key[0]){
		 					case 't':
		 						title='停机报警报表';
		 						break;
		 					case 'T':
		 						title="停机汇总报表" ;
		 						break ;
	 						case 'w':
	 							title="物料配送时间统计报表" ;
	 							break ;
	 						case 'W':
	 							title="线边剩余物料报表" ;
	 							break ;
	 						case 'c':
	 							title="产量月报" ;
	 							break ;
	 						case 'C':
	 							title="产量日报" ;
	 							break ;
		 				}
		 			}else if(key[0]=='l' && key.length==35 && key[1]=='q'){
		 					title="灯二维码" ;
		 			}else if(key[0]=='s' && key.length==35 && key[1]=='q'){
		 					title="工位二维码" ;
		 			}else if(key[0]=='p' && key.length==35 && key[1]=='q'){
		 					title="人员二维码" ;
		 			}else if(barCodeArr.length>8 && ~key[0].indexOf('[')&& ~key[key.length-1].indexOf('.')){//出库小标签
		 					title="标准件小标签二维码" ;
		 			}else if(barCodeArr.length>8 && ~key[0].indexOf('[')){//如果是扫描到的是捷众的二维码标签
		 					title="物料标签二维码" ;
		 			}else if(key[0]=='-' && key.length==13 && key[1]=='S' && key[2]=='C'){
		 					title="TPM点检表" ;
		 			}else if(key[0]=='G' && ((key.split('').length==3 || key.split('').length==2)|| (key[1]=='L' && key[2]=='C' && key[3]=='H'))){
		 				(function(){
		 					if(key.split('').length==3 || key.split('').length==2){
		 						var ast = key.split('');
		 						title='供应商【'+ast[1]+'】'+ast[2]+'订单号：【'+ast[0]+'】' ;	
		 					}else{
		 						title = '通用订单号【'+key+'】' ;
		 					}
		 				})();
		 			}else if(key[0]=='L' && key[key.length-1]==''){
		 				key=key.substring(0,key.length-1);
		 				title="隔离标签号" ;
		 			}
		 			// *********** 捷众扫描   End******************/
   				 	if(~TYPE.indexOf(key[0])&&title!=''){//如果匹配
   				 		checkCallFn(CALLFN,key,title,old,true,key[0]);
   				 	}else{//如果不匹配
   				 		if(CANFN){
   				 			CANFN(key,{TYPE:key[0],typeInf:title});
   				 		}else{
   				 			M.play() ;
   				 			mui.closePopups();			
   				 			mui.alert('扫描不匹配==》：来源【'+(title||'非法信息不能识别')+'】扫描到的内容为：【'+old +'】请重新扫描','扫描不匹配','重新扫描',function(){
   				 			});
   				 		}
						return ;
   				 	}
   				 }else{
   				 	if(OTHERFN){
   				 		OTHERFN(old);	
			 		}else{
						M.play();
	   				 	mui.closePopups();
	   				 	mui.alert('非法信息不能识别！描到的内容为：【'+old +'】','无法识别','确定',function(){
	   				 	});
			 		}
   				 }
}