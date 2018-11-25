initObj.type =initObj.type || '入库';
var app = new Vue({
				el:'.mui-content',
				data:{
					info:{cusTagNo:'',orderNo:'',tagNo:'',num:'',partNo:'',positionId:'',areaNo:''},
					o:{bt:'已关闭',noup:true,bt2:'已取消'}
				},
				methods:{
					setSwitch:function(e){
						if(e.detail.isActive){
							LL.enterScanninghtml=1; 
							mui.toast('已打开扫描成功后立即出库！',{type:'div'}) ;
							this.o.bt='已打开';
						}else{
							mui.toast('已关闭扫描成功后立即出库！',{type:'div'}) ;
							LL.removeItem('enterScanninghtml') ;
							this.o.bt='已关闭';
						}
					},
					setSwitch2:function(e){
						if(e.detail.isActive){
							mui.toast('已扫描的库位',{type:'div'}) ;
							this.o.bt2='已记住';
						}else{
							mui.toast('已扫描的库位',{type:'div'}) ;
							this.o.bt2='已关闭';
						}
					},
					upnum:function(){//修改数量
						if(!this.info.num){
							this.o.noup=true;
							M.play();
							mui.toast('请扫描标签后开始编辑数量',{type:'div'});
							return ;
						}
						this.o.noup=false ;
						mui.toast('可以编辑数量',{type:'div'});
					},
					warehousajax:function(){
						sendAjax(initObj.chuKuUrl,this.info,function(d){
								if(d.fail){
									M.play();
									mui.alert(d.fail,'出库失败','重新扫描',function (e) {
									},'div');
								}else{
									M.toast('出库成功');
									mui.extend(app.info,{cusTagNo:'',orderNo:'',tagNo:'',num:'',partNo:'',positionId:''});
								}
								app.o.noup=true;
							});
					},
					warehous:function(){//出库
						var o = M.checkPre('form input'),str='请确认当前扫描信息是否正确\n零件号：';
						if(o.re){
							str+=app.info.partNo+'\n';
							str+='数量:'+app.info.num+'\n';
							LL.enterScanninghtml?app.warehousajax():mui.confirm(str,'出库确认',['确认','取消'],function (e) {
								!e.index&&app.warehousajax();
							});
						}else{
							M.play();
							M.toast(o.info);
						}
					}
				},
				mounted:function(){
					LL.enterScanninghtml&&(this.o.bt='已打开');
				}
			});
			function kwFn(v,o){
				app.info.positionId = o[0].id || '';
			};
			beginScan({
				type:'[G',
				callFn:function(d,f){
					if(d.number){//如果扫描到的是零件
						d.num = d.number ;
					 	delete d.orderNo ;
					 	M.toast('扫描成功，零件号:【'+d.partNo+'】,数量：【'+d.number+'】');
					}else{
						M.toast(f.typeInf);
					}
					mui.extend(app.info,d);
					LL.enterScanninghtml&&app.warehous();
				}
				});