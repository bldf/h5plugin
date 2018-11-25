initObj.type =initObj.type || '入库';
LL.removeItem('enterScanninghtml');
initObj.scanType = initObj.scanType || '[' ; 
var app = new Vue({
				el:'.mui-content',
				data:{
					info:{lslTagNo:'',cusTagNo:'',btagNo:'',stagNo:'',num2:'',orderNo:'',tagNo:'',num:'',partNo:'',positionId:'',areaNo:''},
					o:{bt:'已关闭',noup:true,bt2:'已关闭',bt3:'已关闭'}
				},
				methods:{
					setSwitch:function(e){
						if(e.detail.isActive){
							LL.enterScanninghtml=1; 
							mui.toast('已打开扫描成功后立即'+initObj.type+'！',{type:'div'}) ;
							this.o.bt='已打开';
						}else{
							mui.toast('已关闭扫描成功后立即'+initObj.type+'！',{type:'div'}) ;
							LL.removeItem('enterScanninghtml') ;
							this.o.bt='已关闭';
						}
					},
					setSwitch2:function(e){
						if(e.detail.isActive){
							mui.toast('已记住扫描的库位',{type:'div'}) ;
							this.o.bt2='已记住';
						}else{
							mui.toast('已关闭记住扫描的库位',{type:'div'}) ;
							this.o.bt2='已关闭';
						}
					},
					setSwitch3:function(e){
						if(e.detail.isActive){
							mui.toast('已记住扫描的订单',{type:'div'}) ;
							this.o.bt3='已记住';
						}else{
							mui.toast('已关闭记住扫描的订单',{type:'div'}) ;
							this.o.bt3='已关闭';
						}
					},
					upnum:function(){//修改数量
						if(!this.info.num){
							this.o.noup=true;
							mui.alert('请扫描标签后开始编辑数量','当前无法修改数量','重新扫描',function (e){},'div')
							M.play();
							return ;
						}
						this.o.noup=false ;
						mui.toast('可以编辑数量',{type:'div'});
					},
					sendAjax:function(){//发送ajax到后台
						sendAjax(initObj.ruKuUrl,app.info,function(d){
								if(d.fail){
									M.play();
									mui.alert(d.fail,''+initObj.type+'失败','重新扫描',function (e) {
									},'div');
								}else{
									M.toast(''+initObj.type+'成功');
//									app.info={orderNo:'',tagNo:'',num:'',partNo:'',positionId:app.bt2=='已记住'?app.info.positionId:'',areaNo:app.bt2=='已记住'?app.info.areaNo:''};
//									mui.extend(app.info,{orderNo:app.o.bt3=='已记住'?app.info.orderNo:'',tagNo:'',num:'',partNo:'',positionId:'',areaNo:''});
									mui.extend(app.info,{lslTagNo:'',cusTagNo:'',num2:'',orderNo:app.o.bt3=='已记住'?app.info.orderNo:'',tagNo:'',num:'',partNo:'',positionId:app.o.bt2=='已记住'?app.info.positionId:'',areaNo:app.o.bt2=='已记住'?app.info.areaNo:''});
								}
								app.o.noup=true;
							});
					},
					checkOut:function(str,type){//出库判断。因为添加了先进先出，所以名称和逻辑不对应，只是调换了一下位置。
						LL.enterScanninghtml&&type==1?app.sendAjax():mui.confirm(str,''+initObj.type+'确认',['确认','取消'],function (e) {
								!e.index&&app.sendAjax();
							});
					},
					warehousajax:function(str,type){//添加先进先出提醒。
						if(initObj.outTxUrl){//如果有先进先出出库提醒。
							sendAjax(initObj.outTxUrl,app.info,function(dataArr){
								var obj ; 
								dataArr.rows = dataArr.rows || [];
								obj =dataArr.rows[0]; 
								if(obj){//如果有在此之前的，提醒先进先出
									M.play();
									mui.confirm('仓库中存在更早的零件\n日期:'+obj.dates+'\n是继续出库当前扫描的零件,还是重新扫描','先进先出提醒',['继续出库','重新扫描'],function (e) {
											!e.index&&app.checkOut(str,type);
									},'div');
								}else{
									if(dataArr.fail){
										M.play();
										mui.alert(dataArr.fail,'出库失败','重新扫描',function (e) {},'div');
									}else{
										app.checkOut(str,type);
									}
								}
							})
						}else{
							app.checkOut(str,type);
						}
					},
					warehous:function(type){//入库准备信息验证;如果type==1说明是系统自己点的
						var o = M.checkPre('form input'),str='请确认当前扫描信息是否正确\n零件号：';
						if(o.re){
							str+=app.info.partNo+'\n';
							str+='标签数量:'+app.info.num+'\n';
							mui('input[name="area"]').length&&(str+='库位：'+app.info.areaNo+'\n');
							mui('input[name="orderNo"]').length&&(str+='订单号：'+app.info.orderNo+'\n');
							app.warehousajax(str,type) ;
						}else{
							type!==1&&(M.play(),mui.alert(o.info,''+initObj.type+'失败','重新扫描',function (e){},'div'));
						}
					}
				},
				mounted:function(){
					mui('.mui-switch-handle').length&&LL.enterScanninghtml&&(this.o.bt='已打开');
				}
			});
			function kwFn(v,o){
				var ob = o[0] ,input = this;
				if(!ob.dates){//如果当前选择的库位没有存放零件
					for(var a = 0,d,arr = WN.KUWEIDATAARR || [] ;d=arr[a];a++){
						if(d.dates){
							setTimeout(function(){input.value = '' ;},1000) ;
							M.play();
							mui.confirm('建议选择其它已使用库位，使用完后再使用空库位','选择空库位提醒',['继续存放此库位','选择其它库位'],function (e) {
								if(!e.index){
									input.value = ob.positionNo ;
									app.info.positionId = ob.id || '';	
								}else{
									input.value = '' ;
									app.info.positionId = '';
								}
							},'div');
							break;
						}else{
							input.value = ob.positionNo ;
							app.info.positionId = ob.id || '';
						}
					}
				}else{
					app.info.positionId = o[0].id || '';	
				}
			};
			beginScan({
				type:initObj.scanType,
				callFn:function(d,f,c){
					if(d.number){//如果扫描到的是零件
						d.num=d.number ;
						initObj.scanF&&initObj.scanF(d,f,c);
					 	delete d.orderNo ;
					 	M.toast('扫描成功，零件号:【'+d.partNo+'】,数量：【'+d.number+'】');
					 	mui('input[name="area"]').length&&sendAjax(initObj.kuWeiUrl,{partNo:d.partNo},function(dat){//如果有库位输入框则加载库位。
					 		var re,datArr = _.map(dat,function(n){
					 			n.text = n.positionNo;
					 			app.o.bt2=='已记住'&&app.info.positionId==n.id&&(re=1);
					 			return n ;
					 		});
					 		!re&&(app.info.positionId='',app.info.areaNo='');//如果没有符合条件的则清空之前选择的库位
					 		if(!dat.length){
					 			M.play();
					 			mui.alert('此零件库位不存在或已到达库位容量','获取库位失败','确定',function (e) {
					 			},'div');
					 		}
					 		WN['SDINTPICKERarea'].setData(datArr);
					 		WN.KUWEIDATAARR = datArr ;
					 	});
					}else{
						initObj.scanF&&initObj.scanF(d,f,c);
						M.toast(f.typeInf);
					}
					d[0]=='L'&&(d={lslTagNo:d});
					mui.extend(app.info,d);
					LL.enterScanninghtml&&mui('.mui-switch').length&&setTimeout(function(){app.warehous(1);},200)
				}
				});
			if(mui('input[name="area"]').length){
				WN['SDINTPICKERarea'] = new mui.PopPicker() ;
				mui('input[name="area"]')[0].SDINTPICKER=true ;	
			}